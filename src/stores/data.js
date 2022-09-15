import { writable } from "svelte/store";
import { getNetworkDataById } from "./web3";
import * as networksDataArray from "../networks-metadata.json";

let networksData = networksDataArray.default

export let datasets = writable("");

export const columnsData = [
  { key: "network", value: "Network" },
  { key: "basetoken", value: "Basetoken" },
  { key: "basetokenaddress", value: "BasetokenAddress" },
  {
    key: "volume",
    value: "Volume",
    display: (volume) => '$' + volume,
  },
  { key: "nftaddress", value: "NFTAddress" },
  { key: "totalallocated", value:"TotalAllocated", display: (allocated) => allocated + ' veOCEAN' },
  { key: "allocated", value: "Allocated", display: (allocated) => allocated + '%' },
  { key: "allocate", value:"Allocate" },
  { key: "action", value: "Action" },
]

export const defaultColumns = ["Network", "Volume", "TotalAllocated" ,"Allocated" ,"Allocate", "Action"]

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

const getTokenSymbolByAddress = (address) => {
  if(address==='0x282d8efce846a88b159800bd4130ad77443fa1a1'){
    return 'mOCEAN'
  }else{
    return 'OCEAN'
  }
}

function getRow(dataInfo, key) {
  return {
    id: key,
    network: getNetworkDataById(networksData, parseInt(dataInfo.chainID))?.name,
    basetoken: dataInfo.symbol,
    basetokenaddress: dataInfo.basetoken_addr.toLocaleLowerCase(),
    nftaddress: dataInfo.nft_addr,
    chainId: dataInfo.chainID,
    totalallocated: parseFloat(dataInfo.ve_allocated).toFixed(3),
    allocate: dataInfo.allocation,
    volume: parseFloat(dataInfo.volume).toFixed(3),
    allocated: dataInfo.allocation,
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
