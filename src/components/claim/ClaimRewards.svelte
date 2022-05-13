<script>
  import { switchWalletNetwork, connectedChainId } from "../../stores/web3";
  import Row from "../common/Row.svelte";

  export let chainId;
  export let totalRewards;

  let rowinfo = {
    network: chainId,
    rewards: totalRewards,
  };

  console.log(chainId, $connectedChainId);

  let buttons = [
    {
      text: "Switch network",
      onClick: switchWalletNetwork,
      disabled: chainId === $connectedChainId,
    },
    {
      text: "Claim",
      onClick: switchWalletNetwork,
      disabled: chainId !== $connectedChainId,
    },
  ];

  $: if (totalRewards) {
    rowinfo = {
      network: chainId,
      rewards: totalRewards,
    };
  }
</script>

<Row rowObject={rowinfo} {buttons} size="large" />

<style>
</style>
