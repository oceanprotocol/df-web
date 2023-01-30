<script>
  import { Circle } from "svelte-loading-spinners";

  export let onclick = () => {};
  export let text;
  export let className = undefined;
  export let fullWidth = undefined;
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
    : ''} {textOnly ? 'textOnly' : ''} {className ? className : ''} {fullWidth
    ? 'fullWidth'
    : ''}"
  {disabled}
  {type}
>
  {#if loading === true}
    <div class="loadingSpinnerContainer">
      <Circle
        size="20"
        color={secondary ? "var(--brand-grey-light)" : "var(--brand-white)"}
        unit="px"
        cl
      />
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
    padding: calc(var(--spacer) / 6) calc(var(--spacer) / 4);
    color: var(--brand-white);
    font-weight: bold;
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
  .textOnly:hover {
    color: var(--color-primary) !important;
  }
  .textOnly:disabled,
  .textOnly[disabled]:hover {
    color: var(--brand-grey-lighter) !important;
  }
  span {
    display: box;
    line-height: 100%;
  }
  .fullWidth {
    width: 100%;
  }
</style>
