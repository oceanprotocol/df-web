import * as VeAllocateABI from "./abis/veAllocateABI";
import * as VeOceanABI from "./abis/veOceanABI";
import {getRpcUrlByChainId} from "./web3";
import {ethers} from "ethers";
const veAllocateABI = VeAllocateABI.default
const veOceanABI = VeOceanABI.default
const decimals = 18;
const gasLimit = 1000000;

export const getAllocatedAmount = async(userAddress) => {
    const rpcURL = await getRpcUrlByChainId(process.env.VE_SUPPORTED_CHAINID);
    try {
        const provider = new ethers.providers.JsonRpcProvider(rpcURL);
        const contract = new ethers.Contract(process.env.VE_ALLOCATE_CONTRACT, veAllocateABI, provider);
        const allocatedAmountInEth = await contract.getTotalAllocation(userAddress)
        const allocatedAmount = ethers.utils.parseUnits(allocatedAmountInEth, decimals)
        return allocatedAmount
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

export const getVeOceanBalance = async(userAddress) => {
    const rpcURL = await getRpcUrlByChainId(process.env.VE_SUPPORTED_CHAINID);
    try {
        const provider = new ethers.providers.JsonRpcProvider(rpcURL);
        const contract = new ethers.Contract(process.env.VE_OCEAN_CONTRACT, veOceanABI, provider);
        const veOceanBalanceInEth = await contract.balanceOfAt(userAddress,provider.getBlockNumber())
        const veOceanBalance = ethers.utils.formatEther(BigInt(veOceanBalanceInEth).toString(10))
        return veOceanBalance
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  export const getLockedOceanAmount = async(userAddress) => {
    const rpcURL = await getRpcUrlByChainId(process.env.VE_SUPPORTED_CHAINID);
    try {
        const provider = new ethers.providers.JsonRpcProvider(rpcURL);
        const contract = new ethers.Contract(process.env.VE_OCEAN_CONTRACT, veOceanABI, provider);
        const lock = await contract.locked(userAddress)
        const lockAmount = ethers.utils.formatEther(BigInt(lock.amount).toString(10))
        return lockAmount
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  export const getLockedEndTime = async(userAddress) => {
    const rpcURL = await getRpcUrlByChainId(process.env.VE_SUPPORTED_CHAINID);
    try {
        const provider = new ethers.providers.JsonRpcProvider(rpcURL);
        const contract = new ethers.Contract(process.env.VE_OCEAN_CONTRACT, veOceanABI, provider);
        const lockEndTime = await contract.locked__end(userAddress)
        const lockEndTimeFormated = parseInt(BigInt(lockEndTime).toString(10))*1000
        return lockEndTimeFormated > 0 ? lockEndTimeFormated : undefined
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  export const lockOcean = async(amount, unlockDate, signer) => {
    try {
        const contract = new ethers.Contract(process.env.VE_OCEAN_CONTRACT, veOceanABI, signer);
        const amountToLockInEth = ethers.utils.parseEther(amount.toString()).toString()
        const tx = await contract.create_lock(amountToLockInEth, unlockDate,{
          gasLimit: gasLimit
      })
        const receipt = await tx.wait()
    } catch (error) {
      throw error;
    }
  }

  export const withdrawOcean = async(signer) => {
    try {
        const contract = new ethers.Contract(process.env.VE_OCEAN_CONTRACT, veOceanABI, signer);
        const tx = await contract.withdraw()
        await tx.wait()
    } catch (error) {
      throw error;
    }
  }

  export const updateLockedOceanAmount = async(amount, signer) => {
    try {
        const contract = new ethers.Contract(process.env.VE_OCEAN_CONTRACT, veOceanABI, signer);
        const amountToLockInEth = ethers.utils.parseEther(amount.toString()).toString()
        const tx = await contract.increase_amount(amountToLockInEth,{
          gasLimit: gasLimit
      })
        await tx.wait()
    } catch (error) {
      throw error;
    }
  }

  export const updateLockPeriod = async(unlockDate, signer) => {
    try {
        const contract = new ethers.Contract(process.env.VE_OCEAN_CONTRACT, veOceanABI, signer);
        const tx = await contract.increase_unlock_time(unlockDate,{
          gasLimit: gasLimit
      })
        tx.wait()
    } catch (error) {
      throw error;
    }
  }