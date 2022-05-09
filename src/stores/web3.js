import { writable } from "svelte/store";
import { ethers } from "ethers";

export let userAddress = writable("");
export let networkProvider = writable("");
export let networkSigner = writable("");
export let nodeProvider = writable("");
export let web3 = writable("");
export let selectedNetworks = writable([1]);

const Web3 = window.Web3;
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

require("dotenv").config();
const networks = [
  {
    address: OCEAN_ERC20_0x,
    provider: process.env.ETH_RPC_URL || "https://cloudflare-eth.com/",
  },
  {
    address: OCEAN_Polygon_0x,
    provider: process.env.POLYGON_RPC_URL || `https://polygon-rpc.com`,
  },
  {
    address: OCEAN_BSC_0x,
    provider: process.env.BSC_RPC_URL || `https://bsc-dataseed.binance.org/`,
  },
];

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // Mikko's test key - don't copy as your mileage may vary
      infuraId: "4b9c931a4f26483aaf53db3ed884549e",
    },
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions, // required
  disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
});

export const setValuesAfterConnection = async (instance) => {
  const provider = new ethers.providers.Web3Provider(instance);
  const signer = provider.getSigner();
  networkProvider.set(provider);
  networkSigner.set(signer);
  const signerAddress = await signer.getAddress();
  console.log(instance)
  userAddress.set(signerAddress);
  web3.set(new Web3(instance));
};

export const connectWalletFromLocalStorage = async () => {
  const localStorageProvider = JSON.parse(
      localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")
  );
  if (!localStorageProvider) return;
  const instance = await web3Modal.connectTo(localStorageProvider);

  // Subscribe to accounts change
  /*instance.on("accountsChanged", (accounts) => {});

  // Subscribe to chainId change
  instance.on("chainChanged", (chainId) => {});

  // Subscribe to networkId change
  instance.on("networkChanged", (networkId) => {});*/

  // Subscribe to networkId change
  instance.on("disconnect", disconnect);

  setValuesAfterConnection(instance);
};

export const signMessage = async (msg, signer) => {
  const signedMessage = await signer.signMessage(msg);
  return signedMessage;
};

export const connectWallet = async () => {
  let instance;
  try {
    instance = await web3Modal.connect();
    //provider = new ethers.providers.Web3Provider(window.ethereum)
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  /*instance.on("accountsChanged", (accounts) => {});

  // Subscribe to chainId change
  instance.on("chainChanged", (chainId) => {});

  // Subscribe to networkId change
  instance.on("networkChanged", (networkId) => {});*/

  // Subscribe to networkId change
  instance.on("disconnect", disconnect);

  setValuesAfterConnection(instance);
};

export const disconnect = async () => {
  await web3Modal.clearCachedProvider();
  if (web3 && web3.currentProvider && web3.currentProvider.close) {
    await web3.currentProvider.close();
  }
  userAddress.set(undefined);
  networkProvider.set(undefined);
  networkSigner.set(undefined);
  localStorage.removeItem("walletconnect");
  localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  window.location.href = "/";
};

