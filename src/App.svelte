<script>
  import Header from "../src/components/header/Header.svelte";
  import BannerMessage from "./components/common/BannerMessage.svelte";
  import ClaimPortal from "./components/claim/ClaimPortal.svelte";
  import DelegationPortal from "./components/delegation/DelegationPortal.svelte";
  import VeOceanPortal from "./components/veocean/VeOceanPortal.svelte";
  import DataPortal from "./components/data/DataPortal.svelte";
  import ChallengesPortal from "./components/challenges/ChallengesPortal.svelte";
  import {
    userAddress,
    selectedNetworks,
    connectedChainId,
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
  import { Buffer } from "buffer";
  import "@oceanprotocol/typographies/css/ocean-typo.css";
  import { getUserSubmittedChallenges, userSubmittedChallenges } from "./stores/challenge";
  
  // @ts-ignore
  window.Buffer = Buffer;

  async function loadGeneralAPYs() {
    let activeAPY = $APYs?.active ? $APYs?.active : await getActiveAPY();
    let passiveAPY = $APYs?.passive ? $APYs.passive : await getPassiveAPY();
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
        getAddressByChainIdKey(
          import.meta.env.VITE_VE_SUPPORTED_CHAINID,
          "veOCEAN"
        )
      ] > 0
        ? await getPassiveUserAPY(
            $userBalances[
              getAddressByChainIdKey(
                import.meta.env.VITE_VE_SUPPORTED_CHAINID,
                "veOCEAN"
              )
            ],
            $lockedOceanAmount
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
    uri: import.meta.env.VITE_SUBGRAPH_API,
    fetchOptions: {
      credentials: "include",
    },
  });
  setClient(client);

  async function initRewards() {
    let lockedOceans = await getLockedOceanAmount($userAddress);
    lockedOceanAmount.update(() => lockedOceans);
    let unlockDateMilliseconds = await getLockedEndTime($userAddress);
    await oceanUnlockDate.update(() =>
      unlockDateMilliseconds ? moment.utc(unlockDateMilliseconds) : undefined
    );

    if (unlockDateMilliseconds) {
      let newAllocation = await getTotalAllocatedVeOcean($userAddress);
      totalUserAllocation.update(() => newAllocation);
    }

    const newRewards = await getRewards($userAddress);
    rewards.update(() => newRewards);
    const newVeOceansWithDelegations = await getUserVotingPowerWithDelegations(
      $userAddress
    );

    veOceanWithDelegations.update(() => newVeOceansWithDelegations);
    await updateUserBalanceVeOcean($userAddress);
    await updateUserBalanceOcean($userAddress);

    let userChallenges = await getUserSubmittedChallenges($userAddress)
    userSubmittedChallenges.update(() => userChallenges)
    isAppLoading.update(() => false);
  }

  $: if ($veOceanWithDelegations > 0) {
    loadUserAPYs();
  }

  function initStore() {
    let emptyUserBalances = {};
    emptyUserBalances[import.meta.env.VITE_VE_OCEAN_CONTRACT] = 0;
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
      import.meta.env.VITE_VE_SUPPORTED_CHAINID,
      "veOCEAN"
    );
    if (veOceanAddress) emptyUserBalances[veOceanAddress] = 0;
    let oceanAddress = getAddressByChainIdKey(
      import.meta.env.VITE_VE_SUPPORTED_CHAINID,
      "Ocean"
    );
    if (oceanAddress) emptyUserBalances[oceanAddress] = 0;
    userBalances.update(() => emptyUserBalances);
  }

  $: if ($userAddress && $connectedChainId) {
    if ($connectedChainId != import.meta.env.VITE_VE_SUPPORTED_CHAINID) {
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
    selectedNetworks.update(() =>
      JSON.parse(import.meta.env.VITE_SUPPORTED_CHAIN_IDS)
    );
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
    title={`Data Farming Main has started!</a>`}
    message={`Read <a href='https://blog.oceanprotocol.com/ocean-data-farming-main-is-here-49c99602419e' target='_blank'><strong>the blogpost</strong></a> for more information.`}
  />
  <BannerMessage
    type="default"
    message={`Publish your datasets through our <strong><a href='https://market.oceanprotocol.com/publish/1' target='_blank'>marketplace</a></strong> to get <strong><a href='https://blog.oceanprotocol.com/data-farming-publisher-rewards-f2639525e508' target='_blank'>2X Stake</a></strong> for publishers.`}
  />
  <WalletConnectModal />
  <main>
    <Header />
    <Route path="/rewards" primary={false}>
      <ClaimPortal />
    </Route>
    <Route path="/volume-df" primary={false}>
      <DataPortal />
    </Route>
    <Route path="/veocean" primary={false}>
      <VeOceanPortal />
    </Route>
    <Route path="/delegate" primary={false}>
      <DelegationPortal />
    </Route>
    <Route path="/challenge-df" primary={false}>
      <ChallengesPortal />
    </Route>
    <Route path="/*" primary={false}>
      <ClaimPortal />
    </Route>
  </main>
</Router>

<style lang="scss" global>
  $css--font-face: false;
  $css--helpers: false;
  $css--body: false;
  $css--use-layer: false;
  $css--reset: false;
  $css--default-type: false;
  $css--plex: false;

 @import "carbon-components/scss/components/notification/_toast-notification.scss";

  main {
    text-align: center;
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
  }
</style>
