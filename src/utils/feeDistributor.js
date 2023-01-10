import {ethers} from "ethers";
import * as feeDistributorABI from "./abis/feeDistributorABI";
import {getAddressByChainIdKey} from "../utils/address/address";
import { prepareWriteContract, readContract, writeContract } from "@wagmi/core";
import { getGasFeeEstimate } from "./web3";

export const getTimeCursor = async(userAddress) => {
  try {
    const weekCursor = await readContract({
      address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veFeeDistributor"),
      args: [userAddress],
      abi: feeDistributorABI.default,
      functionName: 'time_cursor_of',
    })
    return parseInt(BigInt(weekCursor));
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getUserEpoch = async(userAddress, provider) => {
  try {
    const userEpoch = await readContract({
      address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veFeeDistributor"),
      args: [userAddress],
      abi: feeDistributorABI.default,
      functionName: 'user_epoch_of',
    })
    return parseInt(BigInt(userEpoch));
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getLastTokenTime = async() => {
  try {
    const lastTokenTime = await readContract({
      address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veFeeDistributor"),
      args: [],
      abi: feeDistributorABI.default,
      functionName: 'last_token_time',
    })
    return parseInt(BigInt(lastTokenTime));
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function claim(userAddress) {
  try {
    // ABI function is overriden, specify which fn to use to avoid crashing
    const gasLimit = await getGasFeeEstimate(getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veFeeDistributor"),["function claim(address _addr) returns (uint 256)"],'claim',[userAddress])
      const config = await prepareWriteContract({
        address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veFeeDistributor"),
        args: [userAddress],
        abi: ["function claim(address _addr) returns (uint 256)"],
        functionName: 'claim',
        overrides:{
          gasLimit:gasLimit
        }
      })
      const tx = await writeContract(config)
      console.log("Success claiming rewards, txReceipt here", tx);
  }catch (error) {
      console.log("Error claiming rewards :", error);
      throw error;
  }
}