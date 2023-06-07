<script>
  import {
    userAddress,
    networkSigner,
    connectedChainId,
    web3Provider,
  } from "../../stores/web3";
  import {
    veClaimables,
    dfClaimables,
    claimDFReward,
    getDFRewards,
    APYs,
  } from "../../stores/airdrops";
  import ClaimItem from "../common/ClaimItem.svelte";
  import Swal from "sweetalert2";
  import { getRewardsFeeEstimate } from "../../utils/feeEstimate";
  import { updateUserBalanceOcean, userBalances } from "../../stores/tokens";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import { claim as claimVERewards } from "../../utils/feeDistributor";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  export let canClaimVE = true;
  export let canClaimDF = true;
  export let roundInfo;
  let claiming;
  let loading = false;

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
        await updateUserBalanceOcean($userAddress, $web3Provider);
      });
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
    claiming = undefined;
  }

  async function onClaimVeRewards() {
    claiming = "VE_REWARDS";
    try {
      await claimVERewards($userAddress, $networkSigner);
      Swal.fire("Success!", `You've claimed your VE rewards!`, "success").then(
        async () => {
          const claimableEstimate = await getRewardsFeeEstimate(
            $userAddress,
            $web3Provider
          );
          veClaimables.set(claimableEstimate);
          await updateUserBalanceOcean($userAddress, $web3Provider);
        }
      );
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
    claiming = undefined;
  }

  function getAPY(){
    roundInfo.streams[0].substreams[0].apy = {value: `${
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

    roundInfo.streams[1].substreams[0].apy ={value: `${
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

  $:if($APYs) getAPY()
  $:if($userAddress) getAPY()
</script>

<div class="container">
  <h2 class="title">Reward Programs</h2>
  <div class="rewardsContainer">
  {#each roundInfo?.streams as stream}
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
  @media (min-width: 640px) {
  }
</style>
