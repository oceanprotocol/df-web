import { ethers, BigNumber } from "ethers";
import * as networksDataArray from "../networks-metadata.json";

export const GASLIMIT_DEFAULT = 1000000;

const Web3 = window ? window.Web3 : null;
const Web3Modal = window ? window.Web3Modal.default : null;
const WalletConnectProvider = window ? window.WalletConnectProvider.default : null;

// TODO - Stop using this and switch to RPCs via networks-metadata
const chainIdRPCs = {
  1 : "https://mainnet.infura.io/v3/4b9c931a4f26483aaf53db3ed884549e",
  3 : "https://ropsten.infura.io/v3/4b9c931a4f26483aaf53db3ed884549e",
  4 : "https://rinkeby.infura.io/v3/4b9c931a4f26483aaf53db3ed884549e",
  56 : "https://bsc-dataseed.binance.org/",
  137 : "https://polygon-rpc.com",
  246 : "https://rpc.energyweb.org",
  1285 : "https://rpc.api.moonriver.moonbeam.network",
  1287 : "https://rpc.api.moonbase.moonbeam.network",
  80001 : "https://matic-mumbai.chainstacklabs.com",
}

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // Mikko's test key - don't copy as your mileage may vary
      infuraId: "4b9c931a4f26483aaf53db3ed884549e",
    },
  }
};

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions, // required
  disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
});

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

export const getRpcUrlByChainId = (chainId) => {
  return chainIdRPCs[chainId]
}

export const getJsonRpcProvider = (chainId) => {
  try {
    const rpcURL = getRpcUrlByChainId(chainId);
    if (rpcURL) {
      return new ethers.providers.JsonRpcProvider(rpcURL);
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
