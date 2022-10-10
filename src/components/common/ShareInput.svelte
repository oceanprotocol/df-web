<script>
  import Input from "./Input.svelte";

  export let available = 100;
  export let step = 10;
  export let disabled = false;
  export let dataId = undefined;
  export let onChange = undefined;
  export let currentValue = 0;
  export let showAvailable = true;
  export let onBlur = undefined;
  export let onFocus = undefined;

  let n = currentValue;

  const increaseValueByStep = () => {
    currentValue += step;
    //onChange(dataId, currentValue, -step);
  };

  const decreaseValueByStep = () => {
    currentValue -= step;
    //onChange(dataId, currentValue, +step);
  };

  function validator(node, value) {
    return {
      update(value) {
        if (available === 0) return;
        if (value === null) {
          n = 0;
          currentValue = null;
          onChange(dataId, currentValue, value);
          return;
        }
        currentValue =
          currentValue < node.min || currentValue > node.max
            ? n
            : parseInt(value);
        if (currentValue == parseInt(value)) {
          console.log(n, currentValue);
          onChange(dataId, currentValue, -value);
        }
        n = currentValue;
      },
    };
  }
</script>

<div class="container">
  <button
    class="action"
    on:click={() => decreaseValueByStep()}
    disabled={currentValue === 0 || disabled}>-</button
  >
  <div class="allocationInputContainer">
    <input
      type="number"
      bind:value={currentValue}
      use:validator={currentValue}
      on:blur={(e) => onBlur(dataId, e.target.value)}
      on:focus={(e) => onFocus(e.target.value)}
      max="100"
      min="0"
      class="allocationInput"
    />%
  </div>
  <button
    class="action"
    on:click={() => increaseValueByStep()}
    disabled={disabled || available === 0}>+</button
  >
  {#if showAvailable === true}
    <span class="available">{available}</span>
  {/if}
</div>

<style>
  .container {
    display: flex;
    padding: calc(var(--spacer) / 12) 0;
    width: fit-content;
    border: 1px solid var(--brand-grey-lighter);
    border-radius: 5px;
  }
  .action,
  .available {
    padding: 0 calc(var(--spacer) / 6);
    background-color: transparent;
    border: none;
    margin: 0;
  }
  .action:hover {
    cursor: pointer;
  }
  .allocationInput {
    border: 0;
  }
  .allocationInput:focus {
    outline: none;
  }
  .allocationInputContainer {
    width: 80px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--brand-grey-lighter);
  }
  .action:disabled {
    cursor: default;
  }
  .available {
    border-left: 1px solid var(--brand-grey-lighter);
  }
</style>
