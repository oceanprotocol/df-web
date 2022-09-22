<script>
  import NetworkRewards from "./NetworkRewards.svelte";
  import MainMessage from "../common/MainMessage.svelte";
  import EstimatedRewards from "../common/EstimatedRewards.svelte";
  import ClaimRewards from "./ClaimRewardsVeDF.svelte";
  import {
    userAddress,
    connectedChainId,
    selectedNetworks,
    networkSigner,
  } from "../../stores/web3.js";
  import {
    airdrops,
    rewards,
    veClaimables,
    dfClaimables,
    getDFRewards,
    updateAllClaimables,
  } from "../../stores/airdrops";
  import { getRewardsFeeEstimate } from "../../utils/feeEstimate";
  import Countdown from "../common/CountDown.svelte";
  import {getAddressByChainIdKey} from "../utils/address/address";

  let loading = true;

  async function initClaimables() {
    loading = true;
    await updateAllClaimables(
      JSON.parse(process.env.AIRDROP_CONFIG),
      $selectedNetworks,
      $userAddress,
      $rewards
    );
    const veRewards = await getRewardsFeeEstimate($userAddress);
    console.log("veRewards:", veRewards);
    veClaimables.set(veRewards);

    const dfRewards = await getDFRewards(
      $userAddress,
      getAddressByChainIdKey($connectedChainId, "Ocean")
    );
    console.log("dfRewards:", dfRewards);
    dfClaimables.set(dfRewards);

    loading = false;
  }

  $: if ($rewards) {
    initClaimables();
  }

  $: if ($connectedChainId !== process.env.VE_SUPPORTED_CHAINID) {
    loading = false;
  }

  $: if (!$userAddress) {
    loading = false;
  }
</script>

<div
  class={`container ${
    (loading === true || !$airdrops) && "alignContentCenter"
  }`}
>
  {#if loading === false}
    <Countdown />
    <!-- <div class="estimatedRewardsContainer">
      <EstimatedRewards />
    </div> -->
    <ClaimRewards />
  {:else if $selectedNetworks.length > 0 && $userAddress}
    <span class="loading">Loading...</span>
  {/if}
  {#if $selectedNetworks.length === 0 && $userAddress}
    <MainMessage
      title="No network selected"
      message={`Select one or more networks from the **Selected networks** dropdown in
    order to see rewards from those networks.`}
    />
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
