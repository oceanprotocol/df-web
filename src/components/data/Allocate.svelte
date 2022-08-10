<script>
  import {
    userAddress,
    networkSigner,
    connectedChainId,
    switchWalletNetwork,
  } from "../../stores/web3";
  import { userBalances, addUserBalanceToBalances } from "../../stores/tokens";
  import { ethers } from "ethers";
  import Button from "../common/Button.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import Swal from "sweetalert2";
  import TokenApproval from "../common/TokenApproval.svelte";
  import Input from "../common/Input.svelte";
  import {
    getAllocatedAmountForAddress,
    calculatePoolShares,
  } from "../../utils/dataAllocations";
  import { getRewardsForPoolUser } from "../../utils/rewards";
  import { calcMaxAllowedStakeInput } from "../../utils/data";
  import { rewards } from "../../stores/airdrops";
  import { dataAllocations } from "../../stores/dataAllocations";
  import { allocateVeOcean } from "../../utils/dataAllocations";

  export let data;
  export let loading = false;

  let amountToAllocate = 0.0;
  let allocatedAmount = 0.0;
  let currentPoolShare = 0.0;
  let calcBPTOut = 0.0;
  let estimatedRewards = 0.0;
  let canAllocate = false;
  let maxPoolInputAllowed = calcMaxAllowedStakeInput(data.tvl * 2);

  const updateBalance = async () => {
    allocatedAmount = await getAllocatedAmountForAddress(
      $dataAllocations,
      data.poolAddress
    );
    calcBPTOut = await calculatePoolShares(data.tvl * 2, allocatedAmount);
    if (!rewards) {
    }
    estimatedRewards = getRewardsForPoolUser(
      $rewards,
      $userAddress,
      data.poolAddress
    );
    currentPoolShare = calcBPTOut;
    await addUserBalanceToBalances(data.chainId, data.basetokenAddress);
  };

  $: if ($userAddress && data.chainId === $connectedChainId) {
    updateBalance();
  }

  async function allocateVeOceanToData() {
    const tx = await allocateVeOcean(
      amountToAllocate,
      data.basetokenAddress,
      $connectedChainId,
      $networkSigner
    );

    console.log("allocateVeOCEAN tx: ", tx);
    if (tx) {
      let receipt = await tx.wait();
      console.log("allocateVeOCEAN receipt: ", receipt);

      if (receipt.events) {
        const allocateEvent = receipt.events.filter(
          (x) => x.event === "LOG_BPT_SS"
        );
        if (allocateEvent[0].event === "LOG_BPT_SS") {
          calcBPTOut = ethers.utils.formatEther(
            BigInt(allocateEvent[0].args.bptAmount).toString(10)
          );
          console.log("allocateVeOCEAN: ", calcBPTOut);
          return {
            event: allocateEvent,
            calcBPTOut: calcBPTOut,
          };
        }
      }
    }

    throw "Allocation failed";
  }

  async function allocate() {
    try {
      loading = true;
      const results = await allocateVeOceanToData();
      if (results && results.calcBPTOut > 0.0) {
        Swal.fire(
          "Success!",
          "You've allocate veOCEAN to data NFT.",
          "success"
        ).then(async () => {
          amountToAllocate = 0;
          await updateBalance();
          updateCanAllocate();
          loading = false;
        });
      }
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

  async function handleStakeAmount() {
    loading = true;
    calcBPTOut = 0.0;
    if (amountToAllocate > 0.0 && data.chainId === $connectedChainId) {
      await updateBalance();
      calcBPTOut = await calculatePoolShares(
        data.tvl * 2,
        amountToAllocate + allocatedAmount
      );
      updateCanAllocate();
      loading = false;
    } else {
      calcBPTOut = currentPoolShare;
      canAllocate = false;
      loading = false;
    }
  }

  function updateCanAllocate() {
    canAllocate =
      amountToAllocate > 0.0 &&
      amountToAllocate <= $userBalances[data.basetokenAddress] &&
      amountToAllocate < maxPoolInputAllowed;
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
          title={`veOCEAN Balance`}
          value={parseFloat($userBalances[data.basetokenAddress]).toFixed(3)}
        />
        <ItemWithLabel
          title={`veOCEAN allocated`}
          value={parseFloat(allocatedAmount).toFixed(3)}
        />
        <ItemWithLabel
          title="Calc Pool Shares"
          value={`${parseFloat(calcBPTOut).toFixed(2)}%`}
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
          max={maxPoolInputAllowed > $userBalances[data.basetokenAddress]
            ? $userBalances[data.basetokenAddress]
            : maxPoolInputAllowed}
          onChange={handleStakeAmount}
        />
      </div>
      <TokenApproval
        tokenAddress={data.basetokenAddress}
        tokenName={data.basetoken}
        poolAddress={data.poolAddress}
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
