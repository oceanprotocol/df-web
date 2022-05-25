<script>
  export let options = undefined;
  export let title = undefined;
  export let onCheck = undefined;
</script>

<div class={`container`}>
  <span>{title}</span>
  {#if options}
    {#each Object.entries(options) as [value, checked]}
      <input
        type="checkbox"
        {value}
        {checked}
        on:change={(event) => onCheck(value, event.target.checked)}
      />
      <span>{value}</span>
    {/each}
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    margin-bottom: calc(var(--spacer) / 4);
  }
  input {
    margin-right: calc(var(--spacer) / 8);
  }
  .networkName {
    font-size: var(--font-size-small);
  }
  .large {
    font-size: var(--font-size-large);
  }
  .normal {
    font-size: var(--font-size-normal);
  }
  .networkDetails {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .margin0 {
    margin: 0;
  }
  .container:only-child {
    margin: 0;
  }
</style>
