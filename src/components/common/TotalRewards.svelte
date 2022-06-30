<script>
  import { rewards } from "../../stores/airdrops";
  import TokenReward from "../common/TokenReward.svelte";
  let totalRewards;

  function getTotalRewards() {
    totalRewards = {};
    $rewards.forEach((reward) => {
      if (!totalRewards[reward.token]) {
        totalRewards[reward.token] = 0;
      }
      totalRewards[reward.token] += reward.amt;
    });
  }

  $: if ($rewards && !totalRewards) {
    getTotalRewards();
  }
</script>

<p>
  You have a total of <span>
    {#if totalRewards && Object.entries(totalRewards)?.length > 0}
      {#each Object.entries(totalRewards) as [symbol, amount]}
        <TokenReward {amount} {symbol} />
      {/each}
    {:else}
      0
    {/if}
  </span> estimated rewards accross all the pools from all networks
</p>

<style>
  p,
  span {
    font-size: var(--font-size-large);
    color: var(--brand-grey-light);
  }

  span {
    color: var(--text-color-primary);
    font-weight: bold;
  }
</style>
