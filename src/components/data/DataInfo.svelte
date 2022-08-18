<script>
  import NetworkItem from "../common/NetworkItem.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";

  export let data;
</script>

{#if data}
  <div class="header">
    <h3>Data NFT</h3>
    <div class="network-container">
      <NetworkItem chainId={data.chainId} />
    </div>
  </div>
  <div class="items-container">
    <ItemWithLabel title="DataToken Symbol" value={data.DTSymbol} />
    <ItemWithLabel title="Basetoken" value={data.basetoken} />
    <ItemWithLabel title="TVL" value={(parseInt(data.tvl) * 2).toFixed(3)} />
    <ItemWithLabel title="Volume" value={parseInt(data.volume).toFixed(3)} />
  </div>
{/if}

<style>
  .network-container {
    width: auto;
  }
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
