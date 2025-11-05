import { ethers } from "ethers";
import * as feeDistributorABI from "./abis/feeDistributorABI";
import { getAddressByChainIdKey } from "../utils/address/address";
import {
  prepareWriteContract,
  readContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { getGasFeeEstimate } from "./web3";
import { account } from "../stores/web3";
import { get } from "svelte/store";

export const getTimeCursor = async (userAddress) => {
  try {
    const weekCursor = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veFeeDistributor"
      ),
      args: [userAddress],
      abi: feeDistributorABI.default,
      functionName: "time_cursor_of",
    });
    return parseInt(BigInt(weekCursor));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserEpoch = async (userAddress, provider) => {
  try {
    const userEpoch = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veFeeDistributor"
      ),
      args: [userAddress],
      abi: feeDistributorABI.default,
      functionName: "user_epoch_of",
    });
    return parseInt(BigInt(userEpoch));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getLastTokenTime = async () => {
  try {
    const lastTokenTime = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veFeeDistributor"
      ),
      args: [],
      abi: feeDistributorABI.default,
      functionName: "last_token_time",
    });
    return parseInt(BigInt(lastTokenTime));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function claim(userAddress) {
  try {
    const contractAddress = getAddressByChainIdKey(
      import.meta.env.VITE_VE_SUPPORTED_CHAINID,
      "veFeeDistributor"
    );

    if (!contractAddress) {
      throw new Error(
        "Fee distributor address not found for the current chain"
      );
    }

    // ABI function is overriden, specify which fn to use to avoid crashing
    const gasLimit = await getGasFeeEstimate(
      contractAddress,
      feeDistributorABI.default,
      "claim",
      [userAddress]
    );

    // Check if wagmi has an active connector
    try {
      const currentAccount = get(account);
      if (currentAccount && currentAccount.connector) {
        // Use wagmi if connector is available
        const { request } = await prepareWriteContract({
          address: contractAddress,
          args: [userAddress],
          abi: feeDistributorABI.default,
          functionName: "claim",
          overrides: {
            gasLimit: gasLimit,
          },
        });
        const { hash } = await writeContract(request);
        const resp = await waitForTransaction({ hash });
        console.log("Success claiming rewards, txReceipt here", resp);
        return resp;
      }
    } catch (wagmiError) {
      console.warn(
        "Wagmi contract write failed, falling back to ethers:",
        wagmiError
      );
    }
  } catch (error) {
    console.log("Error claiming rewards :", error);
    throw error;
  }
}
