<script>
  import { rewards } from "../../stores/airdrops";
  import ItemWithLabel from "./ItemWithLabel.svelte";
  let estimatedVE = 0.0;
  let estimatedDF = 0;

  function getEstimatedRewards() {
    estimatedDF = $rewards.map((reward) => reward.balance);
  }

  $: if ($rewards) {
    getEstimatedRewards();
  }
</script>

<div class="container">
  <ItemWithLabel value={estimatedDF + estimatedVE} title="Total Estimated" />
  <ItemWithLabel value={estimatedVE} title="Estimated Fee" />
  <ItemWithLabel value={estimatedDF} title="Estimated DF" />
</div>

<style>
  .container {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-evenly;
  }
</style>
