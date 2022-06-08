<script>
  import Button from "./Button.svelte";
  import {
    approve as approveToken,
    isTokenAmountApproved,
  } from "../../utils/tokens";
  import { networkSigner, userAddress } from "../../stores/web3";
  import Swal from "sweetalert2";

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
    try {
      let resp = await approveToken(
        tokenAddress,
        poolAddress,
        amount,
        $networkSigner
      );
    } catch (e) {
      Swal.fire("Error!", e.message, "error").then(() => {
        loading = false;
        approving = false;
      });
      return;
    }
    Swal.fire("Success!", "Tokens succesfully approved.", "success").then(
      async () => {
        isAmountApproved = true;
        loading = false;
        approving = false;
      }
    );
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
