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
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: calc(var(--spacer) / 2) calc(var(--spacer));
    background-color: var(--background-content);
    box-shadow: var(--box-shadow);
  }
  .title {
    font-size: var(--font-size-normal);
    font-weight: bold;
    margin-bottom: calc(var(--spacer) / 2);
  }
</style>
