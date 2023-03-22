<script>
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  export let dataset;
</script>

<div class="container">
  <div class="roundContainer">
    <p>Current Round</p>
    <div class="roundValues">
      <ItemWithLabel
        title="APY"
        value={`${parseFloat(dataset.roundAPY ? dataset.roundAPY : 0).toFixed(
          3
        )}%`}
        tooltipMessage={descriptions.default
          .tooltip_datafarming_current_round_asset_APY}
      />
      <ItemWithLabel
        title="APR"
        value={`${parseFloat(dataset.roundAPR ? dataset.roundAPR : 0).toFixed(
          3
        )}%`}
        tooltipMessage={descriptions.default
          .tooltip_datafarming_current_round_asset_APR}
      />
      <ItemWithLabel
        title="Yield"
        value={`${parseFloat(
          dataset.roundYield ? dataset.roundYield : 0
        ).toFixed(3)}%`}
        tooltipMessage={descriptions.default
          .tooltip_datafarming_current_round_asset_yield}
      />
    </div>
  </div>
  <div class="roundContainer" v>
    <p>Last Round</p>
    <div class="roundValues">
      <ItemWithLabel
        title="APY"
        value={`${parseFloat(
          dataset.lastRoundAPY ? dataset.lastRoundAPY : 0
        ).toFixed(3)}%`}
        tooltipMessage={descriptions.default
          .tooltip_datafarming_last_round_asset_APY}
      />
      <ItemWithLabel
        title="APR"
        value={`${parseFloat(
          dataset.lastRoundAPR ? dataset.lastRoundAPR : 0
        ).toFixed(3)}%`}
        tooltipMessage={descriptions.default
          .tooltip_datafarming_last_round_asset_APR}
      />
      <ItemWithLabel
        title="Yield"
        value={`${parseFloat(
          dataset.lastRoundYield ? dataset.lastRoundYield : 0
        ).toFixed(3)}%`}
        tooltipMessage={descriptions.default
          .tooltip_datafarming_last_round_asset_yield}
      />
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: calc(var(--spacer) / 2);
    margin-left: 0;
  }
  p {
    font-size: var(--font-size-base);
    font-weight: bold;
    margin-bottom: calc(var(--spacer) / 4);
  }
  .roundContainer {
    margin-right: calc(var(--spacer) * 2);
  }
  .roundValues {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacer);
  }
</style>
