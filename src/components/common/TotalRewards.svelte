<script>
  import { rewards } from "../../stores/airdrops";
  let totalRewards = 0;

  function getTotalRewards() {
    console.log($rewards);
    $rewards.forEach((reward) => {
      totalRewards += reward.amt;
    });
  }

  $: if ($rewards) {
    getTotalRewards();
  }
</script>

<p>
  {`You have a total of ${totalRewards} estimated rewards accross all the pools from all networks`}
</p>

<style>
  p {
    font-size: var(--font-size-large);
  }
</style>
