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

export async function claimVERewards(userAddress, signer) {
  try {
    // ABI function is overriden, specify which fn to use to avoid crashing
    const contract = new ethers.Contract(
          process.env.VE_FEE_DISTRIBUTOR_CONTRACT,
          ["function claim(address _addr) returns (uint 256)"],
          get(networkSigner)
      );
      const resp = await contract.claim(userAddress);
      await resp.wait();
      console.log("Success claiming rewards, txReceipt here", resp);
  }catch (error) {
      console.log("Error claiming rewards :", error);
      throw error;
  }
}