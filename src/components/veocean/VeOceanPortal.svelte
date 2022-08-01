<script>
  import { userAddress, connectedChainId } from "../../stores/web3";
  import VeOceanCard from "./VeOceanCard.svelte";
  import OceanCard from "./OceanCard.svelte";
  import LockOcean from "./LockOcean.svelte";
  import { userBalances } from "../../stores/tokens";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";

  let oceanTokenAddress;

  $: if ($userAddress && $userBalances && $connectedChainId) {
    oceanTokenAddress =
      getOceanTokenAddressByChainId($connectedChainId).toLowerCase();
  }
</script>

{#if oceanTokenAddress && $userBalances[oceanTokenAddress]}
  <div class={`container`}>
    <VeOceanCard />
    <OceanCard />
    <LockOcean />
  </div>
{:else}
  <div class={`container`}>Loading...</div>
{/if}

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacer);
    padding-top: var(--spacer);
  }

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
  }

  .alignContentCenter {
    justify-content: center;
  }

  @media (min-width: 640px) {
    .container {
      padding-top: calc(var(--spacer));
      gap: calc(var(--spacer) / 2);
    }
  }
</style>
