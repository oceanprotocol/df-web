<script>
  import { onMount } from "svelte";
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
  import  * as descriptions from "../../utils/metadata/descriptions.json";
  import ChecklistDropdown from "../common/ChecklistDropdown.svelte";

  let rows = [];
  let pagination = { pageSize: 100, page: 1 };
  let dropdownOptions = {};
  let loading = true;

  // Tooltips dropped for now, they'll be back
  let allHeaders = [
    {
      key: "id",
      value: "Round",
    },
    { key: "date_start", value: "Start Date" },
    { key: "active", value: "Active Rewards" },
    {
      key: "volumeapy",
      value: "VolumeDF APY",
      tooltip: descriptions.default.tooltip_rewards_apy_volume_history,
    },
    { key: "passive", value: "Passive Rewards" },
    {
      key: "passiveapy",
      value: "Passive APY",
      tooltip: descriptions.default.tooltip_rewards_apy_passive_history,
    },
    { key: "veocean", value: "veOCEAN Rewards" },
    { key: "volumedf", value: "VolumeDF Rewards" },
    { key: "challenge", value: "Challenge Rewards" },
  ];
  let headers = [...allHeaders.slice(0, -3)]
  let initialHeaders = [...headers];

  const createDropdownOptions = () => {
    allHeaders.forEach((header) => {
      dropdownOptions[header.value] = headers.some(
        (h) => h.key === header.key
      );
    });
  }

  const onDropdownCheck = (value, checked) => {
    if(!checked){
      headers = headers.filter((header) => header.value !== value)
    }else{
      headers.push(allHeaders.find((header) => header.value == value))
      headers = headers
    }
    dropdownOptions[value] = checked
  }

  const init = async () => {
    rows = [...epochs.default.filter((epoch) =>
          moment(epoch.date_end).isBefore(moment())
        )
    ]
    if (!$veBalances || !$veAllocations || !$oceanRewards) {
      let veBals = await getVeOceanBal();
      let dfAllocation = await getDFallocations();
      let apys = await getRoundAPY();
      veBalances.set(veBals);
      veAllocations.set(dfAllocation);
      oceanRewards.set(apys);
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
                rewards["sum(passive_amt)"] / veBal["sum(locked_amt)"]
              )
            : 0
        ).toFixed(2)}%`,
        volumeapy: `${parseFloat(
          rewards && allocation
            ? convertWPRtoAPY(
                rewards["sum(curating_amt)"] / allocation["sum(ocean_amt)"]
              )
            : 0
        ).toFixed(2)}%`,
        passive: `${row.streams.find((s) => s.name=='Passive').rewards.toLocaleString()} OCEAN`,
        active: `${row.streams.find((s) => s.name=='Active').rewards.toLocaleString()} OCEAN`,
        veocean: `${row.streams.find((s) => s.name=='Passive')?.substreams.find((s) => s.name=='veOCEAN')?.rewards.toLocaleString() || 0} OCEAN`,
        volumedf: `${row.streams.find((s) => s.name=='Active')?.substreams.find((s) => s.name=='Volume DF')?.rewards.toLocaleString() || 0} OCEAN`,
        challenge: `${row.streams.find((s) => s.name=='Active')?.substreams.find((s) => s.name=='Challenge')?.rewards.toLocaleString() || 0} OCEAN`,
      });
    });
    rows = newRows;
    rows.sort((first, second) => {
      return second.id - first.id;
    });
    loading = false;
  };

  const getUserRoundAPY = async () => {
    let allocations = await getDFallocations($userAddress);
    let veBals = await getVeOceanBal($userAddress);
    let apys = await getRoundAPY($userAddress);
    veUserBalances.update(() => veBals);
    veUserAllocations.update(() => allocations);
    oceanUserRewards.update(() => apys);
    rows = JSON.parse(JSON.stringify(rows));
    rows.forEach((row) => {
      let veBal = $veUserBalances.find((vb) => vb.round == row.id);
      let allocation = $veUserAllocations.find((r) => r.round == row.id);
      let rewards = $oceanUserRewards.find((r) => r.round == row.id);
      row.passiveapy =
        `${row.passiveapy?.toString()} / ${parseFloat(
          rewards && veBal
            ? convertWPRtoAPY(
                rewards["sum(passive_amt)"] / veBal["sum(locked_amt)"]
              )
            : 0
        ).toFixed(2)}%`;
      row.volumeapy =
        `${row.volumeapy?.toString()} / ${parseFloat(
          rewards && allocation
            ? convertWPRtoAPY(
                rewards["sum(curating_amt)"] / allocation["sum(ocean_amt)"]
              )
            : 0
        ).toFixed(2)}%`;
    });
    rows = JSON.parse(JSON.stringify(rows));
    headers = JSON.parse(JSON.stringify(initialHeaders));
  };

  onMount(init);

  $: createDropdownOptions()
  $: if ($userAddress && !loading) {
    getUserRoundAPY();
  }
</script>

<h2 class="historyTableTitle">Data Farming History</h2>
<div class="epochHistoryTableContainer">
  <div class="tableCustomHeader">
    <ChecklistDropdown title="Select displayed columns" options={dropdownOptions} onCheck={onDropdownCheck}/>
  </div>
  <div class="tableBody">
  {#if rows}
    <DataTable sortable {headers} {rows} class="customTable">
      <svelte:fragment slot="cell-header" let:header>
        <div class="headerContainer">
          {header.value}
          {#if header.tooltip}
            <CustomTooltip text={header.tooltip} direction="bottom" />
          {/if}
        </div>
      </svelte:fragment>
      <svelte:fragment slot="cell" let:cell let:row>
        <div class="cellContainer">
          {cell.value}
        </div>
      </svelte:fragment>
    </DataTable>
  {/if}
  <Pagination
    bind:pageSize={pagination.pageSize}
    bind:page={pagination.page}
    totalItems={rows.length}
    pageSizeInputDisabled
  />
</div>
</div>

<style lang="scss" global>
  @import "carbon-components/scss/components/data-table/_data-table.scss";
  @import "carbon-components/scss/components/data-table/_data-table-sort.scss";
  @import "carbon-components/scss/components/toolbar/_toolbar.scss";
  @import "carbon-components/scss/components/pagination/_pagination.scss";

  .epochHistoryTableContainer {
    width: 100%;
    background-color: var(--brand-white);
    transform: translate3d(0, -0.05rem, 0);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    margin-bottom: calc(var(--spacev)/4);
  }
  :global(.epochHistoryTableContainer thead) {
    position: sticky;
    inset-block-start: 0;
  }
  .cellContainer {
    height: auto;
  }
  .historyTableTitle {
    font-weight: bold;
    width: 100%;
    margin-bottom: calc(var(--spacer) / 2);
  }
  .epochHistoryTableContainer .tableCustomHeader{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: calc(var(--spacer) / 6) calc(var(--spacer) / 3);
    margin: 0;
  }
  .tableBody{
    max-height: calc(50vh);
    overflow-y: scroll;
  }
  .tableCustomHeader > div {
    padding: calc(var(--spacer) / 6) 0 !important;
  }
  .tableCustomHeader {
    display: flex;
    justify-content: space-between;
    flex-direction: column-reverse;
    padding: 0 calc(var(--spacer) / 3);
    margin: 0;
  }
  .headerContainer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
  }
  :global(.bx--tooltip__label) {
    background-color: transparent !important;
    width: 20px !important;
    text-align: center;
    display: flex;
  }
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  tr {
    background-color: var(--brand-white);
  }
  .cellContainer {
    padding: calc(var(--spacer) / 4);
    height: 54px;
    display: flex;
    align-items: center;
  }
  .customTable {
    max-width: 100%;
    background-color: var(--brand-white) !important;
  }
  td {
    border-top: 0 !important;
    background-color: transparent !important;
  }
  .customTable .bx--data-table td, .customTable .bx--data-table tbody th{
    padding: 0 !important;
  }
  .bx--data-table tbody tr:hover{
    background: #e5e5e5 !important;
  }
  .bx--data-table tbody tr:hover .cellContainer .container{
    border: 1px solid var(--brand-grey-darker);
  }
  :global(.tableContainer thead) {
    background-color: var(--brand-white) !important;
    position: sticky;
    inset-block-start: 34px;
  }
  button[class*="table-sort"] {
    background-color: var(--brand-grey-dimmed) !important;
  }
  button[class*="table-sort"] {
    background-color: var(--brand-grey-dimmed);
  }
  div [class*="pagination"] {
    background-color: var(--brand-white) !important;
  }
  :global(div [class*="select-input"]) {
    background-color: var(--brand-white) !important;
    border-left: 1px solid var(--brand-grey-dimmed) !important;
  }
  div [class*="data-table-header"] {
    background-color: var(--brand-white) !important;
  }
  div [class*="pagination__button"] {
    border-left: 1px solid var(--brand-grey-dimmed) !important;
  }
  :global([class*="table-toolbar"]) {
    z-index: 0 !important;
    position: fixed !important;
  }
  .tableContainer .bx--data-table {
    margin-top: calc(var(--spacer) / 2);
  }
  .tableTabs .bx--tabs .bx--tabs-trigger{
    display: none;
  }
  .tableTabs .bx--tabs .bx--tabs__nav{
    display: flex;
    justify-content: space-around;
  }
  .tableTabs .bx--tabs .bx--tabs__nav .bx--tabs__nav-item{
    flex: 1;
    padding: 1rem;
    border: 1px solid var(--brand-grey-dimmed);
    cursor: pointer;
  }
  .tableTabs .bx--tabs .bx--tabs__nav .bx--tabs__nav-item:first-child{
    border-right: none;
  }
  .tableTabs .bx--tabs .bx--tabs__nav .bx--tabs__nav-item:last-child{
    border-left: none;
  }
  .tableTabs .bx--tabs .bx--tabs__nav .bx--tabs__nav-item a{
    text-decoration: none;
  }
  .tableTabs .bx--tabs .bx--tabs__nav .bx--tabs__nav-item.bx--tabs__nav-item--selected{
    background: #f4f4f4;
  }
  @media (min-width: 640px) {
    .tableCustomHeader {
      flex-direction: row;
    }
    .tableCustomHeader > div {
      padding: 0;
    }
    .tableActionsContainer {
      justify-content: flex-end;
    }
    .datasetsWithAllocationsInputContainer {
      width: auto;
    }
  }
</style>
