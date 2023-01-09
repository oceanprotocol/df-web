import * as VeOceanABI from "./abis/veOceanABI.js";
import * as TokenABI from "./abis/tokenABI";
import {ethers} from "ethers";
import {getAddressByChainIdKey} from "../utils/address/address.js";
import { readContract } from "@wagmi/core";
import { getJsonRpcProvider } from "./web3.js";

const veOceanABI = VeOceanABI.default

export const getVeOceanBalance = async(userAddress, provider) => {
    try {
      const veOceanBalanceInEth = await readContract({
        address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN"),
        args: [userAddress],
        abi: veOceanABI,
        functionName: 'balanceOf',
      })

        const veOceanBalance = ethers.utils.formatEther(BigInt(veOceanBalanceInEth).toString(10))
        return veOceanBalance
    } catch (error) {
      console.log(error?.error?.error ? error?.error?.error.message : error);
      return 0;
    }
  }

  export const getLockedOceanAmount = async(userAddress, signer) => {
    try {
      const lock = await readContract({
        address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN"),
        args: [userAddress],
        abi: veOceanABI,
        functionName: 'locked',
      })
        const lockAmount = ethers.utils.formatEther(BigInt(lock.amount).toString(10))
        return lockAmount
    } catch (error) {
      console.log(error?.error?.error ? error?.error?.error.message : error);
      return 0;
    }
  }

  export const getLockedEndTime = async(userAddress) => {
    try {
        const lockEndTime = await readContract({
          address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN"),
          args: [userAddress],
          abi: veOceanABI,
          functionName: 'locked__end',
        })
        const lockEndTimeFormated = parseInt(BigInt(lockEndTime).toString(10))*1000
        return lockEndTimeFormated > 0 ? lockEndTimeFormated : undefined
    } catch (error) {
      console.log(error?.error?.error ? error?.error?.error.message : error);
      return undefined;
    }
}

  export const lockOcean = async(amount, unlockDate, signer) => {
    try {
        const contract = new ethers.Contract(
          getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN"), 
          veOceanABI, 
          signer
        );
        const amountToLockInEth = ethers.utils.parseEther(amount.toString()).toString()
        const calcGasLimit = await contract.estimateGas.create_lock(amountToLockInEth, unlockDate)
        const tx = await contract.create_lock(amountToLockInEth, unlockDate, {gasLimit:BigInt(calcGasLimit) + BigInt(10000)})
        const receipt = await tx.wait()
    } catch (error) {
      throw error;
    }
}

  export const withdrawOcean = async(signer) => {
    try {
        const contract = new ethers.Contract(
          getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN"), 
          veOceanABI, 
          signer
        );
        const calcGasLimit = await contract.estimateGas.withdraw()
        const tx = await contract.withdraw({
          gasLimit:BigInt(calcGasLimit) + BigInt(10000)
      })
        await tx.wait()
    } catch (error) {
      throw error;
    }
}

  export const updateLockedOceanAmount = async(amount, signer) => {
    try {
        const contract = new ethers.Contract(
          getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN"), 
          veOceanABI, 
          signer
        );
        const amountToLockInEth = ethers.utils.parseEther(amount.toString()).toString()
        const calcGasLimit = await contract.estimateGas.increase_amount(amountToLockInEth)
        const tx = await contract.increase_amount(amountToLockInEth,{
          gasLimit:BigInt(calcGasLimit) + BigInt(10000)
      })
        await tx.wait()
    } catch (error) {
      throw error;
    }
}

  export const updateLockPeriod = async(unlockDate, signer) => {
    try {
        const contract = new ethers.Contract(
          getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN"), 
          veOceanABI, 
          signer
        );
        const calcGasLimit = await contract.estimateGas.increase_unlock_time(unlockDate)
        const tx = await contract.increase_unlock_time(unlockDate,{
          gasLimit:BigInt(calcGasLimit) + BigInt(10000)
        })
        await tx.wait()
    } catch (error) {
      throw error;
    }
}

export const getMaxUserEpoch = async(address, provider) => {
  try {
      const contract = new ethers.Contract(getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN"), veOceanABI, provider);
      const maxUserEpoch = await contract.user_point_epoch(address)
      return parseInt(BigInt(maxUserEpoch));
  } catch (error) {
    throw error;
  }
}

export const getTotalVeSupply = async() => {
  try {
    const totalSupply = await readContract({
      address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN"),
      abi: veOceanABI,
      functionName: 'totalSupply',
    })
    const totalSupplyEth = parseFloat(ethers.utils.formatEther(totalSupply))
    return totalSupplyEth;
  } catch (error) {
    throw error;
  }
}

export const getTotalOceanSupply = async() => {
  const data = await readContract({
    address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "Ocean"),
    args: [getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "veOCEAN")],
    abi: TokenABI.default,
    functionName: 'balanceOf',
  })
  const totalSupplyEth = parseFloat(ethers.utils.formatEther(data))
  return totalSupplyEth;
}