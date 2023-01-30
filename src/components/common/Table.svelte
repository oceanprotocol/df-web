<script>
  import {
    DataTable,
    Pagination,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import "carbon-components-svelte/css/white.css";
  import Button from "./Button.svelte";
  import ChecklistDropdown from "./ChecklistDropdown.svelte";
  import { defaultColumns } from "../../stores/data";
  import { filterDataByUserAllocation } from "../../utils/data";
  import {
    dataAllocations,
    totalUserAllocation,
  } from "../../stores/dataAllocations";
  import Input from "./Input.svelte";
  import TextWithNetworkIcon from "./TextWithNetworkIcon.svelte";
  import ShareInput from "./ShareInput.svelte";
  import ItemWithLabel from "./ItemWithLabel.svelte";
  import { userBalances } from "../../stores/tokens";
  import {
    allocateVeOceanToMultipleNFTs,
    getTotalAllocatedVeOcean,
  } from "../../utils/dataAllocations";
  import Swal from "sweetalert2";
  import {
    connectedChainId,
    networkSigner,
    userAddress,
  } from "../../stores/web3";
  import { oceanUnlockDate } from "../../stores/veOcean";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import CustomTooltip from "./CustomTooltip.svelte";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  // TODO - Fix RowData vs. LPData
  // TODO - RowData == View Only (Network, Datatoken, TVL, DCV)
  // TODO - LPData == Everything Required (basetokenAddress, LPAddress, url, etc...)
  export let colData = undefined;
  export let rowData = undefined;
  export let notHidableColumns = [];
  let showDataWithAllocations = false;
  let datasetsWithAllocations = undefined;
  let disabled = undefined;
  let totalAvailable = disabled ? 0 : 100 - $totalUserAllocation;
  let totalAvailableTemporary = undefined;
  let loading = undefined;
  let tooltipMessage = undefined;
  let tooltipState = undefined;

  let columns = {};
  let pagination = { pageSize: 100, page: 1 };

  loadVisibleColumns();

  function getColumnsFromLocalStorage() {
    columns = JSON.parse(localStorage.getItem("datasetsDisplayedColumns"));
    colData.forEach((col) => {
      if (!columns[col.value] && notHidableColumns.indexOf(col.value) === -1) {
        colData = colData.filter((colD) => colD.key !== col.key);
      }
    });
  }

  function checkLocalColumnsEqualLocalStorageColumns() {
    if (!localStorage.getItem("allColumns")) return false;
    return localStorage.getItem("allColumns") === JSON.stringify(colData);
  }

  function loadVisibleColumns() {
    if (
      localStorage.getItem("datasetsDisplayedColumns") &&
      checkLocalColumnsEqualLocalStorageColumns()
    ) {
      getColumnsFromLocalStorage();
    } else {
      localStorage.setItem("allColumns", JSON.stringify(colData));
      colData.forEach((col) => {
        columns[col.value] = defaultColumns.indexOf(col.value) !== -1;
      });
      localStorage.setItem("datasetsDisplayedColumns", JSON.stringify(columns));
      getColumnsFromLocalStorage();
      notHidableColumns.forEach((column) => {
        delete columns[column];
      });
    }
  }

  function onCheck(key, value) {
    columns[key] = value;
    if (value) {
      colData.splice(2, 0, { key: key.toLowerCase(), value: key });
      colData = colData;
    } else {
      colData = colData.filter((col) => col.value !== key);
    }
    localStorage.setItem("datasetsDisplayedColumns", JSON.stringify(columns));
  }

  $: if (showDataWithAllocations === true) {
    const newData = filterDataByUserAllocation(rowData, $dataAllocations);
    datasetsWithAllocations = newData;
  }

  $: if (!showDataWithAllocations && datasetsWithAllocations !== undefined) {
    datasetsWithAllocations = undefined;
  }

  const onTotalAvailableAllocationChange = async (id, value, step) => {
    totalAvailableTemporary = totalAvailable + step;
    rowData[rowData.findIndex((element) => element.id === id)].myallocation =
      value;
  };

  const updateTotalAllocation = (id, value) => {
    if (value == "") {
      rowData[
        rowData.findIndex((element) => element.id === id)
      ].myallocation = 0;
    }
    totalAvailable = totalAvailableTemporary;
  };

  const subtractCurrAllocationsFromTotal = (value) => {
    if (!value || totalAvailable + parseInt(value) > 100) return;
    totalAvailable += parseInt(value);
  };

  const updateAllocations = async (resetPurgatory) => {
    loading = resetPurgatory ? "RESET" : "UPDATE";
    const amounts = [];
    const nftAddresses = [];
    const chainIds = [];
    rowData.forEach((data) => {
      if (data.myallocation !== data.allocated) {
        amounts.push(data.myallocation);
        nftAddresses.push(data.nftaddress);
        chainIds.push(data.chainId);
      }
    });
    if (resetPurgatory) {
      await rowData.forEach((data) => {
        if (data.allocated) {
          amounts.push(0);
          nftAddresses.push(data.nftaddress);
          chainIds.push(data.chainId);
        }
      });
      $dataAllocations.forEach((data) => {
        if (!nftAddresses.find((address) => address === data.nftAddress)) {
          amounts.push(0);
          nftAddresses.push(data.nftAddress);
          chainIds.push(parseInt(data.chainId));
        }
      });
    }
    try {
      await allocateVeOceanToMultipleNFTs(
        amounts,
        nftAddresses,
        chainIds,
        $networkSigner
      );
    } catch (error) {
      Swal.fire("Error!", error.message, "error").then(() => {});
      loading = undefined;
      return;
    }
    Swal.fire("Success!", "Allocation successfully updated.", "success").then(
      async () => {
        let newAllocation = await getTotalAllocatedVeOcean(
          $userAddress,
          $networkSigner
        );
        totalUserAllocation.update(() => newAllocation);
        loading = undefined;
      }
    );
  };

  $: $userAddress && updateTotalAvailableAllocations();
  $: $totalUserAllocation && updateTotalAvailableAllocations();
  $: !$oceanUnlockDate && updateTotalAvailableAllocations();
  $: $oceanUnlockDate && updateTotalAvailableAllocations();

  $: if ($totalUserAllocation === 0) {
    updateTotalAvailableAllocations();
  }

  const updateTotalAvailableAllocations = () => {
    updateDisable();
    totalAvailable = disabled ? 0 : 100 - $totalUserAllocation;
    totalAvailableTemporary = totalAvailable;
  };

  $: if ($oceanUnlockDate) {
    updateDisable();
  }

  $: if (!$oceanUnlockDate) {
    updateDisable();
  }

  function updateDisable() {
    disabled =
      $userBalances[
        getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN")
      ] === undefined ||
      !$userAddress ||
      $connectedChainId != process.env.VE_SUPPORTED_CHAINID ||
      !$oceanUnlockDate;

    updateTooltip();
  }

  function updateTooltip() {
    if (disabled) {
      tooltipMessage =
        descriptions.default.tooltip_datafarming_alloc_amt_no_lock;
      tooltipState = "alert";
    } else {
      if ($totalUserAllocation < 1) {
        tooltipMessage =
          descriptions.default.tooltip_datafarming_alloc_amt_has_lock;
        tooltipState = "warning";
      } else {
        tooltipMessage =
          descriptions.default.tooltip_datafarming_alloc_amt_has_lock;
        tooltipState = undefined;
      }
    }
  }

  $: if ($userAddress && $connectedChainId) {
    disabled =
      $userBalances[
        getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN")
      ] === undefined ||
      !$userAddress ||
      $connectedChainId != process.env.VE_SUPPORTED_CHAINID ||
      !$oceanUnlockDate;
  }

  // init the page state
  updateDisable();
</script>

{#if colData && rowData}
  <div>
    <div class="tableCustomHeader">
      <div class="headerValuesContainer">
        <ItemWithLabel
          title="Allocated amount"
          value={!$oceanUnlockDate
            ? "No available allocation"
            : totalAvailable >= 0
            ? `${
                100 -
                (totalAvailableTemporary !== totalAvailable
                  ? totalAvailableTemporary
                  : totalAvailable)
              }/100%`
            : "loading..."}
          tooltipMessage={tooltipMessage}
          {tooltipState}
        />
        <Button
          text={"Update allocations"}
          className="updateAllocationsBtton"
          onclick={() => updateAllocations()}
          disabled={disabled || loading}
          loading={loading === "UPDATE"}
        />
        <Button
          text={"Reset allocations"}
          className="updateAllocationsBtton"
          onclick={() => updateAllocations(true)}
          disabled={disabled || loading || $totalUserAllocation < 1}
          secondary
          loading={loading === "RESET"}
        />
      </div>
      <div class="tableActionsContainer">
        <div class="datasetsWithAllocationsInputContainer">
          <Input
            type="checkbox"
            label="Only data where I have allocations"
            bind:value={showDataWithAllocations}
          />
        </div>
        <ChecklistDropdown options={columns} title={"Columns"} {onCheck} />
      </div>
    </div>
    <div class="tableContainer">
      <DataTable
        sortable
        headers={colData}
        pageSize={pagination.pageSize}
        page={pagination.page}
        rows={datasetsWithAllocations ? datasetsWithAllocations : rowData}
        class="customTable"
      >
        <Toolbar size="sm">
          <ToolbarContent>
            <ToolbarSearch
              persistent
              on:input={() => {
                pagination.page = 1;
              }}
              shouldFilterRows
            />
          </ToolbarContent>
        </Toolbar>
        <svelte:fragment slot="cell-header" let:header>
          <div class="headerContainer">
            {header.value}
            {#if header.tooltip}
              <CustomTooltip text={header.tooltip} direction="bottom" />
            {/if}
          </div>
        </svelte:fragment>
        <svelte:fragment slot="cell" let:cell let:row>
          {#if cell.key === "title"}
            <TextWithNetworkIcon
              networkName={row.network}
              text={cell.value}
              url={row.action}
            />
          {:else if cell.key === "myallocation"}
            <ShareInput
              currentValue={cell.value}
              available={totalAvailable}
              onChange={(id, value, step) =>
                onTotalAvailableAllocationChange(id, value, step)}
              onBlur={updateTotalAllocation}
              onFocus={subtractCurrAllocationsFromTotal}
              dataId={row.id}
              showAvailable={false}
            />
          {:else}{cell.display ? cell.display(cell.value) : cell.value}{/if}
        </svelte:fragment>
      </DataTable>
    </div>
    <Pagination
      bind:pageSize={pagination.pageSize}
      bind:page={pagination.page}
      totalItems={datasetsWithAllocations
        ? datasetsWithAllocations.length
        : rowData.length}
      pageSizeInputDisabled
    />
  </div>
{/if}

<style>
  .datasetsWithAllocationsInputContainer {
    display: flex !important;
    width: 200px;
    justify-content: center;
    align-items: center;
  }
  .tableContainer {
    width: 100%;
    max-height: calc(100vh - 115px - var(--spacer) * 3.7);
    overflow-y: scroll;
  }
  .tableCustomHeader > div {
    padding: calc(var(--spacer) / 4) 0;
  }
  .tableCustomHeader {
    display: flex;
    justify-content: space-between;
    flex-direction: column-reverse;
    margin: 0;
  }
  .headerContainer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .headerValuesContainer {
    display: flex;
    align-items: center;
    margin-left: calc(var(--spacer) / 3);
  }
  :global(.updateAllocationsBtton) {
    margin-left: calc(var(--spacer) / 3) !important;
  }
  :global(.tableActionsContainer) {
    display: flex !important;
    justify-content: space-between !important;
  }

  :global(.customTable) {
    max-width: 100%;
    background-color: var(--brand-white) !important;
  }
  :global(td) {
    background: var(--brand-white) !important;
    border-bottom: 1px solid var(--brand-grey-dimmed) !important;
    font-size: var(--font-size-small) !important;
    border-top: 0 !important;
  }
  :global(th) {
    background-color: var(--brand-grey-dimmed) !important;
  }
  :global(thead) {
    background-color: var(--brand-white) !important;
    position: sticky;
    inset-block-start: 34px;
  }
  :global(button[class*="table-sort"]) {
    background-color: var(--brand-grey-dimmed) !important;
  }
  :global(button[class*="table-sort"]) {
    background-color: var(--brand-grey-dimmed);
  }
  :global(div [class*="pagination"]) {
    background-color: var(--brand-white) !important;
  }
  :global(div [class*="select-input"]) {
    background-color: var(--brand-white) !important;
    border-left: 1px solid var(--brand-grey-dimmed) !important;
  }
  :global(div [class*="data-table-header"]) {
    background-color: var(--brand-white) !important;
  }
  :global(div [class*="pagination__button"]) {
    border-left: 1px solid var(--brand-grey-dimmed) !important;
  }
  :global([class*="table-toolbar"]) {
    z-index: 0 !important;
    position: fixed !important;
  }
  :global(.tableContainer .bx--data-table) {
    margin-top: calc(var(--spacer) / 2);
  }
  @media (min-width: 640px) {
    .tableCustomHeader {
      flex-direction: row;
    }
    .tableCustomHeader > div {
      padding: 0;
    }
    .tableActionsContainer {
      justify-content: flex-end;
    }
    .datasetsWithAllocationsInputContainer {
      width: auto;
    }
  }
</style>
