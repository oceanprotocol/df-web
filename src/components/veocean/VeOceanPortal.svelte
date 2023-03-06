<script>
  import { networkSigner, userAddress } from "../../stores/web3";
  import OceanSummary from "./OceanSummary.svelte";
  import VeOceanCard from "./VeOceanCard.svelte";
  import LockOcean from "./LockOcean.svelte";
  import { getLockedOceanAmount, getLockedEndTime } from "../../utils/ve";
  import { lockedOceanAmount, oceanUnlockDate } from "../../stores/veOcean";
  import moment from "moment";

  let loading = false;

  const loadValues = async () => {
    loading = true;
    let lockedOceans = await getLockedOceanAmount($userAddress, $networkSigner);
    lockedOceanAmount.update(() => lockedOceans);
    if (!$oceanUnlockDate) {
      let unlockDateMilliseconds = await getLockedEndTime(
        $userAddress,
        $networkSigner
      );
      await oceanUnlockDate.update(() =>
        unlockDateMilliseconds ? moment.utc(unlockDateMilliseconds) : undefined
      );
    }

    loading = false;
  };

  $: if ($userAddress) {
    loadValues();
  }
</script>

{#if !loading}
  <div class={`container`}>
    <VeOceanCard />
    <LockOcean />
    <OceanSummary />
  </div>
{:else}
  <h3 class="loading">Loading...</h3>
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
    color: var(--brand-grey-light);
    height: calc(100vh - 115px);
  }

  .alignContentCenter {
    justify-content: center;
  }

  @media (min-width: 640px) {
    .container {
      padding-top: calc(var(--spacer) * 2);
      gap: var(--spacer);
    }
  }
</style>
