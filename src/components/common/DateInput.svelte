<script>
  export let value;
  export let placeholder = undefined;
  export let min;
  export let max;
  export let onChange;
</script>

<div class={`container`}>
  <input
    class="input"
    type="date"
    {min}
    {max}
    bind:value
    {placeholder}
    on:input={onChange}
  />
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .input {
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 14) calc(var(--spacer) / 6);
    border-radius: 3px;
    width: 100%;
  }
</style>
