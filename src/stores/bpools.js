import { writable } from "svelte/store";
import { ethers } from "ethers";
import { getRPCProvider } from "./web3";
import * as BPoolABI from "../utils/abis/BPoolABI";

export let poolContracts = writable({});

export async function getPoolContract(chainId, address) {
  const provider = getRPCProvider(chainId);
  if( poolContracts[chainId] === undefined ) {
    poolContracts[chainId] = {};
  }

  if( poolContracts[chainId][address] === undefined ) {
    poolContracts[chainId][address] = new ethers.Contract(address, BPoolABI.default, provider);
    poolContracts.set(poolContracts);
  }
  return poolContracts[chainId][address];
}

export const getCurrentTokens = async (chainId, poolInfo) => {
  if (!chainId || !poolInfo) return null;
  try {
    const contract = getPoolContract(chainId, poolInfo.pool_adr);
    if( contract ) {
      const currentTokens = await contract.getCurrentTokens();

      console.log("Current tokens are: ", currentTokens);
      return currentTokens;
    }
  } catch (err) {
    console.error(err);
  }
}

export const getFinalTokens = async (chainId, poolInfo) => {
  if (!chainId || !poolInfo) return null;
  try {
    const contract = getPoolContract(chainId, poolInfo.pool_adr);
    if( contract ) {
      const finalTokens = await contract.getFinalTokens();

      console.log("Final tokens are: ", finalTokens);
      return finalTokens;
    }
  } catch (err) {
    console.error(err);
  }
}

export const calcPoolOutSingleIn = async (chainId, poolInfo, amountIn) => {
  if (!chainId || !poolInfo) return null;
  try {
    const contract = getPoolContract(chainId, poolInfo.pool_adr);
    if( contract ) {
      const poolOut = await contract.calcPoolOutSingleIn(poolInfo.tokens, amountIn);

      console.log("Total BPT out from singleIn : ", poolOut);
      return poolOut;
    }
  } catch (err) {
    console.error(err);
  }
}
