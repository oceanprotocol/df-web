<script>
  export let title = undefined;
  export let message = undefined;
  export let type = "warning";
</script>

<div class={`container ${type === "warning" ? "warning" : "default"}`}>
  {#if title}
    <span>
      {@html title}
    </span>
  {/if}
  {#if message}
    <p>
      {@html message}
    </p>
  {/if}
</div>

<style>
  .container {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: calc(var(--spacer) / 6) 0;
    width: 100%;
    color: var(--brand-black);
    font-size: var(--font-size-small);
    z-index: 101;
  }
  .warning {
    background-color: var(--brand-alert-yellow);
  }
  .default {
    border-bottom: 1px solid var(--border-color);
    background-color: var(--background-content);
  }
  span {
    font-weight: bold;
    margin-right: calc(var(--spacer) / 12);
  }
  p {
    margin-bottom: 0;
    font-weight: 500;
    font-size: var(--font-size-small);
    text-align: center;
  }
  @media (min-width: 640px) {
    .container {
      flex-direction: row;
      margin: 0;
    }
  }
</style>
