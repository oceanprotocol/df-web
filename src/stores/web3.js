import { writable } from "svelte/store";
import { ethers, BigNumber } from "ethers";
import {Web3Modal} from "@web3modal/html"
import * as networksDataArray from "../networks-metadata.json";
//import WalletConnectProvider from '@walletconnect/web3-provider'
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
export let web3Provider = writable("");
export let networkSigner = writable("");
export let connectedChainId = writable(null);
export let selectedNetworks = writable(localStorage?.getItem("selectedNetworks") ? JSON.parse(localStorage?.getItem("selectedNetworks")): []);
export let jsonRPCProvider = writable({});
export let isWalletConnectModalOpen = writable(false)

export const GASLIMIT_DEFAULT = 1000000;

const chains = [mainnet,goerli];

const signClient = await SignClient.init({
  projectId: import.meta.env.VITE_WALLET_CONNECT_KEY ,
  metadata: {
    name: "web3Modal",
    description: "Example Dapp",
    url: "#",
    icons: ["https://walletconnect.com/walletconnect-logo.png"],
  },
});

// Wagmi Core Client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: import.meta.env.VITE_WALLET_CONNECT_KEY }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal and Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);
ethereumClient.watchAccount((data) =>{
  if(data.address){
    userAddress.set(data.address)
    let web3Provider = new ethers.providers.Web3Provider(wagmiClient.provider)
    web3Provider.s
    console.log(web3Provider.getSigner())
    //web3Provider.set(ethereumClient.wagmi.providers)
    //connectedChainId.set()
  }
})
ethereumClient.watchNetwork((network) => {
  connectedChainId.set(network?.chain?.id)
})
console.log(ethereumClient)
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

export async function getJsonRpcProvider(chainId) {
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

export const setValuesAfterConnection = async (instance) => {
  const provider = new ethers.providers.Web3Provider(instance);
  const signer = provider.getSigner();
  networkSigner.set(signer);
  const signerAddress = await signer.getAddress();
  const chainId= (await provider.getNetwork()).chainId;

  connectedChainId.set(chainId);
  userAddress.set(signerAddress);
  web3Provider.set(provider)
};

export const connectWalletFromLocalStorage = async () => {
  const localStorageProvider = JSON.parse(
      localStorage?.getItem("WEB3_CONNECT_CACHED_PROVIDER")
  );
  if (!localStorageProvider) return;
  const instance = await web3Modal?.connectTo(localStorageProvider);

  // Subscribe to accounts change
  instance.on("accountsChanged", (accounts) => {
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    userAddress.set(accounts[0])
    networkSigner.set(signer)
  });

  // Subscribe to chainId change
  instance.on("chainChanged", (chainId) => {
    connectedChainId.set(Number(chainId))
    web3Provider.set(new ethers.providers.Web3Provider(window.ethereum, 'any'))
    networkSigner.set(provider.getSigner())
    web3Provider.set(provider)
  });

  // Subscribe to networkId change
  instance.on("disconnect", disconnect);

  setValuesAfterConnection(instance);
};

export const signMessage = async (msg, signer) => {
  const signedMessage = await signer.signMessage(msg);
  return signedMessage;
};

export const connectWallet = async () => {
  try {
    const { uri, approval } = await signClient.connect({
      // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
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
    if (uri) {
      //dsc()
      /*const result = await connect({
        chainId: 1,
        connector: new InjectedConnector(),
      })*/
      console.log(uri)
      let resp = await web3Modal?.openModal({ uri });
      //const session = await approval();
      console.log(resp)
      console.log('session')
      //console.log(session)
    }
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
};

export const disconnect = async () => {
  ethereumClient.disconnect()
  userAddress.set(undefined);
  networkSigner.set(undefined);
  localStorage?.removeItem("walletconnect");
  localStorage?.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  window.location.href = "/";
};

export const switchWalletNetwork = async(chainId) => {
  let resp = await ethereumClient.switchNetwork({'chainId': chainId})
  console.log(resp)
  connectedChainId.set(resp.id.toString())
  /*const networkNode = await networksList.find(
    (data) => data.chainId === parseInt(chainId)
  )
  addCustomNetwork(networkNode)*/
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
