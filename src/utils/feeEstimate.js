import {ethers} from "ethers";
import * as VeFeeEstimateABI from "./abis/veFeeEstimateABI";

const veFeeEstimateABI = VeFeeEstimateABI.default

export const getRewardsFeeEstimate = async(userAddress, provider) => {
    try {
      const contract = new ethers.Contract(process.env.VE_FEE_ESTIMATE_CONTRACT, veFeeEstimateABI, provider);
      const estimateClaim = await contract.estimateClaim(userAddress)
      const estimateClaimFormatted = ethers.utils.formatEther(BigInt(estimateClaim).toString(10))
      return estimateClaimFormatted
  } catch (error) {
    console.log(error)
    throw error;
  }
}