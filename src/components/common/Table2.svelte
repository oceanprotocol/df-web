<script>
  import {
    InlineNotification,
    DataTable,
    DataTableSkeleton,
    Pagination,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    Button,
    Link,
  } from "carbon-components-svelte";
  import "carbon-components-svelte/css/white.css";

  export let colData = undefined;
  export let rowData = undefined;

  let pagination = { pageSize: 4, page: 1 };

  console.log(rowData);
</script>

{#if colData && rowData}
  <DataTable
    sortable
    title="Load balancers"
    description="Your organization's active load balancers."
    headers={colData}
    pageSize={pagination.pageSize}
    page={pagination.page}
    rows={rowData}
    class="customTable"
  />
  <Pagination
    bind:pageSize={pagination.pageSize}
    bind:page={pagination.page}
    totalItems={6}
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
