<script>
  import { Circle } from "svelte-loading-spinners";

  export let onclick;
  export let text;
  export let secondary = false;
  export let loading = false;
  export let disabled = false;
  export let textOnly = false;
</script>

<button
  on:click={onclick}
  class="button {secondary && 'buttonSecondary'} {disabled &&
    'disabled'} {textOnly && 'textOnly'}"
  disabled={disabled === true}
  type="button"
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
    padding: calc(var(--spacer) / 8);
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
  }
  .buttonSecondary {
    background-color: var(--brand-white);
    color: var(--brand-black);
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
  .textOnly {
    background-color: transparent;
    color: var(--brand-black);
    border: 0;
    padding: 0;
  }
  span {
    display: box;
    line-height: 100%;
  }
</style>
