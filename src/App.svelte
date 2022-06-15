<script>
  import Header from "../src/components/header/Header.svelte";
  import MainMessage from "./components/common/MainMessage.svelte";
  import ClaimPortal from "./components/claim/ClaimPortal.svelte";
  import PoolsPortal from "./components/pools/PoolsPortal.svelte";
  import {
    isWalletConnectModalOpen,
    userAddress,
    connectWalletFromLocalStorage,
    selectedNetworks,
  } from "./stores/web3";
  import { Router, Route } from "svelte-navigator";
  import { supportedChainIds } from "./app.config";
  import WalletConnectModal from "./components/common/WalletConnectModal.svelte";

  if ($userAddress === "") {
    if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
      connectWalletFromLocalStorage();
    } else {
      isWalletConnectModalOpen.update(($isWalletConnectModalOpen) => true);
    }
  }

  let selectedNetworksFromLocalStorage =
    localStorage.getItem("selectedNetworks");
  if (selectedNetworksFromLocalStorage) {
    selectedNetworksFromLocalStorage = JSON.parse(
      selectedNetworksFromLocalStorage
    );
    selectedNetworks.update(() => selectedNetworksFromLocalStorage);
  } else {
    selectedNetworks.update(() => supportedChainIds);
  }
</script>

<Router>
  <Header />
  <main>
    <MainMessage
      title="This software is a Beta release."
      message={`Under construction, use at your own discretion.`}
    />
    <WalletConnectModal />
    <Route path="/rewards">
      <ClaimPortal />
    </Route>
    <Route path="/pools">
      <PoolsPortal />
    </Route>
  </main>
</Router>

<style>
  main {
    text-align: center;
    max-width: 240px;
    margin: 0 auto;
  }

  @media only screen and (max-width: 660px) {
    main {
      max-width: 100%;
    }
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
