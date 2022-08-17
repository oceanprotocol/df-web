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
  let allocatedAmount = undefined;
  let estimatedRewards = 0.0;
  let availableAllocation = undefined;
  let totalAllocationForUser = 100;
  let canAllocate = false;

  const updateBalance = async () => {
    let newAllocation = $totalUserAllocation;
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
    if (!$totalUserAllocation) {
      newAllocation = await getTotalAllocatedVeOcean($userAddress);
      totalUserAllocation.update(() => newAllocation);
    }
    availableAllocation = totalAllocationForUser - newAllocation;
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
        availableAllocation = totalAllocationForUser - newAllocation;
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
    if (amountToAllocate >= 0.0 && data.chainId === $connectedChainId) {
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
      amountToAllocate &&
      amountToAllocate >= 0.0 &&
      amountToAllocate <= availableAllocation;
  }

  async function switchNetwork() {
    await switchWalletNetwork(data.chainId);
  }

  $: if (availableAllocation) {
    updateCanAllocate();
  }
</script>

{#if data}
  <div class="header">
    <h4>Allocate</h4>
    <span>veOCEAN</span>
  </div>
  <div class="components-container">
    {#if $userAddress && data.chainId !== $connectedChainId}
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
          title={`Allocated`}
          value={allocatedAmount ? `${allocatedAmount}%` : "loading..."}
        />
        <ItemWithLabel
          title={`Allocation available`}
          value={availableAllocation ? `${availableAllocation}%` : "loading..."}
        />
        <ItemWithLabel
          title="Estimated Rewards"
          value={`${parseFloat(estimatedRewards).toFixed(3)} ${data.basetoken}`}
        />
      </div>
      <div class="inputContainer percentage">
        <Input
          type="number"
          bind:value={amountToAllocate}
          min="-1"
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
  .percentage {
    width: 80px;
    display: inline-block;
    position: relative;
  }
  .percentage:hover::after,
  .percentage:focus-within::after {
    right: 2.5em;
  }
  /* handle Firefox (arrows always shown) */
  @supports (-moz-appearance: none) {
    .percentage::after {
      right: 2.5em;
    }
  }
  .percentage::after {
    position: absolute;
    top: 6px;
    right: 0.5em;
    transition: all 0.05s ease-in-out;
    content: "%";
  }
</style>
