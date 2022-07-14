<script>
  import { userAddress } from "../../stores/web3";
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";

  let balance = 0;
  let lockedOceans = 0;
  let loading = true;

  $: if ($userAddress) {
    loading = false;
  }
</script>

<div class={`container`}>
  <Card title="My OCEAN">
    <div class="ocean-info">
      <ItemWithLabel
        title={`Ocean Balance`}
        value={loading || `${parseFloat(balance).toFixed(3)} OCEAN`}
      />
      <ItemWithLabel
        title={`Locked`}
        value={loading || `${parseFloat(lockedOceans).toFixed(3)} OCEAN`}
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

  .ocean-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  @media (min-width: 640px) {
    .container {
      grid-column: 1 / 2;
    }
  }
</style>
