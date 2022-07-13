<script>
  export let title = undefined;
</script>

<div class="container">
  {#if title}
    <p class="title">{title}</p>
  {/if}
  <slot />
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 3) calc(var(--spacer) / 2);
    background-color: var(--background-content);
  }
  .title {
    font-size: var(--font-size-normal);
    font-weight: bold;
    margin-bottom: calc(var(--spacer) / 3);
  }
</style>
