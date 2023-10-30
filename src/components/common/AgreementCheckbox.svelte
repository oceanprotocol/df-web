<script>
  import SvelteMarkdown from "svelte-markdown";
import Input from "../common/Input.svelte";
  export let text;
  export let value;
</script>

<div class="container">
  <Input type="checkbox" bind:value className="lockAgreementCheckbox" />
  <span class="text">{@html text}</span>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: calc(var(--spacer) / 5);
  }
  .text {
    font-size: var(--font-size-mini);
    color: var(--brand-alert-black);
    text-align: left;
    margin-left: calc(var(--spacer) / 10);
  }
  :global(.lockAgreementCheckbox) {
    width: fit-content !important;
  }
</style>
