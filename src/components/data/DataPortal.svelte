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
    /*getAllAllocationsForAddress($userAddress).then((resp) => {
      dataAllocations.update(() => resp);
    });*/
    dataAllocations.update(() => [
      {
        chainId: 4,
        nft_addr: "0x537e625c1d722fef6a6e793ac226e5f22e485923",
        LP_addr: "0xe2DD09d719Da89e5a3D0F2549c7E24566e947260",
        percent: 30,
      },
      {
        chainId: 4,
        nft_addr: "0x537e625c1d722fef6a6e793ac226e5f22e485924",
        LP_addr: "0xe2DD09d719Da89e5a3D0F2549c7E24566e947260",
        percent: 30,
      },
      {
        chainId: 4,
        nft_addr: "0x537e625c1d722fef6a6e793ac226e5f22e485925",
        LP_addr: "0xe2DD09d719Da89e5a3D0F2549c7E24566e947260",
        percent: 30,
      },
    ]);
  };

  $: if ($userAddress) {
    loadValues();
  }

  $: if ($dataAllocations) {
    loadDatasets(`${process.env.BACKEND_API}/volume`, $dataAllocations);
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
