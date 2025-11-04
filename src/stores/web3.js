import { writable, get } from "svelte/store";
import {
  configureChains,
  createConfig,
  getAccount,
  getNetwork,
  watchAccount,
  watchNetwork,
  connect,
  disconnect as wagmiDisconnect,
} from "@wagmi/core";
import { mainnet, goerli } from "@wagmi/core/chains";
import { infuraProvider } from "@wagmi/core/providers/infura";

// Create writable stores for compatibility
export const userAddress = writable("");
export let poolContracts = writable("");
export const connectedChainId = writable(null);
export let selectedNetworks = writable(
  localStorage?.getItem("selectedNetworks")
    ? JSON.parse(localStorage?.getItem("selectedNetworks"))
    : []
);
export let jsonRPCProvider = writable({});
export let isWalletConnectModalOpen = writable(false);

export const GASLIMIT_DEFAULT = 1000000;

const chains = [
  import.meta.env.VITE_VE_SUPPORTED_CHAINID === "1" ? mainnet : goerli,
];

// Wagmi Core Client - kept for other utilities like getWalletClient
const { publicClient } = configureChains(chains, [
  infuraProvider({ apiKey: import.meta.env.VITE_INFURA_KEY }),
]);

// Create connectors - will be initialized dynamically
let connectors = [];

// Initialize connectors when needed
const initConnectors = async () => {
  if (connectors.length > 0) return connectors;

  try {
    // Try importing from wagmi connectors packages
    const { InjectedConnector } = await import(
      "@wagmi/core/connectors/injected"
    );
    const { WalletConnectConnector } = await import(
      "@wagmi/core/connectors/walletConnect"
    );

    connectors = [
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: import.meta.env.VITE_WALLET_CONNECT_KEY,
          showQrModal: true,
        },
      }),
    ];
  } catch (e) {
    console.error("Failed to load connectors:", e);
    // Fallback: use ethers directly for injected wallets
  }

  return connectors;
};

const wagmiClient = createConfig({
  autoConnect: true,
  connectors: [],
  publicClient,
});

// Initialize connectors
if (typeof window !== "undefined") {
  initConnectors();
}

// Watch account and network changes from wagmi
if (typeof window !== "undefined") {
  watchAccount((account) => {
    if (account.address) {
      userAddress.set(account.address);
    } else {
      userAddress.set("");
    }
  });

  watchNetwork((network) => {
    if (network?.chain?.id) {
      connectedChainId.set(network.chain.id);
    } else {
      connectedChainId.set(null);
    }
  });

  // Initialize state
  try {
    const account = getAccount();
    if (account.address) {
      userAddress.set(account.address);
    }
    const network = getNetwork();
    if (network?.chain?.id) {
      connectedChainId.set(network.chain.id);
    }
  } catch (e) {
    console.error("Failed to get initial account/network:", e);
  }

  // Listen for network changes from injected wallets (MetaMask, etc.)
  // This handles cases where the wallet is connected via ethers.js directly
  if (window.ethereum) {
    const handleChainChanged = async (chainId) => {
      try {
        // chainId can be a hex string (e.g., "0x1") or a number
        let chainIdNumber;
        if (typeof chainId === "string") {
          // Remove '0x' prefix if present and parse as hex
          chainIdNumber = parseInt(chainId.replace(/^0x/, ""), 16);
        } else {
          chainIdNumber = Number(chainId);
        }
        
        if (isNaN(chainIdNumber)) {
          console.warn("Invalid chainId received:", chainId);
          return;
        }
        
        connectedChainId.set(chainIdNumber);
        
        // Also update the user address if it's still connected
        if (get(userAddress)) {
          const { ethers } = await import("ethers");
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          try {
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            userAddress.set(address);
          } catch (e) {
            // If we can't get the address, the wallet might have disconnected
            console.warn("Could not get address after chain change:", e);
          }
        }
      } catch (error) {
        console.error("Error handling chain change:", error);
      }
    };

    const handleAccountsChanged = async (accounts) => {
      try {
        if (accounts && accounts.length > 0) {
          userAddress.set(accounts[0]);
          
          // Also update chain ID
          const { ethers } = await import("ethers");
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await provider.getNetwork();
          connectedChainId.set(network.chainId);
        } else {
          // Wallet disconnected
          userAddress.set("");
          connectedChainId.set(null);
        }
      } catch (error) {
        console.error("Error handling accounts change:", error);
      }
    };

    // Listen for chain changes
    window.ethereum.on("chainChanged", handleChainChanged);
    
    // Listen for account changes (when user switches accounts in wallet)
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  }
}

