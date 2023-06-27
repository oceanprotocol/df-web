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
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  let loading = false;
  const supportedChainId = import.meta.env.VITE_VE_SUPPORTED_CHAINID

  const setValues = async () => {
    if (!$totalUserAllocation) {
      let newAllocation = await getTotalAllocatedVeOcean(
        $userAddress
      );
      totalUserAllocation.update(() => newAllocation);
    }
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
        value={`${
          $userBalances[
            getAddressByChainIdKey(
              supportedChainId,
              "veOCEAN"
            )
          ]
            ? parseFloat(
                $userBalances[
                  getAddressByChainIdKey(
                    supportedChainId,
                    "veOCEAN"
                  )
                ]
              ).toFixed(3)
            : parseFloat("0").toFixed(3)
        } veOCEAN`}
        tooltipMessage={descriptions.default.tooltip_veocean_my_balance}
        {loading}
      />
      <ItemWithLabel
        title={`Allocation Power`}
        value={`${parseFloat($veOceanWithDelegations).toFixed(3)} veOCEAN`}
        tooltipMessage={descriptions.default.tooltip_veocean_my_voting_power}
        {loading}
      />
    </div>
    <div class="veOcean-info">
      <ItemWithLabel
        title={`Locked`}
        value={`${parseFloat($lockedOceanAmount).toFixed(3)} OCEAN`}
        tooltipMessage={descriptions.default.tooltip_veocean_my_locked_ocean}
        {loading}
      />
      <ItemWithLabel
        title={`Lock ends`}
        value={`${
          $oceanUnlockDate ? $oceanUnlockDate.format("DD-MMM-YYYY") : "-"
        }`}
        tooltipMessage={descriptions.default.tooltip_veocean_my_lock_ends}
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
    grid-column: 1 / 3;
    width: 100%;
  }

  .veOcean-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: var(--spacer);
    margin-bottom: calc(var(--spacer) / 4);
    width: 100%;
  }

  @media (min-width: 640px) {
    .container {
      grid-column: 1 / 2;
    }
    .veOcean-info {
      margin: 0;
    }
  }
</style>
