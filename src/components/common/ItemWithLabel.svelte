<script>
  import CustomTooltip from "./CustomTooltip.svelte";

  export let title;
  export let value;
  export let small = false;
  export let float = false;
  export let loading = false;
  export let direction = "column";
  export let tooltipMessage = undefined;
  export let tooltipState = undefined;
  export let tooltipDirection = "top";
  export let tooltipAlign = "center";
  export let input = undefined;
</script>

<div class="item" style="flex-direction : {direction}">
  <div class="titleContainer" style={direction=="row" && "margin-bottom:0; margin-right:calc(var(--spacer)/6)"}>
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
  <div class="valueContainer">
  {#if input!==null && input!==undefined}
    <input type="number" value={input} min="0" on:change={(event) => {input = event.target.valueAsNumber >= 0 ? event.target.valueAsNumber : 0}}/>
  {/if}
  {#if value}
    {#if !loading}
      <span class={`value ${small ? 'small' : ''}`}>{float ? parseFloat(value).toFixed(3) : value}</span>
    {:else}
      <span class={`value ${small ? 'small' : ''}`}>loading...</span>
    {/if}
  {/if}
  </div>
</div>

<style>
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
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
  input{
    background-color: transparent;
    color: black;
    border: 1px solid var(--brand-grey-lighter);
    width: 40px;
    margin-right: 5px;
    font-size: var(--font-size-small);
  }
  .small{
    font-size: var(--font-size-small);
  }
</style>
