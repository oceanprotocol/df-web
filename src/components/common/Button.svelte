<script>
  import { Circle } from "svelte-loading-spinners";

  export let onclick = () => {};
  export let text;
  export let className = undefined;
  export let secondary = false;
  export let loading = false;
  export let disabled = false;
  export let textOnly = false;
  export let type = "button";
</script>

<button
  on:click={onclick}
  class="button {secondary ? 'buttonSecondary' : ''} {disabled && secondary
    ? 'disabledSecondary'
    : disabled
    ? 'disabled'
    : ''} {textOnly ? 'textOnly' : ''} {className ? className : ''}"
  {disabled}
  {type}
>
  {#if loading === true}
    <div class="loadingSpinnerContainer">
      <Circle size="20" color="#FFFFFF" unit="px" cl />
    </div>
  {/if}
  <span>{text}</span>
</button>

<style>
  .button {
    background-color: var(--brand-color-primary);
    font-size: var(--font-size-small);
    padding: calc(var(--spacer) / 6) calc(var(--spacer) / 4);
    color: var(--brand-white);
    font-weight: bold;
    text-transform: uppercase;
    border-radius: var(--border-radius);
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .loadingSpinnerContainer {
    margin-right: 5px;
  }
  .disabled {
    background-color: var(--button-disabled-color);
    cursor: default;
  }
  .disabledSecondary {
    cursor: default;
    color: var(--brand-grey-lighter) !important;
    background-color: var(--background-body) !important;
  }
  .buttonSecondary {
    background-color: var(--brand-grey-dimmed);
    color: var(--brand-grey-light);
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
  }
  .textOnly {
    background-color: transparent;
    color: var(--brand-grey-light);
    border: 0;
    padding: 0;
  }
  .textOnly:hover {
    color: var(--brand-color-primary) !important;
  }
  span {
    display: box;
    line-height: 100%;
  }
</style>
