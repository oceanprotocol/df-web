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
  
  async function initClaimables() {
    console.log("initClaimables")
    
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
    
    const veRewards = await getRewardsFeeEstimate($userAddress, $web3Provider);
    veClaimables.set(veRewards);

    console.log("userAddress", $userAddress);
    console.log("OCEAN_ADDRESS", process.env.OCEAN_ADDRESS);
    console.log("web3Provider", $web3Provider);
    const dfRewards = await getDFRewards($userAddress, process.env.OCEAN_ADDRESS, $web3Provider);
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
    loading = false;
  }

  $: if ($userAddress && $connectedChainId) {
    initClaimables();
  }
</script>

<div class={`container`}>
  <Countdown />
      
  {#if $userAddress && loading === false && $airdrops && veBalance > 0}
    <!-- <div class="estimatedRewardsContainer">
      <EstimatedRewards />
    </div> -->
    <ClaimRewards canClaimVE={canClaimVE} canClaimDF={canClaimDF}/>
  {:else if $userAddress && loading === false}
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
  }

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
    margin: calc(var(--spacer)) 0;
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
