<script>
  import { userAddress } from "../../stores/web3";
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import { userBalances } from "../../stores/tokens";
  import {
    lockedOceanAmount,
    oceanUnlockDate,
    veOceanWithDelegations,
  } from "../../stores/veOcean";
  import { totalUserAllocation } from "../../stores/dataAllocations";
  import { getTotalAllocatedVeOcean } from "../../utils/dataAllocations";
  import WithdrawOcean from "./WithdrawOcean.svelte";

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
        title={`Balance`}
        value={`${parseFloat(balance).toFixed(3)} veOCEAN`}
        {loading}
      />
      <ItemWithLabel
        title={`Voting Power`}
        value={$veOceanWithDelegations}
        float
        {loading}
      />
    </div>
    <div class="veOcean-info">
      <ItemWithLabel
        title={`Locked`}
        value={`${parseFloat($lockedOceanAmount).toFixed(3)} OCEAN`}
        {loading}
      />
      <ItemWithLabel
        title={`Lock ends`}
        value={`${
          $oceanUnlockDate ? $oceanUnlockDate.toLocaleDateString("ro-RO") : "-"
        }`}
        {loading}
      />
    </div>
    <div class="veOcean-info">
      <WithdrawOcean />
    </div>
  </Card>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    grid-column: 1/3;
    width: 100%;
  }

  .veOcean-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: var(--spacer);
    width: 100%;
  }

  @media (min-width: 640px) {
    .container {
      grid-column: 1 / 2;
    }
  }
</style>
