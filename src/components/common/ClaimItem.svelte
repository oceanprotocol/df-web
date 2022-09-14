<script>
  import Button from "./Button.svelte";
  import ItemWithLabel from "./ItemWithLabel.svelte";

  export let title;
  export let amount;
  export let loading = false;
  export let onClick;

  const onClaimClicked = async () => {
    loading = true;
    await onClick();
    loading = false;
  };
</script>

<div class="container">
  <ItemWithLabel {title} value={amount} />
  <div class="actionContainer">
    <Button
      text={loading ? "Loading..." : "Claim"}
      onClick={() => onClaimClicked()}
      textOnly
      disabled={loading}
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
    border: 1px solid var(--brand-grey-lighter);
    padding: 20px;
    margin: 0 calc(var(--spacer) / 4);
  }
  .actionContainer {
    margin-left: calc(var(--spacer) / 4);
  }

  @media (min-width: 640px) {
    .container {
      margin: 0 calc(var(--spacer) / 2);
    }
  }
</style>
