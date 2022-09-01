<script>
  export let totalAvailable = 100;
  export let step = 10;
  export let dataId = undefined;
  export let onChange = undefined;
  export let currentValue = 0;

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
  <span class="action" on:click={() => decreaseValueByStep()}>-</span>
  <span class="value">{currentValue}</span>
  <span class="action" on:click={() => increaseValueByStep()}>+</span>
  <span class="available">{totalAvailable}</span>
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
    padding: calc(var(--spacer) / 12) calc(var(--spacer) / 6);
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
