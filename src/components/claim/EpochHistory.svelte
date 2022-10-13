<script>
  import { DataTable } from "carbon-components-svelte";
  import * as epochs from "../utils/metadata/epochs/epochs.json";
  import {getEpoch} from "../../utils/epochs"
  import moment from "moment";
  
  let loading = true;
  let epoch;
  let rows = [];
  
  const headers = [
    { key: "round", value: "Round" },
    { key: "ended", value: "Ended" },
    { key: "passive", value: "Passive Rewards" }, 
    { key: "active", value:"Active Rewards" }
  ]

  const init = () => {
    const now = moment();
    epoch = getEpoch(now);

    rows = Object.entries(epochs).filter(([k, v]) => v.index < epoch.index );
    loading = false;
  };

  init();
</script>

<div>
  <DataTable
    title="Data Farming History"
    headers={headers}
    rows={rows}
    class="customTable"
  />
</div>
