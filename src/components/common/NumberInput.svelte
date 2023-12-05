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
  {#if showMaxValue === true}
    <p class="maxItem maxValueLabel">
      {maxValueLabel && maxValueLabel !== "" && maxValueLabel}{max}
    </p>
  {/if}
  {#if showMaxButton === true}
    <Button
      onclick={handleOnMaxClick}
      className="maxItem maxItemButton"
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
    background-color: var(--background-content);
    color: var(--brand-black);
    font-weight: bold;
    border: 1.5px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 14) calc(var(--spacer) / 6);
    border-radius: 3px;
    width: 100%;
  }
  .input:disabled {
    background-color: var(--brand-grey-dimmed);
    color: var(--brand-grey-light);
  }
  .actionsContainer {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-top: calc(var(--spacer) / 10);
  }
  .actionsContainer :global(.maxItem) {
    font-size: var(--font-size-small);
    align-items: center;
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
  .maxValueLabel{
    margin: 0;
    margin-right: calc(var(--spacer) / 4);
  }
  .actionsContainer :global(.maxItemButton){
    margin: 0;
    height: fit-content;
  }
  .allocationInput[type="number"] {
    -moz-appearance: textfield; /* Firefox */
  }
</style>
