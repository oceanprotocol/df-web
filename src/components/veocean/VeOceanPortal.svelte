<script>
  import { userAddress } from "../../stores/web3";
  import OceanSummary from "./OceanSummary.svelte";
  import VeOceanCard from "./VeOceanCard.svelte";
  import LockOcean from "./LockOcean.svelte";
  import { getLockedOceanAmount, getLockedEndTime } from "../../utils/ve";
  import { lockedOceanAmount, oceanUnlockDate } from "../../stores/veOcean";
  import moment from "moment";

  let loading = true;

  const loadValues = async () => {
    if (!$oceanUnlockDate) {
      loading = true;
      let unlockDateMilliseconds = await getLockedEndTime(
        $userAddress
      );
      await oceanUnlockDate.update(() =>
        unlockDateMilliseconds ? moment.utc(unlockDateMilliseconds) : undefined
      );
      let lockedOceans = await getLockedOceanAmount($userAddress);
      lockedOceanAmount.update(() => lockedOceans);
    }
  };

  oceanUnlockDate.subscribe((v) => {
    if(v!==null) {
      loading = false;
    }
  })

  $: if ($userAddress) {
    loadValues();
  }
</script>

{#if !loading }
  <div class={`container`}>
    <VeOceanCard />
    <LockOcean />
    <OceanSummary />
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
    width: 100%;
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
