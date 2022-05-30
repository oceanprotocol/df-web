import { writable } from "svelte/store";
import { ethers } from "ethers";
import { getJsonRpcProvider } from "./web3";
import * as BPoolABI from "../utils/abis/BPoolABI";
import {pool} from "../components/pools/StakeModal.svelte";
import * as networksDataArray from "../networks-metadata.json";

export let poolContracts = writable({});

// TODO - Store/Access contracts (also destroy/manage objects, i.e. svelte comp destroys)
export async function getPoolContract(chainId, address) {
  const provider = await getJsonRpcProvider(chainId);
  return new ethers.Contract(address, BPoolABI.default, provider);
}

export const getCurrentTokens = async (chainId, poolInfo) => {
  if (!chainId || !poolInfo) return null;
  try {
    const contract = getPoolContract(chainId, poolInfo.poolAddress);
    if( contract ) {
      return contract.getCurrentTokens();
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
      return contract.getFinalTokens();
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
      console.log("amount in:", amountIn);
      return contract.calcPoolOutSingleIn(poolInfo.basetokenAddress, ethers.utils.parseEther(amountIn.toString()));
    }
  } catch (err) {
    console.error(err);
  }
}

export const joinSwapExternAmountIn = async (chainId, poolInfo, amountIn, minPoolAmountOut, signer) => {
  if (!chainId || !poolInfo) return null;
  try {
    const contract = new ethers.Contract(
        poolInfo.poolAddress,
        BPoolABI.default,
        signer
    );

    if( contract ) {
      return contract.joinswapExternAmountIn(ethers.utils.parseEther(amountIn.toString()), ethers.utils.parseEther(minPoolAmountOut.toString()));
    }
  } catch (err) {
    console.error(err);
  }
}
