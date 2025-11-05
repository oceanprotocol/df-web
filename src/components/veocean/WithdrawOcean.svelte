<script>
  import {
    userAddress,
    connectedChainId,
  } from "../../stores/web3";
  import { updateUserBalanceOcean } from "../../stores/tokens";
  import Button from "../common/Button.svelte";
  import Swal from "sweetalert2";
  import {
    getLockedEndTime,
    getLockedOceanAmount,
    withdrawOcean,
  } from "../../utils/ve";
  import {
    oceanUnlockDate,
    lockedOceanAmount,
    veOceanWithDelegations,
  } from "../../stores/veOcean";
  import { fetchBlockNumber, getPublicClient } from '@wagmi/core'
  import moment from "moment";

  let loading = true;
  let withdrawing = false;
  let blockTimestamp = 0;
  let unlockTimestamp = 0;
  const supportedChainId = import.meta.env.VITE_VE_SUPPORTED_CHAINID

  const updateBlockTimestamp = async () => {
    try {
      const blockNumber = await fetchBlockNumber();
      const block = await getPublicClient().getBlock(blockNumber);
      // block.timestamp is in seconds, convert to milliseconds
      blockTimestamp = Number(block.timestamp) * 1000;
    } catch (error) {
      console.error("Failed to get block timestamp:", error);
      throw error;
    }
  };

  const updateLockEndDate = async () => {
    unlockTimestamp = await getLockedEndTime($userAddress);
    await oceanUnlockDate.update(() =>
      unlockTimestamp ? moment.utc(unlockTimestamp) : undefined
    );
  };

  const init = async () => {
    loading = true;

    await updateBlockTimestamp();
    await updateLockEndDate();

    loading = false;
  };

  $: if ($userAddress) {
    init();
  }

  const withdraw = async () => {
    // Refresh data before attempting withdrawal
    await updateBlockTimestamp();
    await updateLockEndDate();
    
    // Validate conditions before attempting withdrawal
    const lockedAmount = await getLockedOceanAmount($userAddress);
    const lockEndTime = await getLockedEndTime($userAddress);
    
    if (!lockedAmount || parseFloat(lockedAmount) <= 0) {
      Swal.fire("Error!", "No locked OCEAN tokens to withdraw.", "error");
      return;
    }
    
    if (!lockEndTime || blockTimestamp < lockEndTime) {
      const unlockDate = lockEndTime ? moment.utc(lockEndTime).format("YYYY-MM-DD HH:mm:ss UTC") : "N/A";
      Swal.fire(
        "Lock Period Not Ended",
        `You can withdraw your tokens after ${unlockDate}. Current time: ${moment.utc(blockTimestamp).format("YYYY-MM-DD HH:mm:ss UTC")}`,
        "warning"
      );
      return;
    }
    
    withdrawing = true;
    try {
      await withdrawOcean($userAddress);
      Swal.fire(
        "Success!",
        "OCEAN tokens successfully withdrawn.",
        "success"
      ).then(async () => {
        withdrawing = false;
        await updateUserBalanceOcean($userAddress);
        let lockedOceans = await getLockedOceanAmount(
          $userAddress
        );
        lockedOceanAmount.update(() => lockedOceans);

        await updateBlockTimestamp();
        await updateLockEndDate();
        loading = false;
      });
    } catch (error) {
      console.error("Withdraw error:", error);
      let errorMessage = error.message || "Unknown error occurred";
      
      // Provide more helpful error messages
      if (errorMessage.includes("execution reverted") || errorMessage.includes("UNPREDICTABLE_GAS_LIMIT")) {
        errorMessage = `Unable to withdraw. The transaction would revert. Please verify:\n1) Lock period has ended (current: ${moment.utc(blockTimestamp).format("YYYY-MM-DD HH:mm:ss UTC")}, unlock: ${moment.utc(lockEndTime).format("YYYY-MM-DD HH:mm:ss UTC")})\n2) You have ${lockedAmount} locked tokens\n3) You are on the correct network`;
      }
      
      Swal.fire("Error!", errorMessage, "error").then(() => {
        withdrawing = false;
      });
    }
  };
</script>

<div class={`container`}>
  <div class="item">
    <Button
      text={blockTimestamp <= unlockTimestamp
        ? "Withdraw all locked"
        : withdrawing
        ? "Withdrawing..."
        : "Withdraw all locked"}
      disabled={loading ||
        withdrawing ||
        !$oceanUnlockDate ||
        parseInt(supportedChainId) !== $connectedChainId ||
        $lockedOceanAmount <= 0 ||
        blockTimestamp < unlockTimestamp}
      onclick={() => withdraw()}
    />
  </div>
  <div class="item">
    {#if $lockedOceanAmount > 0}
      <p>
        <strong>OCEAN</strong> withdrawal will be enabled as soon as the lock period
        is over.
      </p>
    {:else}
      <p>
        No <strong>OCEAN</strong> tokens locked.
      </p>
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    grid-column: 1 / 3;
    width: 100%;
  }

  .item {
    width: 100%;
    margin-top: calc(var(--spacer) / 2);
    display: flex;
    justify-content: center;
  }

  .item p {
    font-size: var(--font-size-small);
  }

  .item:last-child {
    margin-top: calc(var(--spacer) / 6);
    margin-bottom: 0;
  }
</style>
