import { ethers, BigNumber } from "ethers";
import * as networksDataArray from "../networks-metadata.json";

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

export const getFairGasPrice = async (chainId) => {
  const x = await ethers.getGasPrice();
  console.log("ethers getGasPrice: ", x);
  const gasFeeMultiplier = getGasFeeMultiplier(chainId);
  return x
      .multipliedBy(gasFeeMultiplier)
      .integerValue(BigNumber.ROUND_DOWN)
      .toString(10);
}

export const getNetworkDataById = (data,networkId) => {
  if (!networkId) return
  const networkData = data.filter(
      (chain) => chain.chainId === networkId
  )
  return networkData[0]
}

export const getRpcUrlByChainId = async(chainId) => {
  const networkNode = await networksList.find(
    (data) => data.chainId === parseInt(chainId)
  )
  return networkNode.chain==="ETH" ? `${networkNode.rpc[0]}${process.env.INFURA_KEY}` : networkNode.rpc[0]
}

export const getJsonRpcProvider = async (chainId) => {
  try {
    const rpcURL = await getRpcUrlByChainId(chainId);
    if (rpcURL) {
      return new ethers.providers.InfuraProvider(rpcURL);
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
