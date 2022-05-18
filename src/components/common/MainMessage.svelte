<script>
  import SvelteMarkdown from "svelte-markdown";

  export let title = undefined;
  export let message = undefined;
</script>

<div class="container">
  <span>
    <SvelteMarkdown source={title} />
  </span>
  <p>
    <SvelteMarkdown source={message} />
  </p>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: calc(var(--spacer) / 4);
    color: var(--brand-grey-light);
  }
  span {
    font-weight: bold;
  }
  p {
    margin: 0;
    font-size: var(--font-size-small);
  }
</style>
