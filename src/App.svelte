<script>
  import Header from "../src/components/header/Header.svelte";
  import BannerMessage from "./components/common/BannerMessage.svelte";
  import ClaimPortal from "./components/claim/ClaimPortal.svelte";
  import VeOceanPortal from "./components/veocean/VeOceanPortal.svelte";
  import {
    approve as approveToken,
    allowance
  } from "./utils/tokens";
  import {
    userAddress,
    selectedNetworks,
    connectedChainId,
  } from "./stores/web3";
  import { Router, Route } from "svelte-tiny-router";
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
    getPassiveUserRewardsData,
  } from "./utils/rewards";
  import {
    updateUserBalanceOcean,
    updateUserBalanceVeOcean,
    userBalances,
  } from "./stores/tokens";
  import {
    lockedOceanAmount,
    oceanUnlockDate,
    totalVeOceanSupply,
    veOceanWithDelegations,
  } from "./stores/veOcean";
  import { isAppLoading } from "./stores/app";
  import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
  import { setClient } from "svelte-apollo";
  import { onMount } from "svelte";
  import { getAddressByChainIdKey } from "./utils/address/address";
  import { getLockedEndTime, getLockedOceanAmount, getTotalVeSupply } from "./utils/ve";
  import moment from "moment";
  import { Buffer } from "buffer";
  import "@oceanprotocol/typographies/css/ocean-typo.css";
  import Redirect from "./components/common/Redirect.svelte";
  import Footer from "./components/footer/Footer.svelte";
  import TermsOfUse from "./components/footer/TermsOfUse.svelte";
  import { ethers } from "ethers";
  
  // @ts-ignore
  window.Buffer = Buffer;

  let allowedTokenAmt;
  const supportedChainId = import.meta.env.VITE_VE_SUPPORTED_CHAINID;
  const allowanceThreshold = 100

  const dismissTokenApproval = async(throwError) =>{
    try{
      await approveToken(
        getAddressByChainIdKey($connectedChainId, "Ocean"),
        getAddressByChainIdKey(
          supportedChainId,
          "veOCEAN"
        ),
        0
      )
      allowedTokenAmt=0
    }catch(e){
      if(throwError == true) throw(e)
      console.error(e)
    }
  }

  async function loadGeneralAPYs() {
    const veOceanSupply = await getTotalVeSupply()
    totalVeOceanSupply.update(() => veOceanSupply)
    const activeAPY = $APYs?.active ? $APYs?.active : await getActiveAPY();
    const passiveAPY = $APYs?.passive ? $APYs.passive : await getPassiveAPY();
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
        ? await getPassiveUserRewardsData(
            parseFloat($lockedOceanAmount),
            parseFloat($totalVeOceanSupply),
            $oceanUnlockDate,
            undefined,
            0,
            0,
          )
        : 0;
    APYs.update((oldObj) => {
      return {
        passive: oldObj?.passive ? oldObj.passive : 0,
        passiveUser: passiveUserAPY?.apy,
        active: oldObj?.active ? oldObj.active : 0,
        activeUser: activeUserAPY,
      };
    });
  }

  const client = new ApolloClient({
    link: new HttpLink({
      uri: import.meta.env.VITE_SUBGRAPH_API,
      credentials: "include",
    }),
    cache: new InMemoryCache(),
  });
  setClient(client);

  async function initRewards() {
    let lockedOceans = await getLockedOceanAmount($userAddress);
    lockedOceanAmount.update(() => lockedOceans);
    let unlockDateMilliseconds = await getLockedEndTime($userAddress);
    await oceanUnlockDate.update(() =>
      unlockDateMilliseconds ? moment.utc(unlockDateMilliseconds) : undefined
    );

    const newRewards = await getRewards($userAddress);
    rewards.update(() => newRewards);
    await updateUserBalanceVeOcean($userAddress);
    await updateUserBalanceOcean($userAddress);

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
  $: if ($userAddress) allowedTokenAmt = undefined

  $: if ($userAddress && allowedTokenAmt == undefined && $connectedChainId) {
    const oceanAddress = getAddressByChainIdKey($connectedChainId, "Ocean");
    const veOceanAddress = getAddressByChainIdKey(supportedChainId, "veOCEAN");
    
    // Only call allowance if both addresses are available
    if (oceanAddress && veOceanAddress) {
      allowance(oceanAddress, $userAddress, veOceanAddress)
        .then((allowedAmt) => {
          allowedTokenAmt = ethers.utils.formatEther(
            BigInt(allowedAmt).toString(10)
          );
          if(allowedTokenAmt < allowanceThreshold){
            allowedTokenAmt = 0;
          }
        })
        .catch((error) => {
          console.error("Failed to get allowance:", error);
          allowedTokenAmt = 0;
        });
    } else {
      // If addresses are not available, set allowance to 0
      allowedTokenAmt = 0;
    }
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
    title={`Passive-DF and Volume-DF are now stopped. If you have an ongoing lock, you will receive an OCEAN token AIRDROP to cover your rewards, and you will be able to get your locked tokens back once the lock period is over.`}
    message= {`Airdropped tokens are going to be automatically sent to your Volume-DF rewards from the Active Rewards stream, do not click on any suspicous links! <a href='https://blog.oceanprotocol.com/passive-volume-data-farming-airdrop-has-completed-they-are-now-retired-6933520b5fcb' target='_blank'>Check the following blogpost for more informations.</a>`}
    type="warning"
  />
  <WalletConnectModal />
  <main>
    <Header />
    <Route path="/rewards">
      <ClaimPortal removeApproval={allowedTokenAmt > allowanceThreshold ? dismissTokenApproval : undefined} />
    </Route>
    <Route path="/veocean" component={VeOceanPortal} />
    <Route path="/terms" component={TermsOfUse} />
    <Route path="/passive-df">
      <Redirect to="/veocean" />
    </Route>
    <Route path="/" component={Redirect} />
    <Footer/>
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
