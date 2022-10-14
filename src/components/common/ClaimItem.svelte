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
  export let metrics;
</script>

<div class={`container`}>
  <Card title={`${distributedAmount} OCEAN - ${title} REWARDS`}>
    <p class="description">{@html description}</p>
    <div class="metrics">
      <ItemWithLabel {title} value={amount} />
      {#each metrics as metric}
        <ItemWithLabel title={metric.name} value={metric.value} />
      {/each}
    </div>
    <Button
      fullWidth
      text={loading ? "Loading..." : "Claim"}
      onclick={() => onClick()}
      disabled={loading || disabled}
    />
  </Card>
</div>

<style>
  .container {
    width: 100%;
  }
  .metrics {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: calc(var(--spacer) / 3);
  }
  .description {
    text-align: start;
    margin-bottom: calc(var(--spacer) / 3);
    font-size: var(--font-size-small);
  }
  @media (min-width: 640px) {
    .container {
      width: 48%;
    }
  }
</style>
