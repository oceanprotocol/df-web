<script>
  export let title = undefined;
  export let tag = undefined;
  export let className = undefined;

  // WIP - APY calculations & data are still wip. 
  const apyEnabled = false;
</script>

<div class={`container ${className ? className : ""}`}>
  <div class="cardHeader">
    {#if title}
      <p class="title">{title}</p>
    {/if}
    {#if tag && apyEnabled === true}
      <span class="tag">{tag}</span>
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
  .cardHeader {
    margin-bottom: calc(var(--spacer) / 2);
  }
  .title {
    font-size: var(--font-size-normal);
    font-weight: bold;
    margin-bottom: calc(var(--spacer) / 20);
  }
  .tag {
    color: var(--brand-color-primary);
    font-weight: bold;
  }
  @media (min-width: 660px) {
    .container {
      padding: calc(var(--spacer) / 2) var(--spacer);
    }
  }
</style>
