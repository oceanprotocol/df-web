<script>
  import NetworkItem from "../common/NetworkItem.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";

  export let pool;
</script>

{#if pool}
  <div class="header">
    <h3>Pool</h3>
    <NetworkItem chainId={pool.chainId} />
  </div>
  <div class="items-container">
    <ItemWithLabel title="DataToken Symbol" value={pool.rowData.datatoken} />
    <ItemWithLabel title="Basetoken" value={pool.rowData.basetoken} />
    <ItemWithLabel title="TVL" value={parseInt(pool.rowData.tvl).toFixed(3)} />
    <ItemWithLabel
      title="Volume"
      value={parseInt(pool.rowData.volume).toFixed(3)}
    />
  </div>
{:else}{/if}

<style>
  .items-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: calc(var(--spacer) / 2);
  }
  h3 {
    margin-right: calc((var(--spacer)) / 6);
  }
</style>
