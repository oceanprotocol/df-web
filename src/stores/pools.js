import { writable } from "svelte/store";
import { airdropsConfig, getTokenAddress } from "./airdrops";
import * as poolInfoChain3 from "../utils/metadata/pools/poolinfo-chain3.csv";
import * as poolInfoChain4 from "../utils/metadata/pools/poolinfo-chain4.csv";

export let pools = writable("");

function getRow(poolInfo) {
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

export const loadPools = () => {
  const poolInfo = {
    3: poolInfoChain3,
    4: poolInfoChain4,
  };
  let allPools = [];
  for (const poolsByChain of Object.values(poolInfo)) {
    // poolInfo.totalPools = Object.entries(poolsByChain.default).length;
    // poolInfo.totalTVL = Object.values(poolsByChain.default).reduce(
    //     (total, pool) => total + parseFloat(pool.stake_amt)
    // );

    poolsByChain.default.forEach((poolInfo) => {
      allPools.push(getRow(poolInfo));
    });
  }

  validateAirdropsConfiguration(allPools);

  pools.set(allPools);
  console.log("Pools initialized: ", allPools);
}
