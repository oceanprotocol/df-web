<script>
  import { switchWalletNetwork } from "../../stores/web3";
  import Row from "../common/Row.svelte";

  export let chainId;
  export let totalRewards;

  let rowinfo = {
    network: chainId,
    rewards: totalRewards,
  };

  let buttons = [
    {
      text: "Switch network",
      onClick: switchWalletNetwork,
    },
    {
      text: "Claim",
      onClick: switchWalletNetwork,
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
