<script>
  import CustomTooltip from "./CustomTooltip.svelte";

  export let title;
  export let value;
  export let float = false;
  export let loading = false;
  export let tooltipMessage = undefined;
  export let tooltipState = undefined;
  export let tooltipDirection = "top";
  export let tooltipAlign = "center";
</script>

<div class="item">
  <div class="titleContainer">
    <span class="title">{title}</span>
    {#if tooltipMessage}
      <CustomTooltip
        text={tooltipMessage}
        direction={tooltipDirection}
        align={tooltipAlign}
        state={tooltipState}
      />
    {/if}
  </div>
  {#if !loading}
    <span class="value">{float ? parseFloat(value).toFixed(3) : value}</span>
  {:else}
    <span class="value">loading...</span>
  {/if}
</div>

<style>
  .item {
    display: flex;
    flex-direction: column;
  }
  :global(.item .bx--tooltip__label) {
    background-color: transparent !important;
    width: 18px !important;
  }
  .titleContainer {
    display: flex;
    margin-bottom: calc((var(--spacer) / 8));
    justify-content: center;
    align-items: center;
  }
  .title {
    font-size: var(--font-size-small);
  }
  .value {
    font-size: var(--font-size-base);
    font-weight: bold;
  }
</style>
