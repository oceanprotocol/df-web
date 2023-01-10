<script>
  import {
    userAddress,
    networkSigner,
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
  import { fetchBlockNumber,getProvider } from '@wagmi/core'
  import { getUserVotingPowerWithDelegations } from "../../utils/delegations";
  import moment from "moment";

  let loading = true;
  let withdrawing = false;
  let blockTimestamp = 0;
  let unlockTimestamp = 0;

  const updateBlockTimestamp = async () => {
    const blockNumber = await fetchBlockNumber();
    blockTimestamp = getProvider().getBlock(blockNumber).timestamp * 1000;
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
    withdrawing = true;
    try {
      await withdrawOcean($networkSigner);
    } catch (error) {
      Swal.fire("Error!", error.message, "error").then(() => {});
      withdrawing = false;
      return;
    }
    Swal.fire(
      "Success!",
      "OCEAN tokens successfully withdrawn.",
      "success"
    ).then(async () => {
      withdrawing = false;
      await updateUserBalanceOcean($userAddress);
      let lockedOceans = await getLockedOceanAmount(
        $userAddress,
        $networkSigner
      );
      lockedOceanAmount.update(() => lockedOceans);
      const newVeOceansWithDelegations =
        await getUserVotingPowerWithDelegations($userAddress);
      veOceanWithDelegations.update(() => newVeOceansWithDelegations);

      await updateBlockTimestamp();
      await updateLockEndDate();
      loading = false;
    });
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
      secondary
      disabled={loading ||
        withdrawing ||
        !$oceanUnlockDate ||
        parseInt(import.meta.env.VITE_VE_SUPPORTED_CHAINID) !== $connectedChainId ||
        (moment().utc().isBefore($oceanUnlockDate) &&
          blockTimestamp <= unlockTimestamp)}
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
        No <strong>OCEAN</strong> locked. Lock your <strong>OCEAN</strong> tokens
        first.
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
    font-size: var(--font-size-mini);
  }

  .item:last-child {
    margin-top: calc(var(--spacer) / 6);
    margin-bottom: 0;
  }
</style>
