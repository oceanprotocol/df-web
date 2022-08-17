<script>
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import { userBalances } from "../../stores/tokens";
  import { lockedOceanAmount } from "../../stores/veOcean";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";
  import WithdrawOcean from "./WithdrawOcean.svelte";

  let balance =
    $userBalances[
      getOceanTokenAddressByChainId(
        process.env.VE_SUPPORTED_CHAINID
      ).toLowerCase()
    ];
  let loading = false;
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
        value={`${parseFloat($lockedOceanAmount).toFixed(3)} OCEAN`}
        {loading}
      />
    </div>
    <div class="ocean-info">
      {#if $lockedOceanAmount > 0}
        <WithdrawOcean />
      {/if}
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
