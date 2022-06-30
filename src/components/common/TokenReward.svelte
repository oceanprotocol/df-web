<script>
  export let amount;
  export let symbol;
</script>

<div class="container">
  <span class="amount"
    >{(Math.round(amount * 1000000) / 1000000).toFixed(6)}</span
  >
  {#if symbol}
    <span class="symbol">{symbol}</span>
  {/if}
</div>

<style>
  .container {
    display: inline-block;
  }
</style>
