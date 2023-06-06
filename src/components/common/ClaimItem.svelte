<script>
  import { each } from "svelte/internal";
  import Button from "./Button.svelte";
  import Card from "./Card.svelte";
  import ItemWithLabel from "./ItemWithLabel.svelte";
  import { navigate } from "svelte-navigator";
  import Substream from "../claim/Substream.svelte";

  export let title;
  export let amount;
  export let distributedAmount;
  export let loading = false;
  export let disabled = false;
  export let showRedirectLink;
  export let onClick;
  export let metrics;
  export let rewardTooltip = undefined;
  export let disableRedirect = false;
  export let apy = undefined;
  export let apyTooltip = undefined;
  export let substreams = undefined;
</script>

<div class={`container`}>
  <Card
    title={`${title} Rewards`}
    subtitle={`${distributedAmount} OCEAN`}
    tag={apy}
    tooltipMessage={apyTooltip}
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
        value={!showRedirectLink ? amount : "..."}
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
  }
  .claimRewards {
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
</style>
