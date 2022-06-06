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
  import Swal from "sweetalert2";
  import { addDTLiquidity } from "../../utils/bpools";
  import {calcPoolOutSingleIn} from "../../stores/bpools";

  export let pool;

  let stakeAmount = 0.0;
  let balance = 0;
  let calcBPTOut = 0.0;
  let finalBPTOut = 0.0;
  let canStake = false;
  let loading = false;

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

  async function addLiquidty() {
    console.log("$userAddress: ", $userAddress);
    console.log("pool.basetokenAddress: ", pool.basetokenAddress);
    console.log("pool.poolAddress: ", pool.poolAddress);
    console.log("stakeAmount: ", stakeAmount);
    console.log("$networkSigner: ", $networkSigner);

    const tx = await addDTLiquidity(
      $userAddress,
      pool.basetokenAddress,
      pool.poolAddress,
      stakeAmount,
      $networkSigner
    );

    console.log("addDTLiquidity tx: ", tx);
    if( tx ) {
      let receipt = await tx.wait();
      console.log("addDTLiquidity receipt: ", receipt);

      if( receipt.events ){
        const stakeEvent = receipt.events.filter(x => x.event === 'LOG_BPT_SS');
        if( stakeEvent[0].event === 'LOG_BPT_SS' ) {
          finalBPTOut = ethers.utils.formatEther(BigInt(stakeEvent[0].args.bptAmount).toString(10));
          console.log("addLiquidity: ", finalBPTOut);
          return {
            event: stakeEvent,
            finalBPTOut: finalBPTOut
          }
        }
      }
    }

    throw 'Staking failed';
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
      console.log(
        $userAddress,
        pool.basetokenAddress,
        pool.poolAddress,
        stakeAmount,
        $networkSigner
      );

      const results = await addLiquidty();
      if (results && results.finalBPTOut > 0.0) {
        Swal.fire(
          "Success!",
          "You've staked " + pool.basetoken + " into pool.",
          "success"
        ).then(async () => {
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
    finalBPTOut = 0.0;
    if (stakeAmount > 0.0) {
      console.log("stakeAmountChanged: ", stakeAmount);

      await updateBalance();
      const bptOutWei = await calcPoolOutSingleIn(
        pool.chainId,
        pool,
        stakeAmount
      );
      calcBPTOut = ethers.utils.formatEther(BigInt(bptOutWei).toString(10));
      console.log("bptOutWei: ", bptOutWei);
      console.log("calcBPTOut: ", calcBPTOut);
      updateCanStake();
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
              title={`${pool.basetoken} Balance`}
              value={parseFloat(balance).toFixed(3)}
      />
      <ItemWithLabel
        title="Calc Pool Shares"
        value={parseFloat(calcBPTOut).toFixed(3)}
      />
      <ItemWithLabel
        title="Final Pool Shares"
        value={parseFloat(finalBPTOut).toFixed(3)}
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
      <Button text="Stake"
              onclick={() => stake()} disabled={!canStake || loading} />
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
