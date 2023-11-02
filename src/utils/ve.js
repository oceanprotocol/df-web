import * as VeOceanABI from "./abis/veOceanABI.js";
import * as TokenABI from "./abis/tokenABI";
import { ethers, Contract } from "ethers";
import { getAddressByChainIdKey } from "../utils/address/address.js";
import {
  readContract,
  writeContract,
  prepareWriteContract,
  waitForTransaction,
} from "@wagmi/core";
import { getGasFeeEstimate, getRpcUrlByChainId } from "./web3.js";

const veOceanABI = VeOceanABI.default;

export const getVeOceanBalance = async (userAddress) => {
  try {
    const veOceanBalanceInEth = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      args: [userAddress],
      abi: veOceanABI,
      functionName: "balanceOf",
    });

    const veOceanBalance = ethers.utils.formatEther(
      BigInt(veOceanBalanceInEth).toString(10)
    );
    return veOceanBalance;
  } catch (error) {
    console.log(error?.error?.error ? error?.error?.error.message : error);
    return 0;
  }
};

export const getLockedOceanAmount = async (userAddress) => {
  try {
    const lock = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      args: [userAddress],
      abi: veOceanABI,
      functionName: "locked",
    });
    const lockAmount = ethers.utils.formatEther(
      BigInt(lock.amount).toString(10)
    );
    return lockAmount;
  } catch (error) {
    console.log(error?.error?.error ? error?.error?.error.message : error);
    return 0;
  }
};

export const getLockedEndTime = async (userAddress) => {
  try {
    const lockEndTime = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      args: [userAddress],
      abi: veOceanABI,
      functionName: "locked__end",
    });
    const lockEndTimeFormated =
      parseInt(BigInt(lockEndTime).toString(10)) * 1000;
    return lockEndTimeFormated > 0 ? lockEndTimeFormated : undefined;
  } catch (error) {
    console.log(error?.error?.error ? error?.error?.error.message : error);
    return undefined;
  }
};

export const lockOcean = async (amount, unlockDate) => {
  try {
    const amountToLockInEth = ethers.utils
      .parseEther(amount.toString())
      .toString();
    const gasLimit = await getGasFeeEstimate(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      veOceanABI,
      "create_lock",
      [amountToLockInEth, unlockDate]
    );
    const { request } = await prepareWriteContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      args: [amountToLockInEth, unlockDate],
      abi: veOceanABI,
      functionName: "create_lock",
      overrides: {
        gasLimit: gasLimit,
      },
    });
    const { hash } = await writeContract(request);
    const resp = await waitForTransaction({ hash });
  } catch (error) {
    throw error;
  }
};

export const withdrawOcean = async () => {
  try {
    const gasLimit = await getGasFeeEstimate(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      veOceanABI,
      "withdraw",
      []
    );
    const { request } = await prepareWriteContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      abi: veOceanABI,
      functionName: "withdraw",
      overrides: {
        gasLimit: gasLimit,
      },
    });
    const { hash } = await writeContract(request);
    const resp = await waitForTransaction({ hash });
  } catch (error) {
    throw error;
  }
};

export const updateLockedOceanAmount = async (amount) => {
  try {
    const amountToLockInEth = ethers.utils
      .parseEther(amount.toString())
      .toString();
    const gasLimit = await getGasFeeEstimate(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      veOceanABI,
      "increase_amount",
      [amountToLockInEth]
    );
    const { request } = await prepareWriteContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      args: [amountToLockInEth],
      abi: veOceanABI,
      functionName: "increase_amount",
      overrides: {
        gasLimit: gasLimit,
      },
    });
    const { hash } = await writeContract(request);
    const resp = await waitForTransaction({ hash });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateLockPeriod = async (unlockDate) => {
  try {
    const gasLimit = await getGasFeeEstimate(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      veOceanABI,
      "increase_unlock_time",
      [unlockDate]
    );
    console.log(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      )
    );
    const { request } = await prepareWriteContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      args: [unlockDate],
      abi: veOceanABI,
      functionName: "increase_unlock_time",
      overrides: {
        gasLimit: gasLimit,
      },
    });
    const { hash } = await writeContract(request);
    const resp = await waitForTransaction({ hash });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMaxUserEpoch = async (address) => {
  try {
    const maxUserEpoch = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      args: [address],
      abi: veOceanABI,
      functionName: "user_point_epoch",
    });
    return parseInt(BigInt(maxUserEpoch));
  } catch (error) {
    throw error;
  }
};

export const getTotalVeSupply = async () => {
  try {
    const totalSupply = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veOCEAN"
      ),
      abi: veOceanABI,
      functionName: "totalSupply",
    });
    const totalSupplyEth = parseFloat(ethers.utils.formatEther(totalSupply));
    return totalSupplyEth;
  } catch (error) {
    throw error;
  }
};

export const getTotalOceanSupply = async () => {
  const data = await readContract({
    address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "Ocean"),
    args: [getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN")],
    abi: TokenABI.default,
    functionName: "balanceOf",
  });
  
  const totalSupplyEth = parseFloat(ethers.utils.formatEther(data));
  return totalSupplyEth;
};
