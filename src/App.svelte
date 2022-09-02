<script>
  import Header from "../src/components/header/Header.svelte";
  import BannerMessage from "./components/common/BannerMessage.svelte";
  import ClaimPortal from "./components/claim/ClaimPortal.svelte";
  import VeOceanPortal from "./components/veocean/VeOceanPortal.svelte";
  import DataPortal from "./components/data/DataPortal.svelte";
  import {
    isWalletConnectModalOpen,
    userAddress,
    connectWalletFromLocalStorage,
    selectedNetworks,
  } from "./stores/web3";
  import { Router, Route } from "svelte-navigator";
  import WalletConnectModal from "./components/common/WalletConnectModal.svelte";
  import { rewards } from "./stores/airdrops";
  import { getRewards } from "./utils/rewards";
  import {
    addUserOceanBalanceToBalances,
    addUserVeOceanBalanceToBalances,
  } from "./stores/tokens";
  import { veOceanWithDelegations } from "./stores/veOcean";
  import { getUserVotingPowerWithDelegations } from "./utils/delegations";

  window.process = {
    ...window.process,
  };

  if ($userAddress === "") {
    if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
      connectWalletFromLocalStorage();
    } else {
      isWalletConnectModalOpen.update(($isWalletConnectModalOpen) => true);
    }
  }

  async function initRewards() {
    const newRewards = await getRewards($userAddress);
    rewards.update(() => newRewards);
    const newVeOceansWithDelegations = await getUserVotingPowerWithDelegations(
      $userAddress
    );
    veOceanWithDelegations.update(() => newVeOceansWithDelegations);
    await addUserVeOceanBalanceToBalances($userAddress);
    await addUserOceanBalanceToBalances(
      parseInt(process.env.VE_SUPPORTED_CHAINID)
    );
  }

  $: if ($userAddress) {
    initRewards();
  }

  let selectedNetworksFromLocalStorage =
    localStorage.getItem("selectedNetworks");
  if (selectedNetworksFromLocalStorage) {
    selectedNetworksFromLocalStorage = JSON.parse(
      selectedNetworksFromLocalStorage
    );
    selectedNetworks.update(() => selectedNetworksFromLocalStorage);
  } else {
    selectedNetworks.update(() => JSON.parse(process.env.SUPPORTED_CHAIN_IDS));
  }
</script>

<Router>
  <BannerMessage
    title="This software is a Beta release."
    message={`The website is under construction, use at your own discretion.`}
  />
  <WalletConnectModal />
  <main>
    <Header />
    <Route path="/rewards" primary={false}>
      <ClaimPortal />
    </Route>
    <Route path="/data" primary={false}>
      <DataPortal />
    </Route>
    <Route path="/*" primary={false}>
      <VeOceanPortal />
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

  @media only screen and (max-width: 640px) {
    main {
      max-width: 1024px;
    }
  }
</style>
