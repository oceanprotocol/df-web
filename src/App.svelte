<script>
  import Header from "../src/components/header/Header.svelte";
  import ClaimPortal from "./components/claim/ClaimPortal.svelte";
  import PoolsPortal from "./components/pools/PoolsPortal.svelte";
  import AdminPortal from "./components/admin/AdminPortal.svelte";
  import {
    connectWallet,
    userAddress,
    connectWalletFromLocalStorage,
    selectedNetworks,
  } from "./stores/web3";
  import {
    initValues,
  } from "./stores/airdrops";
  import { Router, Route } from "svelte-navigator";
  import { supportedChainIds } from "./app.config";

  if ($userAddress === "") {
    if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
      connectWalletFromLocalStorage();
    } else {
      connectWallet();
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

  initValues();

</script>

<Router>
  <Header />
  <main>
    <Route path="/">
      <ClaimPortal />
    </Route>
    <Route path="/pools">
      <PoolsPortal />
    </Route>
    <Route path="/admin">
      <AdminPortal />
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
