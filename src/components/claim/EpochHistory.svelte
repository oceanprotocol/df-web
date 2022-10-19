<script>
  import { DataTable } from "carbon-components-svelte";
  import * as epochs from "../../utils/metadata/epochs/epochs.json";
  import { getEpoch } from "../../utils/epochs";
  import moment from "moment";

  let loading = true;
  let curEpoch;
  let rows = [];

  const headers = [
    { key: "id", value: "Round" },
    { key: "date_start", value: "Start Date" },
    { key: "passive", value: "Passive Rewards" },
    { key: "active", value: "Active Rewards" },
  ];

  const init = () => {
    const now = moment();
    curEpoch = getEpoch(now);

    rows = epochs.default.filter((epoch) => epoch.id < curEpoch.id);
    rows.forEach((row) => {
      row.date_start = moment(row.date_start).format("DD-MM-YYYY");
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
  <DataTable sortable {headers} {rows} class="customTable" />
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
  :global(.epochHistoryContainer .bx--data-table-container) {
    padding-top: 0 !important;
  }
</style>
