import {ethers} from "ethers";
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
  console.log(amount, dataAddress, chainId, signer)
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

export const calculatePoolShares = async(TVL, stakedAmount) => {
    return (100 * stakedAmount) / TVL
}