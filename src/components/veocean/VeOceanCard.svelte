<script>
  import { userAddress } from "../../stores/web3";
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import { userBalances } from "../../stores/tokens";
  import {
    oceanUnlockDate,
    veOceanWithDelegations,
  } from "../../stores/veOcean";
  import { totalUserAllocation } from "../../stores/dataAllocations";
  import { getTotalAllocatedVeOcean } from "../../utils/dataAllocations";

  let balance = 0;
  let loading = true;

  const setValues = async () => {
    if (!$totalUserAllocation) {
      let newAllocation = await getTotalAllocatedVeOcean($userAddress);
      totalUserAllocation.update(() => newAllocation);
    }
    balance = $userBalances[process.env.VE_OCEAN_CONTRACT];
    loading = false;
  };

  $: if ($userAddress) {
    setValues();
  }
</script>

<div class={`container`}>
  <Card title="My veOCEAN">
    <div class="veOcean-info">
      <ItemWithLabel
        title={`veOcean balance`}
        value={`${parseFloat(balance).toFixed(3)} veOCEAN`}
        {loading}
      />
      <ItemWithLabel
        title={`voting power`}
        value={$veOceanWithDelegations}
        float
        {loading}
      />
      <ItemWithLabel
        title={`Lock period end`}
        value={`${
          $oceanUnlockDate ? $oceanUnlockDate.toLocaleDateString("en-CA") : "-"
        }`}
        {loading}
      />
      <ItemWithLabel
        title={`Total allocated`}
        value={`${$totalUserAllocation}%`}
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

  .veOcean-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
</style>
