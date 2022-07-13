import { writable } from "svelte/store";
import { getNetworkDataById } from "./web3";
import * as networksDataArray from "../networks-metadata.json";

let networksData = networksDataArray.default

export let pools = writable("");

export const columnsData = [
  { key: "network", value: "Network" },
  { key: "datatoken", value: "Datatoken" },
  { key: "dtaddress", value: "DTAddress" },
  { key: "basetoken", value: "Basetoken" },
  { key: "basetokenaddress", value: "BasetokenAddress" },
  { key: "tvl", value: "TVL", display: (cost) => cost * 2 },
  {
    key: "volume",
    value: "Volume",
    display: (volume) => volume,
  },
  { key: "pooladdress", value: "PoolAddress" },
  { key: "nftaddress", value: "NFTAddress" },
  { key: "lp", value:"LP" },
  { key: "action", value: "Action" },
]

export const defaultColumns = ["Network", "Datatoken", "TVL", "Volume", "LP", "Action"]

async function getPools(api) {
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

function getRow(poolInfo, key) {
  return {
    id: key,
    network: getNetworkDataById(networksData, parseInt(poolInfo.chainID))?.name,
    datatoken: poolInfo.DT_symbol,
    dtaddress: poolInfo.DT_addr,
    basetoken: getTokenSymbolByAddress(poolInfo.basetoken),
    basetokenaddress: poolInfo.basetoken_addr,
    pooladdress: poolInfo.pool_addr,
    nftaddress: poolInfo.nft_addr,
    tvl: parseFloat(poolInfo.stake_amt).toFixed(3),
    volume: parseFloat(poolInfo.vol_amt).toFixed(3),
    lp: {
      chainId: poolInfo.chainID,
      url: poolInfo.url,
      poolAddress: poolInfo.pool_addr,
      nftAddress: poolInfo.nft_addr,
      DTAddress: poolInfo.DT_addr,
      basetokenAddress: poolInfo.basetoken_addr,
      DTSymbol: poolInfo.DT_symbol,
      basetoken: getTokenSymbolByAddress(poolInfo.basetoken),
      tvl: parseFloat(poolInfo.stake_amt),
      volume: parseFloat(poolInfo.vol_amt),
    },
    action: poolInfo.url,
  };
}

export async function loadPools(poolsApi) {
  const allPools = await getPools(poolsApi);
  if (allPools.length === 0) {
    pools.set([]);
    return;
  }
  let newPools = [];
  allPools.forEach((poolInfo, key) => {
     poolInfo.totalPools = allPools.length;
     poolInfo.totalTVL = allPools.reduce(
      (total, pool) => total + parseFloat(pool.stake_amt)
    );
    newPools.push(getRow(poolInfo, key));
  });

  pools.set(newPools);
}
