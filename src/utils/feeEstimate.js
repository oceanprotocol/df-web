import {ethers} from "ethers";
import * as veFeeEstimateABI from "./abis/veFeeEstimateABI";
import {networkSigner} from "../stores/web3";
import {getAddressByChainIdKey} from "../utils/address/address";

export const getRewardsFeeEstimate = async(userAddress, provider) => {
    try {
      const contract = new ethers.Contract(
        getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veFeeEstimate"),
        veFeeEstimateABI.default, 
        provider
      );
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
        getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veFeeDistributor"),
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