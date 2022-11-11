<script>
  import { Tooltip } from "carbon-components-svelte";
  import SvelteMarkdown from "svelte-markdown";

  export let text = undefined;
  export let direction = "top";
  export let align = "center";
  export let open = false;
</script>

<div on:mouseleave={() => (open = false)} on:mouseenter={() => (open = true)}>
  <Tooltip {align} {direction} size={10} {open}>
    <div class="tooltipTextContainer">
      <SvelteMarkdown source={text} />
    </div>
  </Tooltip>
</div>

<style>
  .tooltipTextContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    background-color: var(--brand-white);
    width: 160px;
  }
  :global(.tooltipTextContainer > p) {
    color: black;
    font-size: var(--font-size-mini) !important;
    white-space: pre-wrap;
  }
</style>
