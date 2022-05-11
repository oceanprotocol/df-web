<script>
  import NetworkItem from "../common/NetworkItem.svelte";
  import { switchWalletNetwork } from "../../stores/web3";
  import Row from "../common/Row.svelte";

  export let chainId;
  let rowinfo = {
    network: chainId,
    rewards: "$200",
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
</script>

<Row rowObject={rowinfo} {buttons} size="large" />

<style>
</style>
