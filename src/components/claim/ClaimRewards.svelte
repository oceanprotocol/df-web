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

  export let chainId;
  export let totalRewards;
  export let claimables;

  let rowinfo = {
    network: chainId,
    rewards: totalRewards,
  };

  let buttons = [];

  async function claim() {
    await claimRewards(
      $userAddress,
      $connectedChainId,
      claimables.tokens,
      claimables.tokensData,
      $networkSigner,
      $web3Provider
    );
    let newAirdrops = await updateAllClaimables(
      $userAddress,
      $selectedNetworks
    );
    airdrops.update(() => newAirdrops);
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
        onClick: () => switchWalletNetwork,
        disabled: chainId === $connectedChainId,
      },
      {
        text: "Claim",
        onClick: () => claim(),
        disabled: chainId !== $connectedChainId || totalRewards !== 0,
      },
    ];
  }
</script>

<Row rowObject={rowinfo} {buttons} size="large" />

<style>
</style>
