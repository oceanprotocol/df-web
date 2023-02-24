<script>
  import DataTable from "carbon-components-svelte/src/DataTable/DataTable.svelte";
  import Pagination from "carbon-components-svelte/src/Pagination/Pagination.svelte";
  import Toolbar from "carbon-components-svelte/src/DataTable/Toolbar.svelte";
  import ToolbarContent from "carbon-components-svelte/src/DataTable/ToolbarContent.svelte";
  import ToolbarSearch from "carbon-components-svelte/src/DataTable/ToolbarSearch.svelte";
  import "carbon-components/scss/components/_data-table.scss"
  import Button from "./Button.svelte";
  import 'carbon-'
  import ChecklistDropdown from "./ChecklistDropdown.svelte";
  import { defaultColumns } from "../../stores/data";
  import { filterDataByUserAllocation, filterDataByOwner } from "../../utils/data";
  import {
    dataAllocations,
    totalUserAllocation,
  } from "../../stores/dataAllocations";
  import Input from "./Input.svelte";
  import TextWithNetworkIcon from "./TextWithNetworkIcon.svelte";
  import NetworkIcon from "./NetworkIcon.svelte";
  import ShareInput from "./ShareInput.svelte";
  import ItemWithLabel from "./ItemWithLabel.svelte";
  import Dropdown from "./Dropdown.svelte";
  import { userBalances } from "../../stores/tokens";
  import {
    allocateVeOceanToMultipleNFTs,
    getTotalAllocatedVeOcean,
  } from "../../utils/dataAllocations";
  import Swal from "sweetalert2";
  import {
    connectedChainId,
    networkSigner,
    userAddress,
  } from "../../stores/web3";
  import Link from "./Link.svelte";
  import { oceanUnlockDate } from "../../stores/veOcean";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import CustomTooltip from "./CustomTooltip.svelte";
  import { navigate } from "svelte-navigator";
  import * as descriptions from "../../utils/metadata/descriptions.json";
  

  // TODO - Fix RowData vs. LPData
  // TODO - RowData == View Only (Network, Datatoken, TVL, DCV)
  // TODO - LPData == Everything Required (basetokenAddress, LPAddress, url, etc...)
  export let colData = undefined;
  export let rowData = undefined;
  export let notHidableColumns = [];
  let showDataWithAllocations = false;
  let filteredDatasets = undefined;
  let disabled = undefined;
  let totalAvailable = disabled ? 0 : 100 - $totalUserAllocation;
  let totalAvailableTemporary = undefined;
  let loading = undefined;
  let tooltipMessage = undefined;
  let tooltipState = undefined;
  let filterOption = "0";

  let columns = {};
  let pagination = { pageSize: 100, page: 1 };

  $:if(filterOption) {
    filterTable(filterOption)
  } 

  loadVisibleColumns();

  function getColumnsFromLocalStorage() {
    columns = JSON.parse(localStorage.getItem("datasetsDisplayedColumns"));
    colData.forEach((col) => {
      if (!columns[col.value] && notHidableColumns.indexOf(col.value) === -1) {
        colData = colData.filter((colD) => colD.key !== col.key);
      }
    });
  }

  function filterTable(option){
    switch (option) {
      case "0":
        filteredDatasets = undefined
        break;
      case "1":
        filteredDatasets = filterDataByUserAllocation(rowData, $dataAllocations);
        break;
      case "2":
        filteredDatasets = filterDataByOwner(rowData, $userAddress);
        break;
      default:
        break;
    }
  }

  function checkLocalColumnsEqualLocalStorageColumns() {
    if (!localStorage.getItem("allColumns")) return false;
    return localStorage.getItem("allColumns") === JSON.stringify(colData);
  }

  function loadVisibleColumns() {
    if (
      localStorage.getItem("datasetsDisplayedColumns") &&
      checkLocalColumnsEqualLocalStorageColumns()
    ) {
      getColumnsFromLocalStorage();
    } else {
      localStorage.setItem("allColumns", JSON.stringify(colData));
      colData.forEach((col) => {
        columns[col.value] = defaultColumns.indexOf(col.value) !== -1;
      });
      localStorage.setItem("datasetsDisplayedColumns", JSON.stringify(columns));
      getColumnsFromLocalStorage();
      notHidableColumns.forEach((column) => {
        delete columns[column];
      });
    }
  }

  function onCheck(key, value) {
    columns[key] = value;
    if (value) {
      colData.splice(2, 0, { key: key.toLowerCase(), value: key });
      colData = colData;
    } else {
      colData = colData.filter((col) => col.value !== key);
    }
    localStorage.setItem("datasetsDisplayedColumns", JSON.stringify(columns));
  }

  const onTotalAvailableAllocationChange = async (id, value, step) => {
    totalAvailableTemporary = totalAvailable + step;
    rowData[rowData.findIndex((element) => element.id === id)].myallocation =
      value;
  };

  const updateTotalAllocation = (id, value) => {
    if (value == "") {
      rowData[
        rowData.findIndex((element) => element.id === id)
      ].myallocation = 0;
    }
    totalAvailable = totalAvailableTemporary;
  };

  const subtractCurrAllocationsFromTotal = (value) => {
    if (!value || totalAvailable + parseInt(value) > 100) return;
    totalAvailable += parseInt(value);
  };

  const updateAllocations = async (resetPurgatory) => {
    loading = resetPurgatory ? "RESET" : "UPDATE";
    const amounts = [];
    const nftAddresses = [];
    const chainIds = [];
    rowData.forEach((data) => {
      if (data.myallocation !== data.allocated) {
        amounts.push(data.myallocation);
        nftAddresses.push(data.nftaddress);
        chainIds.push(data.chainId);
      }
    });
    if (resetPurgatory) {
      await rowData.forEach((data) => {
        if (data.allocated) {
          amounts.push(0);
          nftAddresses.push(data.nftaddress);
          chainIds.push(data.chainId);
        }
      });
      $dataAllocations.forEach((data) => {
        if (!nftAddresses.find((address) => address === data.nftAddress)) {
          amounts.push(0);
          nftAddresses.push(data.nftAddress);
          chainIds.push(parseInt(data.chainId));
        }
      });
    }
    try {
      await allocateVeOceanToMultipleNFTs(
        amounts,
        nftAddresses,
        chainIds,
        $networkSigner
      );
    } catch (error) {
      Swal.fire("Error!", error.message, "error").then(() => {});
      loading = undefined;
      return;
    }
    Swal.fire("Success!", "Allocation successfully updated.", "success").then(
      async () => {
        let newAllocation = await getTotalAllocatedVeOcean(
          $userAddress,
          $networkSigner
        );
        totalUserAllocation.update(() => newAllocation);
        loading = undefined;
      }
    );
  };

  $: $userAddress && updateTotalAvailableAllocations();
  $: $totalUserAllocation && updateTotalAvailableAllocations();
  $: !$oceanUnlockDate && updateTotalAvailableAllocations();
  $: $oceanUnlockDate && updateTotalAvailableAllocations();

  $: if ($totalUserAllocation === 0) {
    updateTotalAvailableAllocations();
  }

  const updateTotalAvailableAllocations = () => {
    updateDisable();
    totalAvailable = disabled ? 0 : 100 - $totalUserAllocation;
    totalAvailableTemporary = totalAvailable;
  };

  $: if ($oceanUnlockDate) {
    updateDisable();
  }

  $: if (!$oceanUnlockDate) {
    updateDisable();
  }

  function updateDisable() {
    disabled =
      $userBalances[
        getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN")
      ] === undefined ||
      !$userAddress ||
      $connectedChainId != process.env.VE_SUPPORTED_CHAINID ||
      !$oceanUnlockDate;

    updateTooltip();
  }

  function updateTooltip() {
    if (disabled) {
      tooltipMessage =
        descriptions.default.tooltip_datafarming_alloc_amt_no_lock;
      tooltipState = "alert";
    } else {
      if ($totalUserAllocation < 1) {
        tooltipMessage =
          descriptions.default.tooltip_datafarming_alloc_amt_has_lock;
        tooltipState = "warning";
      } else {
        tooltipMessage =
          descriptions.default.tooltip_datafarming_alloc_amt_has_lock;
        tooltipState = undefined;
      }
    }
  }

  $: if ($userAddress && $connectedChainId) {
    disabled =
      $userBalances[
        getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN")
      ] === undefined ||
      !$userAddress ||
      $connectedChainId != process.env.VE_SUPPORTED_CHAINID ||
      !$oceanUnlockDate;
  }

  // init the page state
  updateDisable();
