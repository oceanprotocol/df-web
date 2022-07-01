<script>
  import {
    DataTable,
    Pagination,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import "carbon-components-svelte/css/white.css";
  import StakeModal from "../pools/StakeModal.svelte";
  import Button from "./Button.svelte";
  import ChecklistDropdown from "./ChecklistDropdown.svelte";
  import { defaultColumns } from "../../stores/pools";
  import { filterPoolsByUserShares } from "../../utils/pools";
  import { userStakes } from "../../stores/poolShares";
  import Input from "./Input.svelte";

  // TODO - Fix RowData vs. LPData
  // TODO - RowData == View Only (Network, Datatoken, TVL, DCV)
  // TODO - LPData == Everything Required (basetokenAddress, LPAddress, url, etc...)
  export let colData = undefined;
  export let rowData = undefined;
  export let notHidableColumns = [];
  let showPoolsWithShares = false;
  let poolsWithShares = undefined;

  let columns = {};
  let pagination = { pageSize: 13, page: 1 };

  loadVisibleColumns();

  function getColumnsFromLocalStorage() {
    columns = JSON.parse(localStorage.getItem("poolsDisplayedColumns"));
    colData.forEach((col) => {
      if (!columns[col.value] && notHidableColumns.indexOf(col.value) === -1) {
        colData = colData.filter((colD) => colD.key !== col.key);
      }
    });
  }

  function loadVisibleColumns() {
    if (localStorage.getItem("poolsDisplayedColumns")) {
      getColumnsFromLocalStorage();
    } else {
      colData.forEach((col) => {
        columns[col.value] = defaultColumns.indexOf(col.value) !== -1;
      });

      localStorage.setItem("poolsDisplayedColumns", JSON.stringify(columns));

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
    localStorage.setItem("poolsDisplayedColumns", JSON.stringify(columns));
  }

  $: if (showPoolsWithShares) {
    const newData = filterPoolsByUserShares(rowData, $userStakes);
    poolsWithShares = newData;
  }

  $: if (!showPoolsWithShares && poolsWithShares !== undefined) {
    poolsWithShares = undefined;
  }
</script>

{#if colData && rowData}
  <div>
    <div class="tableActionsContainer">
      <Input
        type="checkbox"
        label="My stakes"
        bind:value={showPoolsWithShares}
      />
      <ChecklistDropdown options={columns} title={"Columns"} {onCheck} />
    </div>
    <div class="tableContainer">
      <DataTable
        sortable
        headers={colData}
        pageSize={pagination.pageSize}
        page={pagination.page}
        rows={poolsWithShares ? poolsWithShares : rowData}
        class="customTable"
      >
        <Toolbar size="sm">
          <ToolbarContent>
            <ToolbarSearch persistent shouldFilterRows />
          </ToolbarContent>
        </Toolbar>
        <svelte:fragment slot="cell" let:cell>
          {#if cell.key === "action"}
            <Button
              text="view"
              onclick={() => {
                window.open(cell.value, "_blank");
              }}
              disabled={false}
            />{:else if cell.key === "lp"}
            <StakeModal pool={cell.value} />
          {:else}{cell.value}{/if}
        </svelte:fragment>
      </DataTable>
    </div>
    <Pagination
      bind:pageSize={pagination.pageSize}
      bind:page={pagination.page}
      totalItems={poolsWithShares ? poolsWithShares.length : rowData.length}
      pageSizeInputDisabled
    />
  </div>
{/if}

<style>
  .tableContainer {
    width: 100%;
    overflow-y: scroll;
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
