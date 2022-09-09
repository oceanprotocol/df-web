<script>
  import { rewards } from "../../stores/airdrops";
  import TokenReward from "../common/TokenReward.svelte";
  import ItemWithLabel from "./ItemWithLabel.svelte";
  let estimatedRewards;
  let estimatedDF = 0;

  function getEstimatedRewards() {
    estimatedRewards = {};
    $rewards.forEach((reward) => {
      if (!estimatedRewards[reward.token]) {
        estimatedRewards[reward.token] = 0;
      }
      estimatedDF += reward.amt;
      estimatedRewards[reward.token] += reward.amt;
    });
  }

  $: if ($rewards && !estimatedRewards) {
    getEstimatedRewards();
  }
</script>

<div class="container">
  <ItemWithLabel value={estimatedDF} title="Total Estimated" />
  <ItemWithLabel value={estimatedDF} title="Estimated Fee" />
  <ItemWithLabel value={estimatedDF} title="Estimated DF" />
</div>

<style>
  .container {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }
</style>
