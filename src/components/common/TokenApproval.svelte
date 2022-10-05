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
  export let fullWidth = undefined;
  export let amount;
  export let infiniteAmount = false;
  export let tokenName;
  export let tokenAddress;
  export let spender;
  export let approving = false;

  export let agreed = false;

  let isAmountApproved;

  const onClick = async () => {
    loading = true;
    approving = true;
    try {
      let tx = await approveToken(
        tokenAddress,
        spender,
        infiniteAmount ? 2 ** 53 - 1 : amount,
        $networkSigner
      );
      const receipt = await tx.wait();
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
      spender,
      $networkSigner
    ).then((resp) => {
      isAmountApproved = resp;
      loading = false;
    });
</script>

{#if isAmountApproved === false}
  <Button
    {fullWidth}
    loading={approving}
    text={infiniteAmount
      ? `Allow the OceanDAO to use your ${tokenName}`
      : `Approve ${amount} ${tokenName}${amount > 1 ? "s" : ""}`}
    onclick={() => onClick()}
    disabled={disabled || loading || !agreed}
  />
{:else}
  <slot />
{/if}

<style>
</style>
