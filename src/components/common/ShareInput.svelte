<script>
  import { userAddress } from "../../stores/web3";

  export let available = 100;
  export let dataId = undefined;
  export let onChange = undefined;
  export let currentValue = 0;
  export let showAvailable = true;
  export let onBlur = undefined;
  export let onFocus = undefined;

  let n = currentValue;
  let isFocused = false;

  $: $userAddress && resetValues();

  function validator(node, value) {
    return {
      update(value) {
        if (available === 0) return;
        if (value === null) {
          n = null;
          currentValue = null;
          isFocused && onChange(dataId, currentValue, value);
          return;
        }
        currentValue =
          currentValue < node.min || currentValue > node.max
            ? n
            : parseInt(value);
        if (currentValue == parseInt(value)) {
          isFocused && onChange(dataId, currentValue, -value);
        }
        n = currentValue;
      },
    };
  }

  const resetValues = () => {
    n = 0;
  };
</script>

<div class="container">
  <input
    type="number"
    bind:value={currentValue}
    use:validator={currentValue}
    on:blur={(e) => {
      onBlur(dataId, e.target.value);
      isFocused = false;
    }}
    on:focus={(e) => {
      onFocus(e.target.value);
      if (currentValue === 0) {
        currentValue = null;
      }
      isFocused = true;
    }}
    max={available}
    disabled={available === 0 && currentValue === 0}
    min="0"
    class="allocationInput"
  />%
  {#if showAvailable === true}
    <span class="available">{available}</span>
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: calc(var(--spacer) / 12) calc(var(--spacer) / 8);
    border: 1px solid var(--brand-grey-lighter);
    width: fit-content;
    color: black;
    border-radius: 5px;
  }
  .container:focus-within {
    border: 1px solid var(--brand-grey-darker);
  }
  .available {
    padding: 0 calc(var(--spacer) / 6);
    background-color: transparent;
    border: none;
    margin: 0;
  }
  .allocationInput {
    border: 0;
    width: 30px;
  }
  .allocationInput::-webkit-inner-spin-button,
  .allocationInput::-webkit-outer-spin-button {
    -webkit-appearance: none !important;
    margin: 0 !important;
  }
  .allocationInput[type="number"] {
    -moz-appearance: textfield; /* Firefox */
  }
  .allocationInput:focus {
    outline: none;
  }
  .available {
    border-left: 1px solid var(--brand-grey-lighter);
  }
</style>
