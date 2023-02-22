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
  class={`${state === "alert" ? "alert" : state === "warning" ? "warning" : ''}`}
>
  {#if state === undefined}
    <Tooltip {align} {direction} size={3} {open}>
      {#if text}
        <div class="tooltipTextContainer">
          <p class="text">
            {@html text}
          </p>
        </div>
      {/if}
    </Tooltip>
  {:else}
    <Tooltip {align} {direction} size={3} {open} icon={InformationFilled}>
      {#if text}
        <div class="tooltipTextContainer">
          <p class="text">
            {@html text}
          </p>
        </div>
      {/if}
    </Tooltip>
  {/if}
</div>

<style lang="scss" global>
  $css--font-face: false;
  $css--helpers: false;
  $css--body: false;
  $css--use-layer: false;
  $css--reset: false;
  $css--default-type: false;
  $css--plex: false;
  @import "carbon-components/scss/components/tooltip/_tooltip.scss";
  .tooltipTextContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    background-color: var(--brand-white);
    width: 160px;
  }
  .tooltipTextContainer > p {
    color: black !important;
    font-size: var(--font-size-small) !important;
    white-space: pre-wrap;
  }
  .alert svg {
    fill: var(--brand-alert-red) !important;
  }
  .warning svg {
    fill: var(--brand-alert-yellow) !important;
  }
</style>