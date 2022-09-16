import {ethers} from "ethers";
import {getRpcUrlByChainId} from "./web3";
import { gql } from "apollo-boost";
import * as VeAllocateABI from "./abis/veAllocateABI";
const veAllocateABI = VeAllocateABI.default

export const GET_ALLOCATIONS = gql`
query userAllocations($userAddress: String!) {
  veAllocateUser(
    id: $userAddress
  ) {
    id
    veAllocation(where: {allocated_gt: 0}) {
      allocated
    	nftAddress
    	chainId
    }
  }
}
`;

export const getAllAllocationsForAddress = async(userAddress) => {
    let res;
    try {
      res = await fetch(`${process.env.BACKEND_API}/allocations`, {
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

export const allocateVeOcean = async(amount, dataAddress, chainId, signer) => {
  try {
    const contract = new ethers.Contract(process.env.VE_ALLOCATE_CONTRACT, veAllocateABI, signer);
    const tx = await contract.setAllocation((amount* 100), dataAddress, chainId)
    await tx.wait()
} catch (error) {
  throw error;
}
}

export const allocateVeOceanToMultipleNFTs = async(amounts, dataAddresses, chainIds, signer) => {
  if(!amounts?.length > 0){
    throw {message:'There are no allocations set'}
  }
  //convert amounts from 100 to 10000 units
  const formatedAmounts = amounts.map((amount) => amount * 100)
  try {
    const contract = new ethers.Contract(process.env.VE_ALLOCATE_CONTRACT, veAllocateABI, signer);
    const tx = await contract.setBatchAllocation(formatedAmounts, dataAddresses, chainIds)
    await tx.wait()
} catch (error) {
  throw error;
}
}

export const getAllocatedVeOcean = async(userAddress, dataAddress, chainId) => {
  const rpcURL = await getRpcUrlByChainId(process.env.VE_SUPPORTED_CHAINID);
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const contract = new ethers.Contract(process.env.VE_ALLOCATE_CONTRACT, veAllocateABI, provider);
    const allocatedAmount = await contract.getveAllocation(userAddress, dataAddress, chainId)
    return allocatedAmount / 100
} catch (error) {
  console.log(error)
  throw error;
}
}

export const getTotalAllocatedVeOcean = async(userAddress) => {
  const rpcURL = await getRpcUrlByChainId(process.env.VE_SUPPORTED_CHAINID);
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const contract = new ethers.Contract(process.env.VE_ALLOCATE_CONTRACT, veAllocateABI, provider);
    const allocatedAmount = await contract.getTotalAllocation(userAddress)
    return allocatedAmount / 100
} catch (error) {
  console.log(error)
  throw error;
}
}