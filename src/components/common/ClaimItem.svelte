<script>
  import Button from "./Button.svelte";
  import Card from "./Card.svelte";
  import ItemWithLabel from "./ItemWithLabel.svelte";

  export let title;
  export let amount;
  export let distributedAmount;
  export let loading = false;
  export let disabled = false;
  export let description;
  export let onClick;
</script>

<Card title={`${distributedAmount} OCEAN - ${title} REWARDS`}>
  <p class="description">{description}</p>
  <div class="metrics">
    <ItemWithLabel {title} value={amount} />
    <ItemWithLabel {title} value={amount} />
  </div>
  <Button
    fullWidth
    text={loading ? "Loading..." : "Claim"}
    onclick={() => onClick()}
    disabled={loading || disabled}
  />
</Card>

<style>
  .metrics {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .description {
    text-align: start;
  }
  @media (min-width: 640px) {
  }
</style>
