<script>
  import { loadPools, pools, columnsData } from "../../stores/pools";
  import Table from "../common/Table.svelte";

  $: if (!$pools) {
    loadPools();
  }
</script>

<div class="container">
  <h1>Pool Explorer</h1>
  {#if $pools}
    <div class="pools">
      <Table
        colData={columnsData}
        notHidableColumns={["Action"]}
        rowData={$pools}
        description="Explore all the pools that are eligible for staking, and stake your Ocean token to get rewards."
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
    justify-content: center;
  }

  h1 {
    margin: calc(var(--spacer)) 0;
  }

  .pools {
    width: 100%;
    background-color: var(--brand-white);
    box-shadow: 0 12px 30px 0 rgba(0, 0, 0, 0.1);
    transform: translate3d(0, -0.05rem, 0);
    border-radius: var(--border-radius);
  }

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
  }

  @media only screen and (min-width: 660px) {
    h1 {
      margin: calc(var(--spacer) * 2) 0;
    }
  }
</style>
