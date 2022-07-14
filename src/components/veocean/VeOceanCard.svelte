<script>
  import { userAddress } from "../../stores/web3";
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";

  let balance = 0;
  let unlockDate = new Date();
  let votingPowerMultiplier = 0;
  let loading = true;

  $: if ($userAddress) {
    loading = false;
  }
</script>

<div class={`container`}>
  <Card title="My veOCEAN">
    <div class="veOcean-info">
      <ItemWithLabel
        title={`veOcean Balance`}
        value={loading || `${parseFloat(balance).toFixed(3)} veOCEAN`}
      />
      <ItemWithLabel
        title={`Locked until`}
        value={loading || `${new Date(unlockDate).toLocaleDateString()}`}
      />
      <ItemWithLabel
        title={`Voting power multiplier`}
        value={loading || `${parseFloat(votingPowerMultiplier).toFixed(3)} X`}
      />
    </div>
  </Card>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    grid-column: 1 / 3;
    width: 100%;
  }

  .veOcean-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  @media (min-width: 640px) {
  }
</style>
