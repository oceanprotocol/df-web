<script>
  import { userAddress, connectedChainId } from "../../stores/web3";
  import VeOceanCard from "./VeOceanCard.svelte";
  import OceanCard from "./OceanCard.svelte";
  import LockOcean from "./LockOcean.svelte";
  import { getLockedOceanAmount, getLockedEndTime } from "../../utils/ve";
  import { lockedOceanAmount, oceanUnlockDate } from "../../stores/veOcean";
  import { userBalances } from "../../stores/tokens";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";
  import WithdrawOcean from "./WithdrawOcean.svelte";

  let oceanTokenAddress;
  let loading = !$lockedOceanAmount;

  console.log(!$lockedOceanAmount);

  const loadValues = async () => {
    loading = true;
    oceanTokenAddress =
      getOceanTokenAddressByChainId($connectedChainId).toLowerCase();
    let lockedOceans = await getLockedOceanAmount($userAddress);
    lockedOceanAmount.update(() => lockedOceans);
    let unlockDateMilliseconds = await getLockedEndTime($userAddress);
    oceanUnlockDate.update(() => new Date(unlockDateMilliseconds));
    loading = false;
  };

  $: if ($userAddress && $userBalances && $connectedChainId) {
    if (!$lockedOceanAmount) {
      loadValues();
    } else {
      loading = false;
    }
  }
</script>

{#if !loading}
  <div class={`container`}>
    <VeOceanCard />
    <OceanCard />
    {#if lockedOceanAmount}
      <WithdrawOcean />
    {:else}
      <LockOcean />
    {/if}
  </div>
{:else}
  <div class={`loading`}>Loading...</div>
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
