<script>
  export let totalAvailable = 100;
  export let step = 10;
  export let dataId = undefined;
  export let onChange = undefined;
  export let currentValue = 0;
  export let showTotalAvailable = true;

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
    disabled={totalAvailable === 0}>-</button
  >
  <span class="value">{`${currentValue} %`}</span>
  <button
    class="action"
    on:click={() => increaseValueByStep()}
    disabled={totalAvailable === 0}>+</button
  >
  {#if showTotalAvailable === true}
    <span class="available">{totalAvailable}</span>
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
  .value {
    width: 10px;
  }
  .available {
    border-left: 1px solid var(--brand-grey-lighter);
  }
</style>
