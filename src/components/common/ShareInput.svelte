<script>
  export let available = 100;
  export let step = 10;
  export let disabled = false;
  export let dataId = undefined;
  export let onChange = undefined;
  export let currentValue = 0;
  export let showAvailable = true;

  const increaseValueByStep = () => {
    currentValue += step;
    onChange(dataId, currentValue, -step);
  };

  const decreaseValueByStep = () => {
    currentValue -= step;
    onChange(dataId, currentValue, +step);
  };
</script>

<div class="container">
  <button
    class="action"
    on:click={() => decreaseValueByStep()}
    disabled={currentValue === 0 || disabled}>-</button
  >
  <span class="value">{`${currentValue} %`}</span>
  <button
    class="action"
    on:click={() => increaseValueByStep()}
    disabled={available === 0 || disabled}>+</button
  >
  {#if showAvailable === true}
    <span class="available">{available}</span>
  {/if}
</div>

<style>
  .container {
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
  .action:disabled {
    cursor: default;
  }
  .value {
    width: 10px;
  }
  .available {
    border-left: 1px solid var(--brand-grey-lighter);
  }
</style>
