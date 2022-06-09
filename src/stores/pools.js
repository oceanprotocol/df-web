import { writable } from "svelte/store";
import { getNetworkDataById } from "./web3";
import * as networksDataArray from "../networks-metadata.json";
import {getTokenAddress} from "./airdrops";

let networksData = networksDataArray.default

export let pools = writable("");

export const columnsData = [
  { key: "network", value: "Network" },
  { key: "datatoken", value: "Datatoken" },
  { key: "dtaddress", value: "DTAddress" },
  { key: "basetoken", value: "Basetoken" },
  { key: "basetokenaddress", value: "BasetokenAddress" },
  { key: "tvl", value: "TVL", display: (cost) => "$ " + cost },
  {
    key: "volume",
    value: "Volume",
    display: (volume) => "$ " + volume,
  },
  { key: "pooladdress", value: "PoolAddress" },
  { key: "nftaddress", value: "NFTAddress" },
  { key: "lp", value:"LP" },
  { key: "action", value: "Action" },
]

export const defaultColumns = ["Network", "Datatoken", "Basetoken", "TVL", "Volume", "LP", "Action"]

async function getPools() {
  const query = {};
  let res;
  try {
    res = await fetch(`https://df-sql.oceandao.org/pools`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
      }),
    });
  } catch (error) {
    console.log(error);
    return [];
  }
  let data = await res.json();
  return data;
}

function getRow(poolInfo, key) {
  return {
    id: key + poolInfo.chainID,
    network: getNetworkDataById(networksData, parseInt(poolInfo.chainID))?.name,
    datatoken: poolInfo.DT_symbol,
    dtaddress: poolInfo.DT_addr,
    basetoken: poolInfo.basetoken,
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
      basetoken: poolInfo.basetoken,
      tvl: parseFloat(poolInfo.stake_amt),
      volume: parseFloat(poolInfo.vol_amt),
    },
    action: poolInfo.url,
  };
}

export async function loadPools() {
  const allPools = await getPools();
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
