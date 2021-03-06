import { writable } from "svelte/store";
import { ethers, BigNumber } from "ethers";
import * as networksDataArray from "../networks-metadata.json";

export let userAddress = writable("");
export let poolContracts = writable("");
export let web3Provider = writable("");
export let networkSigner = writable("");
export let connectedChainId = writable("");
export let web3 = writable("");
export let selectedNetworks = writable(localStorage.getItem("selectedNetworks") ? JSON.parse(localStorage.getItem("selectedNetworks")): []);
export let jsonRPCProvider = writable({});
export let isWalletConnectModalOpen = writable(false)

export const GASLIMIT_DEFAULT = 1000000;

const Web3 = window.Web3;
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

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

// TODO - Replace networkData w/ networksDataArray
export function getNetworkDataById(
    data,
    networkId
) {
  if (!networkId) return
  const networkData = data.filter(
      (chain) => chain.chainId === networkId
  )
  return networkData[0]
}

export async function getJsonRpcProvider(chainId) {
  try {
    const rpcURL = await getRpcUrlByChainId(chainId);
    if (rpcURL) {
      return new ethers.providers.JsonRpcProvider(rpcURL);
    }
    return null;
  } catch(err) {
    console.log(err);
  }
}

export const setValuesAfterConnection = async (instance) => {
  const provider = new ethers.providers.Web3Provider(instance);
  const signer = provider.getSigner();
  networkSigner.set(signer);
  const signerAddress = await signer.getAddress();
  const chainId= (await provider.getNetwork()).chainId;

  connectedChainId.set(chainId)
  userAddress.set(signerAddress);
  web3Provider.set(provider)
  web3.set(new Web3(instance));
};

export const connectWalletFromLocalStorage = async () => {
  const localStorageProvider = JSON.parse(
      localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")
  );
  if (!localStorageProvider) return;
  const instance = await web3Modal.connectTo(localStorageProvider);

  // Subscribe to accounts change
  instance.on("accountsChanged", (accounts) => {
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    userAddress.set(accounts[0])
    networkSigner.set(signer)
  });

  // Subscribe to chainId change
  instance.on("chainChanged", (chainId) => {
    connectedChainId.set(Number(chainId))
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    networkSigner.set(signer)
  });

  // Subscribe to networkId change
  instance.on("disconnect", disconnect);

  setValuesAfterConnection(instance);
};

export const signMessage = async (msg, signer) => {
  const signedMessage = await signer.signMessage(msg);
  return signedMessage;
};

export const connectWalletToSpecificProvider = async (provider) => {
  let instance;
  try {
    instance = await web3Modal.connectTo(provider);
    //provider = new ethers.providers.Web3Provider(window.ethereum)
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  instance.on("accountsChanged", (accounts) => {
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    userAddress.set(accounts[0])
    networkSigner.set(signer)
  });

  // Subscribe to networkId change
  instance.on("chainChanged", (chainId) => {
    connectedChainId.set(parseInt(chainId, 16))
  });

  // Subscribe to networkId change
  instance.on("disconnect", disconnect);

  setValuesAfterConnection(instance);
}

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
  instance.on("accountsChanged", (accounts) => {
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    userAddress.set(accounts[0])
    networkSigner.set(signer)
  });

  // Subscribe to chainChanged change
  instance.on("chainChanged", (chainId) => {
    connectedChainId.set(parseInt(chainId, 16))
  });

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
  networkSigner.set(undefined);
  localStorage.removeItem("walletconnect");
  localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  window.location.href = "/";
};

export const switchWalletNetwork = async(chainId) => {
  let networksList = networksDataArray.default;
  const networkNode = await networksList.find(
    (data) => data.chainId === parseInt(chainId)
  )
  addCustomNetwork(networkNode)
}

export async function addCustomNetwork(
  network
) {
  // Always add explorer URL from ocean.js first, as it's null sometimes
  // in network data
  const blockExplorerUrls = [
    network.explorers && network.explorers[0].url
  ]

  const newNetworkData = {
    chainId: `0x${network.chainId.toString(16)}`,
    chainName: network.name,
    nativeCurrency: network.nativeCurrency,
    rpcUrls: network.rpc,
    blockExplorerUrls
  }
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: newNetworkData.chainId }]
    })
  } catch (switchError) {
    if (switchError.code === 4902) {
      await window.ethereum.request(
        {
          method: 'wallet_addEthereumChain',
          params: [newNetworkData]
        },
        (err, added) => {
          if (err || 'error' in added) {
            console.error(
              `Couldn't add ${network.name} (0x${
                network.chainId
              }) network to MetaMask, error: ${err || added.error}`
            )
          } else {
            console.log(
              `Added ${network.name} (0x${network.chainId}) network to MetaMask`
            )
          }
        }
      )
    } else {
      console.error(
        `Couldn't add ${network.name} (0x${network.chainId}) network to MetaMask, error: ${switchError}`
      )
    }
  }
  console.log(
    `Added ${network.name} (0x${network.chainId}) network to MetaMask`
  )
}

export function getGasFeeMultiplier(chainId) {
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

export async function getFairGasPrice(chainId) {
  const x = await web3.eth.getGasPrice();
  const gasFeeMultiplier = getGasFeeMultiplier(chainId);
  return x
        .multipliedBy(gasFeeMultiplier)
        .integerValue(BigNumber.ROUND_DOWN)
        .toString(10);
}
