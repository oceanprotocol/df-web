<script>
  import Header from "../src/components/header/Header.svelte";
  import BannerMessage from "./components/common/BannerMessage.svelte";
  import ClaimPortal from "./components/claim/ClaimPortal.svelte";
  import PoolsPortal from "./components/pools/PoolsPortal.svelte";
  import {
    connectWallet,
    userAddress,
    connectWalletFromLocalStorage,
    selectedNetworks,
  } from "./stores/web3";
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
</script>

<Router>
  <BannerMessage
    title="This software is a Beta release."
    message={`The website is under construction, use at your own discretion.`}
  />
  <main>
    <Header />
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
    max-width: 1024px;
    margin: 0 auto;
  }

  @media only screen and (max-width: 660px) {
    main {
      max-width: 1024px;
    }
  }
</style>
