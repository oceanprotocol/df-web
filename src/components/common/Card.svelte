<script>
  export let title = undefined;
</script>

<div class="container">
  {#if title}
    <p class="title">{title}</p>
  {/if}
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 3) calc(var(--spacer) / 6);
    background-color: var(--background-content);
  }
  .title {
    font-size: var(--font-size-normal);
    font-weight: bold;
  }
  .content {
    margin-top: calc(var(--spacer) / 3);
  }
</style>
