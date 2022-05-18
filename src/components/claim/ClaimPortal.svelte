<script>
  import NetworkRewards from "./NetworkRewards.svelte";
  import MainMessage from "../common/MainMessage.svelte";
  import { userAddress, selectedNetworks } from "../../stores/web3.js";
  import { updateAllClaimables } from "../../utils/airdrops";
  import { supportedChainIds } from "../../app.config";
  import { airdrops } from "../../stores/airdrops";

  let loading = false;

  async function loadClaimables() {
    loading = true;
    let newAirdrops = await updateAllClaimables(
      $userAddress,
      supportedChainIds
    );
    airdrops.update(() => newAirdrops);
    loading = false;
  }

  $: if ($userAddress && !$airdrops) {
    loadClaimables();
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
  {:else if $selectedNetworks.lenght > 0}
    <div>Loading</div>
  {/if}
  {#if $selectedNetworks.length === 0}
    <MainMessage
      title="No network selected"
      message="Select one or more networks from the 'Selected networks' dropdown in
    order to get rewards from those networks"
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
