<script>
  export let title = undefined;
  export let message = undefined;
  export let type = "warning";
</script>

<div class={`container ${type === "warning" ? "warning" : type == "danger" ? "danger" : "default"}`}>
  {#if title}
    <p class="title">
      {@html title}
    </p>
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
    padding: calc(var(--spacer) / 6) 0;
    width: 100%;
    color: var(--brand-black);
    font-size: var(--font-size-small);
    z-index: 101;
  }
  .warning {
    background-color: var(--brand-alert-yellow);
  }
  .danger {
    background-color: var(--brand-alert-red);
  }
  .danger p{
    color: white !important;
  }
  .default {
    border-bottom: 1px solid var(--border-color);
    background-color: var(--background-content);
  }
  .title {
    font-weight: bold;
    font-size: var(--font-size-base) !important;
    text-align: center;
    max-width: 1280px;
    padding: 0 calc(var(--spacer)/2);
    margin: auto
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
