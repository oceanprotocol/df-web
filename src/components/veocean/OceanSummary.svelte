<script>
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import { query } from "svelte-apollo";
  import { TOTAL_LOCKED } from "../../utils/subgraph";
  import { veTotalLocked } from "../../stores/subgraph";

  let summary = query(TOTAL_LOCKED);
  let totalLocked = 0;
  let loading = true;

  const convertToInternationalCurrencySystem = (value) => {
    return Math.abs(Number(value)) >= 1.0e9
      ? (Math.abs(Number(value)) / 1.0e9).toFixed(2) + "B"
      : Math.abs(Number(value)) >= 1.0e6
      ? (Math.abs(Number(value)) / 1.0e6).toFixed(2) + "M"
      : Math.abs(Number(value)) >= 1.0e3
      ? (Math.abs(Number(value)) / 1.0e3).toFixed(2) + "K"
      : Math.abs(Number(value));
  };

  const initSummary = () => {
    veTotalLocked.update(() => $summary.data);
    let data = $summary.data.veOCEANs;

    totalLocked = data.reduce(function (total, user) {
      return total + parseInt(user.lockedAmount);
    }, 0);
  };

  $: if ($summary.data) {
    initSummary();
    loading = false;
  }
</script>

<div class={`container`}>
  <Card title="veOCEAN Metrics">
    <div class="veOcean-info">
      {#if $summary.loading === true}
        <ItemWithLabel title={`Total Locked`} value="Loading..." />
      {:else}
        <ItemWithLabel
          title={`Total Locked`}
          value={`${convertToInternationalCurrencySystem(totalLocked)} OCEAN`}
        />
      {/if}
    </div>
  </Card>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-column: 1 / 3;
    width: 100%;
  }

  .veOcean-info {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  }
</style>
