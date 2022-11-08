<script>
  import { Tooltip } from "carbon-components-svelte";

  export let text = undefined;
  export let direction = "top";
  export let align = "center";
  export let open = false;
  export let warning = undefined;
</script>

<div
  on:mouseleave={() => (open = false)}
  on:mouseenter={() => (open = true)}
  class={`tooltipContiner ${warning ? "warning" : ""}`}
>
  <Tooltip {align} {direction} size={10} {open}>
    {#if text}
      <div class="textContainer">
        <p class="text">
          {@html text}
        </p>
      </div>
    {/if}
  </Tooltip>
</div>

<style>
  .textContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    background-color: var(--brand-white);
    width: 160px;
  }
  .text {
    color: black;
    font-size: var(--font-size-mini);
    white-space: pre-wrap;
  }
  :global(.warning svg) {
    fill: var(--brand-alert-yellow) !important;
  }
</style>
