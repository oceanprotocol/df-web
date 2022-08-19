<script>
  import { userAddress, networkSigner } from "../../stores/web3";
  import VeOceanCard from "./VeOceanCard.svelte";
  import OceanCard from "./OceanCard.svelte";
  import LockOcean from "./LockOcean.svelte";
  import { getLockedOceanAmount, getLockedEndTime } from "../../utils/ve";
  import { lockedOceanAmount, oceanUnlockDate } from "../../stores/veOcean";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";
  import { delegate } from "../../utils/delegations";
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
    /*await delegate(
      "0xe08A1dAe983BC701D05E492DB80e0144f8f4b909",
      "0xe2DD09d719Da89e5a3D0F2549c7E24566e947260",
      8000,
      0,
      unlockDateMilliseconds / 10000,
      1,
      $networkSigner
    );*/
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
    <OceanCard />
    <LockOcean />
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
