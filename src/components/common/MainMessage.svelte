<script>
  import SvelteMarkdown from "svelte-markdown";

  export let title = undefined;
  export let message = undefined;
  export let warning = undefined;
</script>

<div class="container">
  <h3>
    <SvelteMarkdown source={title} />
  </h3>
  <p class={warning ? "warning" : ""}>
    <SvelteMarkdown source={message} />
  </p>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: calc(var(--spacer) / 4);
    color: var(--brand-black);
  }
  h3 {
    font-weight: bold;
  }
  p {
    margin: 0;
    font-size: var(--font-size-small);
  }
  .warning {
    color: var(--brand-alert-yellow);
  }
</style>
