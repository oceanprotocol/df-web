import {ethers} from "ethers";
import {get} from "svelte/store";
import * as VeFeeEstimateABI from "./abis/veFeeEstimateABI";
import { networkSigner } from "../stores/web3";

const veFeeEstimateABI = VeFeeEstimateABI.default

export const getRewardsFeeEstimate = async(userAddress) => {
    try {
      const contract = new ethers.Contract(process.env.VE_FEE_ESTIMATE_CONTRACT, veFeeEstimateABI, get(networkSigner));
      const estimateClaim = await contract.estimateClaim(userAddress)
      const estimateClaimFormatted = ethers.utils.formatEther(BigInt(estimateClaim).toString(10))
      return estimateClaimFormatted
  } catch (error) {
    console.log(error)
    throw error;
  }
}