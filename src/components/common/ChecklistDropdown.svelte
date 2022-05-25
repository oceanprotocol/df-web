<script>
  import { Tooltip } from "carbon-components-svelte";
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
            <input
              type="checkbox"
              {value}
              {checked}
              on:change={(event) => onCheck(value, event.target.checked)}
            />
            <span>{value}</span>
          {/each}
        </div>
      </Tooltip>
    {/if}
  </div>
{/if}

<style>
  .container {
  }
  .optionsContainer {
    position: fixed;
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 8) calc(var(--spacer) / 6);
    background-color: var(--brand-white);
    box-shadow: 0 12px 30px 0 rgba(0, 0, 0, 0.1);
    transform: translate3d(0, -0.05rem, 0);
    border-radius: var(--border-radius);
    width: 180px;
  }
  .title {
    color: var(--brand-black);
    font-size: var(--font-size-small);
  }
</style>
