<script>
  import MainMessage from "../common/MainMessage.svelte";
  import ClaimRewards from "./ClaimRewardsVeDF.svelte";
  import {
    userAddress,
    connectedChainId,
    selectedNetworks,
    web3Provider,
  } from "../../stores/web3.js";
  import {
    airdrops,
    veClaimables,
    dfClaimables,
    getDFRewards,
  } from "../../stores/airdrops";
  import { getRewardsFeeEstimate } from "../../utils/feeEstimate";
  import { getVeOceanBalance } from "../../utils/ve";
  import Countdown from "../common/CountDown.svelte";
  import { getAddressByChainIdKey } from "../../utils/address/address";

  let loading = true;
  let veBalance = 0.0;
  let canClaimVE = true;
  let canClaimDF = true;

  async function initClaimables() {
    loading = true;

    veBalance = await getVeOceanBalance($userAddress, $web3Provider);

    const veRewards = await getRewardsFeeEstimate($userAddress, $web3Provider);
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
</script>

<div class={`container`}>
  <Countdown />

  {#if $userAddress && loading === false && $airdrops && veBalance > 0}
    <!-- <div class="estimatedRewardsContainer">
      <EstimatedRewards />
    </div> -->
    <ClaimRewards {canClaimVE} {canClaimDF} />
  {:else if $userAddress && loading === false}
    {#if !$userAddress}
      <MainMessage
        title="No wallet connected"
        message={`Connect your wallet to see the rewards`}
      />
    {:else if $selectedNetworks.length === 0 && $userAddress}
      <MainMessage
        title="No network selected"
        message={`Select a network to see rewards.`}
      />
    {:else}
      <MainMessage
        title="No veOcean"
        message={`Lock Ocean to receive veOcean and earn yield.`}
      />
    {/if}
  {:else}
    <span class="loading">Loading...</span>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: calc(100vh - 300px);
    padding-top: var(--spacer);
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
