<script>
  import { DataTable, Pagination } from "carbon-components-svelte";
  import { convertWPRtoAPY } from "../../utils/rewards.js";
  import * as epochs from "../../utils/metadata/epochs/epochs.json";
  import {
    getRoundAPY,
    getVeOceanBal,
    getDFallocations,
  } from "../../utils/rewards";
  import { userAddress } from "../../stores/web3";
  import { veBalances, veUserBalances } from "../../stores/veOcean";
  import {
    veAllocations,
    veUserAllocations,
  } from "../../stores/dataAllocations";
  import { oceanRewards, oceanUserRewards } from "../../stores/airdrops";
  import moment from "moment";
  import CustomTooltip from "../common/CustomTooltip.svelte";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  let rows = [];
  let initialRows = [];
  let pagination = { pageSize: 100, page: 1 };
  let loading = true;

  // Tooltips dropped for now, they'll be back
  let headers = [
    {
      key: "id",
      value: "Round",
    },
    { key: "date_start", value: "Start Date" },
    { key: "passive", value: "Passive Rewards" },
    { key: "passiveapy", value: "Passive APY", tooltip: descriptions.default.tooltip_rewards_apy_passive_history},
    { key: "active", value: "Active Rewards" },
    { key: "activeapy", value: "Active APY", tooltip: descriptions.default.tooltip_rewards_apy_active_history},
  ];
  let initialHeaders = headers;

  const init = async () => {
    rows = JSON.parse(
      JSON.stringify(
        epochs.default.filter((epoch) =>
          moment(epoch.date_end).isBefore(moment())
        )
      )
    );
    if (!$veBalances || !$veAllocations || !$oceanRewards) {
      let veBals = await getVeOceanBal();
      let dfAllocation = await getDFallocations();
      let apys = await getRoundAPY();
      veBalances.update(() => veBals);
      veAllocations.update(() => dfAllocation);
      oceanRewards.update(() => apys);
    } else {
      let allocations = $veBalances;
      let veBals = $veAllocations;
      let apys = $oceanRewards;
    }
    let newRows = [];
    rows.forEach((row) => {
      let veBal = $veBalances.find((vb) => vb.round == row.id);
      let allocation = $veAllocations.find((r) => r.round == row.id);
      let rewards = $oceanRewards.find((r) => r.round == row.id);
      newRows.push({
        id: row.id,
        date_start: moment(row.date_start).format("DD-MMM-YYYY"),
        passiveapy: `${parseFloat(
          rewards && veBal
            ? convertWPRtoAPY(
                rewards["sum(passive_amt)"] / veBal["sum(balance)"]
              )
            : 0
        ).toFixed(2)}%`,
        activeapy: `${parseFloat(
          rewards && allocation
            ? convertWPRtoAPY(
                rewards["sum(curating_amt)"] / allocation["sum(ve_amt)"]
              )
            : 0
        ).toFixed(2)}%`,
        passive: `${row.passive} OCEAN`,
        active: `${row.active} OCEAN`,
      });
    });
    rows = newRows;
    rows.sort((first, second) => {
      return second.id - first.id;
    });
    initialRows = rows;
    loading = false;
  };

  const getUserRoundAPY = async () => {
    let allocations = await getDFallocations($userAddress);
    let veBals = await getVeOceanBal($userAddress);
    let apys = await getRoundAPY($userAddress);
    veUserBalances.update(() => veBals);
    veUserAllocations.update(() => allocations);
    oceanUserRewards.update(() => apys);
    rows = JSON.parse(JSON.stringify(initialRows));
    rows.forEach((row) => {
      let veBal = $veUserBalances.find((vb) => vb.round == row.id);
      let allocation = $veUserAllocations.find((r) => r.round == row.id);
      let rewards = $oceanUserRewards.find((r) => r.round == row.id);
      row.passiveapy =
        row.passiveapy?.toString() +
        ` / ${parseFloat(
          rewards && veBal
            ? convertWPRtoAPY(
                rewards["sum(passive_amt)"] / veBal["sum(balance)"]
              )
            : 0
        ).toFixed(2)}%`;
      row.activeapy =
        row.activeapy?.toString() +
        ` / ${parseFloat(
          rewards && allocation
            ? convertWPRtoAPY(
                rewards["sum(curating_amt)"] / allocation["sum(ve_amt)"]
              )
            : 0
        ).toFixed(2)}%`;
    });
    rows = JSON.parse(JSON.stringify(rows));
    headers = JSON.parse(JSON.stringify(initialHeaders));
  };

  init();

  $: if ($userAddress) {
    getUserRoundAPY();
  }
</script>

<h2 class="title">Data Farming History</h2>
<div class="epochHistoryTableContainer">
  <DataTable sortable {headers} {rows} class="customTable">
    <svelte:fragment slot="cell-header" let:header>
      <div class="headerContainer">
        {header.value}
        {#if header.tooltip}
          <CustomTooltip
            text={header.tooltip}
            direction="bottom"
          />
        {/if}
      </div>
    </svelte:fragment>
    <svelte:fragment slot="cell" let:cell let:row>
      <div class='cellContainer'>
        {cell.value}
      </div>
    </svelte:fragment>
  </DataTable>
  <Pagination
    bind:pageSize={pagination.pageSize}
    bind:page={pagination.page}
    totalItems={rows.length}
    pageSizeInputDisabled
  />
</div>

<style>
  .epochHistoryTableContainer {
    width: 100%;
    background-color: var(--brand-white);
    transform: translate3d(0, -0.05rem, 0);
    border-radius: var(--border-radius);
    max-height: calc(50vh);
    overflow-y: scroll;
  }
  :global(.epochHistoryTableContainer thead) {
    position: sticky;
    inset-block-start: 0;
  }
  .cellContainer {
    height: auto;
  }
  .title {
    font-weight: bold;
    width: 100%;
  }
  .headerContainer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
