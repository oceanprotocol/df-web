import { writable } from "svelte/store";
import { ethers } from "ethers";
import { getJsonRpcProvider, getFairGasPrice, GASLIMIT_DEFAULT } from "./web3";
import * as BPoolABI from "../utils/abis/BPoolABI";
import {pool} from "../components/pools/StakeModal.svelte";
import * as networksDataArray from "../networks-metadata.json";

export let poolContracts = writable({});

// TODO - Store/Access contracts (also destroy/manage objects, i.e. svelte comp destroys)
export async function getPoolContract(chainId, address) {
  const provider = await getJsonRpcProvider(chainId);
  return new ethers.Contract(address, BPoolABI.default, provider);
}

export const calcPoolOutSingleIn = async (chainId, poolInfo, amountIn) => {
  if (!chainId || !poolInfo) return null;
  try {
    const contract = await getPoolContract(chainId, poolInfo.poolAddress);
    if( contract ) {
      return contract.calcPoolOutSingleIn(poolInfo.basetokenAddress, ethers.utils.parseEther(amountIn.toString()));
    }
  } catch (err) {
    console.error(err);
  }
}

export const joinSwapExternAmountIn = async (chainId, poolInfo, amountIn, minPoolAmountOut, userAddress, signer) => {
  if (!chainId || !poolInfo) return null;
  console.log(chainId, poolInfo, amountIn, minPoolAmountOut, signer)
  try {
    const contract = new ethers.Contract(
        poolInfo.poolAddress,
        BPoolABI.default,
        signer
    );

    if( contract ) {
      const gasLimitDefault = GASLIMIT_DEFAULT;
      let result;
      await contract
        .estimateGas
        .joinswapExternAmountIn(ethers.utils.parseEther(amountIn.toString()), ethers.utils.parseEther(minPoolAmountOut.toString()))
        .then(res => {
          result = res;
      });
      console.log("Estimated gas results is: ", result);
    }

    return contract
        .joinswapExternAmountIn(ethers.utils.parseEther(amountIn.toString()), ethers.utils.parseEther(minPoolAmountOut.toString()))
        .send({
          from: userAddress,
          gas: estGas + 1,
          gasPrice: await getFairGasPrice(chainId)
        });
  } catch (err) {
    console.error(err);
  }
}
