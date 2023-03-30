import { writable } from "svelte/store";
import { getNetworkDataById, userAddress } from "./web3";
import * as networksDataArray from "../networks-metadata.json";
import * as descriptions from "../utils/metadata/descriptions.json";
import { getEpoch } from "../utils/epochs";
import { getRoundsDatafarm } from "../utils/functions";

let networksData = networksDataArray.default

export let datasets = writable("");

export const columnsData = {
  'alloc': [
    { key: "network", value: "Network" },
    { key: "title", value: "Title", tooltip: descriptions.default.tooltip_datafarming_title},
    { key: "symbol", value: "Symbol" },
    { key: "last10roundavgalloc", value:"Ro10 Avg Alloc", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_10_round_allocation},
    { key: "last5roundavgalloc", value:"Ro5 Avg Alloc", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_5_round_allocation},
    { key: "last3roundavgalloc", value:"Ro3 Avg Alloc", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_3_round_allocation},
    { key: "roundallocation", value:"Ro Alloc", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_round_allocation},
    { key: "currentallocation", value:"Curr Alloc", display: (allocated) => allocated + ' veOCEAN', tooltip: descriptions.default.tooltip_datafarming_current_allocation},
    { key: "myallocation", value:"My Allocation", tooltip: descriptions.default.tooltip_datafarming_my_allocation },
  ],
  'dcv': [
    { key: "network", value: "Network" },
    { key: "title", value: "Title", tooltip: descriptions.default.tooltip_datafarming_title},
    { key: "symbol", value: "Symbol" },
    { key: "last10roundavgdcv", value:"Ro10 DCV", display: (last10roundavgdcv) => '$' + last10roundavgdcv, tooltip: descriptions.default.tooltip_datafarming_10_round_consume },
    { key: "last5roundavgdcv", value:"Ro5 DCV", display: (volume) => '$' + volume, tooltip: descriptions.default.tooltip_datafarming_5_round_consume },
    { key: "last3roundavgdcv", value:"Ro3 DCV", display: (volume) => '$' + volume, tooltip: descriptions.default.tooltip_datafarming_3_round_consume },
    {
      key: "roundvolume",
      value: "Ro Volume",
      display: (volume) => '$' + volume,
      tooltip: descriptions.default.tooltip_datafarming_round_consume
    },
    { key: "lastroundvolume", value: "Last Ro Volume", display: (volume) => '$' + volume, tooltip: descriptions.default.tooltip_datafarming_last_round_consume },
    { key: "myallocation", value:"My Allocation", tooltip: descriptions.default.tooltip_datafarming_my_allocation },
  ],
  'apy': [
    { key: "network", value: "Network" },
    { key: "title", value: "Title", tooltip: descriptions.default.tooltip_datafarming_title},
    { key: "symbol", value: "Symbol" },
    { key: "last10roundavgapy", value: "Ro10 APY", display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_10_round_asset_APY },
    { key: "last5roundavgapy", value: "Ro5 APY", display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_5_round_asset_APY },
    { key: "last3roundavgapy", value: "Ro3 APY", display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_3_round_asset_APY },
    { key: "roundapr", value: "Ro APR", display: (roundAPR) => parseFloat(roundAPR ? roundAPR * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_current_round_asset_APR },
    { key: "roundapy", value: "Ro APY", display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_current_round_asset_APY },
    { key: "lastroundapy", value: "Last Ro APY", display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_last_round_asset_APY},
    { key: "roundyield", value: "Ro Yield", display: (roundYield) => parseFloat(roundYield ? roundYield * 100 : 0).toFixed(2) + '%', tooltip: descriptions.default.tooltip_datafarming_current_round_asset_yield },
    { key: "myallocation", value:"My Allocation", tooltip: descriptions.default.tooltip_datafarming_my_allocation },
  ]
}

export const defaultColumns = {
  'alloc': ["Title", "Ro5 Avg Alloc", "Ro3 Avg Alloc", "Ro Alloc", "Curr Alloc", "My Allocation"],
  'dcv': ["Title", "Ro10 DCV", "Ro5 DCV", "Ro3 DCV", "Last Ro Volume", "Ro Volume", "My Allocation"],
  'apy': ["Title", "Ro5 APY", "Ro3 APY", "Ro APY", "Last Ro APY", "Ro Yield", "My Allocation"],
}

async function getDatasetsAvgs(api,roundNumber) {
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
          "round": {
            "$in": getRoundsDatafarm(roundNumber)
          }
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
          "round": roundNumber
        },
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
  let userId;
  userAddress.subscribe(id => (userId = id));
  const isowner = userId.toLowerCase() === dataInfo.owner_addr

  console.log(dataInfo);

  return {
    id: key,
    title: dataInfo.name,
    network: getNetworkDataById(networksData, parseInt(dataInfo.chainID))?.name,
    symbol: dataInfo.symbol,
    owner: dataInfo.owner_addr,
    lastroundapy: dataInfo.lastRoundAPY,
    lastroundapr: dataInfo.lastRoundAPR,
    lastroundyield: dataInfo.lastRoundYield,
    roundapy: dataInfo.apy,
    roundapr: dataInfo.apr,
    roundyield: dataInfo.roundYield,
    last10roundavgapy: dataInfo['10_round_avg_apy'],
    last3roundavgapy: dataInfo['3_round_avg_apy'],
    last5roundavgapy: dataInfo['5_round_avg_apy'],
    last3roundavgdcv: parseFloat(dataInfo['3_round_avg_dcv']).toFixed(3),
    last5roundavgdcv: parseFloat(dataInfo['5_round_avg_dcv']).toFixed(3),
    last10roundavgdcv: parseFloat(dataInfo['10_round_avg_dcv']).toFixed(3),
    last3roundavgalloc: dataInfo['3_round_avg_alloc'],
    last5roundavgalloc: dataInfo['5_round_avg_alloc'],
    last10roundavgalloc: dataInfo['10_round_avg_alloc'],
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
    ownerallocation: parseFloat(dataInfo.ve_allocated_realtime_owner).toFixed(3),
    myveocean: dataInfo.allocation,
    lastroundvolume: parseFloat(dataInfo.lastRoundVolume).toFixed(3),
    action: `https://market.oceanprotocol.com/asset/${dataInfo.did}`,
    publishersreward: dataInfo.ownerallocation > 0 || isowner && dataInfo.allocation > 0
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
  const avgsRoundDatasets = await getDatasetsAvgs(nftsApi,curRound);
  if (currentRoundDatasets.length === 0) {
    datasets.set([]);
    return;
  }
  let newDatasets = [];
  currentRoundDatasets.forEach((datasetInfo, key) => {
    
    datasetInfo.allocation = allocations.find((allocation) => allocation.nftAddress === datasetInfo.nft_addr)?.allocated/100 || 0
    
    datasetInfo.lastRoundAPY = lastRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)?.apy
    datasetInfo.lastRoundAPR = lastRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)?.apr
    datasetInfo.lastRoundYield = lastRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)?.roundYield
    datasetInfo.lastRoundVolume = lastRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)?.volume
    datasetInfo.lastRoundVolume = datasetInfo.lastRoundVolume > 0 ? datasetInfo.lastRoundVolume : 0.00

    datasetInfo['3_round_avg_alloc'] = avgsRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)['3_round_avg_alloc']
    datasetInfo['3_round_avg_dcv'] = avgsRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)['3_round_avg_dcv']
    datasetInfo['3_round_avg_apy'] = avgsRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)['3_round_avg_apy']

    datasetInfo['5_round_avg_alloc'] = avgsRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)['5_round_avg_alloc']
    datasetInfo['5_round_avg_dcv'] = avgsRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)['5_round_avg_dcv']
    datasetInfo['5_round_avg_apy'] = avgsRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)['5_round_avg_apy']

    datasetInfo['10_round_avg_alloc'] = avgsRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)['10_round_avg_alloc']
    datasetInfo['10_round_avg_dcv'] = avgsRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)['10_round_avg_dcv']
    datasetInfo['10_round_avg_apy'] = avgsRoundDatasets.find((ld) => ld.nft_addr === datasetInfo.nft_addr)['10_round_avg_apy']

    newDatasets.push(getRow(datasetInfo, key));
  });
  datasets.set(newDatasets);
}
