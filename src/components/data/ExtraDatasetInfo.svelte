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
        value={`${dataset.roundAPY}%`}
        tooltipMessage={""}
      />
      <ItemWithLabel
        title="APR"
        value={`${dataset.roundAPY}%`}
        tooltipMessage={""}
      />
      <ItemWithLabel
        title="Yield"
        value={`${dataset.roundYield}%`}
        tooltipMessage={""}
      />
    </div>
  </div>
  <div class="roundContainer" v>
    <p>Last Round</p>
    <div class="roundValues">
      <ItemWithLabel
        title="APY"
        value={`${dataset.lastRoundAPY}%`}
        tooltipMessage={""}
      />
      <ItemWithLabel
        title="APR"
        value={`${dataset.lastRoundAPR}%`}
        tooltipMessage={""}
      />
      <ItemWithLabel
        title="Yield"
        value={`${dataset.lastRoundYield}%`}
        tooltipMessage={""}
      />
    </div>
  </div>
</div>

<style>
  .container {
  }
  .roundContainer {
    margin-bottom: var(--spacer);
  }
  .container div:last-child {
    margin-bottom: 0;
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
