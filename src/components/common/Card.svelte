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
    align-items: center;
    justify-content: center;
  }
  .inputContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .input {
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 14) calc(var(--spacer) / 6);
    border-radius: 3px;
  }
  label {
    font-weight: bold;
    margin-right: calc(var(--spacer) / 8);
    font-size: var(--font-size-small);
  }
  .message {
    font-size: var(--font-size-small);
    margin-top: calc(var(--spacer) / 6);
    color: var(--brand-alert-red);
  }
</style>
