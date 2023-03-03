import { writable } from "svelte/store";
import { getNetworkDataById } from "./web3";
import * as networksDataArray from "../networks-metadata.json";
import * as descriptions from "../utils/metadata/descriptions.json";
import { getEpoch } from "../utils/epochs";

let networksData = networksDataArray.default

export let datasets = writable("");

export const columnsData = [
  { key: "network", value: "Network" },
  { key: "title", value: "Title" },
  { key: "symbol", value: "Symbol" },
  { key: "roundapy", value: "RoundAPY", display: (roundapy) => parseFloat(roundapy ? roundapy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_current_round_asset_APY },
  { key: "roundAPR", value: "RoundAPR", display: (roundAPR) => parseFloat(roundAPR ? roundAPR * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_current_round_asset_APY },
  { key: "roundYield", value: "RoundYield", display: (roundYield) => parseFloat(roundYield ? roundYield * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_current_round_asset_yield },
  { key: "lastRoundAPY", value: "LastRoundAPY", display: (lastRoundAPY) => parseFloat(lastRoundAPY ? lastRoundAPY * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_last_round_asset_APY},
  { key: "lastRoundAPR", value: "LastRoundAPR", display: (lastRoundAPR) => parseFloat(lastRoundAPR ? lastRoundAPR * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_last_round_asset_APY},
  { key: "lastRoundYield", value: "LastRoundYield", display: (lastRoundYield) => parseFloat(lastRoundYield ? lastRoundYield * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_last_round_asset_yield},
  {
    key: "roundvolume",
    value: "RoundVolume",
    display: (volume) => '$' + volume,
    tooltip: descriptions.default.tooltip_datafarming_round_consume
  },
  { key: "nftaddress", value: "NFTAddress" },
  { key: "did", value: "DID" },
  { key: "roundallocation", value:"RoundAllocation", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_round_allocation},
  { key: "currentallocation", value:"CurrentAllocation", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_current_allocation},
  { key: "myallocation", value:"MyAllocation", tooltip: descriptions.default.tooltip_datafarming_my_allocation },
]

export const defaultColumns = ["Title","RoundVolume","RoundAPY","LastRoundAPY","CurrentAllocation","MyAllocation"]

async function getDatasets(api,roundNumber) {
  let res;
  try {
    res = await fetch(api, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "query":{
          round:roundNumber
        },
        "sort":{
          "volume":-1
        }
      })
    });
  } catch (error) {
    console.log(error);
    return [];
  }
  let data = await res.json();
  return data;
}

function getRow(dataInfo, key) {
  return {
    id: key,
    title: dataInfo.name,
    network: getNetworkDataById(networksData, parseInt(dataInfo.chainID))?.name,
    symbol: dataInfo.symbol,
    owner: dataInfo.owner_addr,
    lastRoundAPY: dataInfo.lastRoundAPY,
    lastRoundAPR: dataInfo.lastRoundAPR,
    lastRoundYield: dataInfo.lastRoundAPR / 52,
    roundapy: dataInfo.apy,
    roundAPR: dataInfo.apr,
    roundYield: dataInfo.apr / 52,
    nftaddress: dataInfo.nft_addr,
    ispurgatory: dataInfo.is_purgatory,
    did: dataInfo.did,
    chainId: dataInfo.chainID,
    currentallocation: parseFloat(dataInfo.ve_allocated_realtime).toFixed(3),
    roundallocation: parseFloat(dataInfo.ve_allocated).toFixed(3),
    myallocation: dataInfo.allocation,
    allocated: dataInfo.allocation,
    roundvolume: parseFloat(dataInfo.volume).toFixed(3),
    action: `https://market.oceanprotocol.com/asset/${dataInfo.did}`,
  };
}

function filterPurgatoryDatasetsWithoutAllocations(datasets,allocations){
  let purgatoryDatasets = datasets.filter((d) => d.is_purgatory === 1)
  let purgatoryDatasetsWithAllocations = []
  allocations.forEach((a) =>{
    purgatoryDatasets.forEach((d) => {
      if(a.nftAddress === d.nft_addr) purgatoryDatasetsWithAllocations.push(d)
    })
  })
  return purgatoryDatasetsWithAllocations
}

export async function loadDatasets(nftsApi, allocations) {
  let curRound = getEpoch().id;
  //current round number is 0
  let currentRoundDatasets = await getDatasets(nftsApi,0);
  let purgatoryDatasetsWithAllocation = filterPurgatoryDatasetsWithoutAllocations(currentRoundDatasets, allocations)
  currentRoundDatasets = currentRoundDatasets.filter((d) => d.is_purgatory === 0)
  currentRoundDatasets = purgatoryDatasetsWithAllocation.concat(currentRoundDatasets)
  const lastRoundDatasets = await getDatasets(nftsApi,curRound-1)
  if (currentRoundDatasets.length === 0) {
    datasets.set([]);
    return;
  }
  let newDatasets = [];
  currentRoundDatasets.forEach((datasetInfo, key) => {
    datasetInfo.allocation = allocations.find((allocation) => allocation.nftAddress === datasetInfo.nft_addr)?.allocated/100 || 0
    datasetInfo.lastRoundAPY = lastRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)?.apy
    datasetInfo.lastRoundAPR = lastRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)?.apr
    newDatasets.push(getRow(datasetInfo, key));
  });
  datasets.set(newDatasets);
}
