<script>
  import Button from "./Button.svelte";

  export let value = undefined;
  export let name = undefined;
  export let placeholder = undefined;
  export let min = undefined;
  export let max = undefined;
  export let disabled = false;
  export let onChange = undefined;
  export let maxValueLabel = "";
  export let showMaxValue = false;
  export let showMaxButton = false;
  export let noArrows = undefined;

  const handleOnMaxClick = () => (value = max);
</script>

<div class="actionsContainer">
  {#if showMaxValue === true}
    <p class="maxItem maxValueLabel">
      {maxValueLabel && maxValueLabel !== "" && maxValueLabel}{max}
    </p>
  {/if}
</div>
<div class={`container`}>
  <input
    class={`input ${noArrows ? "disableArrows" : ""}`}
    type="number"
    {name}
    {disabled}
    {min}
    {max}
    bind:value
    {placeholder}
    on:change={onChange}
  />
</div>
<div class="actionsContainer">
  {#if showMaxButton === true}
    <Button
      onclick={handleOnMaxClick}
      className="maxItem"
      text={"max"}
      textOnly
    />
  {/if}
</div>

<style>
  .container {
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

  .actionsContainer {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
  }
  .actionsContainer :global(.maxItem) {
    margin-top: calc(var(--spacer) / 10);
    font-size: var(--font-size-mini);
    color: var(--brand-grey-light);
  }
  .actionsContainer :global(.maxValueLabel) {
    color: var(--brand-black);
  }
  .disableArrows::-webkit-inner-spin-button,
  .disableArrows::-webkit-outer-spin-button {
    -webkit-appearance: none !important;
    margin: 0 !important;
  }
  .allocationInput[type="number"] {
    -moz-appearance: textfield; /* Firefox */
  }
</style>
