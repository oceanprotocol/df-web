<script>
  import {
    userAddress,
    networkSigner,
    connectedChainId,
    switchWalletNetwork,
  } from "../../stores/web3";
  import { userBalances } from "../../stores/tokens";
  import Button from "../common/Button.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import Swal from "sweetalert2";
  import TokenApproval from "../common/TokenApproval.svelte";
  import Input from "../common/Input.svelte";
  import { getRewardsForPoolUser } from "../../utils/rewards";
  import { rewards } from "../../stores/airdrops";
  import {
    allocateVeOcean,
    getAllocatedVeOcean,
    getTotalAllocatedVeOcean,
  } from "../../utils/dataAllocations";
  import { totalUserAllocation } from "../../stores/dataAllocations";

  export let data;
  export let loading = false;

  let amountToAllocate = 0.0;
  let allocatedAmount = 0.0;
  let estimatedRewards = 0.0;
  let canAllocate = false;

  const updateBalance = async () => {
    allocatedAmount = await getAllocatedVeOcean(
      $userAddress,
      data.DTAddress,
      $connectedChainId
    );
    if (!rewards) {
    }
    estimatedRewards = getRewardsForPoolUser(
      $rewards,
      $userAddress,
      data.poolAddress
    );
  };

  $: if ($userAddress && data.chainId === $connectedChainId) {
    updateBalance();
  }

  async function allocate() {
    try {
      loading = true;
      await allocateVeOcean(
        amountToAllocate,
        data.DTAddress,
        $connectedChainId,
        $networkSigner
      );
      Swal.fire(
        "Success!",
        "You've allocate veOCEAN to data NFT.",
        "success"
      ).then(async () => {
        amountToAllocate = 0;
        await updateBalance();
        updateCanAllocate();
        let newAllocation = await getTotalAllocatedVeOcean($userAddress);
        totalUserAllocation.update(() => newAllocation);
        loading = false;
      });
    } catch (error) {
      console.log("Error: ", error);
      Swal.fire(
        "Error!",
        "Failed to allocate veOCEAN to data NFT.",
        "error"
      ).then(() => {
        loading = false;
      });
    }
  }

  async function handleAllocateAmountChange() {
    loading = true;
    if (amountToAllocate > 0.0 && data.chainId === $connectedChainId) {
      await updateBalance();
      updateCanAllocate();
      loading = false;
    } else {
      canAllocate = false;
      loading = false;
    }
  }

  function updateCanAllocate() {
    canAllocate =
      amountToAllocate > 0.0 &&
      amountToAllocate <= $userBalances[process.env.VE_OCEAN_CONTRACT];
  }

  async function switchNetwork() {
    await switchWalletNetwork(data.chainId);
  }
</script>

{#if data}
  <div class="header">
    <h4>Allocate</h4>
    <span>veOCEAN</span>
  </div>
  <div class="components-container">
    {#if $userAddress && process.env.VE_SUPPORTED_CHAINID !== $connectedChainId}
      <div class="button">
        <Button
          text="Switch Network"
          onclick={() => switchNetwork()}
          disabled={!$userAddress}
        />
      </div>
    {:else}
      <div class="items-container">
        <ItemWithLabel
          title={`veOCEAN Balance`}
          value={parseFloat(
            $userBalances[process.env.VE_OCEAN_CONTRACT]
          ).toFixed(3)}
        />
        <ItemWithLabel
          title={`veOCEAN allocated`}
          value={parseFloat(allocatedAmount).toFixed(3)}
        />
        <ItemWithLabel
          title="Estimated Rewards"
          value={`${parseFloat(estimatedRewards).toFixed(3)} ${data.basetoken}`}
        />
      </div>
      <div class="inputContainer">
        <Input
          type="number"
          bind:value={amountToAllocate}
          min="0"
          max={$userBalances[process.env.VE_OCEAN_CONTRACT]}
          onChange={handleAllocateAmountChange}
        />
      </div>
      <TokenApproval
        tokenAddress={data.basetokenAddress}
        tokenName="veOCEAN"
        poolAddress={process.env.VE_OCEAN_CONTRACT}
        amount={amountToAllocate}
        disabled={!canAllocate}
        bind:loading
      >
        <Button
          text={loading ? "Allocating" : "Allocate"}
          onclick={() => allocate()}
          disabled={!canAllocate || loading}
        />
      </TokenApproval>
    {/if}
  </div>
{:else}{/if}

<style>
  .components-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .items-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: calc(var(--spacer) / 4);
  }
  .button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: calc(var(--spacer) / 2);
  }
  h4 {
    margin-right: calc((var(--spacer)) / 6);
  }
  .inputContainer {
    margin-bottom: calc(var(--spacer) / 4);
  }
</style>
