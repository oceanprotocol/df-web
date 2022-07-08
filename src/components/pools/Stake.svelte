<script>
  import {
    userAddress,
    networkSigner,
    connectedChainId,
    switchWalletNetwork,
  } from "../../stores/web3";
  import { userBalances } from "../../stores/tokens";
  import { balanceOf } from "../../utils/tokens";
  import { ethers } from "ethers";
  import Button from "../common/Button.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import Swal from "sweetalert2";
  import { addDTLiquidity } from "../../utils/bpools";
  import TokenApproval from "../common/TokenApproval.svelte";
  import Input from "../common/Input.svelte";
  import {
    getStakedAmountForLPAddress,
    calculatePoolShares,
  } from "../../utils/poolShares";
  import { getRewardsForPoolUser } from "../../utils/rewards";
  import { calcMaxAllowedStakeInput } from "../../utils/pools";
  import { rewards } from "../../stores/airdrops";
  import { userStakes } from "../../stores/poolShares";

  export let pool;
  export let loading = false;

  let stakeAmount = 0.0;
  let stakedAmount = 0.0;
  let currentPoolShare = 0.0;
  let balance = 0.0;
  let calcBPTOut = 0.0;
  let estimatedRewards = 0.0;
  let canStake = false;
  let maxPoolInputAllowed = calcMaxAllowedStakeInput(pool.tvl * 2);

  const updateBalance = async () => {
    stakedAmount = await getStakedAmountForLPAddress(
      $userStakes,
      pool.poolAddress
    );
    calcBPTOut = await calculatePoolShares(pool.tvl * 2, stakedAmount);
    if (!rewards) {
    }
    estimatedRewards = getRewardsForPoolUser(
      $rewards,
      $userAddress,
      pool.poolAddress
    );
    currentPoolShare = calcBPTOut;

    const balanceInWei = await balanceOf(
      $userBalances,
      pool.chainId,
      pool.basetokenAddress,
      $userAddress
    );
    balance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10));
  };

  $: if ($userAddress && pool.chainId === $connectedChainId) {
    updateBalance();
  }

  async function addLiquidty() {
    const tx = await addDTLiquidity(
      $userAddress,
      pool.basetokenAddress,
      pool.poolAddress,
      stakeAmount,
      $networkSigner
    );

    console.log("addDTLiquidity tx: ", tx);
    if (tx) {
      let receipt = await tx.wait();
      console.log("addDTLiquidity receipt: ", receipt);

      if (receipt.events) {
        const stakeEvent = receipt.events.filter(
          (x) => x.event === "LOG_BPT_SS"
        );
        if (stakeEvent[0].event === "LOG_BPT_SS") {
          calcBPTOut = ethers.utils.formatEther(
            BigInt(stakeEvent[0].args.bptAmount).toString(10)
          );
          console.log("addLiquidity: ", calcBPTOut);
          return {
            event: stakeEvent,
            calcBPTOut: calcBPTOut,
          };
        }
      }
    }

    throw "Staking failed";
  }

  async function stake() {
    try {
      loading = true;
      const results = await addLiquidty();
      if (results && results.calcBPTOut > 0.0) {
        Swal.fire(
          "Success!",
          "You've staked " + pool.basetoken + " into pool.",
          "success"
        ).then(async () => {
          stakeAmount = 0;
          await updateBalance();
          updateCanStake();
          loading = false;
        });
      }
    } catch (error) {
      console.log("Error: ", error);
      Swal.fire(
        "Error!",
        "Failed to stake " + pool.basetoken + " into pool.",
        "error"
      ).then(() => {
        loading = false;
      });
    }
  }

  async function handleStakeAmount() {
    loading = true;
    calcBPTOut = 0.0;
    if (stakeAmount > 0.0 && pool.chainId === $connectedChainId) {
      await updateBalance();
      calcBPTOut = await calculatePoolShares(
        pool.tvl * 2,
        stakeAmount + stakedAmount
      );
      updateCanStake();
      loading = false;
    } else {
      calcBPTOut = currentPoolShare;
      canStake = false;
      loading = false;
    }
  }

  function updateCanStake() {
    canStake =
      stakeAmount > 0.0 &&
      stakeAmount <= balance &&
      stakeAmount < maxPoolInputAllowed;
  }

  async function switchNetwork() {
    await switchWalletNetwork(pool.chainId);
  }
</script>

{#if pool}
  <div class="header">
    <h4>Stake</h4>
    <span>{pool.basetoken}</span>
  </div>
  <div class="components-container">
    {#if $userAddress && pool.chainId !== $connectedChainId}
      <div class="button">
        <Button
          text="Switch Network"
          textOnly
          onclick={() => switchNetwork()}
          disabled={!$userAddress}
        />
      </div>
    {:else}
      <div class="items-container">
        <ItemWithLabel
          title={`${pool.basetoken} Balance`}
          value={parseFloat(balance).toFixed(3)}
        />
        <ItemWithLabel
          title={`${pool.basetoken} staked`}
          value={parseFloat(stakedAmount).toFixed(3)}
        />
        <ItemWithLabel
          title="Calc Pool Shares"
          value={`${parseFloat(calcBPTOut).toFixed(2)}%`}
        />
        <ItemWithLabel
          title="Estimated Rewards"
          value={`${parseFloat(estimatedRewards).toFixed(3)} ${pool.basetoken}`}
        />
      </div>
      <div class="inputContainer">
        <Input
          type="number"
          bind:value={stakeAmount}
          min="0"
          max={maxPoolInputAllowed > balance ? balance : maxPoolInputAllowed}
          onChange={handleStakeAmount}
        />
      </div>
      <TokenApproval
        tokenAddress={pool.basetokenAddress}
        tokenName={pool.basetoken}
        poolAddress={pool.poolAddress}
        amount={stakeAmount}
        disabled={!canStake}
        bind:loading
      >
        <Button
          text={loading ? "Staking" : "Stake"}
          onclick={() => stake()}
          disabled={!canStake || loading}
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
