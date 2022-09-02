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
  { key: "allocated", value: "Allocated", display: (allocated) => allocated + '%' },
  { key: "allocate", value:"Allocate" },
  { key: "action", value: "Action" },
]

export const defaultColumns = ["Network", "Volume", "Allocated" ,"Allocate", "Action"]

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
          "vol_amt":-1
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
    basetoken: getTokenSymbolByAddress(dataInfo.basetoken),
    basetokenaddress: '0x2473f4F7bf40ed9310838edFCA6262C17A59DF64'.toLocaleLowerCase(),
    nftaddress: dataInfo.nft_addr,
    volume: parseFloat(dataInfo.volume).toFixed(3),
    allocated: dataInfo.allocation,
    allocate: {
      chainId: 8996,
      nftAddress: dataInfo.nft_addr,
      basetokenAddress: '0x2473f4F7bf40ed9310838edFCA6262C17A59DF64'.toLocaleLowerCase(),
      basetoken: getTokenSymbolByAddress(dataInfo.basetoken),
      volume: parseFloat(dataInfo.volume),
    },
    action: `https://market.oceanprotocol.com/asset/${dataInfo.did}`,
  };
}

export async function loadDatasets(nftsApi, allocations) {
  //const allDatasets = await getDatasets(nftsApi);
  const allDatasets = [{basetoken_addr: "0x8967bcf84170c91b0d24d4302c2376283b0b3a07",
  chainID: 4,
  nft_addr: "0x537e625c1d722fef6a6e793ac226e5f22e485923",
  basetoken_symbol: "OCEAN",
  did: "did:op:aee900df7379cda6a5aa1b87bd77e053906002058f649825df0bffe5d8cf17dc",
  volume: 11.103105545},
  {basetoken_addr: "0x8967bcf84170c91b0d24d4302c2376283b0b3a07",
  chainID: 4,
  nft_addr: "0x537e625c1d722fef6a6e793ac226e5f22e485924",
  basetoken_symbol: "OCEAN",
  did: "did:op:aee900df7379cda6a5aa1b87bd77e053906002058f649825df0bffe5d8cf17dc",
  volume: 11.103105545},{basetoken_addr: "0x8967bcf84170c91b0d24d4302c2376283b0b3a07",
  chainID: 4,
  nft_addr: "0x537e625c1d722fef6a6e793ac226e5f22e485926",
  basetoken_symbol: "OCEAN",
  did: "did:op:aee900df7379cda6a5aa1b87bd77e053906002058f649825df0bffe5d8cf17dc",
  volume: 11.103105545}]
  if (allDatasets.length === 0) {
    datasets.set([]);
    return;
  }
  let newDatasets = [];
  allDatasets.forEach((datasetInfo, key) => {
    datasetInfo.allocation = allocations.find((allocation) => allocation.nft_addr === datasetInfo.nft_addr)?.percent || 0
    datasetInfo.totalPools = allDatasets.length;
    datasetInfo.totalTVL = allDatasets.reduce(
      (total, dataset) => total + parseFloat(dataset.stake_amt)
    );
    newDatasets.push(getRow(datasetInfo, key));
  });

  datasets.set(newDatasets);
}
