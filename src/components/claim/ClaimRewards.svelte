<script>
  import {
    switchWalletNetwork,
    connectedChainId,
    userAddress,
    networkSigner,
    selectedNetworks,
    web3Provider,
  } from "../../stores/web3";
  import { claimRewards, updateAllClaimables } from "../../utils/airdrops";
  import { airdrops } from "../../stores/airdrops";
  import Row from "../common/Row.svelte";
  import Swal from "sweetalert2";

  export let chainId;
  export let totalRewards;
  export let claimables;

  let loading = false;
  let rowinfo = {
    network: chainId,
    rewards: totalRewards,
  };

  let buttons = [];

  async function claim() {
    loading = true;
    const result = await claimRewards(
      $userAddress,
      $connectedChainId,
      claimables.tokens,
      claimables.tokensData,
      $networkSigner,
      $web3Provider
    );

    if (result === true) {
      Swal.fire(
        "Success!",
        `You've claimed your Data Farming rewards!`,
        "success"
      );
    } else {
      Swal.fire("Error!", "Failed to claim Data Farming rewards!", "error");
    }

    let newAirdrops = await updateAllClaimables(
      $userAddress,
      $selectedNetworks
    );
    airdrops.update(() => newAirdrops);
    loading = false;
  }

  $: if (totalRewards) {
    rowinfo = {
      network: chainId,
      rewards: totalRewards,
    };
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

<Row rowObject={rowinfo} {buttons} size="large" />

<style>
</style>
