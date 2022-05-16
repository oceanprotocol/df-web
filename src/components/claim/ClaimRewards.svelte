<script>
  import {
    switchWalletNetwork,
    connectedChainId,
    userAddress,
    networkSigner,
  } from "../../stores/web3";
  import { claimRewards } from "../../utils/airdrops";
  import Row from "../common/Row.svelte";

  export let chainId;
  export let totalRewards;
  export let claimables;

  let rowinfo = {
    network: chainId,
    rewards: totalRewards,
  };

  console.log(claimables);

  let buttons = [];

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
        onClick: () =>
          claimRewards(
            $userAddress,
            $connectedChainId,
            claimables.tokens,
            claimables.tokensData,
            $networkSigner
          ),
        disabled: chainId !== $connectedChainId,
      },
    ];
  }
</script>

<Row rowObject={rowinfo} {buttons} size="large" />

<style>
</style>
