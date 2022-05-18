<script>
  import Table from "svelte-tailwind-table";

  export let colData = undefined;
  export let rowData = undefined;
</script>

{#if colData && rowData}
  <Table overrideClasses="customTable" {colData} {rowData} />
{/if}

<style>
  .customTable {
    width: 100%;
  }
  .customTable .table {
    width: 100%;
  }
</style>
