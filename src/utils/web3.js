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
  // Use wagmi client for gas estimation
  const { getAccount, getWalletClient, getContract } = await import(
    "@wagmi/core"
  );
  const account = getAccount();

  if (!account.connector) {
    throw new Error("No active wallet connector. Please connect your wallet.");
  }

  const client = await getWalletClient();
  if (!client) {
    throw new Error(
      "Unable to get wallet client. Please ensure your wallet is connected."
    );
  }

  const contract = getContract({
    address: contractAddress,
    abi: abi,
    walletClient: client,
  });

  const gas = await contract.estimateGas[functionName](params);
  return BigInt(gas) + BigInt(10000);
};
