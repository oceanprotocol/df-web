<script>
  export let label = undefined;
  export let value;
  export let placeholder = undefined;
  export let type = "text";
  export let min;
  export let max;
  export let onChange;
</script>

<div class="container">
  {#if label}
    <label>{label}</label>
  {/if}
  <div class="inputContainer">
    {#if type === "number"}
      <input
        class="input"
        type="number"
        {min}
        {max}
        bind:value
        {placeholder}
        on:input={onChange}
      />
    {:else if type === "checkbox"}
      <input class="input" type="checkbox" bind:checked={value} {placeholder} />
    {:else}
      <input
        class="input"
        type="text"
        {min}
        {max}
        bind:value
        {placeholder}
        on:input={onChange}
      />
    {/if}
    {#if value > max}
      <p class="message">{`The maximum allowed amount is ${max}`}</p>
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .inputContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .input {
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 14) calc(var(--spacer) / 6);
    border-radius: 3px;
  }
  label {
    font-weight: bold;
    margin-right: calc(var(--spacer) / 8);
    font-size: var(--font-size-small);
  }
  .message {
    font-size: var(--font-size-small);
    margin-top: calc(var(--spacer) / 6);
    color: var(--brand-alert-red);
  }
</style>
