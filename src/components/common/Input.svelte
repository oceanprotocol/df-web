<script>
  import DateInput from "./DateInput.svelte";

  export let label = undefined;
  export let value = undefined;
  export let placeholder = undefined;
  export let type = "text";
  export let min = undefined;
  export let max = undefined;
  export let onChange = undefined;
  export let error = false;
  export let direction = "row";
</script>

<div class={`container ${direction === "row" ? "row" : "column"}`}>
  {#if label}
    <label class={`${direction === "column" && "margin-bottom"}`}>{label}</label
    >
  {/if}
  <div class={`inputContainer ${type === "checkbox" && "checkbox"}`}>
    {#if type === "number"}
      <input
        class="input"
        class:invalid={error}
        type="number"
        {min}
        {max}
        bind:value
        {placeholder}
        on:input={onChange}
      />
    {:else if type === "checkbox"}
      <input
        class:invalid={error}
        class="input checkbox"
        type="checkbox"
        bind:checked={value}
        {placeholder}
      />
    {:else if type === "date"}
      <DateInput {min} {max} bind:value {placeholder} on:input={onChange} />
    {:else}
      <input
        class="input"
        type="text"
        class:invalid={error}
        {min}
        {max}
        bind:value
        {placeholder}
        on:input={onChange}
      />
    {/if}
    {#if error}
      <p class="message">{error}</p>
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
    width: 100%;
  }
  .inputContainer {
    display: flex;
    flex-direction: column;
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
  .row {
    flex-direction: row;
  }
  .column {
    flex-direction: column;
  }
  .margin-bottom {
    margin-bottom: calc(var(--spacer) / 6);
  }
  .checkbox {
    width: auto;
  }
  .invalid {
    border-color: red !important;
  }
</style>