</script>

{#if colData && rowData}
  <div>
    <div class="tableCustomHeader">
      <div class="headerValuesContainer">
        <ItemWithLabel
          title="Allocated amount"
          value={!$oceanUnlockDate
            ? "No available allocation"
            : totalAvailable >= 0
            ? `${
                100 -
                (totalAvailableTemporary !== totalAvailable
                  ? totalAvailableTemporary
                  : totalAvailable)
              }/100%`
            : "loading..."}
          {tooltipMessage}
          {tooltipState}
        />
        {#if $oceanUnlockDate}
          <Button
            text={"Update allocations"}
            className="updateAllocationsBtton"
            onclick={() => updateAllocations()}
            disabled={disabled || loading}
            loading={loading === "UPDATE"}
          />
          <Button
            text={"Reset allocations"}
            className="updateAllocationsBtton"
            onclick={() => updateAllocations(true)}
            disabled={disabled || loading || $totalUserAllocation < 1}
            secondary
            loading={loading === "RESET"}
          />
        {:else}
          <Button
            text={"Get allocations"}
            className="updateAllocationsBtton"
            onclick={() => navigate("veocean")}
          />
        {/if}
      </div>
      <div class="tableActionsContainer">
        <Dropdown 
          options={[
            { id: "0", text: "All datasets" },
            { id: "1", text: "Datasets where I have allocations" },
            { id: "2", text: "My published datasets" },
          ]}
          bind:selectedOption={filterOption}
        />
        <ChecklistDropdown options={columns} title={"Columns"} {onCheck} />
      </div>
    </div>
    <div class="tableContainer">
      <DataTable
        sortable
        headers={colData}
        pageSize={pagination.pageSize}
        page={pagination.page}
        rows={filteredDatasets ? filteredDatasets : rowData}
        class="customTable"
      >
        <Toolbar size="sm">
          <ToolbarContent>
            <ToolbarSearch
              persistent
              on:input={() => {
                pagination.page = 1;
              }}
              shouldFilterRows
            />
          </ToolbarContent>
        </Toolbar>
        <svelte:fragment slot="cell-header" let:header>
          <div class="headerContainer">
            {header.value}
            {#if header.tooltip}
              <CustomTooltip text={header.tooltip} direction="bottom" />
            {/if}
          </div>
        </svelte:fragment>
        <svelte:fragment slot="cell" let:cell let:row>
          {#if cell.key === "title"}
          <div class="title">
            <NetworkIcon name={row.network} minimal/>
            <div class="textContainer">
              <TextWithNetworkIcon
                className={row.ispurgatory ? "purgatory" : ""}
                text={cell.value}
                url={row.action}
                textColor={row.ispurgatory ? 'var(--brand-alert-red)' : 'var(--brand-black)'}
                tooltipMessage={row.ispurgatory ? "Item in purgatory. Remove your allocations." : undefined}
              />
              <span class="ownerContainer">
                owned by
                <div class="ownerAddressContainer">
                  <Link 
                    url={`https://market.oceanprotocol.com/profile/${row.owner}`} 
                    text= {row.owner.substr(0, 6)}...{row.owner.substr(
                            row.owner.length - 6
                          )}
                    className="owner"
                    hideIcon
                  />
                </div>
              </span>
            </div>
          </div>
          {:else if cell.key === "myallocation"}
            <ShareInput
              currentValue={cell.value}
              available={row.ispurgatory ? parseInt($dataAllocations.find((d) =>d.nftAddress == row.nftaddress)?.allocated)/100 : totalAvailable}
              onChange={(id, value, step) =>
                onTotalAvailableAllocationChange(id, value, step)}
              onBlur={updateTotalAllocation}
              onFocus={subtractCurrAllocationsFromTotal}
              dataId={row.id}
              showAvailable={false}
            />
          {:else}{cell.display ? cell.display(cell.value) : cell.value}{/if}
        </svelte:fragment>
      </DataTable>
    </div>
    <Pagination
      bind:pageSize={pagination.pageSize}
      bind:page={pagination.page}
      totalItems={filteredDatasets
        ? filteredDatasets.length
        : rowData.length}
      pageSizeInputDisabled
    />
  </div>
{/if}

<style lang="scss" global>
  @import "carbon-components/scss/components/data-table/_data-table.scss";
  @import "carbon-components/scss/components/data-table/_data-table-sort.scss";
  @import "carbon-components/scss/components/toolbar/_toolbar.scss";
  @import "carbon-components/scss/components/pagination/_pagination.scss";

  .datasetsWithAllocationsInputContainer {
    display: flex !important;
    width: 200px;
    justify-content: center;
    align-items: center;
  }
  .tableContainer {
    width: 100%;
    max-height: calc(100vh - 115px - var(--spacer) * 3.7);
    overflow-y: scroll;
  }
  .tableCustomHeader > div {
    padding: calc(var(--spacer) / 6) 0 !important;
  }
  .tableCustomHeader {
    display: flex;
    justify-content: space-between;
    flex-direction: column-reverse;
    margin: 0;
  }
  .headerContainer{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .title{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .textContainer{
    width: 100%;
  }
  .purgatory {
    font-size: var(--font-size-small);
    color: var(--brand-alert-red);
  }
  .ownerContainer{
    display: block;
    color: var(--brand-grey-light);
    font-size: var(--font-size-mini);
  }
  .ownerAddressContainer{
    display: inline-block;
  }
  :global(.ownerContainer .owner){
    color: var(--brand-color-primary);
    font-size: var(--font-size-mini);
  }
  .headerValuesContainer {
    display: flex;
    align-items: center;
    margin-left: calc(var(--spacer) / 3);
  }
  .updateAllocationsBtton {
    margin-left: calc(var(--spacer) / 3) !important;
  }
  .tableActionsContainer {
    display: flex !important;
    justify-content: space-between !important;
  }

  .customTable {
    max-width: 100%;
    background-color: var(--brand-white) !important;
  }
  td {
    background: var(--brand-white) !important;
    border-top: 0 !important;
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
  :global(.bx--search-input){
    font-size: var(--font-size-base);
  }
  :global(tr:has(.purgatory) > td) {
    color: var(--brand-alert-red) !important;
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
