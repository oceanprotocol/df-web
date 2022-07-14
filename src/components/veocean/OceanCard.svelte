<script>
  import { userAddress, connectedChainId } from "../../stores/web3";
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import { userBalances } from "../../stores/tokens";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";

  let lockedOceans = 0;
  let loading = true;

  $: if (
    $userAddress &&
    $userBalances[
      getOceanTokenAddressByChainId($connectedChainId).toLowerCase()
    ]
  ) {
    loading = false;
  }
</script>

<div class={`container`}>
  <Card title="My OCEAN">
    <div class="ocean-info">
      <ItemWithLabel
        title={`Ocean Balance`}
        value={loading
          ? "loading..."
          : `${parseFloat(
              $userBalances[
                getOceanTokenAddressByChainId($connectedChainId)
                  .toLowerCase()
                  .toLowerCase()
              ]
            ).toFixed(3)} OCEAN`}
      />
      <ItemWithLabel
        title={`Locked`}
        value={loading
          ? "loading..."
          : `${parseFloat(lockedOceans).toFixed(3)} OCEAN`}
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
