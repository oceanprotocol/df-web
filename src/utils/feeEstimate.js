import { ethers } from "ethers";
import * as veFeeEstimateABI from "./abis/veFeeEstimateABI";
import {
  prepareWriteContract,
  readContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { getAddressByChainIdKey } from "../utils/address/address";
import { getGasFeeEstimate } from "./web3";

export const getRewardsFeeEstimate = async (userAddress) => {
  try {
    const estimateClaim = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veFeeEstimate"
      ),
      args: [userAddress],
      abi: veFeeEstimateABI.default,
      functionName: "estimateClaim",
    });
    const estimateClaimFormatted = ethers.utils.formatEther(
      BigInt(estimateClaim).toString(10)
    );
    return estimateClaimFormatted;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function claimVERewards(userAddress) {
  try {
    const gasLimit = await getGasFeeEstimate(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veFeeDistributor"
      ),
      ["function claim(address _addr) returns (uint 256)"],
      "claim",
      [userAddress]
    );
    const { request } = await prepareWriteContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veFeeDistributor"
      ),
      args: [
        delegator,
        receiver,
        10000,
        moment().unix(),
        oceanUnlockDate.unix(),
        id,
      ],
      abi: ["function claim(address _addr) returns (uint 256)"],
      functionName: "claim",
      gas: gasLimit,
    });
    const { hash } = await writeContract(request);
    const resp = await waitForTransaction({ hash });

    console.log("Success claiming rewards, txReceipt here", resp);
  } catch (error) {
    console.log("Error claiming rewards :", error);
    throw error;
  }
}
