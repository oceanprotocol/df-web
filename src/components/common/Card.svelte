<script>
  import CustomTooltip from "./CustomTooltip.svelte";

  export let title = undefined;
  export let className = undefined;
  export let tag = undefined;

  // tooltip
  export let tooltipMessage = undefined;
  export let tooltipState = undefined;
  export let tooltipDirection = "bottom";
  export let tooltipAlign = "center";
</script>

<div class={`container ${className ? className : ""}`}>
  <div class="cardHeader">
    {#if title}
      <h3 class="title">{title}</h3>
    {/if}
    {#if tag}
      <div class="subtitle">
        <span class="tag">{tag}</span>
        {#if tooltipMessage}
          <CustomTooltip
            text={tooltipMessage}
            direction={tooltipDirection}
            align={tooltipAlign}
            state={tooltipState}
          />
        {/if}
      </div>
    {/if}
  </div>
  <slot />
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: calc(var(--spacer) / 2) calc(var(--spacer) / 2);
    background-color: var(--background-content);
    box-shadow: var(--box-shadow);
  }
  .subtitle {
    margin-top: calc(var(--spacer) / 6);
    height: fit-content !important;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .cardHeader {
    margin-bottom: calc(var(--spacer) / 2);
  }
  .title {
    margin-bottom: 0;
  }
  .tag {
    color: var(--color-primary);
    font-weight: bold;
  }
  @media (min-width: 660px) {
    .container {
      padding: calc(var(--spacer) / 2) calc(var(--spacer) * 1.5);
    }
  }
</style>
