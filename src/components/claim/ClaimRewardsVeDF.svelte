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

  function addAPYs(){
    streams[0].substreams[0].apy = {value: `${
        $APYs
          ? $APYs?.passive > 10000
            ? "over 10000"
            : `${$APYs?.passive.toFixed(2)}`
          : parseFloat(0).toFixed(2)
      }% Avg APY ${
        $userAddress
          ? `| ${
              $APYs
                ? $APYs?.passiveUser > 10000
                  ? "over 10000"
                  : `${$APYs?.passiveUser.toFixed(2)}`
                : parseFloat(0).toFixed(2)
            }% Your APY`
          : ""
      }`,
      tooltip: descriptions.default.tooltip_rewards_apy_passive}

    streams[1].substreams[0].apy ={value: `${
        $APYs
          ? $APYs?.active > 10000
            ? "over 10000"
            : `${$APYs?.active.toFixed(2)}`
          : parseFloat(0).toFixed(2)
      }% Avg APY ${
        $userAddress
          ? `| ${
              $APYs
                ? $APYs?.activeUser > 10000
                  ? "over 10000"
                  : `${$APYs?.activeUser.toFixed(2)}`
                : parseFloat(0).toFixed(2)
            }% Your APY`
          : ""
      }`,
    tooltip: descriptions.default.tooltip_active_rewards
    }
  }

  function addAllocated(){
    streams[1].substreams[0].metric.value = $totalUserAllocation + '%'
  }

  function addUserSubmittedChallenges(){
    streams[1].substreams[1].metric.value = $userSubmittedChallenges.length
  }

  function addVeOceanBalance(){
    streams[0].substreams[0].metric.value = `${$userBalances[
        getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN")
      ]
      ? parseFloat(
          $userBalances[
            getAddressByChainIdKey(
              process.env.VE_SUPPORTED_CHAINID,
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

  $:if($APYs) addAPYs()
  $:if($totalUserAllocation) addAllocated()
  $:if($userBalances) addVeOceanBalance()
  $:if($userSubmittedChallenges) addUserSubmittedChallenges()
  $:if($veClaimables) streams[0].substreams[0].availableRewards = $veClaimables
  $:if($lastActiveRewardsClaimRound >= 0 && $oceanUserRewards) setUnclaimedActiveRewardsSubstreamValues()
</script>

<div class="container">
  <h2 class="title">Reward Programs</h2>
  <div class="rewardsContainer">
  {#each streams as stream}
    <ClaimItem
      title={stream.name}
      distributedAmount={stream?.rewards}
      amount={`${parseFloat(stream.name.toLowerCase() == 'passive' ? $veClaimables : $dfClaimables).toFixed(2)} OCEAN`}
      loading={stream.name.toLowerCase() == 'passive' ? claiming === "VE_REWARDS" : claiming === "DF_REWARDS"}
      onClick={stream.name.toLowerCase() == 'passive' ? onClaimVeRewards : onClaimDfRewards}
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
