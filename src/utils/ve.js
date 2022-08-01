import * as VeAllocateABI from "./abis/veAllocateABI";
import * as VeOceanABI from "./abis/veOceanABI";
import {getRpcUrlByChainId} from "./web3";
import {ethers} from "ethers";
const veAllocateABI = VeAllocateABI.default
const veOceanABI = VeOceanABI.default
const decimals = 18;

export const allocateOcean=()=>{

}

export const getAllocatedAmount = async(userAddress) => {
    const rpcURL = await getRpcUrlByChainId(process.env.VE_OCEAN_CHAINID);
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
    const rpcURL = await getRpcUrlByChainId(process.env.VE_OCEAN_CHAINID);
    console.log(rpcURL)
    try {
        console.log(process.env.VE_OCEAN_CONTRACT)
        const provider = new ethers.providers.JsonRpcProvider(rpcURL);
        const contract = new ethers.Contract(process.env.VE_OCEAN_CONTRACT, veOceanABI, provider);
        const timestamp = await provider.getBlockNumber()
        console.log(contract)
        //const timestampInUnit256 = ethers.utils.parseEther(timestamp.toString())
        //const veOceanBalanceInEth = await contract.balanceOf(userAddress,'11062967000000000000000000')
        const veOceanBalanceInEth = await contract.locked(userAddress)
        console.log(veOceanBalanceInEth)
        const veOceanBalance = ethers.utils.formatEther(BigInt(veOceanBalanceInEth.amount).toString(10))
        return veOceanBalance
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  export const getLockedOceanAmount = async(userAddress) => {
    const rpcURL = await getRpcUrlByChainId(process.env.VE_OCEAN_CHAINID);
    console.log(rpcURL)
    try {
        console.log(process.env.VE_OCEAN_CONTRACT)
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

  export const lockOcean = async(userAddress, amount, unlockDate, signer) => {
    const rpcURL = await getRpcUrlByChainId(process.env.VE_OCEAN_CHAINID);
    try {
        console.log(userAddress, amount, unlockDate)
        const contract = new ethers.Contract(process.env.VE_OCEAN_CONTRACT, veOceanABI, signer);
        const amountToLockInEth = ethers.utils.formatUnits(amount)
        const veOceanBalanceInEth = await contract.create_lock(amount, unlockDate)
        const veOceanBalance = ethers.utils.formatEther(BigInt(veOceanBalanceInEth).toString(10))
        return veOceanBalance
    } catch (error) {
      console.log(error);
      return 0;
    }
  }