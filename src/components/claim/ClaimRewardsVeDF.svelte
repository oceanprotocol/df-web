<script>
  import {
    userAddress,
    connectedChainId
  } from "../../stores/web3";
  import {
    veClaimables,
    dfClaimables,
    claimDFReward,
    getDFRewards,
    APYs,
    lastActiveRewardsClaimRound,
    oceanUserRewards,
    lastPassiveRewardsClaimRound,
  } from "../../stores/airdrops";
  import ClaimItem from "../common/ClaimItem.svelte";
  import Swal from "sweetalert2";
  import { getRewardsFeeEstimate } from "../../utils/feeEstimate";
  import { updateUserBalanceOcean, userBalances } from "../../stores/tokens";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import { claim as claimVERewards } from "../../utils/feeDistributor";
  import * as descriptions from "../../utils/metadata/descriptions.json";
  import { totalUserAllocation } from "../../stores/dataAllocations";
  import { getPredictoorRoundSummary } from "../../utils/predictoor";
 
  export let canClaimVE = true;
  export let canClaimDF = true;
  export let streams;
  export let roundInfo;
  let claiming;
  let passiveRewards = 0;
  const supportedChainId = import.meta.env.VITE_VE_SUPPORTED_CHAINID

  async function onClaimDfRewards() {
    claiming = "DF_REWARDS";
    try {
      await claimDFReward(
        $userAddress,
        getAddressByChainIdKey($connectedChainId, "Ocean")
      );
      Swal.fire(
        "Success!",
        `You've claimed your Data Farming rewards!`,
        "success"
      ).then(async () => {
        dfClaimables.set(
          await getDFRewards(
            $userAddress,
            getAddressByChainIdKey($connectedChainId, "Ocean")
          )
        );
        await updateUserBalanceOcean($userAddress);
      });
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
    claiming = undefined;
  }

  async function onClaimVeRewards() {
    claiming = "VE_REWARDS";
    try {
      await claimVERewards($userAddress);
      Swal.fire("Success!", `You've claimed your VE rewards!`, "success").then(
        async () => {
          const claimableEstimate = await getRewardsFeeEstimate(
            $userAddress
          );
          veClaimables.set(claimableEstimate);
          await updateUserBalanceOcean($userAddress);
        }
      );
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
    claiming = undefined;
  }

  function addAPYs() {
    let your_passive_apy = "0.00"
    let avg_passive_apy = "0.00"
    let your_active_apy = "0.00"
    let avg_active_apy = "0.00"

    if($APYs) {
      if($connectedChainId==supportedChainId){
        your_passive_apy = $APYs.passiveUser > 10000 ? "over 10000" : `${$APYs.passiveUser.toFixed(2)}`
        your_active_apy = $APYs.activeUser > 10000 ? "over 10000" : `${$APYs.activeUser.toFixed(2)}`
      }
      avg_passive_apy = $APYs.passive > 10000 ? "over 10000" : `${$APYs?.passive.toFixed(2)}`
      avg_active_apy = $APYs.active > 10000 ? "over 10000" : `${$APYs?.active.toFixed(2)}`
    }
    
    streams[0].substreams[0].apy = {
      value: $userAddress? `${your_passive_apy}% Your APY | ${avg_passive_apy}% Avg APY` : `${avg_passive_apy}% Avg APY`,
      tooltip: descriptions.default.tooltip_rewards_apy_passive,
    };

    streams[1].substreams[0].apy = {
      value: $userAddress? `${your_active_apy}% Your APY | ${avg_active_apy}% Avg APY` : `${avg_active_apy}% Avg APY`,
      tooltip: descriptions.default.tooltip_active_rewards,
    };
  }

  function addAllocated(){
    streams[1].substreams[0].metric.value = ($connectedChainId==supportedChainId ? $totalUserAllocation : 0) + '%'
  }

  async function addUserPredictoorAccuracy(){
    const currentDayIndexInWeek = new Date().getDay()
    //Predictoor data is updated every Monday morning. Between new round start and Monday show accuracy for round - 2.
    const response = await getPredictoorRoundSummary($userAddress, roundInfo.id - ((currentDayIndexInWeek>=1 && currentDayIndexInWeek<4) ? 1 : 2))
    streams[1].substreams[1].metric.value = `${response && response.accuracy ? parseFloat(response.accuracy * 100).toFixed(2) : 0}%`
  }

  function addVeOceanBalance(){
    streams[0].substreams[0].metric.value = `${$userBalances[
        getAddressByChainIdKey(supportedChainId, "veOCEAN")
      ]
      ? parseFloat(
          $userBalances[
            getAddressByChainIdKey(
              supportedChainId,
              "veOCEAN"
            )
          ]
        ).toFixed(2)
      : parseFloat("0").toFixed(2)} veOCEAN`
  }

  function canClaim(type){
    if(type.toLowerCase() == 'passive'){
      return canClaimVE === false ||
        claiming !== undefined ||
        $veClaimables <= 0
    }else{
      return canClaimDF === false ||
        claiming !== undefined ||
        $dfClaimables <= 0
    }
  }

  function setUnclaimedActiveRewardsSubstreamValues(){
    let volumeRewards = 0
    $oceanUserRewards.forEach((r) => {
      if(r.round >= $lastActiveRewardsClaimRound) {
        volumeRewards += r['sum(curating_amt)']
      }
    })
    streams[1].substreams[0].availableRewards = $connectedChainId==supportedChainId ? volumeRewards : 0
  }

  const calculateUnclaimedPassiveReward = () => {
    let sum = 0
    if($connectedChainId==supportedChainId){
      $oceanUserRewards.forEach((r) => {
        if(r.round >= $lastPassiveRewardsClaimRound) {
          sum += r['sum(passive_amt)']
        }
      })
    }
    passiveRewards = sum 
    streams[0].substreams[0].availableRewards = sum
  }

  $:if($lastActiveRewardsClaimRound >= 0 && $oceanUserRewards && $connectedChainId) calculateUnclaimedPassiveReward()

  $:if($APYs && $connectedChainId) addAPYs()
  $:if($totalUserAllocation || $connectedChainId) addAllocated()
  $:if($userBalances) addVeOceanBalance()
  $:if($lastActiveRewardsClaimRound >= 0 && $oceanUserRewards && $connectedChainId) setUnclaimedActiveRewardsSubstreamValues()
  $:if($userAddress) addUserPredictoorAccuracy()
</script>

<div class="container">
  <div class="rewardsContainer">
  {#each streams as stream}
    <ClaimItem
      title={stream.name}
      distributedAmount={stream?.rewards}
      amount={`${parseFloat(stream.name.toLowerCase() == 'passive' ? `${parseFloat(passiveRewards > $veClaimables ? passiveRewards : $veClaimables).toFixed(2)}` : $dfClaimables).toFixed(2)} OCEAN`}
      loading={stream.name.toLowerCase() == 'passive' ? claiming === "VE_REWARDS" : claiming === "DF_REWARDS"}
      claimMessage={stream.name.toLowerCase() == 'passive' && parseFloat($veClaimables).toFixed(2)!=parseFloat(passiveRewards).toFixed(2) ? 'You need multiple claims to claim all the rewards' : undefined}
      onClick={stream.name.toLowerCase() == 'passive' ? onClaimVeRewards : onClaimDfRewards}
      buttonText={stream.name.toLowerCase() == 'passive' && parseFloat($veClaimables).toFixed(2)!=parseFloat(passiveRewards).toFixed(2) ? `Claim ${parseFloat($veClaimables).toFixed(2)}` : 'Claim All'}
      substreams={stream.substreams}
      disabled={canClaim(stream.name)}
    />
    {/each}
  </div>
</div>

<style>
  .container {
    margin: calc(var(--spacer) * 2) 0;
    width: 100%;
  }
  .rewardsContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: calc(var(--spacer) / 2);
  }
  .title {
    margin-bottom: calc(var(--spacer) / 2);
  }
</style>
