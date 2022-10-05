import { writable } from "svelte/store";
import { getNetworkDataById } from "./web3";
import * as networksDataArray from "../networks-metadata.json";

let networksData = networksDataArray.default

export let datasets = writable("");

export const columnsData = [
  { key: "network", value: "Network" },
  { key: "name", value: "Name" },
  { key: "symbol", value: "Symbol" },
  {
    key: "volume",
    value: "Volume",
    display: (volume) => '$' + volume,
  },
  { key: "nftaddress", value: "NFTAddress" },
  { key: "did", value: "DID" },
  { key: "totalallocated", value:"TotalAllocated", display: (allocated) => allocated + ' veOCEAN' },
  { key: "myallocation", value:"MyAllocation" },
  { key: "action", value: "Action" },
]

export const defaultColumns = ["Name", "Volume", "TotalAllocated" ,"MyAllocation", "Action"]

async function getDatasets(api) {
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
    name: "[Data Whale] Ocean ONDA DataFi Directory V4, [Data Whale] Ocean ONDA DataFi Directory V4, [Data Whale] Ocean ONDA DataFi Directory V4",
    network: getNetworkDataById(networksData, parseInt(dataInfo.chainID))?.name,
    symbol: dataInfo.symbol,
    nftaddress: dataInfo.nft_addr,
    did: dataInfo.did,
    chainId: dataInfo.chainID,
    totalallocated: parseFloat(dataInfo.ve_allocated).toFixed(3),
    myallocation: dataInfo.allocation,
    allocated: dataInfo.allocation,
    volume: parseFloat(dataInfo.volume).toFixed(3),
    action: `https://market.oceanprotocol.com/asset/${dataInfo.did}`,
  };
}

export async function loadDatasets(nftsApi, allocations) {
  const allDatasets = await getDatasets(nftsApi);
  if (allDatasets.length === 0) {
    datasets.set([]);
    return;
  }
  let newDatasets = [];
  allDatasets.forEach((datasetInfo, key) => {
    datasetInfo.allocation = allocations.find((allocation) => allocation.nftAddress === datasetInfo.nft_addr)?.allocated/100 || 0
    newDatasets.push(getRow(datasetInfo, key));
  });
  datasets.set(newDatasets);
}
