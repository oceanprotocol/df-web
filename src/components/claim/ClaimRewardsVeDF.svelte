<script>
  import {
    connectedChainId,
    userAddress,
    networkSigner,
    selectedNetworks,
  } from "../../stores/web3";
  import {
    airdrops,
    veClaimables,
    dfClaimables,
    claimDFRewards,
    claimVERewards,
    updateAllClaimables,
  } from "../../stores/airdrops";
  import ClaimItem from "../common/ClaimItem.svelte";
  import Swal from "sweetalert2";
  import { getRewardsFeeEstimate } from "../../utils/feeEstimate";

  let claiming;

  async function onClaimDfRewards() {
    claiming = "DF_REWARDS";
    try {
      await claimDFRewards(
        $airdrops,
        $connectedChainId,
        $userAddress,
        $networkSigner
      );
      Swal.fire(
        "Success!",
        `You've claimed your Data Farming rewards!`,
        "success"
      ).then(async () => {
        await updateAllClaimables(
          JSON.parse(process.env.AIRDROP_CONFIG),
          $selectedNetworks,
          $userAddress
        );
      });
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
    claiming = undefined;
  }

  // Todo
  async function onClaimVeRewards() {
    claiming = "VE_REWARDS";
    try {
      await claimVERewards($userAddress, $networkSigner);
      Swal.fire("Success!", `You've claimed your VE rewards!`, "success").then(
        async () => {
          veClaimables.set(await getRewardsFeeEstimate($userAddress));
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
    title="VE Claimable"
    amount={parseFloat($veClaimables).toFixed(3)}
    loading={claiming === "VE_REWARDS"}
    onClick={onClaimVeRewards}
    disabled={claiming !== undefined || $veClaimables <= 0}
  />
  <ClaimItem
    title="DF Claimable"
    amount={parseFloat($dfClaimables).toFixed(3)}
    loading={claiming === "DF_REWARDS"}
    onClick={onClaimDfRewards}
    disabled={claiming !== undefined || $dfClaimables <= 0}
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