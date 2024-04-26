<script>
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import {
    lockedOceanAmount,
    oceanUnlockDate,
  } from "../../stores/veOcean";
  import WithdrawOcean from "./WithdrawOcean.svelte";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  let loading = false;
</script>

<div class={`container`}>
  <Card title="My veOCEAN">
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
    justify-content: center;
    align-items: center;
    gap: calc(var(--spacer) * 4);
    min-height: var(--spacer);
    margin-bottom: calc(var(--spacer) / 4);
    width: 100%;
  }

  @media (min-width: 640px) {
    .container {
      grid-column: 1 / 3;
    }
    .veOcean-info {
      margin: 0;
    }
  }
</style>
