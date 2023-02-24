import { writable } from "svelte/store";
//import {Web3Modal} from "@web3modal/htmlstandalone"
import {Web3Modal} from "@web3modal/standalone"
import { configureChains, createClient} from "@wagmi/core";
import { mainnet,goerli } from "@wagmi/core/chains";
import SignClient from "@walletconnect/sign-client";
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


const signClient = await SignClient.init({
  projectId: import.meta.env.VITE_WALLET_CONNECT_KEY,
  metadata: {
    name: "DF Dapp",
    description: "Ocean Data Farming portal",
    url: "#",
    icons: ["https://walletconnect.com/walletconnect-logo.png"],
  },
});

signClient.on("session_event", ({ event }) => {
  // Handle session events, such as "chainChanged", "accountsChanged", etc.
});

signClient.on("session_update", ({ topic, params }) => {
  const { namespaces } = params;
  const _session = signClient.session.get(topic);
  // Overwrite the `namespaces` of the existing session with the incoming one.
  const updatedSession = { ..._session, namespaces };
  // Integrate the updated session state into your dapp state.
  onSessionUpdate(updatedSession);
});

signClient.on("session_delete", () => {
  // Session was deleted -> reset the dapp state, clean up from user session, etc.
});

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

const onSessionConnect = (session) =>{
  console.log(session)
}
/*const web3Modal = new Web3Modal(
  { projectId: import.meta.env.VITE_WALLET_CONNECT_KEY },
  ethereumClient
);*/

const web3Modal = new Web3Modal({
  projectId: import.meta.env.VITE_WALLET_CONNECT_KEY,
  // `standaloneChains` can also be specified when calling `web3Modal.openModal(...)` later on.
  standaloneChains: ["eip155:1"],
});

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
    //web3Modal?.openModal();
    const { uri, approval } = await signClient.connect({
      // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
      requiredNamespaces: {
        eip155: {
          methods: [
            "eth_sendTransaction",
            "eth_signTransaction",
            "eth_sign",
            "personal_sign",
            "eth_signTypedData",
          ],
          chains: ["eip155:1"],
          events: ["chainChanged", "accountsChanged"],
        },
      },
    });
  
    // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
    if (uri) {
      web3Modal.openModal({ uri });
      // Await session approval from the wallet.
      const session = await approval();
      // Handle the returned session (e.g. update UI to "connected" state).
      // * You will need to create this function *
      onSessionConnect(session);
      // Close the QRCode modal in case it was open.
      web3Modal.closeModal();
    }
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
