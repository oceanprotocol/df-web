<script>
  import ClaimRewards from "./ClaimRewardsVeDF.svelte";
  import {
    userAddress,
    connectedChainId
  } from "../../stores/web3.js";
  import {
    veClaimables,
    dfClaimables,
    getDFRewards,
    lastActiveRewardsClaimRound,
    lastPassiveRewardsClaimRound,
  } from "../../stores/airdrops";
  import { getRewardsFeeEstimate } from "../../utils/feeEstimate";
  import { getVeOceanBalance } from "../../utils/ve";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import EpochHistory from "./EpochHistory.svelte";
  import { query } from "svelte-apollo";
  import RewardOverview from "./RewardOverview.svelte";
  import moment from "moment";
  import { getEpoch } from "../../utils/epochs";
  import { oceanUnlockDate } from "../../stores/veOcean";
  import * as streamsData from "../../utils/metadata/rewards/streams.json";
  import {GET_USER_LAST_ACTIVE_REWARDS_CLAIM, GET_USER_LAST_PASSIVE_REWARDS_CLAIM} from "../../utils/subgraph";
  import { onMount } from "svelte";

  export let removeApproval = false;
  let loading = false;
  let veBalance = 0.0;
  let canClaimVE = true;
  let canClaimDF = true;
  const now = moment.utc();
  let curEpoch = getEpoch(now);
  let streams = null;
  let userLastPassiveRewardsClaim = null;
  let userLastActiveRewardsClaim = query(GET_USER_LAST_ACTIVE_REWARDS_CLAIM, {
      variables: { userAddress: $userAddress.toLowerCase() },
    })

  async function populateStreamsWithRewardsFromCurrentEpoch(){
    // Update streams with rewards from curEpoch
    const modifiedStreams = streamsData.default.streams.map((stream, indexStream) => {
        if(!curEpoch?.streams) return stream; // return the original stream if there is no current epoch
        stream.rewards = curEpoch?.streams[indexStream]?.rewards;
        stream.substreams.forEach((substream, indexSubstream) => {
          substream.rewards = curEpoch.streams[indexStream].substreams[indexSubstream]?.rewards;
        });
        return stream; // return the updated stream
    });

    streams = modifiedStreams;
  }

  async function initClaimables() {
    if (!userAddress || !oceanUnlockDate || $connectedChainId != import.meta.env.VITE_VE_SUPPORTED_CHAINID) {
      veClaimables.set(0);
      dfClaimables.set(0);
      loading = false;
      return;
    }
    loading = true;

    veBalance = await getVeOceanBalance($userAddress);

    const veRewards = await getRewardsFeeEstimate($userAddress);
    veClaimables.set(veRewards);

    const dfRewards = await getDFRewards(
      $userAddress,
      getAddressByChainIdKey($connectedChainId, "Ocean")
    );
    dfClaimables.set(dfRewards);

    if (veRewards <= 0) {
      canClaimVE = false;
    }

    if (dfRewards <= 0) {
      canClaimDF = false;
    }

    loading = false;
  }

  $: if ($userAddress && $connectedChainId) {
    initClaimables();
    userLastActiveRewardsClaim = query(GET_USER_LAST_ACTIVE_REWARDS_CLAIM, {
      variables: { userAddress: $userAddress.toLowerCase() },
    })
    userLastPassiveRewardsClaim = query(GET_USER_LAST_PASSIVE_REWARDS_CLAIM, {
      variables: { userAddress: $userAddress.toLowerCase() },
    })
  }

  $: if ($userLastActiveRewardsClaim.data) {
    if(!$userLastActiveRewardsClaim.data.dfrewards[0]?.history.length || $userLastActiveRewardsClaim.data.dfrewards[0]?.history.length == 0){
      lastActiveRewardsClaimRound.set(0)
    }
    else{
      lastActiveRewardsClaimRound.set(getEpoch(moment.unix(parseInt($userLastActiveRewardsClaim.data.dfrewards[0].history[0].timestamp)).utc()).id)
    }
  }

  $: if ($userLastPassiveRewardsClaim?.data || $veClaimables) {
    if($userLastPassiveRewardsClaim.data?.veOCEAN?.claims.length>0){
      let date = moment(parseInt($userLastPassiveRewardsClaim.data.veOCEAN.claims[0].timestamp) * 1000)
      lastPassiveRewardsClaimRound.set(getEpoch(date)?.id)
    }else{
      lastPassiveRewardsClaimRound.set(0)
    }
  }

  onMount(() => {
    populateStreamsWithRewardsFromCurrentEpoch();
  })
</script>

<div class={`container`}>
  <RewardOverview roundInfo={curEpoch} />
  {#if streams !== null}
    <ClaimRewards {canClaimVE} {canClaimDF} streams={streams} roundInfo={curEpoch} removeApproval={removeApproval}/>
  {/if}
  <EpochHistory />
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: calc(100vh - 300px);
    padding-top: calc(var(--spacer) * 2);
  }

  .rewards {
    width: 100%;
  }

  .estimatedRewardsContainer {
    width: 100%;
    font-size: var(--font-size-large);
  }

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
    margin: calc(var(--spacer)) 0;
  }

  .alignContentCenter {
    justify-content: center;
  }

  @media only screen and (min-width: 640px) {
    .estimatedRewardsContainer {
      margin: var(--spacer) 0;
    }
    .container {
      min-height: calc(100vh - 200px);
    }
  }
</style>
