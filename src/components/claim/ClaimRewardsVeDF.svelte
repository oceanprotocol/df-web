<script>
  import {
    connectedChainId,
    userAddress,
    networkSigner,
    selectedNetworks,
  } from "../../stores/web3";
  import {
    airdrops,
    claimRewards,
    updateAllClaimables,
  } from "../../stores/airdrops";
  import ClaimItem from "../common/ClaimItem.svelte";
  import Swal from "sweetalert2";
  import {
    veClaimables,
    dfClaimables,
  } from "../../stores/claimables";

  async function claimDfRewards() {
    loading = true;

    const result = await claimRewards(
      $airdrops,
      $connectedChainId,
      claimables.tokensData,
      $userAddress,
      $networkSigner
    );

    if (result > 0) {
      Swal.fire(
        "Success!",
        `You've claimed your Data Farming rewards!`,
        "success"
      ).then(async (result) => {
        await updateAllClaimables(
          JSON.parse(process.env.AIRDROP_CONFIG),
          $selectedNetworks,
          $userAddress
        );
      });
    } else if (result === false) {
      Swal.fire("Error!", "Failed to claim Data Farming rewards!", "error");
    }

    loading = false;
  }

  // Todo
  async function claimVeRewards() {
    loading = true;
  }

</script>

<div class={`container`}>
  <ClaimItem title="VE Claimable" amount={$veClaimables} onClick={claimVeRewards}/>
  <ClaimItem title="DF Claimable" amount={$dfClaimables} onClick={claimDfRewards}/>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: calc(var(--spacer) / 4) 8%;
    overflow-y: hidden;
    min-width: 450px;
  }
</style>
