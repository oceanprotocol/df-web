<script>
  import NetworkRewards from "./NetworkRewards.svelte";
  import MainMessage from "../common/MainMessage.svelte";
  import { userAddress, selectedNetworks } from "../../stores/web3.js";
  import { airdrops, updateAllClaimables } from "../../stores/airdrops";

  let loading = false;

  async function initAirdrops() {
    loading = true;
    await updateAllClaimables($airdrops, $selectedNetworks, $userAddress);
    loading = false;
  }

  $: if ($userAddress) {
    initAirdrops();
  }
</script>

<div class="container">
  <h1>Claim Portal</h1>
  {#if $userAddress && loading === false && $airdrops}
    <div class="pools">
      {#each $selectedNetworks as chainId}
        <NetworkRewards {chainId} airdropData={$airdrops[chainId]} />
      {/each}
    </div>
  {:else if $selectedNetworks.length > 0}
    <div>Loading</div>
  {/if}
  {#if !$userAddress}
    <MainMessage
      title="No wallet connected"
      message={`No wallet is connected to this page. Connect your wallet to see rewards.`}
    />
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
    justify-content: center;
  }

  .pools {
    width: 100%;
  }

  h1 {
    margin: calc(var(--spacer) * 2) 0;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
