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
  } from "../../stores/airdrops";
  import ClaimItem from "../common/ClaimItem.svelte";
  import Swal from "sweetalert2";
  import { getRewardsFeeEstimate } from "../../utils/feeEstimate";
  import { updateUserBalanceOcean, userBalances } from "../../stores/tokens";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import { claim as claimVERewards } from "../../utils/feeDistributor";
  import { totalUserAllocation } from "../../stores/dataAllocations";

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
</script>

<div class={`container`}>
  <p class="title">Get your share of OCEAN rewards</p>
  <ClaimItem
    title="Passive"
    description="Shares based on user’s <strong>veOCEAN</strong> amount. 
    Lock your OCEAN to receive rewards."
    distributedAmount={roundInfo.passive}
    amount={`${parseFloat($veClaimables).toFixed(3)} OCEAN`}
    metrics={[
      {
        name: "balance",
        value: `${
          $userBalances[
            getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN")
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
    disabled={canClaimVE === false ||
      claiming !== undefined ||
      $veClaimables <= 0}
  />
  <ClaimItem
    title="Active"
    description="Shares based on <strong>allocation</strong> amount set upon datasets with consume volume. 
    Set allocations to receive rewards."
    amount={`${parseFloat($dfClaimables).toFixed(3)} OCEAN`}
    metrics={[{ name: "allocated", value: `${$totalUserAllocation}%` }]}
    distributedAmount={roundInfo.active}
    loading={claiming === "DF_REWARDS"}
    onClick={onClaimDfRewards}
    disabled={canClaimDF === false ||
      claiming !== undefined ||
      $dfClaimables <= 0}
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
