<script>
  import ItemWithLabel from "../common/ItemWithLabel.svelte";

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
        tooltipMessage={""}
      />
      <ItemWithLabel
        title="APR"
        value={`${parseFloat(dataset.roundAPR ? dataset.roundAPR : 0).toFixed(
          3
        )}%`}
        tooltipMessage={""}
      />
      <ItemWithLabel
        title="Yield"
        value={`${parseFloat(
          dataset.roundYield ? dataset.roundYield : 0
        ).toFixed(3)}%`}
        tooltipMessage={""}
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
        tooltipMessage={""}
      />
      <ItemWithLabel
        title="APR"
        value={`${parseFloat(
          dataset.lastRoundAPR ? dataset.lastRoundAPR : 0
        ).toFixed(3)}%`}
        tooltipMessage={""}
      />
      <ItemWithLabel
        title="Yield"
        value={`${parseFloat(
          dataset.lastRoundYield ? dataset.lastRoundYield : 0
        ).toFixed(3)}%`}
        tooltipMessage={""}
      />
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: calc(var(--spacer) / 2);
    margin-left: 0;
  }
  p {
    font-size: var(--font-size-large);
    font-weight: bold;
    margin-bottom: calc(var(--spacer) / 4);
  }
  .roundValues {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacer);
  }
</style>
