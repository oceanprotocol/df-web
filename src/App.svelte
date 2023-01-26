<script>
  import Header from "../src/components/header/Header.svelte";
  import BannerMessage from "./components/common/BannerMessage.svelte";
  import ClaimPortal from "./components/claim/ClaimPortal.svelte";
  import VeOceanPortal from "./components/veocean/VeOceanPortal.svelte";
  import DataPortal from "./components/data/DataPortal.svelte";
  import { setupAppConfig } from "./app.config";
  import {
    isWalletConnectModalOpen,
    userAddress,
    connectWalletFromLocalStorage,
    selectedNetworks,
    web3Provider,
    connectedChainId,
    networkSigner,
  } from "./stores/web3";
  import { Router, Route } from "svelte-navigator";
  import WalletConnectModal from "./components/common/WalletConnectModal.svelte";
  import {
    dfClaimables,
    dfEstimate,
    rewards,
    APYs,
    veClaimables,
    veEstimate,
  } from "./stores/airdrops";
  import {
    getActiveAPY,
    getPassiveAPY,
    getRewards,
    getPassiveUserAPY,
  } from "./utils/rewards";
  import {
    updateUserBalanceOcean,
    updateUserBalanceVeOcean,
    userBalances,
  } from "./stores/tokens";
  import {
    lockedOceanAmount,
    oceanUnlockDate,
    veOceanWithDelegations,
  } from "./stores/veOcean";
  import { getUserVotingPowerWithDelegations } from "./utils/delegations";
  import { isAppLoading } from "./stores/app";
  import ApolloClient from "apollo-boost";
  import { setClient } from "svelte-apollo";
  import { onMount } from "svelte";
  import { getAddressByChainIdKey } from "./utils/address/address";
  import { getLockedEndTime, getLockedOceanAmount } from "./utils/ve";
  import moment from "moment";
  import { getTotalAllocatedVeOcean } from "./utils/dataAllocations";
  import { totalUserAllocation } from "./stores/dataAllocations";

  setupAppConfig();

  async function loadGeneralAPYs() {
    let activeAPY = $APYs?.active ? $APYs?.active : await getActiveAPY();
    let passiveAPY = $APYs?.passive ? $APYs?.passive : await getPassiveAPY();
    APYs.update(() => {
      return {
        passive: passiveAPY,
        passiveUser: 0,
        active: activeAPY,
        activeUser: 0,
      };
    });
  }

  async function loadUserAPYs() {
    let activeUserAPY = $userAddress ? await getActiveAPY($userAddress) : 0;
    let passiveUserAPY =
      $userAddress &&
      $lockedOceanAmount &&
      $userBalances[
        getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN")
      ] > 0
        ? await getPassiveUserAPY(
            $userBalances[
              getAddressByChainIdKey(
                process.env.VE_SUPPORTED_CHAINID,
                "veOCEAN"
              )
            ],
            $lockedOceanAmount,
            $web3Provider
          )
        : 0;
    APYs.update((oldObj) => {
      return {
        passive: oldObj?.passive ? oldObj.passive : 0,
        passiveUser: passiveUserAPY,
        active: oldObj?.active ? oldObj.active : 0,
        activeUser: activeUserAPY,
      };
    });
  }

  const client = new ApolloClient({
    uri: process.env.SUBGRAPH_API,
    fetchOptions: {
      credentials: "include",
    },
  });
  setClient(client);
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
    let lockedOceans = await getLockedOceanAmount($userAddress, $networkSigner);
    lockedOceanAmount.update(() => lockedOceans);
    let unlockDateMilliseconds = await getLockedEndTime(
      $userAddress,
      $networkSigner
    );
    await oceanUnlockDate.update(() =>
      unlockDateMilliseconds ? moment.utc(unlockDateMilliseconds) : undefined
    );

    if (unlockDateMilliseconds) {
      let newAllocation = await getTotalAllocatedVeOcean(
        $userAddress,
        $networkSigner
      );
      totalUserAllocation.update(() => newAllocation);
    }

    const newRewards = await getRewards($userAddress);
    rewards.update(() => newRewards);
    const newVeOceansWithDelegations = await getUserVotingPowerWithDelegations(
      $userAddress
    );

    veOceanWithDelegations.update(() => newVeOceansWithDelegations);
    await updateUserBalanceVeOcean($userAddress, $web3Provider);
    await updateUserBalanceOcean($userAddress, $web3Provider);
    isAppLoading.update(() => false);
  }

  $: if ($veOceanWithDelegations > 0) {
    loadUserAPYs();
  }

  function initStore() {
    let emptyUserBalances = {};
    emptyUserBalances[process.env.VE_OCEAN_CONTRACT] = 0;
    emptyUserBalances[getAddressByChainIdKey($connectedChainId, "veOCEAN")] = 0;
    userBalances.update(() => emptyUserBalances);
    veOceanWithDelegations.update(() => 0);
    oceanUnlockDate.update(() => undefined);
    lockedOceanAmount.update(() => 0);
  }

  initStore();

  $: if (!$userAddress) {
    setBalancesTo0();
  }

  function setBalancesTo0() {
    let emptyUserBalances = {};
    let veOceanAddress = getAddressByChainIdKey(
      process.env.VE_SUPPORTED_CHAINID,
      "veOCEAN"
    );
    if (veOceanAddress) emptyUserBalances[veOceanAddress] = 0;
    let oceanAddress = getAddressByChainIdKey(
      process.env.VE_SUPPORTED_CHAINID,
      "Ocean"
    );
    if (oceanAddress) emptyUserBalances[oceanAddress] = 0;
    userBalances.update(() => emptyUserBalances);
  }

  $: if ($userAddress && $web3Provider && $connectedChainId) {
    if ($connectedChainId != process.env.VE_SUPPORTED_CHAINID) {
      veOceanWithDelegations.update(() => 0);
      setBalancesTo0();
      totalUserAllocation.update(() => 0);
      oceanUnlockDate.update(() => undefined);
      lockedOceanAmount.update(() => 0);
      veClaimables.update(() => 0);
      dfClaimables.update(() => 0);
      veEstimate.update(() => 0);
      dfEstimate.update(() => 0);
      isAppLoading.update(() => false);
    } else {
      initRewards();
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
    selectedNetworks.update(() => JSON.parse(process.env.SUPPORTED_CHAIN_IDS));
  }

  onMount(async () => {
    loadGeneralAPYs();
    if (!$userAddress) {
      isAppLoading.update(() => false);
    }
  });
</script>

<Router>
  <BannerMessage
    title="This software is a Beta release."
    message={`The website is under construction, use at your own discretion.`}
  />
  <WalletConnectModal />
  <main>
    <Header />
    <Route path="/activerewards" primary={false}>
      <ClaimPortal />
    </Route>
    <Route path="/datafarming" primary={false}>
      <DataPortal />
    </Route>
    <Route path="/veocean" primary={false}>
      <VeOceanPortal />
    </Route>
    <Route path="/*" primary={false}>
      <ClaimPortal />
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
