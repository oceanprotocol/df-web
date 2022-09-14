<script>
  import Button from "./Button.svelte";
  import ItemWithLabel from "./ItemWithLabel.svelte";

  export let title;
  export let amount;
  export let loading = false;
  export let disabled = false;
  export let onClick;
</script>

<div class="container">
  <ItemWithLabel {title} value={amount} />
  <div class="actionContainer">
    <Button
      text={loading ? "Loading..." : "Claim"}
      onclick={() => onClick()}
      textOnly
      disabled={loading || disabled}
    />
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: calc(var(--spacer) / 4) calc(var(--spacer) / 1.5) !important;
    margin-bottom: calc(var(--spacer) / 4);
    background-color: var(--background-content);
    box-shadow: var(--box-shadow);
    padding: 20px;
    margin: calc(var(--spacer) / 12) calc(var(--spacer) / 4) var(--spacer)
      calc(var(--spacer) / 4);
  }
  .actionContainer {
    margin-left: calc(var(--spacer) / 4);
  }

  @media (min-width: 640px) {
    .container {
      margin: calc(var(--spacer) / 12) calc(var(--spacer) / 2)
        calc(var(--spacer) / 2) calc(var(--spacer) / 2);
    }
  }
</style>
