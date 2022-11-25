import * as VeAllocateABI from "./abis/veAllocateABI.js";
import * as VeOceanABI from "./abis/veOceanABI.js";
import {get} from "svelte/store"
import {ethers} from "ethers";
import {networkSigner, web3Provider} from "../stores/web3.js";
import {getAddressByChainIdKey} from "../utils/address/address.js";
import moment from "moment";
import { getJsonRpcProvider } from "./web3.js";

const veAllocateABI = VeAllocateABI.default
const veOceanABI = VeOceanABI.default
const decimals = 18;

export const getAllocatedAmount = async(userAddress) => {
    try {
        const contract = new ethers.Contract(
          getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veAllocate"), 
          veAllocateABI, 
          get(networkSigner)
        );
        const allocatedAmountInEth = await contract.getTotalAllocation(userAddress)
        const allocatedAmount = ethers.utils.parseUnits(allocatedAmountInEth, decimals)
        return allocatedAmount
    } catch (error) {
      console.log(error?.error?.error ? error?.error?.error.message : error);
      return 0;
    }
  }

export const getVeOceanBalance = async(userAddress, provider) => {
    try {
        const contract = new ethers.Contract(
          getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"), 
          veOceanABI, 
          provider
        );
        const veOceanBalanceInEth = await contract.balanceOf(userAddress)
        const veOceanBalance = ethers.utils.formatEther(BigInt(veOceanBalanceInEth).toString(10))
        return veOceanBalance
    } catch (error) {
      console.log(error?.error?.error ? error?.error?.error.message : error);
      return 0;
    }
  }

  export const getLockedOceanAmount = async(userAddress, signer) => {
    try {
        const contract = new ethers.Contract(
          getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"), 
          veOceanABI, 
          signer
        );
        const lock = await contract.locked(userAddress)
        const lockAmount = ethers.utils.formatEther(BigInt(lock.amount).toString(10))
        return lockAmount
    } catch (error) {
      console.log(error?.error?.error ? error?.error?.error.message : error);
      return 0;
    }
  }

  export const getLockedEndTime = async(userAddress, signer) => {
    try {
        const contract = new ethers.Contract(
          getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"), 
          veOceanABI, 
          signer
        );
        const lockEndTime = await contract.locked__end(userAddress)
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
          getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"), 
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
          getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"), 
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
          getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"), 
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
          getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"), 
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
      const contract = new ethers.Contract(getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"), veOceanABI, provider);
      const maxUserEpoch = await contract.user_point_epoch(address)
      return parseInt(BigInt(maxUserEpoch));
  } catch (error) {
    throw error;
  }
}

export const getTotalVeSupply = async() => {
  let provider = await getJsonRpcProvider(process.env.VE_SUPPORTED_CHAINID)
  try {
      const contract = new ethers.Contract(getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"), veOceanABI, provider);
      const totalSupply = await contract.totalSupply()
      const totalSupplyEth = parseFloat(ethers.utils.formatEther(totalSupply))
      return totalSupplyEth;
  } catch (error) {
    throw error;
  }
}