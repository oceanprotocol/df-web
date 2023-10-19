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
  export let substreams;
  export let claimMessage;
  export let buttonText = "Claim Rewards";
</script>

<div class={`container`}>
  <Card
    title={`${title} Rewards - ${distributedAmount.toLocaleString()} OCEAN`}
    id={`${title}Rewards`.toLocaleLowerCase()}
    tag={apy?.value}
    tooltipMessage={apy?.tooltip}
    priority="secondary"
  >
  {#if substreams}
    {#each substreams as substream}
      <Substream 
        title={substream.name}
        availableRewards={substream.rewards}
        rewards={substream.availableRewards}
        description={substream.description}
        action={substream.action}
        metric={substream.metric}
        apy={substream?.apy}
      />
    {/each}
  {/if}
    <div class="rewardsContainer">
      <div class="claimRewards">
        <div class="rewardsAmt">
          <ItemWithLabel
            title="total rewards"
            value={amount || "..."}
            tooltipMessage={rewardTooltip || undefined}
            direction="row"
          />
          {#if claimMessage} 
            <span>{claimMessage}</span>
          {/if}
        </div>
        <div class="buttonMargin">
          <Button
            text={loading ? "Loading..." : buttonText}
            onclick={onClick}
            disabled={loading || disabled}
          />
        </div>
      </div>
    </div>
  </Card>
</div>

<style>
  .container {
    width: 100%;
    margin: calc(var(--spacer)/2) 0;
  }
  .rewardsContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .claimRewards {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .buttonMargin {
    margin-top: calc(var(--spacer) / 4);
  }
  .rewardsAmt{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }
  .rewardsAmt span{
    font-size: var(--font-size-mini);
    color: var(--brand-alert-yellow);
    margin-top: calc(var(--spacer)/16);
  }
</style>
