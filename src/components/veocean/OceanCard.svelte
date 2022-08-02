<script>
  import { userAddress, connectedChainId } from "../../stores/web3";
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import { userBalances } from "../../stores/tokens";
  import { getLockedOceanAmount } from "../../utils/ve";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";

  let lockedOceans = 0;
  let balance = 0;
  let loading = false;

  const setValues = async () => {
    loading = true;
    balance =
      $userBalances[
        getOceanTokenAddressByChainId($connectedChainId)
          .toLowerCase()
          .toLowerCase()
      ];
    lockedOceans = await getLockedOceanAmount($userAddress);
    loading = false;
  };

  $: if (
    $userAddress &&
    $userBalances[
      getOceanTokenAddressByChainId($connectedChainId).toLowerCase()
    ]
  ) {
    setValues();
  }
</script>

<div class={`container`}>
  <Card title="My OCEAN">
    <div class="ocean-info">
      <ItemWithLabel
        title={`Ocean Balance`}
        value={`${parseFloat(balance).toFixed(3)} OCEAN`}
        {loading}
      />
      <ItemWithLabel
        title={`Locked`}
        value={`${parseFloat(lockedOceans).toFixed(3)} OCEAN`}
        {loading}
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
