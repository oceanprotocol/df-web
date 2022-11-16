<script>
  import { loadDatasets, datasets, columnsData } from "../../stores/data";
  import { getTotalAllocatedVeOcean } from "../../utils/dataAllocations";
  import {
    dataAllocations,
    totalUserAllocation,
  } from "../../stores/dataAllocations";
  import {
    connectedChainId,
    networkSigner,
    userAddress,
  } from "../../stores/web3";
  import Table from "../common/Table.svelte";
  import { isAppLoading } from "../../stores/app";
  import { query } from "svelte-apollo";
  import { GET_ALLOCATIONS } from "../../utils/dataAllocations";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import { userBalances } from "../../stores/tokens";
  import { oceanUnlockDate } from "../../stores/veOcean";

  let allocations;
  let message = undefined;

  const loadTotalAllocation = async () => {
    let newAllocation = await getTotalAllocatedVeOcean(
      $userAddress,
      $networkSigner
    );
    totalUserAllocation.update(() => newAllocation);
  };

  const loadValues = async () => {
    dataAllocations.update(() =>
      $allocations.data.veAllocateUser
        ? $allocations.data.veAllocateUser.veAllocation
        : []
    );
  };

  const getMessage = () => {
    if (!$oceanUnlockDate) {
      message =
        "You don't have allocation. Go to **veOCEAN** and lock your OCEAN tokens to receive allocation.";
    } else if ($totalUserAllocation === 0) {
      message =
        "You have not used your allocation. Set your allocation at **MyAllocations** column to receive active rewards.";
    } else {
      message = "";
    }
  };

  $: (!$oceanUnlockDate ||
    $oceanUnlockDate ||
    $totalUserAllocation > 0 ||
    $totalUserAllocation < 1) &&
    getMessage();

  $: if ($allocations?.data) {
    loadValues();
  }

  $: if ($userAddress && $connectedChainId) {
    allocations = query(GET_ALLOCATIONS, {
      variables: { userAddress: $userAddress.toLowerCase() },
    });
    loadTotalAllocation();
  }

  $: if ($totalUserAllocation !== undefined) {
    if (!allocations) {
      allocations = query(GET_ALLOCATIONS, {
        variables: { userAddress: $userAddress.toLowerCase() },
      });
    } else {
      allocations.refetch();
    }
  }

  $: if ($dataAllocations) {
    loadDatasets(`${process.env.BACKEND_API}/nftinfo`, $dataAllocations);
  }
</script>

<div
  class={`container ${
    (!$datasets ||
      $isAppLoading ||
      !$userBalances[
        getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN")
      ]) &&
    "alignContentCenter"
  }`}
>
  {#if $datasets && !$isAppLoading && $userBalances[getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN")] !== undefined}
    <div class="wrapper">
      <h3 class="title">Explore and Curate Data Assets</h3>
      <div class="data">
        <Table
          colData={columnsData}
          notHidableColumns={["Action", "Allocate"]}
          rowData={$datasets}
          description="Explore elligible datasets and allocate your veOCEAN to earn Active Rewards."
        />
      </div>
    </div>
  {:else}
    <span class="loading">Loading...</span>
  {/if}
</div>

<style>
  .wrapper {
    margin-top: var(--spacer);
    height: 100%;
    width: 100%;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  
  .title {
    font-weight: bold;
    width: 100%;
    font-size: var(--font-size-large);
  }

  .data {
    width: 100%;
    background-color: var(--brand-white);
    box-shadow: var(--box-shadow);
    transform: translate3d(0, -0.05rem, 0);
    border-radius: var(--border-radius);
    margin-top: var(--spacer);
  }

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
  }

  .alignContentCenter {
    justify-content: center;
    height: calc(100vh - 115px);
  }

  @media (min-width: 640px) {
    .data {
      margin-top: var(--spacer);
    }
  }
</style>
