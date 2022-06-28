<script>
  import NetworkRewards from "./NetworkRewards.svelte";
  import MainMessage from "../common/MainMessage.svelte";
  import TotalRewards from "../common/TotalRewards.svelte";
  import { userAddress, selectedNetworks } from "../../stores/web3.js";
  import { airdrops, updateAllClaimables } from "../../stores/airdrops";

  import { rewards } from "../../stores/airdrops";
  import { getRewards } from "../../utils/rewards";

  let loading = false;

  async function initAirdrops() {
    loading = true;
    await updateAllClaimables(
      JSON.parse(process.env.AIRDROP_CONFIG),
      $selectedNetworks,
      $userAddress,
      $rewards
    );
    loading = false;
  }

  async function initRewards() {
    const newRewards = await getRewards(
      `${process.env.BACKEND_API}/rewards`,
      $userAddress
    );
    rewards.update(() => newRewards);
  }

  $: if ($userAddress) {
    initRewards();
  }

  $: if ($rewards) {
    initAirdrops();
  }
</script>

<div class="container">
  <div class="totalRewardsContainer">
    <TotalRewards />
  </div>
  {#if $userAddress && loading === false && $airdrops}
    <div class="pools">
      {#each $selectedNetworks as chainId}
        <NetworkRewards {chainId} airdropData={$airdrops[chainId]} />
      {/each}
    </div>
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
    justify-content: center;
  }

  .pools {
    width: 100%;
  }

  .totalRewardsContainer p {
    font-size: var(--font-size-large);
    margin: calc(var(--spacer)) 0;
  }

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
  }

  @media only screen and (min-width: 660px) {
    .totalRewardsContainer {
      margin: var(--spacer) 0;
    }
  }
</style>
