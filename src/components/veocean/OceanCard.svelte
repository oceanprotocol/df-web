<script>
  import { userAddress } from "../../stores/web3";
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";

  let balance = 0;
  let unlockDate = 0;
  let loading = true;

  $: if ($userAddress) {
    loading = false;
  }
</script>

<div class={`container`}>
  <Card title="My OCEAN">
    <div class="veOcean-info">
      <ItemWithLabel
        title={`Ocean Balance`}
        value={loading || `${parseFloat(balance).toFixed(3)} OCEAN`}
      />
      <ItemWithLabel
        title={`Locked`}
        value={loading || `${parseFloat(balance).toFixed(3)} OCEAN`}
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
    grid-column: 1 / 2;
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
