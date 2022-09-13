import {ethers} from "ethers";
import {getRpcUrlByChainId} from "./web3";
import * as VeFeeEstimateABI from "./abis/veFeeEstimateABI";

const veFeeEstimateABI = VeFeeEstimateABI.default

export const getRewardsFeeEstimate = async(userAddress) => {
    const rpcURL = await getRpcUrlByChainId(process.env.VE_SUPPORTED_CHAINID);
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcURL);
      const contract = new ethers.Contract(process.env.VE_FEE_ESTIMATE_CONTRACT, veFeeEstimateABI, provider);
      const estimateClaim = await contract.estimateClaim(userAddress)
      const estimateClaimFormatted = ethers.utils.formatEther(BigInt(estimateClaim).toString(10))
      return estimateClaimFormatted
  } catch (error) {
    console.log(error)
    throw error;
  }
}