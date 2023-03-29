import { writable } from "svelte/store";
import { getNetworkDataById } from "./web3";
import * as networksDataArray from "../networks-metadata.json";
import * as descriptions from "../utils/metadata/descriptions.json";
import { getEpoch } from "../utils/epochs";

let networksData = networksDataArray.default

export let datasets = writable("");

export const columnsData = {
  'alloc': [
    { key: "network", value: "Network" },
    { key: "title", value: "Title" },
    { key: "symbol", value: "Symbol" },
    { key: "last10roundavgalloc", value:"10RoundAllocation", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_round_allocation},
    { key: "last5roundavgalloc", value:"5RoundAllocation", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_round_allocation},
    { key: "last3roundavgalloc", value:"3RoundAllocation", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_round_allocation},
    { key: "roundallocation", value:"RoundAllocation", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_round_allocation},
    { key: "currentallocation", value:"CurrentAllocation", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_current_allocation},
    { key: "myallocation", value:"MyAllocation", tooltip: descriptions.default.tooltip_datafarming_my_allocation },
  ],
  'dcv': [
    { key: "network", value: "Network" },
    { key: "title", value: "Title" },
    { key: "symbol", value: "Symbol" },
    { key: "last10roundavgdcv", value:"10RoundDCV", display: (volume) => '$' + volume, tooltip: descriptions.default.tooltip_datafarming_last_round_consume },
    { key: "last5roundavgdcv", value:"5RoundDCV", display: (volume) => '$' + volume, tooltip: descriptions.default.tooltip_datafarming_last_round_consume },
    { key: "last3roundavgdcv", value:"3RoundDCV", display: (volume) => '$' + volume, tooltip: descriptions.default.tooltip_datafarming_last_round_consume },
    {
      key: "roundvolume",
      value: "RoundVolume",
      display: (volume) => '$' + volume,
      tooltip: descriptions.default.tooltip_datafarming_round_consume
    },
    { key: "lastroundvolume", value: "LastRoundVolume", display: (volume) => '$' + volume, tooltip: descriptions.default.tooltip_datafarming_last_round_consume },
    { key: "myallocation", value:"MyAllocation", tooltip: descriptions.default.tooltip_datafarming_my_allocation },
  ],
  'apy': [
    { key: "network", value: "Network" },
    { key: "title", value: "Title" },
    { key: "symbol", value: "Symbol" },
    { key: "last10roundavgapy", value: "10RoundAPY", display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_current_round_asset_APY },
    { key: "last5roundavgapy", value: "5RoundAPY", display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_current_round_asset_APY },
    { key: "last3roundavgapy", value: "3RoundAPY", display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_current_round_asset_APY },
    { key: "roundapy", value: "RoundAPY", display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_current_round_asset_APY },
    { key: "lastroundapy", value: "LastRoundAPY", display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_last_round_asset_APY},
    { key: "myallocation", value:"MyAllocation", tooltip: descriptions.default.tooltip_datafarming_my_allocation },
  ]
}

export const defaultColumns = {
  'alloc': ["Title", "5RoundAllocation", "3RoundAllocation", "RoundAllocation", "CurrentAllocation", "MyAllocation"],
  'dcv': ["Title", "5RoundDCV", "3RoundDCV", "RoundVolume", "LastRoundVolume", "MyAllocation"],
  'apy': ["Title", "10RoundAPY", "5RoundAPY", "3RoundAPY", "RoundAPY", "LastRoundAPY", "MyAllocation"],
}

async function getDatasets(api,roundNumber) {
  let res;
  // TODO: make rounds dynamic L75
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
        "fields": [
            "*",
            {
                "expression": {
                    "pattern": "avg(case when round in (26,27,28) then apy else 0 end)"
                },
                "alias": "3_round_avg_apy"
            },
            {
                "expression": {
                    "pattern": "avg(case when round in (24,25,26,27,28) then apy else 0 end)"
                },
                "alias": "5_round_avg_apy"
            },
            {
                "expression": {
                    "pattern": "avg(case when round in (19,20,21,22,23,24,25,26,27,28) then apy else 0 end)"
                },
                "alias": "10_round_avg_apy"
            },
            {
                "expression": {
                    "pattern": "avg(case when round in (26,27,28) then volume else 0 end)"
                },
                "alias": "3_round_avg_dcv"
            },
            {
                "expression": {
                    "pattern": "avg(case when round in (24,25,26,27,28) then volume else 0 end)"
                },
                "alias": "5_round_avg_dcv"
            },
            {
                "expression": {
                    "pattern": "avg(case when round in (19,20,21,22,23,24,25,26,27,28) then volume else 0 end)"
                },
                "alias": "10_round_avg_dcv"
            },
            {
              "expression": {
                  "pattern": "avg(case when round in (24,25,26,27,28) then ve_allocated else 0 end)"
              },
              "alias": "3_round_avg_alloc"
            },
            {
                "expression": {
                    "pattern": "avg(case when round in (24,25,26,27,28) then ve_allocated else 0 end)"
                },
                "alias": "5_round_avg_alloc"
            },
            {
                "expression": {
                    "pattern": "avg(case when round in (19,20,21,22,23,24,25,26,27,28) then ve_allocated else 0 end)"
                },
                "alias": "10_round_avg_alloc"
            },
        ],
        "group": [
            "did",
            "nft_addr",
            "chainID",
            "symbol",
            "name",
            "ve_allocated",
            "ocean_allocated",
            "ve_allocated_owner",
            "ocean_allocated_owner",
            "ve_allocated_realtime",
            "ocean_allocated_realtime",
            "ve_allocated_realtime_owner",
            "ocean_allocated_realtime_owner",
            "volume",
            "is_purgatory",
            "apr",
            "apy",
            "owner_addr",
            "round"
        ],
        "sort": {
            "volume": -1
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
    lastroundapy: dataInfo.lastRoundAPY,
    roundapy: dataInfo.apy,
    last10roundavgapy: dataInfo['10_round_avg_apy'],
    last3roundavgapy: dataInfo['3_round_avg_apy'],
    last5roundavgapy: dataInfo['5_round_avg_apy'],
    last3roundavgdcv: dataInfo['5_round_avg_dcv'],
    last5roundavgdcv: dataInfo['3_round_avg_dcv'],
    last10roundavgdcv: dataInfo['10_round_avg_dcv'],
    last3roundavgalloc: dataInfo['5_round_avg_alloc'],
    last5roundavgalloc: dataInfo['3_round_avg_alloc'],
    last10roundavgalloc: dataInfo['3_round_avg_alloc'],
    nftaddress: dataInfo.nft_addr,
    ispurgatory: dataInfo.is_purgatory,
    did: dataInfo.did,
    chainId: dataInfo.chainID,
    last_7_round_avg_allocation: dataInfo['7_round_avg_allocation'],
    currentallocation: parseFloat(dataInfo.ve_allocated_realtime).toFixed(3),
    roundallocation: parseFloat(dataInfo.ve_allocated).toFixed(3),
    myallocation: dataInfo.allocation,
    allocated: dataInfo.allocation,
    roundvolume: parseFloat(dataInfo.volume).toFixed(3),
    lastroundvolume: parseFloat(dataInfo.lastRoundVolume).toFixed(3),
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
    datasetInfo.lastRoundVolume = lastRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)?.volume
    datasetInfo.lastRoundVolume = datasetInfo.lastRoundVolume > 0 ? datasetInfo.lastRoundVolume : 0.00
    newDatasets.push(getRow(datasetInfo, key));
  });
  datasets.set(newDatasets);
}
