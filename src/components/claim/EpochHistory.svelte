<script>
  import { DataTable } from "carbon-components-svelte";
  import * as epochs from "../../utils/metadata/epochs/epochs.json";
  import { getEpoch } from "../../utils/epochs";
  import moment from "moment";
  import CustomTooltip from "../common/CustomTooltip.svelte";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  let loading = true;
  let curEpoch;
  let rows = [];

  const headers = [
    {
      key: "id",
      value: "Round",
      tooltip: descriptions.default.tooltip_rewards_history_rounds,
      tooltipDirection: "right",
    },
    { key: "date_start", value: "Start Date" },
    { key: "passive", value: "Passive Rewards" },
    { key: "active", value: "Active Rewards" },
  ];

  const init = () => {
    const now = moment();
    curEpoch = getEpoch(now);

    rows = JSON.parse(
      JSON.stringify(epochs.default.filter((epoch) => epoch.id < curEpoch?.id))
    );
    rows.forEach((row) => {
      row.date_start = moment(row.date_start).format("DD-MM-YYYY");
      row.passive = `${row.passive} OCEAN`;
      row.active = `${row.active} OCEAN`;
    });
    rows.sort((first, second) => {
      return second.id - first.id;
    });

    loading = false;
  };

  init();
</script>

<h3 class="title">Data Farming History</h3>
<div class="epochHistoryContainer">
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

<style>
  .epochHistoryContainer {
    width: 100%;
    background-color: var(--brand-white);
    box-shadow: var(--box-shadow);
    transform: translate3d(0, -0.05rem, 0);
    border-radius: var(--border-radius);
    margin-top: calc(var(--spacer) / 2);
  }
  .title {
    font-weight: bold;
    width: 100%;
    font-size: var(--font-size-normal);
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
