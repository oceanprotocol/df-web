<script>
  import { loadDatasets, datasets, columnsData } from "../../stores/data";
  import { getTotalAllocatedVeOcean } from "../../utils/dataAllocations";
  import {
    dataAllocations,
    totalUserAllocation,
  } from "../../stores/dataAllocations";
  import {
    connectedChainId,
    userAddress,
  } from "../../stores/web3";
  import Table from "../common/Table.svelte";
  import { isAppLoading } from "../../stores/app";
  import { query } from "svelte-apollo";
  import { GET_ALLOCATIONS } from "../../utils/dataAllocations";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import { userBalances } from "../../stores/tokens";
  import { oceanUnlockDate } from "../../stores/veOcean";
  import DelegationPortal from "../delegation/DelegationPortal.svelte";

  let allocations;
  let message = undefined;

  let tabSelected = "alloc";
  const chainId = import.meta.env.VITE_VE_SUPPORTED_CHAINID;

  const loadTotalAllocation = async () => {
    let newAllocation = await getTotalAllocatedVeOcean(
      $userAddress
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

  export const changeTab = (tab) =>{
    tabSelected = tab;
  }

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
    loadDatasets(`${import.meta.env.VITE_BACKEND_API}/nftinfo`, $dataAllocations);
  }
</script>

<div
  class={`container ${
    (!$datasets ||
      $isAppLoading ||
      !$userBalances[
        getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN")
      ]) &&
    "alignContentCenter"
  }`}
>
    <div class="wrapper">
      <h2 class="title">Curate Data to Earn OCEAN</h2>
      <p class="message">Find assets that generate sales and allocate your veOCEAN to curate them.</p>
      <p class="message">Easily manage your curation and rewards by delegating to a single wallet. <a href="#delegation" rel="noreferrer" >Scroll down to learn more.</a></p>
      <div class="data">
        <Table 
          dataAvailable={$datasets && !$isAppLoading && $userBalances[getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN")] !== undefined}
          colData={columnsData[tabSelected]}
          notHidableColumns={["Allocate"]}
          rowData={$datasets}
          tabSelection={changeTab}
          tabSelected={tabSelected}
        />
      </div>
    </div>
    <DelegationPortal />
</div>

<style>
  .wrapper {
    padding-top: calc(var(--spacer) * 2);
    width: 100%;
  }

  .container {
    width: 100%;
    margin-bottom: var(--spacer);
  }

  .title {
    width: 100%;
    margin-bottom: calc(var(--spacer) / 2);
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
    color: var(--brand-grey-light);
  }

  .alignContentCenter {
    justify-content: center;
    min-height: calc(100vh - 115px);
  }

  @media (min-width: 640px) {
    .data {
      margin-top: var(--spacer);
    }
  }
</style>
