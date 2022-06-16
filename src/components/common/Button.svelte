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
    border: 0;
    cursor: pointer;
    outline: 0;
    margin: 0;
    display: inline-block;
    width: fit-content;
    min-width: 7rem;
    padding: calc(var(--spacer) / 4) calc(var(--spacer) / 2);
    font-size: var(--font-size-small);
    font-family: var(--font-family-base);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    border-radius: var(--border-radius);
    transition: 0.2s ease-out;
    color: var(--brand-white);
    background: var(--brand-gradient);
    
    box-shadow: 0 9px 18px 0 rgba(0, 0, 0, 0.1);
    user-select: none;
    text-align: center;
  }

  .button:hover,
  .button:focus {
    color: var(--brand-white);
    background: var(--brand-grey-light);
    text-decoration: none;
    box-shadow: 0 12px 30px 0 rgba(0, 0, 0, 0.1);
    transform: translate3d(0, -0.05rem, 0);
  }

  .button:active {
    background: var(--brand-grey-light);
    transition: none;
    transform: none;
    box-shadow: 0 5px 18px 0 rgba(0, 0, 0, 0.1);
  }

  .button:disabled,
  .button.disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.25;
  }
  .loadingSpinnerContainer {
    margin-right: 5px;
  }

  .buttonSecondary {
    background: var(--brand-grey-light);
  }

  .textOnly,
  .textOnly:hover,
  .textOnly:focus,
  .textOnly:active {
    border: 0;
    border-radius: 0;
    outline: 0;
    padding: 0;
    display: inline-block;
    background: 0;
    color: var(--brand-pink);
    box-shadow: none;
    cursor: pointer;
    min-width: auto;
  }
  span {
    display: box;
    line-height: 100%;
  }
</style>
