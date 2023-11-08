import { ethers } from "ethers";
import { gql } from "apollo-boost";
import * as VeAllocateABI from "./abis/veAllocateABI";
import { readContract, waitForTransaction } from "@wagmi/core";
import { getAddressByChainIdKey } from "../utils/address/address";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { getGasFeeEstimate } from "./web3";

const veAllocateABI = VeAllocateABI.default;

export const GET_ALLOCATIONS = gql`
  query userAllocations($userAddress: String!) {
    veAllocateUser(id: $userAddress) {
      id
      veAllocation(where: { allocated_gt: 0 }) {
        allocated
        nftAddress
        chainId
      }
    }
  }
`;

export const getAllAllocationsForAddress = async (userAddress) => {
  let res;
  try {
    res = await fetch(`${import.meta.env.VITE_BACKEND_API}/allocations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          LP_addr: userAddress.toLowerCase(),
        },
      }),
    });
  } catch (error) {
    console.log(error);
    return [];
  }
  let data = await res.json();
  return data;
};

export const allocateVeOcean = async (amount, dataAddress, chainId, signer) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(chainId, "veAllocate"),
      veAllocateABI,
      signer
    );
    const tx = await contract.setAllocation(amount * 100, dataAddress, chainId);
    await tx.wait();
  } catch (error) {
    throw error;
  }
};

export const allocateVeOceanToMultipleNFTs = async (
  amounts,
  dataAddresses,
  chainIds
) => {
  if (!amounts?.length > 0) {
    throw { message: "There are no allocations set or changed. Make sure there are changes inside the 'My Allocation' column." };
  }
  //convert amounts from 100 to 10000 units
  const formatedAmounts = amounts.map((amount) => amount * 100);
  try {
    const gasLimit = await getGasFeeEstimate(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veAllocate"
      ),
      veAllocateABI,
      "setBatchAllocation",
      [formatedAmounts, dataAddresses, chainIds]
    );
    const { request } = await prepareWriteContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veAllocate"
      ),
      args: [formatedAmounts, dataAddresses, chainIds],
      abi: veAllocateABI,
      functionName: "setBatchAllocation",
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

export const getAllocatedVeOcean = async (
  userAddress,
  dataAddress,
  chainId
) => {
  try {
    const allocatedAmount = await readContract({
      address: getAddressByChainIdKey(chainId, "veAllocate"),
      args: [userAddress, dataAddress, chainId],
      abi: veAllocateABI,
      functionName: "getveAllocation",
    });
    return allocatedAmount / 100;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTotalAllocatedVeOcean = async (userAddress) => {
  try {
    const allocatedAmount = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veAllocate"
      ),
      args: [userAddress],
      abi: veAllocateABI,
      functionName: "getTotalAllocation",
    });
    return BigInt(allocatedAmount).toString(10) / 100;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
