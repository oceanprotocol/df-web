<script>
  import NetworkRewards from "./NetworkRewards.svelte";
  import { userAddress, selectedNetworks } from "../../stores/web3.js";
  import { updateAllClaimables } from "../../utils/airdrops";
  import { airdrops } from "../../stores/airdrops";

  let loading = true;

  async function loadClaimables() {
    loading = true;
    let newAirdrops = await updateAllClaimables(
      "0xf25B7b8dC2B264Be6c3410e2CAE339c041B854C2",
      $selectedNetworks
    );
    airdrops.update(() => newAirdrops);
    loading = false;
  }

  $: if ($userAddress) {
    loadClaimables();
  }

  selectedNetworks.subscribe((value) => {
    if ($userAddress) {
      loadClaimables();
    }
  });
</script>

<div class="container">
  <h1>Claim Portal</h1>
  {#if $userAddress && loading === false && $airdrops}
    <div class="pools">
      {#each $selectedNetworks as chainId}
        <NetworkRewards {chainId} airdropData={$airdrops[chainId]} />
      {/each}
    </div>
  {:else}
    <div>Loading</div>
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
