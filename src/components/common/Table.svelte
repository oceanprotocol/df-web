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

  export let colData = undefined;
  export let rowData = undefined;
  export let title = undefined;
  export let description = undefined;
  export let notHidableColumns = [];

  let columns = {};

  loadVisibleColumns();

  function switchArrayItemsPosition(array, first, second) {
    var intermadiate = array[first];
    array[first] = array[second];
    array[second] = intermadiate;
  }

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
        columns[col.value] = true;
      });

      notHidableColumns.forEach((column) => {
        delete columns[column];
      });
    }
  }

  function onCheck(key, value) {
    columns[key] = value;
    console.log(key, value);
    console.log(colData);
    if (value) {
      colData = [...colData, { key: key.toLowerCase(), value: key }];
      switchArrayItemsPosition(colData, colData.length - 1, colData.length - 2);
    } else {
      colData = colData.filter((col) => col.value !== key);
    }
    localStorage.setItem("poolsDisplayedColumns", JSON.stringify(columns));
  }

  let pagination = { pageSize: 6, page: 1 };
</script>

{#if colData && rowData}
  <DataTable
    sortable
    {title}
    {description}
    headers={colData}
    pageSize={pagination.pageSize}
    page={pagination.page}
    rows={rowData}
    class="customTable"
  >
    <div class="tableActionsContainer">
      <ChecklistDropdown options={columns} title={"Columns"} {onCheck} />
    </div>
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
  <Pagination
    bind:pageSize={pagination.pageSize}
    bind:page={pagination.page}
    totalItems={rowData.length}
    pageSizeInputDisabled
  />
{/if}

<style>
  :global(.tableActionsContainer) {
    display: flex !important;
    justify-content: flex-end !important;
  }

  :global(.customTable) {
    width: 100%;
    overflow: scroll !important;
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
  }
</style>