import {ethers} from "ethers";
import {getRpcUrlByChainId} from "./web3";
import * as VeAllocateABI from "./abis/veAllocateABI";
const veAllocateABI = VeAllocateABI.default

export const getAllAllocationsForAddress = async(userAddress) => {
    let res;
    try {
      res = await fetch(`${process.env.BACKEND_API}/stakes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "query":{
            "LP_addr": userAddress.toLowerCase()
          }
        }),
      });
    } catch (error) {
      console.log(error);
      return [];
    }
    let data = await res.json();
    return data;
  }

export const getAllocatedAmountForAddress = async(stakes,poolAddress) => {
  let pool;
  pool = stakes.find((poolStake) =>poolStake.pool_addr === poolAddress)
    return pool ? pool.stake_amt * 2 : 0;
}

export const allocateVeOcean = async(amount, dataAddress, chainId, signer) => {
  try {
    const contract = new ethers.Contract(process.env.VE_ALLOCATE_CONTRACT, veAllocateABI, signer);
    console.log(contract)
    const amountToLockInEth = ethers.utils.parseEther(amount.toString())
    await contract.setAllocation(amountToLockInEth, dataAddress, chainId)
} catch (error) {
  console.log(error)
  throw error;
}
}

export const getAllocatedVeOcean = async(userAddress, dataAddress, chainId) => {
  const rpcURL = await getRpcUrlByChainId(process.env.VE_OCEAN_CHAINID);
  try {
    console.log(rpcURL, userAddress, dataAddress, chainId)
    console.log(process.env.VE_ALLOCATE_CONTRACT)
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const contract = new ethers.Contract(process.env.VE_ALLOCATE_CONTRACT, veAllocateABI, provider);
    console.log(contract)
    const allocatedAmount = await contract.getveAllocation(userAddress, dataAddress, chainId)
    const allocatedAmountFormatted = ethers.utils.formatUnits(allocatedAmount)
    return allocatedAmountFormatted
} catch (error) {
  console.log(error)
  throw error;
}
}

export const calculatePoolShares = async(TVL, stakedAmount) => {
    return (100 * stakedAmount) / TVL
}