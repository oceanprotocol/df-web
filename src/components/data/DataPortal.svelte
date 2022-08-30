<script>
  import { loadDatasets, datasets, columnsData } from "../../stores/data";
  import {
    getAllAllocationsForAddress,
    getTotalAllocatedVeOcean,
  } from "../../utils/dataAllocations";
  import {
    dataAllocations,
    totalUserAllocation,
  } from "../../stores/dataAllocations";
  import { userAddress } from "../../stores/web3";
  import Table from "../common/Table.svelte";

  const loadValues = async () => {
    if (!$totalUserAllocation) {
      let newAllocation = await getTotalAllocatedVeOcean($userAddress);
      totalUserAllocation.update(() => newAllocation);
    }
  };

  $: if (!$datasets) {
    loadDatasets(`${process.env.BACKEND_API}/volume`);
  }

  $: if ($userAddress) {
    loadValues();
    getAllAllocationsForAddress($userAddress).then((resp) => {
      dataAllocations.update(() => resp);
    });
  }
</script>

<div class={`container ${!$datasets && "alignContentCenter"}`}>
  {#if $datasets}
    <div class="data">
      <Table
        colData={columnsData}
        notHidableColumns={["Action", "Allocate"]}
        rowData={$datasets}
        description="Explore all the datasets that are eligible for staking, and stake your Ocean token to get rewards."
      />
    </div>
  {:else}
    <span class="loading">Loading...</span>
  {/if}
</div>

<style>
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
    margin-top: calc(var(--spacer) * 2);
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
