import { writable } from "svelte/store";
import { airdropsConfig, getTokenAddress } from "./airdrops";
import * as poolInfoChain3 from "../utils/metadata/pools/poolinfo-chain3.csv";
import * as poolInfoChain4 from "../utils/metadata/pools/poolinfo-chain4.csv";

export let pools = writable("");

/*function getRow(poolInfo) {
  return {
    chainId: poolInfo.chainID,
    url: poolInfo.url,
    poolAddress: poolInfo.pool_addr,
    nftAddress: poolInfo.nft_addr,
    DTAddress: poolInfo.DT_addr,
    basetokenAddress: poolInfo.basetoken_addr,
    rowData: {
      network: poolInfo.chainID,
      datatoken: poolInfo.DT_symbol,
      basetoken: poolInfo.basetoken,
      tvl: parseFloat(poolInfo.stake_amt),
      volume: parseFloat(poolInfo.vol_amt),
    },
  };
}*/

async function getPools() {
  const query = {};
  let res;
  try {
    res = await fetch(`http://test-df-sql.oceandao.org/pools`, {
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
    network: getNetworkDataById(networksData, poolInfo.chainId)?.name,
    datatoken: poolInfo.DT_symbol,
    basetoken: poolInfo.basetoken,
    tvl: parseFloat(poolInfo.stake_amt).toFixed(3),
    volume: parseFloat(poolInfo.vol_amt).toFixed(3),
    action: poolInfo.url,
  };
}

const validateAirdropsConfiguration = (pools) => {
  console.log(pools);

  for (const pool of pools) {
    const token = airdropsConfig[pool.chainId].tokensData[pool.basetokenAddress];
    if (token === undefined) {
      console.log("Can't find token: ", pool.basetokenAddress, " from chain: ", pool.chainId, " in airdrops config.");
    }
  }
}

export async function loadPools() {
  const allPools = await getPools();
  if (allPools.length === 0) {
    pools.set([]);
    return;
  }
  poolInfo.totalPools = allPools.length;
  poolInfo.totalTVL = allPools.reduce(
    (total, pool) => total + parseFloat(pool.stake_amt)
  );
  newPools = [];
  allPools.forEach((poolInfo, key) => {
    newPools.push(getRow(poolInfo, key));
  });
  pools.set(newPools);
}
