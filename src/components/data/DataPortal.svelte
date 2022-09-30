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
  import { onMount } from "svelte";
  import MainMessage from "../common/MainMessage.svelte";

  let allocations;

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

  onMount(async () => {
    if (!$userAddress) {
      if (!$totalUserAllocation) {
        await totalUserAllocation.update(() => 0);
      }
      dataAllocations.update(() => []);
    }
  });
</script>

<div
  class={`container ${(!$datasets || $isAppLoading) && "alignContentCenter"}`}
>
  {#if $datasets && !$isAppLoading}
    <div class="wrapper">
      <MainMessage
        message={`Distribute your available allocation across datasets to earn active rewards.`}
      />
      <div class="data">
        <Table
          colData={columnsData}
          notHidableColumns={["Action", "Allocate"]}
          rowData={$datasets}
          description="Explore all the datasets that are eligible for staking, and stake your Ocean token to get rewards."
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
    width: 100%;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: calc(100vh - 115px);
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
  }

  @media (min-width: 640px) {
    .data {
      margin-top: var(--spacer);
    }
  }
</style>
