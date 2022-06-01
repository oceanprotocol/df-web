<script>
  import {
    userAddress,
    networkSigner,
    connectedChainId,
    switchWalletNetwork,
  } from "../../stores/web3";
  import { userBalances, balanceOf, approveToken } from "../../stores/tokens";
  import { ethers } from "ethers";
  import Button from "../common/Button.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";

  export let pool;

  let stakeAmount = 0.0;
  let balance = 0;
  let calcBPTOut = 0.0;
  let finalBPTOut = 0.0;
  let canStake = false;

  const updateBalance = async () => {
    const balanceInWei = await balanceOf(
      $userBalances,
      pool.chainId,
      pool.basetokenAddress,
      $userAddress
    );
    balance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10));
  };
  $: if ($userAddress) {
    updateBalance();
  }

  async function stake() {
    /*await approveToken(
      "0x8967bcf84170c91b0d24d4302c2376283b0b3a07",
      $userAddress,
      stakeAmount,
      $networkSigner
    );*/
    try {
      loading = true;
      console.log(pool.chainId, pool, stakeAmount, calcBPTOut, $networkSigner);
      const resp = await joinSwapExternAmountIn(
        pool.chainId,
        pool,
        stakeAmount,
        calcBPTOut,
        $networkSigner
      );
      console.log("response: ", resp);
      const receipt = await resp.wait();
      console.log("response events:", receipt.events);

      const event = receipt.events.find(
        (event) => event.event === "LOG_BPT_SS"
      );
      const [from, to, value] = event.args;
      console.log("bptOutWei response:", from, to, value);

      finalBPTOut = ethers.utils.formatEther(BigInt(value).toString(10));
      if (finalBPTOut > 0.0) {
        Swal.fire(
          "Success!",
          "You've staked " + pool.basetoken + " into pool.",
          "success"
        ).then(() => {
          updateBalance();
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
    finalBPTOut = 0.0;
    if (stakeAmount > 0.0) {
      updateCanStake();
      const bptOutWei = await calcPoolOutSingleIn(
        pool.chainId,
        pool,
        stakeAmount
      );
      calcBPTOut = ethers.utils.formatEther(BigInt(bptOutWei).toString(10));
    } else canStake = false;
  }

  function updateCanStake() {
    canStake = stakeAmount > 0.0 && stakeAmount <= balance;
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
  <div class="items-container">
    {#if $userAddress && pool.chainId !== $connectedChainId}
      <div class="button">
        <Button
          text="Switch Network"
          onclick={() => switchNetwork()}
          disabled={!$userAddress}
        />
      </div>
    {:else}
      <ItemWithLabel
        title="Calc Pool Shares"
        value={parseInt(calcBPTOut).toFixed(3)}
      />
      {#if finalBPTOut > 0.0}
        <ItemWithLabel
          title="Final Pool Shares"
          value={parseInt(finalBPTOut).toFixed(3)}
        />
      {/if}
      <ItemWithLabel
        title={`${pool.basetoken} Balance`}
        value={parseInt(balance).toFixed(3)}
      />
      {#if balance >= 0}
        <label>
          <input
            type="number"
            bind:value={stakeAmount}
            min="0"
            max={balance}
            on:input={handleStakeAmount}
          />
        </label>
      {/if}
      <Button
        text="Stake"
        onclick={() => stake()}
        disabled={!canStake || loading}
      />
    {/if}
  </div>
{:else}{/if}

<style>
  .items-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
</style>
