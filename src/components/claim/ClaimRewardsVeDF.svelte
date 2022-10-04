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
  import { updateUserBalanceOcean } from "../../stores/tokens";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import { claim as claimVERewards } from "../../utils/feeDistributor";

  export let canClaimVE = true;
  export let canClaimDF = true;
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
          const claimableEstimate = await getRewardsFeeEstimate($userAddress, $web3Provider);
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
  <ClaimItem
    title="veOCEAN Claimable"
    amount={`${parseFloat($veClaimables).toFixed(3)} OCEAN`}
    loading={claiming === "VE_REWARDS"}
    onClick={onClaimVeRewards}
    disabled={canClaimVE === false ||
      claiming !== undefined ||
      $veClaimables <= 0}
  />
  <ClaimItem
    title="DF Claimable"
    amount={`${parseFloat($dfClaimables).toFixed(3)} OCEAN`}
    loading={claiming === "DF_REWARDS"}
    onClick={onClaimDfRewards}
    disabled={canClaimDF === false ||
      claiming !== undefined ||
      $dfClaimables <= 0}
  />
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: hidden;
    padding-top: 40px;
  }
</style>
