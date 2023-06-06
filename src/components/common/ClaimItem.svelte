<script>
  import Button from "./Button.svelte";
  import Card from "./Card.svelte";
  import ItemWithLabel from "./ItemWithLabel.svelte";
  import Substream from "../claim/Substream.svelte";

  export let title;
  export let amount;
  export let distributedAmount;
  export let loading = false;
  export let disabled = false;
  export let onClick;
  export let rewardTooltip = undefined;
  export let apy = undefined;
  export let substreams = undefined;
</script>

<div class={`container`}>
  <Card
    title={`${title} Rewards - ${distributedAmount} OCEAN`}
    tag={apy?.value}
    tooltipMessage={apy?.tooltip}
    priority="secondary"
  >
  {#if substreams}
    {#each substreams as substream}
      <Substream 
        title={substream.name}
        availableRewards={substream.rewards}
        description={substream.description}
        action={substream.action}
        metric={substream.metric}
      />
    {/each}
  {/if}
    <div class="claimRewards">
      <ItemWithLabel
        title="rewards"
        value={amount ? amount : "..."}
        tooltipMessage={rewardTooltip ? rewardTooltip : undefined}
      />
      <Button
        text={loading ? "Loading..." : `Claim Rewards${disabled ? "" : amount}`}
        onclick={() => onClick()}
        disabled={loading || disabled}
      />
    </div>
  </Card>
</div>

<style>
  .container {
    width: 100%;
    margin: calc(var(--spacer)/2) 0;
  }
  .claimRewards {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: calc(var(--spacer) / 3) 0;
  }
</style>
