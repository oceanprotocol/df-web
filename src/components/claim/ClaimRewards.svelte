<script>
  import {
    switchWalletNetwork,
    connectedChainId,
    userAddress,
    networkSigner,
    selectedNetworks,
    web3Provider,
  } from "../../stores/web3";
  import { airdrops, claimRewards, updateAllClaimables } from "../../stores/airdrops";
  import Row from "../common/Row.svelte";
  import Swal from "sweetalert2";

  export let chainId;
  export let totalRewards;
  export let claimables;

  let loading = false;
  let buttons = [];

  async function claim() {
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
              $airdrops,
              $selectedNetworks,
              $userAddress
          );
      })
    } else if(result === false) {
      Swal.fire("Error!", "Failed to claim Data Farming rewards!", "error");
    }

    loading = false;
  }

  $: if ($connectedChainId) {
    buttons = [
      {
        text: "Switch network",
        onClick: () => switchWalletNetwork(chainId),
        disabled: chainId === $connectedChainId,
      },
      {
        text: loading ? "lOADING.." : "Claim",
        onClick: () => claim(),
        disabled:
          chainId !== $connectedChainId || totalRewards === 0 || loading,
      },
    ];
  }
</script>

<Row rowObject={{network: chainId, rewards: totalRewards}} {buttons} size="large" />

<style>
</style>
