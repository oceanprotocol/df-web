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
  }
  .customTable .table {
    width: 100%;
  }
</style>
