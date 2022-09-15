import {ethers} from "ethers";
import {get} from "svelte/store";
import * as VeFeeEstimateABI from "./abis/veFeeEstimateABI";
import * as feeDistributorABI from "../utils/abis/feeDistributorABI";
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
      const contract = new ethers.Contract(
          process.env.VE_FEE_DISTRIBUTOR_CONTRACT,
          feeDistributorABI.default,
          signer
      );
      // TODO - Claim call to contract not working. Manual works.
      // TODO - Hook up Claimed event => if claim_epoch < max_epoch then canClaim = true
      const resp = await contract.claim(userAddress,{"gasLimit": gasLimit});
      await resp.wait();
      console.log("Success claiming rewards, txReceipt here", resp);
  }catch (error) {
      console.log("Error claiming rewards :", error);
      throw error;
  }
}