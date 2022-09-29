<script>
  import NetworkRewards from "./NetworkRewards.svelte";
  import MainMessage from "../common/MainMessage.svelte";
  import EstimatedRewards from "../common/EstimatedRewards.svelte";
  import ClaimRewards from "./ClaimRewardsVeDF.svelte";
  import {get} from "svelte/store"
  import {
    userAddress,
    connectedChainId,
    selectedNetworks,
    networkSigner,
    web3Provider
  } from "../../stores/web3.js";
  import {
    airdrops,
    rewards,
    veClaimables,
    dfClaimables,
    getDFRewards,
    updateAllClaimables,
  } from "../../stores/airdrops";
  import { getRewardsFeeEstimate } from "../../utils/feeEstimate";
  import { 
    getVeOceanBalance, 
    getMaxUserEpoch
  } from "../../utils/ve";
  import { 
    getLastTokenTime,
    getUserEpoch,
    getTimeCursor 
  } from "../../utils/feeDistributor";
  import Countdown from "../common/CountDown.svelte";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";

  let loading = true;
  let veBalance = 0.0;
  let maxUserEpoch = 0;
  let curUserEpoch = 0;
  let timeCursor = 0;
  let timeCursorWeeks = 0;
  let lastTokenTime = 0;
  let lastTokenTimeWeeks = 0;
  let canClaimVE = true;
  let canClaimDF = true;
  
  const WEEK = 7 * 86400;

  async function initClaimables() {
    loading = true;
    await updateAllClaimables(
      JSON.parse(process.env.AIRDROP_CONFIG),
      $selectedNetworks,
      $userAddress,
      $rewards
    );

    veBalance = await getVeOceanBalance($userAddress, $web3Provider);
    maxUserEpoch = await getMaxUserEpoch($userAddress, $web3Provider);
    curUserEpoch = await getUserEpoch($userAddress, $web3Provider);
    lastTokenTime = await getLastTokenTime($web3Provider);
    timeCursor = await getTimeCursor($userAddress, $web3Provider);
    
    console.log("veBalance", veBalance);
    console.log("curUserEpoch", curUserEpoch);
    console.log("maxUserEpoch", maxUserEpoch);
    console.log("lastTokenTime", lastTokenTime);
    console.log("timeCursor", timeCursor);
    
    const veRewards = await getRewardsFeeEstimate($userAddress, $web3Provider);
    console.log("veRewards:", veRewards)
    veClaimables.set(veRewards);

    const dfRewards = await getDFRewards($userAddress, process.env.OCEAN_ADDRESS, $web3Provider);
    console.log("dfRewards:", dfRewards)
    dfClaimables.set(dfRewards);

    if( 
      maxUserEpoch === 0 || 
      curUserEpoch >= maxUserEpoch || 
      timeCursor >= lastTokenTime ||
      veRewards <= 0 
    ) {
      canClaimVE = false;
    }

    if( dfRewards <= 0 ) {
      canClaimDF = false;
    }

    console.log("canClaimVE", canClaimVE);
    console.log("canClaimDF", canClaimDF);

    loading = false;
  }

  $: if ($rewards) {
    initClaimables();
  }

  $: if ($connectedChainId !== process.env.VE_SUPPORTED_CHAINID) {
    loading = true;
  }

  $: if (!$userAddress) {
    loading = true;
  }
</script>

<div
  class={`container ${
    (loading === true || !$airdrops) && "alignContentCenter"
  }`}
>
  {#if $userAddress && loading === false && $airdrops && veBalance > 0}
    <Countdown />
    <!-- <div class="estimatedRewardsContainer">
      <EstimatedRewards />
    </div> -->
    <ClaimRewards canClaimVE={canClaimVE} canClaimDF={canClaimDF}/>
  {:else if $userAddress && loading === false}
    <Countdown />  
    {#if !$userAddress}
      <MainMessage
        title="No wallet connected"
        message={`Connect your wallet to see the rewards`}
      />
    {:else if $selectedNetworks.length === 0 && $userAddress}
      <MainMessage
        title="No network selected"
        message={`Select a network to see rewards.`}
      />
    {:else}
      <MainMessage
        title="No veOcean"
        message={`Lock Ocean to receive veOcean and earn yield.`}
      />
    {/if}
  {:else}
    <span class="loading">Loading...</span>
  {/if}  
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: calc(100vh - 300px);
    padding-top: var(--spacer);
  }

  .rewards {
    width: 100%;
  }

  .estimatedRewardsContainer {
    width: 100%;
    font-size: var(--font-size-large);
    margin: calc(var(--spacer)) 0;
  }

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
  }

  .alignContentCenter {
    justify-content: center;
  }

  @media only screen and (min-width: 640px) {
    .estimatedRewardsContainer {
      margin: var(--spacer) 0;
    }
    .container {
      min-height: calc(100vh - 200px);
    }
  }
</style>
