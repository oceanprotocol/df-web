<script>
  import Input from "../common/Input.svelte";
  export let text;
  export let value;
</script>

<div class="container">
  <Input type="checkbox" bind:value className="lockAgreementCheckbox" />
  <span class="text">{text}</span>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text {
    font-size: var(--font-size-mini);
    color: var(--brand-alert-yellow);
    text-align: left;
    margin-left: calc(var(--spacer) / 10);
  }
  :global(.lockAgreementCheckbox) {
    width: fit-content !important;
  }
</style>
