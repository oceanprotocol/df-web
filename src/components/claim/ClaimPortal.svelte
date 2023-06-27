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

  let loading = false;
  let veBalance = 0.0;
  let canClaimVE = true;
  let canClaimDF = true;
  const now = moment.utc();
  let curEpoch = getEpoch(now);

  async function initClaimables() {
    // userAddress.set("0x0000000000........")
    // console.log("userAddress", $userAddress)

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

    /*const veRewards = 20;
    const dfRewards = 20;

    veClaimables.set(veRewards);
    dfClaimables.set(dfRewards);*/

    if (veRewards <= 0) {
      canClaimVE = false;
    }

    if (dfRewards <= 0) {
      canClaimDF = false;
    }

    // console.log("canClaimVE", canClaimVE)
    // console.log("canClaimDF", canClaimDF)
    // console.log("veClaimables", $veClaimables)
    // console.log("dfClaimables", $dfClaimables)

    loading = false;
  }

  $: if ($userAddress && $connectedChainId) {
    initClaimables();
  }
</script>

<div class={`container`}>
  <RewardOverview roundInfo={curEpoch} />
  <Features />
  <ClaimRewards {canClaimVE} {canClaimDF} roundInfo={curEpoch} {loading} />
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
