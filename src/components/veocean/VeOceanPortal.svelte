<script>
  import { userAddress, connectedChainId } from "../../stores/web3";
  import OceanSummary from "./OceanSummary.svelte";
  import VeOceanCard from "./VeOceanCard.svelte";
  import { getLockedOceanAmount, getLockedEndTime } from "../../utils/ve";
  import { lockedOceanAmount, oceanUnlockDate } from "../../stores/veOcean";
  import moment from "moment";

  let loading = false;

  const loadValues = async () => {
    loading = true;
    let lockedOceans = await getLockedOceanAmount($userAddress);
    lockedOceanAmount.update(() => lockedOceans);
    if (!$oceanUnlockDate) {
      let unlockDateMilliseconds = await getLockedEndTime(
        $userAddress
      );
      await oceanUnlockDate.update(() =>
        unlockDateMilliseconds ? moment.utc(unlockDateMilliseconds) : undefined
      );
      let lockedOceans = await getLockedOceanAmount($userAddress);
      lockedOceanAmount.update(() => lockedOceans);
    }
    loading = false
  };

  oceanUnlockDate.subscribe((v) => {
    if(v!==null) {
      loading = false;
    }
  })

  $: if ($userAddress && $connectedChainId==import.meta.env.VITE_VE_SUPPORTED_CHAINID) {
    loadValues();
  }
</script>

{#if !loading }
<div>
  <h2 class="title">
    Withdraw your OCEAN tokens after your lock period has ended
  </h2>
  </div>
  <div class={`container`}>
    <VeOceanCard />
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
    width: 100%;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--brand-grey-light);
    height: calc(100vh - 115px);
    width: 100%;
  }

  .alignContentCenter {
    justify-content: center;
  }

  .title {
    width: 100%;
    margin-top: calc(var(--spacer) * 2);
    margin-bottom: calc(var(--spacer) / 2);
  }
  .message {
    width: 100%;
  }

  :global(.dismissAllowanceButton){
    margin-bottom: calc(var(--spacer)/3) !important;
  }

  @media (min-width: 640px) {
    .container {
      padding-top: var(--spacer);
      gap: var(--spacer);
    }
  }
</style>
