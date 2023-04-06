<script>
  import Button from "./Button.svelte";
  import Card from "./Card.svelte";
  import ItemWithLabel from "./ItemWithLabel.svelte";
  import { navigate } from "svelte-navigator";

  export let title;
  export let amount;
  export let distributedAmount;
  export let loading = false;
  export let disabled = false;
  export let description;
  export let redirectLink;
  export let showRedirectLink;
  export let onClick;
  export let metrics;
  export let rewardTooltip = undefined;
  export let disableRedirect = false;
  export let apy = undefined;
  export let apyTooltip = undefined;
</script>

<div class={`container`}>
  <Card title={`${title} Rewards`} subtitle={`${distributedAmount} OCEAN`} tag={apy} tooltipMessage={apyTooltip}>
    <div class="description">{@html description}</div>
    <div class="metrics">
      {#each metrics as metric}
        <ItemWithLabel title={metric.name} value={metric.value} />
      {/each}
      <ItemWithLabel
        title="rewards"
        value={!showRedirectLink ? amount : "..."}
        tooltipMessage={rewardTooltip ? rewardTooltip : undefined}
      />
    </div>
    {#if showRedirectLink}
      <Button
        fullWidth
        text={redirectLink.text}
        onclick={() => navigate(redirectLink.url)}
        disabled={disableRedirect}
      />
    {:else}
      <Button
        fullWidth
        text={loading ? "Loading..." : `Claim ${disabled ? "" : amount}`}
        onclick={() => onClick()}
        disabled={loading || disabled}
      />
    {/if}
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
      width: 45%;
    }
  }
  @media (min-width: 820px) {
    .container {
      width: 48%;
    }
  }
</style>
