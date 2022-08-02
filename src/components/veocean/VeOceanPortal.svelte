<script>
  import { userAddress, connectedChainId } from "../../stores/web3";
  import VeOceanCard from "./VeOceanCard.svelte";
  import OceanCard from "./OceanCard.svelte";
  import LockOcean from "./LockOcean.svelte";
  import { getLockedOceanAmount } from "../../utils/ve";
  import { lockedOceanAmount } from "../../stores/veOcean";
  import { userBalances } from "../../stores/tokens";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";

  let oceanTokenAddress;
  let loading = false;

  const loadValues = async () => {
    loading = true;
    oceanTokenAddress =
      getOceanTokenAddressByChainId($connectedChainId).toLowerCase();
    let lockedOceans = await getLockedOceanAmount($userAddress);
    lockedOceanAmount.update(() => lockedOceans);
    loading = false;
  };

  $: if ($userAddress && $userBalances && $connectedChainId) {
    loadValues();
  }
</script>

{#if !loading && $userBalances[oceanTokenAddress]}
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
