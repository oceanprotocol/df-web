<script>
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import { query } from "svelte-apollo";
  import { DEPOSITS, TOTAL_LOCKED } from "../../utils/subgraph";
  import { veTotalLocked } from "../../stores/subgraph";
  import moment from "moment";

  let summary = query(TOTAL_LOCKED);
  let deposits = query(DEPOSITS);

  let totalLocked = 0;
  let averageLock = 0;

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

  const initDeposits = () => {
    let data = $deposits.data.veDeposits;
    const deltaDaysArr = data.map(function (deposit) {
      let unlockTime = moment.unix(parseInt(deposit.unlockTime));
      let timestamp = moment.unix(parseInt(deposit.timestamp));
      return unlockTime.diff(timestamp, "days");
    });

    //average
    const totalDaysLocked = deltaDaysArr.reduce(function (total, amount) {
      return total + amount;
    }, 0);

    const averageLockDays =
      totalDaysLocked / deltaDaysArr.length
        ? totalDaysLocked / deltaDaysArr.length
        : 0;
    averageLock = parseFloat(averageLockDays / 365).toFixed(3);
  };

  $: if ($summary.data) {
    initSummary();
    loading = false;
  }

  $: if ($deposits.data) {
    initDeposits();
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
          tootipMessage="What percenteg of total potential is used based on lock end time."
        />
      {/if}

      {#if $deposits.loading === true}
        <ItemWithLabel
          title={`Average Lock`}
          value="Loading..."
          tooltipDirection="top"
        />
      {:else}
        <ItemWithLabel
          title={`Average Lock Time`}
          value={`${averageLock} Years`}
          tootipMessage="What percenteg of total potential is used based on lock end time."
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
