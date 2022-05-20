<script>
  import {
    DataTable,
    DataTableSkeleton,
    Pagination,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
  } from "carbon-components-svelte";
  import "carbon-components-svelte/css/white.css";
  import Button from "./Button.svelte";
  import * as networksDataArray from "../../networks-metadata.json";
  import { getNetworkDataById } from "../../utils/web3";

  let networksData = networksDataArray.default;

  export let colData = undefined;
  export let rowData = undefined;
  export let title = undefined;
  export let description = undefined;

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
        />
      {:else if cell.key === "network"}
        {getNetworkDataById(networksData, parseInt(cell.value))?.name}
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
  .customTable {
    width: 100%;
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
</style>
