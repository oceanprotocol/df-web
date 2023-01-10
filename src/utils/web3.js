import { fetchSigner, getContract } from "@wagmi/core";
import { ethers, BigNumber } from "ethers";
import * as networksDataArray from "../networks-metadata.json";
import { getAddressByChainIdKey } from "./address/address";

let networksList = networksDataArray.default;
export const GASLIMIT_DEFAULT = 1000000;

export const getGasFeeMultiplier = (chainId) => {
  const gasFeeMultiplier = {
    1: 1.05,
    3: 1,
    4: 1,
    56: 1.05,
    246: 1.05,
    1285: 1.05
  }
  return gasFeeMultiplier.indexOf(chainId) >= 0 ? gasFeeMultiplier[chainId] : 1;
}

export const getNetworkDataById = (data,networkId) => {
  if (!networkId) return
  const networkData = data.filter(
      (chain) => chain.chainId === parseInt(networkId)
  )
  return networkData[0]
}

export const getRpcUrlByChainId = async(chainId) => {
  const networkNode = await networksList.find(
    (data) => data.chainId === parseInt(chainId)
  )
  return networkNode.rpc[0].includes("infura") ? `${networkNode.rpc[0]}${import.meta.env.VITE_INFURA_KEY}` : networkNode.rpc[0]
}

export const getJsonRpcProvider = async (chainId) => {
  try {
    const rpc = await getRpcUrlByChainId(chainId);
    if (rpc) {
      return new ethers.providers.JsonRpcProvider(rpc);
    }
    return null;
  } catch(err) {
    console.log(err);
  }
}

export const signMessage = async (msg, signer) => {
  const signedMessage = await signer.signMessage(msg);
  return signedMessage;
};

export const getGasFeeEstimate = async(contractAddress, abi, functionName, params) => {
  let signer = await fetchSigner()
  const contract = getContract({address: contractAddress, abi: abi, signerOrProvider:signer})
  const gas = await contract.estimateGas[functionName](...params)
  return BigInt(gas) + BigInt(10000)
}
