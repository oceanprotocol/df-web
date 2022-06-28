<script>
  import { rewards } from "../../stores/airdrops";
  let totalRewards = 0;

  function getTotalRewards() {
    $rewards.forEach((reward) => {
      totalRewards += reward.amt;
    });
  }

  $: if ($rewards) {
    getTotalRewards();
  }
</script>

<p>
  You have a total of <span>{totalRewards}</span> estimated rewards accross all the
  pools from all networks
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
