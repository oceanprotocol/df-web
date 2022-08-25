<script>
  import NumberInput from "./NumberInput.svelte";
  import DateInput from "./DateInput.svelte";

  export let label = undefined;
  export let value = undefined;
  export let placeholder = undefined;
  export let disabled = false;
  export let type = "text";
  export let min = undefined;
  export let max = undefined;
  export let onChange = undefined;
  export let error = false;
  export let step = 1;
  export let direction = "row";
  export let showMax = false;
</script>

<div class={`container ${direction === "row" ? "row" : "column"}`}>
  {#if label}
    <label class={`${direction === "column" && "margin-bottom"}`}>{label}</label
    >
  {/if}
  <div class={`inputContainer ${type === "checkbox" && "checkbox"}`}>
    {#if type === "number"}
      <NumberInput
        bind:value
        {placeholder}
        {min}
        {max}
        {disabled}
        on:input={onChange}
        {showMax}
      />
    {:else if type === "checkbox"}
      <input
        class:invalid={error}
        {disabled}
        class="input checkbox"
        type="checkbox"
        bind:checked={value}
        {placeholder}
      />
    {:else if type === "date"}
      <DateInput
        {min}
        {max}
        {step}
        bind:value
        {placeholder}
        on:input={onChange}
        {disabled}
      />
    {:else}
      <input
        class="input"
        {disabled}
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
