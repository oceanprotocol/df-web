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
    display: (volume) => volume,
  },
  { key: "nftaddress", value: "NFTAddress" },
  { key: "allocate", value:"Allocate" },
  { key: "action", value: "Action" },
]

export const defaultColumns = ["Network", "Volume", "Allocate", "Action"]

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
    volume: parseFloat(dataInfo.vol_amt).toFixed(3),
    allocate: {
      chainId: 8996,
      url: dataInfo.url,
      nftAddress: dataInfo.nft_addr,
      basetokenAddress: '0x2473f4F7bf40ed9310838edFCA6262C17A59DF64'.toLocaleLowerCase(),
      basetoken: getTokenSymbolByAddress(dataInfo.basetoken),
      volume: parseFloat(dataInfo.vol_amt),
    },
    action: dataInfo.url,
  };
}

export async function loadDatasets(nftsApi) {
  const allDatasets = await getDatasets(nftsApi);
  console.log(allDatasets)
  if (allDatasets.length === 0) {
    datasets.set([]);
    return;
  }
  let newDatasets = [];
  allDatasets.forEach((datasetInfo, key) => {
    datasetInfo.totalPools = allDatasets.length;
    datasetInfo.totalTVL = allDatasets.reduce(
      (total, dataset) => total + parseFloat(dataset.stake_amt)
    );
    newDatasets.push(getRow(datasetInfo, key));
  });

  datasets.set(newDatasets);
}
