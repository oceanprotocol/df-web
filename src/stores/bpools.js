import { writable } from "svelte/store";
import { ethers } from "ethers";
import { getJsonRpcProvider } from "./web3";
import * as BPoolABI from "../utils/abis/BPoolABI";
import {pool} from "../components/pools/StakeModal.svelte";

export let poolContracts = writable({});

// v.svelteStore...
// it's becoming redundant to pass in the data in order to update it... but.... maybe that's the pattern?
// export async function getPoolContract(chainId, address) {
//   const provider = getRPCProvider(chainId);
//   if( poolContracts[chainId] === undefined ) {
//     poolContracts[chainId] = {};
//   }
//
//   if( poolContracts[chainId][address] === undefined ) {
//     poolContracts[chainId][address] = new ethers.Contract(address, BPoolABI.default, provider);
//     poolContracts.set(poolContracts);
//   }
//   return poolContracts[chainId][address];
// }

export async function getPoolContract(chainId, address) {
  const provider = await getJsonRpcProvider(chainId);
  return new ethers.Contract(address, BPoolABI.default, provider);
}

export const getCurrentTokens = async (chainId, poolInfo) => {
  if (!chainId || !poolInfo) return null;
  try {
    const contract = getPoolContract(chainId, poolInfo.poolAddress);
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
    const contract = getPoolContract(chainId, poolInfo.poolAddress);
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
    const contract = await getPoolContract(chainId, poolInfo.poolAddress);
    if( contract ) {
      const poolOut = await contract.calcPoolOutSingleIn(poolInfo.basetokenAddress, ethers.utils.parseEther(amountIn));

      console.log("Total BPT out from singleIn : ", poolOut);
      return poolOut;
    }
  } catch (err) {
    console.error(err);
  }
}
