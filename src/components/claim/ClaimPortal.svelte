<script>
  import NetworkRewards from "./NetworkRewards.svelte";
  import MainMessage from "../common/MainMessage.svelte";
  import EstimatedRewards from "../common/EstimatedRewards.svelte";
  import ClaimRewards from "./ClaimRewardsVeDF.svelte";
  import { 
    userAddress, 
    connectedChainId, 
    selectedNetworks 
  } from "../../stores/web3.js";
  import { airdrops, updateAllClaimables } from "../../stores/airdrops";
  import { getRewardsFeeEstimate } from "../../utils/feeEstimate";
  import Countdown from "../common/CountDown.svelte";

  import { rewards } from "../../stores/airdrops";
  import { veClaimables, dfClaimables } from "../../stores/claimables";

  let loading = true;

  async function initClaimables() {
    loading = true;
    await updateAllClaimables(
      JSON.parse(process.env.AIRDROP_CONFIG),
      $selectedNetworks,
      $userAddress,
      $rewards
    );
    const estimateReward = await getRewardsFeeEstimate(
      $userAddress
    );
    veClaimables.set(estimateReward);
    dfClaimables.set($airdrops[$connectedChainId].claimableRewards)
    
    console.log("$airdrops:", $airdrops);
    console.log("$connectedChainId:", $connectedChainId);

    loading = false;
  }

  $: if ($rewards) {
    initClaimables();
  }
</script>

<div
  class={`container ${
    (!$userAddress || loading === true || !$airdrops) && "alignContentCenter"
  }`}
>
  {#if $userAddress && loading === false && $airdrops}
    <Countdown />
    <div class="estimatedRewardsContainer">
      <EstimatedRewards />
    </div>
    <ClaimRewards />
  {:else if $selectedNetworks.length > 0 && $userAddress}
    <span class="loading">Loading...</span>
  {/if}
  {#if !$userAddress}
    <MainMessage
      title="No wallet connected"
      message={`Connect your wallet to see the rewards`}
    />
  {/if}
  {#if $selectedNetworks.length === 0 && $userAddress}
    <MainMessage
      title="No network selected"
      message={`Select one or more networks from the **Selected networks** dropdown in
    order to see rewards from those networks.`}
    />
  {/if}
  {#if $userAddress && loading === false && $selectedNetworks.length > 0 && Object.keys($airdrops).length === 0}
    <MainMessage title="Coming Soon" />
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
    margin: calc(var(--spacer)) 0;
  }

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
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
