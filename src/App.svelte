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
    veClaimables,
    veEstimate,
  } from "./stores/airdrops";
  import { getRewards } from "./utils/rewards";
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
  import { getLockedEndTime } from "./utils/ve";
  import moment from "moment";

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
    let unlockDateMilliseconds = await getLockedEndTime(
      $userAddress,
      $networkSigner
    );

    await oceanUnlockDate.update(() =>
      unlockDateMilliseconds ? moment.utc(unlockDateMilliseconds) : undefined
    );

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

  function initStore() {
    let emptyUserBalances = {};
    emptyUserBalances[process.env.VE_OCEAN_CONTRACT] = 0;
    emptyUserBalances[
      getOceanTokenAddressByChainId(process.env.VE_SUPPORTED_CHAINID)
    ] = 0;
    userBalances.update(() => emptyUserBalances);
    veOceanWithDelegations.update(() => 0);
    oceanUnlockDate.update(() => undefined);
    lockedOceanAmount.update(() => 0);
  }

  initStore();

  $: if ($userAddress && $web3Provider && $connectedChainId) {
    if ($connectedChainId != process.env.VE_SUPPORTED_CHAINID) {
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
