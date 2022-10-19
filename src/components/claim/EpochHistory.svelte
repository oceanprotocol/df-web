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

<div class="container">
  <DataTable
    sortable
    title="Data Farming History"
    {headers}
    {rows}
    class="customTable"
  />
</div>

<style>
  .container {
    width: 100%;
  }
</style>
