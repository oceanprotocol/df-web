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
  import { totalUserAllocation } from "../../stores/dataAllocations";
  import { oceanUnlockDate } from "../../stores/veOcean";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  export let canClaimVE = true;
  export let canClaimDF = true;
  export let roundInfo;
  let claiming;

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

  function getAPY(type){
    let apy={}
    if(type=='passive'){
      apy.value = `${
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
      }`
      apy.tooltip = descriptions.default.tooltip_rewards_apy_passive
    }else{
      apy.value = `${
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
      }`
      apy.tooltip = descriptions.default.tooltip_active_rewards
    }
    return apy
  }

  /*
  <ClaimItem
      title="Active"
      apy={`${
        $APYs
          ? $APYs?.active > 10000
            ? "over 10000"
            : `${$APYs?.active.toFixed(2)}`
          : 0
      }% Avg APY ${
        $userAddress
          ? `| ${
              $APYs
                ? $APYs?.activeUser > 10000
                  ? "over 10000"
                  : `${$APYs?.activeUser.toFixed(2)}`
                : 0
            }% Your APY`
          : ""
      }`}
      apyTooltip={descriptions.default.tooltip_rewards_apy_active}
      amount={`${parseFloat($dfClaimables).toFixed(3)} OCEAN`}
      rewardTooltip={descriptions.default.tooltip_active_rewards}
      metrics={[{ name: "allocated", value: `${$totalUserAllocation}%` }]}
      showRedirectLink={(!$oceanUnlockDate || $totalUserAllocation <= 0) &&
        $dfClaimables <= 0}
      redirectLink={{ text: "Set allocations", url: "datafarming" }}
      distributedAmount={roundInfo?.active}
      loading={claiming === "DF_REWARDS"}
      onClick={onClaimDfRewards}
      disabled={canClaimDF === false ||
        claiming !== undefined ||
        $dfClaimables <= 0}
      disableRedirect={!$oceanUnlockDate}
    />
  */
  console.log(getAPY('passive'))
</script>

<div class="container">
  <h2 class="title">Reward Programs</h2>
  <div class="rewardsContainer">
  {#each roundInfo?.streams as stream}
    <ClaimItem
      title={stream.name}
      distributedAmount={stream?.rewards}
      apy={getAPY(stream.name.toLowerCase())}
      showRedirectLink={!$oceanUnlockDate && $veClaimables <= 0}
      redirectLink={{ text: "Get veOCEAN", url: "veocean" }}
      amount={`${parseFloat($veClaimables).toFixed(2)} OCEAN`}
      metrics={[
        {
          name: "balance",
          value: `${
            $userBalances[
              getAddressByChainIdKey(
                process.env.VE_SUPPORTED_CHAINID,
                "veOCEAN"
              )
            ]
              ? parseFloat(
                  $userBalances[
                    getAddressByChainIdKey(
                      process.env.VE_SUPPORTED_CHAINID,
                      "veOCEAN"
                    )
                  ]
                ).toFixed(3)
              : 0
          } veOCEAN`,
        },
      ]}
      loading={claiming === "VE_REWARDS"}
      onClick={onClaimVeRewards}
      substreams={stream.substreams}
      disabled={canClaimVE === false ||
        claiming !== undefined ||
        $veClaimables <= 0}
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
