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
  } from "../../stores/airdrops";
  import { getRewardsFeeEstimate } from "../../utils/feeEstimate";
  import { getVeOceanBalance } from "../../utils/ve";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import EpochHistory from "./EpochHistory.svelte";
  import Features from "./Features.svelte";
  import RewardOverview from "./RewardOverview.svelte";
  import moment from "moment";
  import { getEpoch } from "../../utils/epochs";
  import { oceanUnlockDate } from "../../stores/veOcean";
  import { getRate } from "../../utils/market_rates";
  import * as streamsData from "../../utils/metadata/rewards/streams.json"
  import { onMount } from "svelte";

  let loading = false;
  let veBalance = 0.0;
  let canClaimVE = true;
  let canClaimDF = true;
  const now = moment.utc();
  let curEpoch = getEpoch(now);
  let streams = null;

  async function populateStreamsWithRewardsFromCurrentEpoch(){
    // Calculate adjusted rewards for current epoch
    const fxRate = await getRate('OCEAN', 'ocean-protocol');
    const challengeDFReward = Math.round(
      // TODO - Fix Magic Numbers
      curEpoch.streams[1].substreams[1].rewards / fxRate, 2
    );
    const adjustedVolumeDFReward = curEpoch.streams[1].rewards - challengeDFReward;
    
    // Update curEpoch rewards
    curEpoch.streams[1].substreams[0].rewards = adjustedVolumeDFReward;
    curEpoch.streams[1].substreams[1].rewardsUSD = curEpoch.streams[1].substreams[1].rewards;
    curEpoch.streams[1].substreams[1].rewards = challengeDFReward;

    // Update streams with rewards from curEpoch
    const modifiedStreams = streamsData.default.streams.map((stream, indexStream) => {
        if(!curEpoch?.streams) return stream; // return the original stream if there is no current epoch
        stream.rewards = curEpoch?.streams[indexStream]?.rewards;
        stream.substreams.forEach((substream, indexSubstream) => {
          substream.rewards = curEpoch.streams[indexStream].substreams[indexSubstream].rewards;
          substream.rewardsUSD = substream.showUSD ? curEpoch.streams[indexStream].substreams[indexSubstream].rewardsUSD : 0;
        });
        return stream; // return the updated stream
    });

    streams = modifiedStreams;
  }

  async function initClaimables() {
    if (!userAddress || !oceanUnlockDate) {
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
  }

  onMount(() => {
    populateStreamsWithRewardsFromCurrentEpoch();
  })
</script>

<div class={`container`}>
  <RewardOverview roundInfo={curEpoch} />
  <Features />
  {#if streams !== null}
    <ClaimRewards {canClaimVE} {canClaimDF} streams={streams}/>
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
