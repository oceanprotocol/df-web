<script>
  import {
    userAddress,
    connectedChainId,
    switchWalletNetwork,
    getNetworkDataById,
  } from "../../stores/web3";
  import Button from "../common/Button.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import Swal from "sweetalert2";
  import { getRewardsForDataAllocation } from "../../utils/rewards";
  import { rewards } from "../../stores/airdrops";
  import {
    allocateVeOcean,
    getAllocatedVeOcean,
    getTotalAllocatedVeOcean,
  } from "../../utils/dataAllocations";
  import { totalUserAllocation } from "../../stores/dataAllocations";
  import RangeSliderInput from "../common/RangeSliderInput.svelte";
  import * as networksDataArray from "../../networks-metadata.json";

  let networksData = networksDataArray.default;

  export let data;
  export let loading = false;

  let amountToAllocate = 0.0;
  let allocatedAmount = undefined;
  let estimatedRewards = 0.0;
  let availableAllocation = undefined;
  let totalAllocationForUser = 100;
  let canAllocate = false;
  const supportedChainId = import.meta.env.VITE_VE_SUPPORTED_CHAINID

  const updateBalance = async () => {
    let newTotalUserAllocation = $totalUserAllocation;
    allocatedAmount = await getAllocatedVeOcean(
      $userAddress,
      data.nftAddress,
      $connectedChainId
    );
    amountToAllocate = allocatedAmount;
    if (!rewards) {
    }
    estimatedRewards = getRewardsForDataAllocation(
      $rewards,
      $userAddress,
      data.nftAddress
    );
    if (!$totalUserAllocation) {
      newTotalUserAllocation = await getTotalAllocatedVeOcean(
        $userAddress
      );
      totalUserAllocation.update(() => newTotalUserAllocation);
    }
    updateAvailableAllocation(newTotalUserAllocation);
  };

  const updateAvailableAllocation = (totalUserAllocation) => {
    availableAllocation =
      parseInt(totalAllocationForUser) -
      parseInt(totalUserAllocation) +
      parseInt(allocatedAmount);
  };

  $: if (
    $userAddress &&
    parseInt(supportedChainId) === $connectedChainId
  ) {
    updateBalance();
  }

  async function allocate() {
    try {
      loading = true;
      await allocateVeOcean(
        amountToAllocate,
        data.nftAddress,
        $connectedChainId
      );
      Swal.fire(
        "Success!",
        `You've allocate ${amountToAllocate}% of total allocations to data NFT.`,
        "success"
      ).then(async () => {
        amountToAllocate = 0;
        await updateBalance();
        updateCanAllocate();
        let newTotalUserAllocation = await getTotalAllocatedVeOcean(
          $userAddress
        );
        totalUserAllocation.update(() => newTotalUserAllocation);
        updateAvailableAllocation(newTotalUserAllocation);
        loading = false;
      });
    } catch (error) {
      console.log("Error: ", error);
      Swal.fire(
        "Error!",
        "Failed to allocate ${amountToAllocate}% of total allocations to data NFT.",
        "error"
      ).then(() => {
        loading = false;
      });
    }
  }

  async function handleAllocateAmountChange(newValue) {
    loading = true;
    amountToAllocate = newValue;
    if (
      amountToAllocate > 0.0 &&
      parseInt(supportedChainId) === $connectedChainId
    ) {
      updateCanAllocate();
      loading = false;
    } else {
      canAllocate = false;
      loading = false;
    }
  }

  function updateCanAllocate() {
    canAllocate =
      amountToAllocate !== null &&
      amountToAllocate >= 0 &&
      amountToAllocate <= availableAllocation;
  }

  async function switchNetwork() {
    await switchWalletNetwork(supportedChainId);
  }

  $: if (availableAllocation) {
    updateCanAllocate();
  }
</script>

{#if data}
  <div class="header">
    <h4>Allocation</h4>
  </div>
  <div class="components-container">
    {#if $userAddress && parseInt(supportedChainId) !== $connectedChainId}
      <div class="button">
        <Button
          text={`Switch Network to ${
            getNetworkDataById(
              networksData,
              parseInt(supportedChainId)
            )?.name
          }`}
          onclick={() => switchNetwork()}
          disabled={!$userAddress}
        />
      </div>
    {:else}
      <div class="items-container">
        <ItemWithLabel
          title={`Allocated`}
          value={allocatedAmount !== undefined
            ? `${allocatedAmount}%`
            : "loading..."}
        />
        <ItemWithLabel
          title={`Available allocation`}
          value={availableAllocation >= 0
            ? `${availableAllocation}%`
            : "loading..."}
        />
        <ItemWithLabel
          title="Estimated Rewards"
          value={`${parseFloat(estimatedRewards).toFixed(3)} ${data.basetoken}`}
        />
      </div>
      <div class="inputContainer percentage">
        <RangeSliderInput
          min={0}
          value={[allocatedAmount]}
          max={availableAllocation}
          last={availableAllocation > 0 ? "label" : false}
          onChange={handleAllocateAmountChange}
          disabled={availableAllocation === 0}
        />
      </div>
      <Button
        text={loading ? "Allocating" : `Set allocation to ${amountToAllocate}%`}
        onclick={() => allocate()}
        disabled={!canAllocate || loading}
      />
    {/if}
  </div>
{/if}

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
    width: 100%;
  }
</style>
