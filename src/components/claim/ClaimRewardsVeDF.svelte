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
  export let loading = false;
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
</script>

<div class={`container`}>
  <h3 class="title">Earn OCEAN Rewards</h3>
  <ClaimItem
    title="Passive"
    description="Earn Passive Rewards from Data Farming by <strong>locking OCEAN</strong> and <strong>holding veOCEAN</strong>."
    distributedAmount={roundInfo?.passive}
    apy={`${
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
    }`}
    apyTooltip={descriptions.default.tooltip_rewards_apy_passive}
    showRedirectLink={!$oceanUnlockDate && $veClaimables <= 0}
    redirectLink={{ text: "Get veOCEAN", url: "veocean" }}
    amount={`${parseFloat($veClaimables).toFixed(2)} OCEAN`}
    metrics={[
      {
        name: "balance",
        value: `${
          $userBalances[
            getAddressByChainIdKey(
              import.meta.env.VITE_VE_SUPPORTED_CHAINID,
              "veOCEAN"
            )
          ]
            ? parseFloat(
                $userBalances[
                  getAddressByChainIdKey(
                    import.meta.env.VITE_VE_SUPPORTED_CHAINID,
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
    disabled={canClaimVE === false ||
      claiming !== undefined ||
      $veClaimables <= 0}
  />
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
    description="Earn Active Rewards from Data Farming by <strong>allocating veOCEAN</strong> and <strong>curating quality data</strong>."
    amount={`${parseFloat($dfClaimables).toFixed(3)} OCEAN`}
    rewardTooltip={descriptions.default.tooltip_active_rewards}
    metrics={[{ name: "allocated", value: `${$totalUserAllocation}%` }]}
    showRedirectLink={(!$oceanUnlockDate || $totalUserAllocation <= 0) &&
      $dfClaimables <= 0}
    redirectLink={{ text: "Set allocations", url: "data" }}
    distributedAmount={roundInfo?.active}
    loading={claiming === "DF_REWARDS"}
    onClick={onClaimDfRewards}
    disabled={canClaimDF === false ||
      claiming !== undefined ||
      $dfClaimables <= 0}
    disableRedirect={!$oceanUnlockDate}
  />
</div>

<style>
  .container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--spacer) / 2);
    flex-direction: row;
    margin: calc(var(--spacer)) 0;
  }
  .title {
    font-weight: bold;
    width: 100%;
    font-size: var(--font-size-normal);
  }

  @media (min-width: 640px) {
    .container {
      gap: calc(var(--spacer) / 2);
    }
  }
</style>
