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
  import ShareInput from "./ShareInput.svelte";
  import ItemWithLabel from "./ItemWithLabel.svelte";
  import Link from "./Link.svelte";
  import { userBalances } from "../../stores/tokens";
  import {
    allocateVeOceanToMultipleNFTs,
    getTotalAllocatedVeOcean,
  } from "../../utils/dataAllocations";
  import Swal from "sweetalert2";
  import { networkSigner, userAddress } from "../../stores/web3";

  // TODO - Fix RowData vs. LPData
  // TODO - RowData == View Only (Network, Datatoken, TVL, DCV)
  // TODO - LPData == Everything Required (basetokenAddress, LPAddress, url, etc...)
  export let colData = undefined;
  export let rowData = undefined;
  export let notHidableColumns = [];
  let showDataWithAllocations = false;
  let datasetsWithAllocations = undefined;
  let disabled = $userBalances[process.env.VE_OCEAN_CONTRACT] === undefined;
  let totalAvailable = disabled ? 0 : 100 - $totalUserAllocation;
  let loading = false;

  let columns = {};
  let pagination = { pageSize: 13, page: 1 };

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

  $: if (showDataWithAllocations) {
    const newData = filterDataByUserAllocation(rowData, $dataAllocations);
    datasetsWithAllocations = newData;
  }

  $: if (!showDataWithAllocations && datasetsWithAllocations !== undefined) {
    datasetsWithAllocations = undefined;
  }

  function compare(a, b) {
    if (a.myallocation > b.myallocation) {
      return -1;
    }
    if (a.myallocation < b.myallocation) {
      return 1;
    }
    return 1;
  }

  $: if (rowData) {
    sortRowsDataByAllocations();
  }

  const sortRowsDataByAllocations = () => {
    rowData = rowData.sort(compare);
  };

  const onTotalAvailableAllocationChange = async (id, value, step) => {
    totalAvailable += step;
    rowData[rowData.findIndex((element) => element.id === id)].myallocation =
      value;
    if (pagination.page > 1) pagination.page = 1;
  };

  const updateAllocations = async () => {
    loading = true;
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
    try {
      await allocateVeOceanToMultipleNFTs(
        amounts,
        nftAddresses,
        chainIds,
        $networkSigner
      );
    } catch (error) {
      Swal.fire("Error!", error.message, "error").then(() => {});
      loading = false;
      return;
    }
    Swal.fire("Success!", "Allocation successfully updated.", "success").then(
      async () => {
        let newAllocation = await getTotalAllocatedVeOcean(
          $userAddress,
          $networkSigner
        );
        totalUserAllocation.update(() => newAllocation);
        loading = false;
      }
    );
  };

  $: if ($totalUserAllocation !== undefined) {
    totalAvailable = disabled ? 0 : 100 - $totalUserAllocation;
  }
</script>

{#if colData && rowData}
  <div>
    <div class="tableCustomHeader">
      <div class="headerValuesContainer">
        <ItemWithLabel
          title="Available allocation"
          value={totalAvailable >= 0 ? `${totalAvailable}%` : "loading..."}
        />
        <Button
          text={loading ? "Updating..." : "Update allocations"}
          className="updateAllocationsBtton"
          onclick={() => updateAllocations()}
          disabled={disabled || loading}
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
            <ToolbarSearch persistent shouldFilterRows />
          </ToolbarContent>
        </Toolbar>
        <svelte:fragment slot="cell" let:cell let:row>
          {#if cell.key === "action"}
            <Link
              text="view"
              url={cell.value}
            />{:else if cell.key === "myallocation"}
            <ShareInput
              currentValue={cell.value}
              available={totalAvailable}
              onChange={(id, value, step) =>
                onTotalAvailableAllocationChange(id, value, step)}
              dataId={row.id}
              {disabled}
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
    justify-content: center;
    align-items: center;
  }
  .tableContainer {
    width: 100%;
    overflow-y: scroll;
  }
  .tableCustomHeader {
    display: flex;
    justify-content: space-between;
    margin: calc(var(--spacer) / 8) 0;
  }
  :global(.updateAllocationsBtton) {
    margin-left: calc(var(--spacer) / 3);
  }
  .headerValuesContainer {
    display: flex;
    align-items: center;
    margin-left: calc(var(--spacer) / 3);
  }
  :global(.tableActionsContainer) {
    display: flex !important;
    justify-content: flex-end !important;
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
    background-color: var(--brand-white) !important;
  }
  :global(thead) {
    background-color: var(--brand-white) !important;
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
  :global(.bx--data-table) {
    margin-top: 2rem;
  }
</style>
