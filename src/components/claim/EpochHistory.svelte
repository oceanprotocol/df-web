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
  import moment from "moment";
  import CustomTooltip from "../common/CustomTooltip.svelte";

  let rows = [];
  let pagination = { pageSize: 100, page: 1 };
  let loading = true;

  // Tooltips dropped for now, they'll be back
  const headers = [
    {
      key: "id",
      value: "Round",
    },
    { key: "date_start", value: "Start Date" },
    { key: "passive", value: "Passive Rewards" },
    { key: "passiveapy", value: "Passive APY AVG" },
    { key: "active", value: "Active Rewards" },
    { key: "activeapy", value: "Active APY AVG" },
  ];

  const init = async () => {
    rows = JSON.parse(
      JSON.stringify(
        epochs.default.filter((epoch) =>
          moment(epoch.date_end).isBefore(moment())
        )
      )
    );
    let veBals = await getVeOceanBal();
    let dfAllocation = await getDFallocations($userAddress);
    let apys = await getRoundAPY();
    let newRows = [];
    rows.forEach((row) => {
      let veBal = veBals.find((vb) => vb.round == row.id);
      let allocation = dfAllocation.find((r) => r.round == row.id);
      let rewards = apys.find((r) => r.round == row.id);
      newRows.push({
        id: row.id,
        date_start: moment(row.date_start).format("DD-MMM-YYYY"),
        passiveapy: `${parseFloat(
          rewards && veBal
            ? convertWPRtoAPY(
                rewards["sum(passive_amt)"] / veBal["sum(balance)"]
              )
            : 0
        ).toFixed(2)} %`,
        activeapy: `${parseFloat(
          rewards && allocation
            ? convertWPRtoAPY(
                rewards["sum(curating_amt)"] /
                  allocation["sum(ocean_allocated)"]
              )
            : 0
        ).toFixed(2)} %`,
        passive: `${row.passive} OCEAN`,
        active: `${row.active} OCEAN`,
      });
    });
    rows = newRows;
    rows.sort((first, second) => {
      return second.id - first.id;
    });

    loading = false;
  };

  init();
</script>

<h2 class="title">Data Farming History</h2>
<div class="epochHistoryContainer">
  <div class="epochHistoryTableContainer">
    <DataTable sortable {headers} {rows} class="customTable">
      <svelte:fragment slot="cell-header" let:header>
        <div class="headerContainer">
          {header.value}
          {#if header.tooltip}
            <CustomTooltip
              text={header.tooltip}
              direction={header.tooltipDirection
                ? header.tooltipDirection
                : "top"}
            />
          {/if}
        </div>
      </svelte:fragment>
    </DataTable>
  </div>
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
  .epochHistoryContainer {
    width: 100%;
    margin: calc(var(--spacer) / 2) 0;
    background-color: var(--brand-white);
    box-shadow: var(--box-shadow);
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
  :global(.epochHistoryContainer .bx--data-table-container) {
    padding-top: 0 !important;
  }
</style>
