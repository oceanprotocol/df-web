<script>
  import Button from "./Button.svelte";
  import {
    approve as approveToken,
    isTokenAmountApproved,
  } from "../../utils/tokens";
  import { networkSigner, userAddress } from "../../stores/web3";

  export let disabled = false;
  export let loading = false;
  export let amount;
  export let tokenName;
  export let tokenAddress;
  export let poolAddress;
  export let approving = false;

  let isAmountApproved;

  const onClick = async () => {
    loading = true;
    approving = true;
    let resp = await approveToken(
      tokenAddress,
      poolAddress,
      amount,
      $networkSigner
    );
    if (resp) {
      isAmountApproved = true;
    }
    loading = false;
    approving = false;
  };

  $: amount,
    isTokenAmountApproved(
      tokenAddress,
      amount,
      $userAddress,
      poolAddress,
      $networkSigner
    ).then((resp) => {
      isAmountApproved = resp;
    });
</script>

<div>
  {#if isAmountApproved === false}
    <Button
      text={approving
        ? "Approving"
        : `Approve ${amount} ${tokenName}${amount > 1 ? "s" : ""}`}
      onclick={() => onClick()}
      disabled={disabled || loading}
    />
  {:else}
    <slot />
  {/if}
</div>

<style>
</style>
