import { writable } from "svelte/store";
import {Web3Modal} from "@web3modal/html"
import { configureChains, createClient} from "@wagmi/core";
import { mainnet,goerli } from "@wagmi/core/chains";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider
} from "@web3modal/ethereum";

export let userAddress = writable("");
export let poolContracts = writable("");
export let connectedChainId = writable(null);
export let selectedNetworks = writable(localStorage?.getItem("selectedNetworks") ? JSON.parse(localStorage?.getItem("selectedNetworks")): []);
export let jsonRPCProvider = writable({});
export let isWalletConnectModalOpen = writable(false)

export const GASLIMIT_DEFAULT = 1000000;

const chains = [mainnet,goerli];

// Wagmi Core Client
const { provider } = configureChains(chains, [walletConnectProvider({ projectId: import.meta.env.VITE_WALLET_CONNECT_KEY })]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({appName:'DF-WEB', chains, projectId:import.meta.env.VITE_WALLET_CONNECT_KEY, version:'2'}),
  provider
});

// Web3Modal and Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);
ethereumClient.watchAccount((data) =>{
  if(data.address){
    userAddress.set(data.address)
  }
})
ethereumClient.watchNetwork((network) => {
  connectedChainId.set(network?.chain?.id)
})

const web3Modal = new Web3Modal(
  { projectId: import.meta.env.VITE_WALLET_CONNECT_KEY },
  ethereumClient
);

web3Modal.setTheme({
  themeMode: "light"
})

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

export const signMessage = async (msg, signer) => {
  const signedMessage = await signer.signMessage(msg);
  return signedMessage;
};

export const connectWallet = async () => {
  try {
    web3Modal?.openModal();
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
};

export const disconnect = async () => {
  ethereumClient.disconnect()
  userAddress.set(undefined);
  localStorage?.removeItem("walletconnect");
  localStorage?.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  window.location.href = "/";
};

export const switchWalletNetwork = async(chainId) => {
  let resp = await ethereumClient.switchNetwork({'chainId': chainId})
  connectedChainId.set(resp.id.toString())
}
