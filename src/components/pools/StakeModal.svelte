<script>
  import Button from "../common/Button.svelte";
  import {connectWallet, connectWalletFromLocalStorage, userAddress} from "../../stores/web3";
  import {userBalances, balanceOf} from "../../stores/tokens";
  import {calcPoolOutSingleIn} from "../../stores/bpools";
  import {ethers} from "ethers";

  export let pool;
  export let stakeAmount = 0.0;

  let isOpen;
  let tokenBalance = 0;
  let calcAmountBPTOut = 0.0;
  let canStake = false;

  // MODAL
  async function open() {
      isOpen = true;
      const balanceInWei = await balanceOf($userBalances, pool.chainID, pool.basetokenAddress, $userAddress);
      tokenBalance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10));
    // if ($userAddress === "") {
    //   if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
    //       connectWalletFromLocalStorage();
    //   } else {
    //       connectWallet();
    //   }
    // } else {
    //   isOpen = true;
    //   const balanceInWei = await balanceOf($userBalances, pool.chainID, pool.basetokenAddress, $userAddress);
    //   tokenBalance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10));
    // }
  }

  function close() {
    isOpen = false;
  }

  function keydown(e) {
    e.stopPropagation();
    if (e.key === 'Escape') {
      close();
    }
  }

  // OTHERS
  async function updateAmountBPTOut(amount) {
      console.log(">>>> Update calcAmountBPTOut.");
      console.log("chainId: ", pool.chainID);
      console.log("poolInfo: ", pool);
      console.log("amount: ", amount);
      console.log("stakeAmount: ", stakeAmount);
      calcAmountBPTOut = await calcPoolOutSingleIn(pool.chainID, pool, amount);
  }

  function handleStakeAmount() {
      canStake = stakeAmount > 0.0 && stakeAmount <= tokenBalance;
      console.log("canStake: ", canStake);
  }

  // BUTTONS
  function stake() {
      console.log("Stake: Add Liquidity.");
  }

  function unstake() {
      console.log("Stake: Remove Liquidity.");
  }

  calcAmountBPTOut.sub
</script>

<style>
  div.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div.content-wrapper {
    position: absolute;
    width: 50vw;
    height: 70vh;
    border-radius: 0.3rem;
    background-color: white;
    border: 4px solid var(--brand-grey-dimmed);
    overflow: hidden;
  }
  .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5px;
      overflow-y: hidden;
  }
  .button {
      display: flex;
      justify-content: left;
      align-items: center;
      padding: 10px;
  }
</style>

<Button text="LP" onclick={() => open()}/>
{#if isOpen}
  <div class="modal" on:keydown={keydown} tabindex={0} autofocus>
    <div class="content-wrapper">
        <div class="button">
            <Button text="X" onclick={() => close()}/>
        </div>
        <div>
            {#if pool && tokenBalance}
                <div class="container">
                    <h3>Pool Data</h3>
                    <p>DataToken Symbol: {pool.rowData.datatoken}</p>
                    <p>Basetoken: {pool.rowData.basetoken}</p>
                    <p>TVL: {pool.rowData.tvl}</p>
                    <p>Volume: {pool.rowData.volume}</p>
                </div>
                <div class="container">
                    <h3>Staking</h3>
                    <p>Your {pool.rowData.basetoken} balance: {tokenBalance}</p>
                    {#if tokenBalance >= 0}
                        <p>Amount to stake.</p>
                        <label>
                            <input type=number bind:value={stakeAmount} min=0 max={tokenBalance} on:input={handleStakeAmount} />
                        </label>
                        {#if stakeAmount >= 0.0 && calcAmountBPTOut}
                            <p>Calculated BPT Out: {calcAmountBPTOut}</p>
                        {/if}
                    {:else}
                        <p>You do not have any tokens.</p>
                    {/if}
                    <div class="button">
                        <Button text="Stake" onclick={() => stake()} disabled={!canStake}/>
                    </div>
                </div>
            {:else}
                <p>Loading...</p>
            {/if}
        </div>
    </div>
  </div>
{/if}