// TODO - Replace networkData w/ networksDataArray
export function getNetworkDataById(data, networkId) {
  if (!networkId) return;
  const networkData = data.filter((chain) => chain.chainId === networkId);
  return networkData[0];
}

// Connect wallet using wagmi connectors or ethers fallback
export const connectWallet = async (connectorType = "injected") => {
  try {
    if (connectorType === "injected") {
      // Use injected wallet (MetaMask, etc.)
      if (window.ethereum) {
        const { ethers } = await import("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        userAddress.set(address);

        const network = await provider.getNetwork();
        connectedChainId.set(network.chainId);
      } else {
        throw new Error(
          "No injected wallet found. Please install MetaMask or another wallet extension."
        );
      }
    } else if (connectorType === "walletconnect") {
      // Try to use WalletConnect connector
      const conns = await initConnectors();
      const connector = conns.find((c) => {
        try {
          return (
            c.id === "walletConnect" ||
            c.constructor.name === "WalletConnectConnector"
          );
        } catch {
          return false;
        }
      });

      if (connector) {
        await connect({ connector });
      } else {
        throw new Error(
          "WalletConnect connector not available. Please use MetaMask."
        );
      }
    }
  } catch (e) {
    console.error("Could not connect wallet:", e);
    throw e;
  }
};

export const disconnect = async () => {
  try {
    await wagmiDisconnect();
    userAddress.set("");
    connectedChainId.set(null);
    localStorage?.clear();
    window.location.href = "/";
  } catch (e) {
    console.error("Failed to disconnect:", e);
    // Fallback: just clear state
    userAddress.set("");
    connectedChainId.set(null);
    localStorage?.clear();
    window.location.href = "/";
  }
};

export const switchWalletNetwork = async (chainId) => {
  try {
    // Ensure chainId is a number
    const targetChainId =
      typeof chainId === "string" ? parseInt(chainId, 10) : Number(chainId);

    if (isNaN(targetChainId)) {
      throw new Error(`Invalid chain ID: ${chainId}`);
    }

    // First, try to use wagmi if there's an active connector
    const { getAccount, switchNetwork } = await import("@wagmi/core");
    const account = getAccount();

    // If wagmi has an active connector, use it
    if (account.connector) {
      try {
        await switchNetwork({ chainId: targetChainId });
        // connectedChainId will update automatically via watchNetwork
        return;
      } catch (wagmiError) {
        // If wagmi fails, fall back to ethers
        console.warn(
          "Wagmi switchNetwork failed, falling back to ethers:",
          wagmiError
        );
      }
    }

    // Fallback: Use ethers.js directly for injected wallets
    if (window.ethereum) {
      const { ethers } = await import("ethers");
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Request to switch/add network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });

        // Update connected chain ID after successful switch
        const network = await provider.getNetwork();
        connectedChainId.set(network.chainId);
      } catch (switchError) {
        // If the chain doesn't exist, we might need to add it
        // This is a basic implementation - you may want to add network metadata
        if (switchError.code === 4902 || switchError.code === -32603) {
          throw new Error(
            `Network with chain ID ${targetChainId} is not available. Please add it to your wallet manually.`
          );
        }
        throw switchError;
      }
    } else {
      throw new Error(
        "No wallet provider found. Please install MetaMask or another wallet extension."
      );
    }
  } catch (switchError) {
    console.error("Failed to switch network:", switchError);
    throw switchError;
  }
};
