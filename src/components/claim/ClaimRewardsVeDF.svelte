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
  import { userSubmittedChallenges } from "../../stores/challenge";
 
  export let canClaimVE = true;
  export let canClaimDF = true;
  export let streams;
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
      your_passive_apy = $APYs.passiveUser > 10000 ? "over 10000" : `${$APYs.passiveUser.toFixed(2)}`;
      avg_passive_apy = $APYs.passive > 10000 ? "over 10000" : `${$APYs?.passive.toFixed(2)}`

      your_active_apy = $APYs.activeUser > 10000 ? "over 10000" : `${$APYs.activeUser.toFixed(2)}`;
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
    streams[1].substreams[0].metric.value = $totalUserAllocation + '%'
  }

  function addUserSubmittedChallenges(){
    streams[1].substreams[1].metric.value = $userSubmittedChallenges.length
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
    let challengeRewards = 0
    $oceanUserRewards.forEach((r) => {
      if(r.round >= $lastActiveRewardsClaimRound) {
        volumeRewards += r['sum(curating_amt)']
        challengeRewards += r['sum(challenge_amt)']
      }
    })
    streams[1].substreams[0].availableRewards = volumeRewards
    streams[1].substreams[1].availableRewards = challengeRewards
  }

  const calculateUnclaimedPassiveReward = () => {
    let sum = 0
      $oceanUserRewards.forEach((r) => {
        if(r.round >= $lastPassiveRewardsClaimRound) {
          sum += r['sum(passive_amt)']
        }
      })
      passiveRewards = sum
      streams[0].substreams[0].availableRewards = sum
  }

  $:if($lastActiveRewardsClaimRound >= 0 && $oceanUserRewards) calculateUnclaimedPassiveReward()

  $:if($APYs) addAPYs()
  $:if($totalUserAllocation) addAllocated()
  $:if($userBalances) addVeOceanBalance()
  $:if($userSubmittedChallenges) addUserSubmittedChallenges()
  //$:if($veClaimables) streams[0].substreams[0].availableRewards = $veClaimables
  $:if($lastActiveRewardsClaimRound >= 0 && $oceanUserRewards) setUnclaimedActiveRewardsSubstreamValues()
</script>

<div class="container">
  <h2 class="title">Reward Programs</h2>
  <div class="rewardsContainer">
  {#each streams as stream}
    <ClaimItem
      title={stream.name}
      distributedAmount={stream?.rewards}
      amount={`${parseFloat(stream.name.toLowerCase() == 'passive' ? `${parseFloat(passiveRewards).toFixed(2)}` : $dfClaimables).toFixed(2)} OCEAN`}
      loading={stream.name.toLowerCase() == 'passive' ? claiming === "VE_REWARDS" : claiming === "DF_REWARDS"}
      onClick={stream.name.toLowerCase() == 'passive' ? onClaimVeRewards : onClaimDfRewards}
      buttonText={stream.name.toLowerCase() == 'passive' && $veClaimables!=passiveRewards ? `First Claim ${parseFloat($veClaimables).toFixed(2)}` : 'Claim Rewards'}
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
