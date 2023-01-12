<script>
  import NumberInput from "./NumberInput.svelte";
  import DateInput from "./DateInput.svelte";

  export let label = undefined;
  export let name = undefined;
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
  export let showMaxValue = false;
  export let maxValueLabel = "";
  export let showMaxButton = false;
  export let disableKeyboardInput = undefined;
  export let className = undefined;
  export let noArrows = undefined;
</script>

<div
  class={`container ${direction === "row" ? "row" : "column"} ${
    className ? className : ""
  }`}
>
  {#if label}
    <label class={`${direction === "column" && "margin-bottom"}`}>
      {label}
    </label>
  {/if}
  <div class={`inputContainer ${type === "checkbox" && "checkbox"}`}>
    {#if type === "number"}
      <NumberInput
        bind:value
        {name}
        {placeholder}
        {min}
        {max}
        {disabled}
        {onChange}
        {showMaxValue}
        {maxValueLabel}
        {showMaxButton}
        {noArrows}
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
        {disableKeyboardInput}
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
  .input:disabled {
    background-color: var(--brand-grey-dimmed) !important;
    color: var(--brand-grey-dimmed) !important;
  }
  .input {
    background-color: var(--background-content);
    color: var(--brand-grey-light);
    font-weight: bold;
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
    background-color: var(--background-content);
    color: var(--brand-grey-light);
  }
  .invalid {
    border-color: red !important;
  }
</style>
