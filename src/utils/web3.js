import { getWalletClient, getContract } from "@wagmi/core";
import { ethers } from "ethers";
import * as networksDataArray from "../networks-metadata.json";

let networksList = networksDataArray.default;
export const GASLIMIT_DEFAULT = 1000000;

export const getNetworkDataById = (data, networkId) => {
  if (!networkId) return;
  const networkData = data.filter(
    (chain) => chain.chainId === parseInt(networkId)
  );
  return networkData[0];
};

export const getRpcUrlByChainId = async (chainId) => {
  const networkNode = await networksList.find(
    (data) => data.chainId === parseInt(chainId)
  );
  return networkNode.rpc[0].includes("infura")
    ? `${networkNode.rpc[0]}${import.meta.env.VITE_INFURA_KEY}`
    : networkNode.rpc[0];
};

export const getJsonRpcProvider = async (chainId) => {
  try {
    const rpc = await getRpcUrlByChainId(chainId);
    if (rpc) {
      return new ethers.providers.JsonRpcProvider(rpc);
    }
    return null;
  } catch (err) {
    console.log(err);
  }
};

export const signMessage = async (msg, signer) => {
  const signedMessage = await signer.signMessage(msg);
  return signedMessage;
};

export const getGasFeeEstimate = async (
  contractAddress,
  abi,
  functionName,
  params
) => {
  try {
    // Try to use wagmi client if available
    let client = await getWalletClient();
    if (client) {
      const contract = getContract({
        address: contractAddress,
        abi: abi,
        walletClient: client,
      });
      const gas = await contract.estimateGas[functionName](params);
      return BigInt(gas) + BigInt(10000);
    }
  } catch (error) {
    console.warn("Wagmi gas estimation failed, falling back to ethers:", error);
  }
  
  // Fallback: Use ethers.js directly for injected wallets
  if (window.ethereum) {
    const { ethers } = await import("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    try {
      // Try direct access to estimateGas function
      const estimateGasFunc = contract.estimateGas[functionName];
      if (estimateGasFunc && typeof estimateGasFunc === 'function') {
        const gas = await estimateGasFunc(...params);
        return BigInt(gas) + BigInt(10000);
      }
      
      // Fallback: use the contract's interface to get the function and estimate gas
      // Build transaction data manually
      const contractInterface = new ethers.utils.Interface(abi);
      const functionFragment = contractInterface.getFunction(functionName);
      if (!functionFragment) {
        throw new Error(`Function ${functionName} not found in ABI`);
      }
      
      const data = contractInterface.encodeFunctionData(functionFragment, params);
      const tx = {
        to: contractAddress,
        data: data,
      };
      
      const gas = await provider.estimateGas(tx);
      return BigInt(gas) + BigInt(10000);
    } catch (error) {
      console.warn("Gas estimation failed with ethers, using default:", error);
      return BigInt(GASLIMIT_DEFAULT);
    }
  }
  
  // If no wallet available, return a default gas limit
  return BigInt(GASLIMIT_DEFAULT);
};
