<script>
  import Tooltip from "carbon-components-svelte/src/Tooltip/Tooltip.svelte";
  import ChevronDown from "carbon-icons-svelte/lib/ChevronDown.svelte";

  export let options = undefined;
  export let title = undefined;
  export let onCheck = undefined;

  let showOptions = true;
</script>

{#if options}
  <div class={`container`}>
    <span class="title">{title}</span>
    {#if showOptions}
      <Tooltip icon={ChevronDown} align="end">
        <div class="optionsContainer">
          {#each Object.entries(options) as [value, checked]}
            <div class="option">
              <input
                type="checkbox"
                {value}
                {checked}
                on:change={(event) => onCheck(value, event.target.checked)}
              />
              <span class="value">{value}</span>
            </div>
          {/each}
        </div>
      </Tooltip>
    {/if}
  </div>
{/if}

<style>
  .container {
    display: flex;
    width: auto;
    align-items: center;
    justify-content: flex-start;
    margin: calc(var(--spacer) / 6);
    padding: 0 calc(var(--spacer) / 8);
  }
  .optionsContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    background-color: var(--brand-white);
    width: 140px;
  }
  .option {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: calc(var(--spacer) / 2);
  }
  .title {
    color: var(--brand-black);
    font-size: var(--font-size-small);
    font-weight: bold;
  }
  input {
    margin-right: calc(var(--spacer) / 6);
  }
  .value {
    font-size: var(--font-size-small);
    color: var(--brand-black);
    width: 100%;
    overflow-y: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .option:last-child {
    margin: 0;
  }
  .option:only-child {
    margin: 0;
  }
</style>
