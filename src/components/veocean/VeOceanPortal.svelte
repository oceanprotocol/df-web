<script>
  import { userAddress } from "../../stores/web3";
  import VeOceanCard from "./VeOceanCard.svelte";
  import LockOcean from "./LockOcean.svelte";
  import { getLockedOceanAmount, getLockedEndTime } from "../../utils/ve";
  import { lockedOceanAmount, oceanUnlockDate } from "../../stores/veOcean";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";
  import { userBalances } from "../../stores/tokens";

  let loading = !$lockedOceanAmount;

  const loadValues = async () => {
    loading = true;
    let lockedOceans = await getLockedOceanAmount($userAddress);
    lockedOceanAmount.update(() => lockedOceans);
    let unlockDateMilliseconds = await getLockedEndTime($userAddress);
    oceanUnlockDate.update(() =>
      unlockDateMilliseconds ? new Date(unlockDateMilliseconds) : undefined
    );
    loading = false;
  };

  $: if (
    $userAddress &&
    $userBalances[
      getOceanTokenAddressByChainId(
        process.env.VE_SUPPORTED_CHAINID
      ).toLowerCase()
    ]
  ) {
    loadValues();
  }
</script>

{#if !loading}
  <div class={`container`}>
    <VeOceanCard />
    <LockOcean />
  </div>
{:else}
  <div class="loading">Loading...</div>
{/if}

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacer);
    padding-top: var(--spacer);
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
    height: calc(100vh - 115px);
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
