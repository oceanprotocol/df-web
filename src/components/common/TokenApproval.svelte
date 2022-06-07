<script>
  import Button from "./Button.svelte";
  import { approve as approveToken } from "../../utils/tokens";
  import { networkSigner, userAddress } from "../../stores/web3";
  import { isTokenAmountApproved } from "../../utils/tokens";

  export let disabled = false;
  export let loading = false;
  export let amount;
  export let tokenName;
  export let tokenAddress;
  export let poolAddress;

  let isAmountApproved;

  const onClick = async () => {
    loading = true;
    approveToken(tokenAddress, poolAddress, spender, amount, $networkSigner);
    loading = false;
  };

  $: amount,
    isTokenAmountApproved(
      tokenAddress,
      amount,
      poolAddress,
      $userAddress,
      $networkSigner
    ).then((resp) => {
      isAmountApproved = resp;
    });
</script>

<div>
  {#if isAmountApproved === false}
    <Button
      text={`Approve ${tokenName}`}
      onclick={() => onClick()}
      {disabled}
    />
  {:else}
    <slot />
  {/if}
</div>

<style>
</style>
