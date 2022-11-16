<script>
  import { Tooltip } from "carbon-components-svelte";
  import { InformationFilled } from "carbon-icons-svelte";
  
  export let text = undefined;
  export let direction = "top";
  export let align = "center";
  export let open = false;
  
  // Use: "alert", "warning", or undefined
  export let state = undefined; 
</script>

<div
  on:mouseleave={() => (open = false)}
  on:mouseenter={() => (open = true)}
  class={`tooltipContainer ${state === "alert" ? "alert" : state === "warning" ? "warning" : ''}`}
>
  {#if state === undefined}
    <Tooltip {align} {direction} size={10} {open}>
      {#if text}
        <div class="textContainer">
          <p class="text">
            {@html text}
          </p>
        </div>
      {/if}
    </Tooltip>
  {:else}
    <Tooltip {align} {direction} size={10} {open} icon={InformationFilled}>
      {#if text}
        <div class="textContainer">
          <p class="text">
            {@html text}
          </p>
        </div>
      {/if}
    </Tooltip>
  {/if}
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
  :global(.alert svg) {
    fill: var(--brand-alert-red) !important;
  }
  :global(.warning svg) {
    fill: var(--brand-alert-yellow) !important;
  }
</style>
