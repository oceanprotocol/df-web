<script>
  import { rewards } from "../../stores/airdrops";
  import TokenReward from "../common/TokenReward.svelte";
  let claimableRewards;

  function getClaimableRewards() {
    claimableRewards = {};
    $rewards.forEach((reward) => {
      if (!claimableRewards[reward.token]) {
        claimableRewards[reward.token] = 0;
      }
      claimableRewards[reward.token] += reward.amt;
    });
  }

  $: if ($rewards && !claimableRewards) {
    getClaimableRewards();
  }
</script>

<p>
  You have a total of <span>
    {#if claimableRewards && Object.entries(claimableRewards)?.length > 0}
      {#each Object.entries(claimableRewards) as [symbol, amount]}
        <TokenReward {amount} {symbol} />
      {/each}
    {:else}
      0
    {/if}
  </span> estimated rewards accross all the datasets from all networks
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
