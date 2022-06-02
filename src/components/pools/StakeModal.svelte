<script>
  import Button from "../common/Button.svelte";
  import {
    connectWallet,
    connectWalletFromLocalStorage,
    userAddress,
    networkSigner,
    connectedChainId,
    switchWalletNetwork,
    GASLIMIT_DEFAULT
  } from "../../stores/web3";
  import { userBalances, balanceOf, approveToken } from "../../stores/tokens";
  import {
    getPoolContract,
    calcPoolOutSingleIn,
    joinSwapExternAmountIn,
  } from "../../stores/bpools";
  import { ethers } from "ethers";
  import Swal from "sweetalert2";
  import { updateAllClaimables } from "../../stores/airdrops";

  export let pool;
  export let stakeAmount = 0.0;

  let isOpen;
  let balance = 0;
  let calcBPTOut = 0.0;
  let finalBPTOut = 0.0;
  let approved = true;
  let canStake = false;
  let networkDisabled = true;
  let loading = false;

  // MODAL
  async function open() {
    if ($userAddress === "") {
      networkDisabled = true;
      if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
        connectWalletFromLocalStorage();
      } else {
        connectWallet();
      }
    } else {
      isOpen = true;
      updateNetworkDisabled();
      updateBalance();
    }
  }

  function close() {
    isOpen = false;
    calcBPTOut = 0.0;
    finalBPTOut = 0.0;
  }

  function keydown(e) {
    e.stopPropagation();
    if (e.key === "Escape") {
      close();
    }
  }

  // OTHERS
  async function updateBalance() {
    if( !networkDisabled ) {
      console.log("updateBalance");
      console.log("$userBalances:", $userBalances);
      console.log("pool.chainId", pool.chainId);
      console.log("pool.basetokenAddress", pool.basetokenAddress);
      console.log("$userAddress", $userAddress);
      const balanceInWei = await balanceOf(
              $userBalances,
              pool.chainId,
              pool.basetokenAddress,
              $userAddress
      );
      balance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10));
    }
  }

  function updateCanStake() {
    canStake = stakeAmount > 0.0 && stakeAmount <= balance;
  }

  function updateNetworkDisabled() {
    networkDisabled = pool.chainId.toString() !== $connectedChainId.toString();
    console.log("chain id: ", pool.chainId);
    console.log("connected chaind id: ", $connectedChainId.toString());
    console.log("network disabled: ", networkDisabled);
    console.log("can stake: ", canStake);
    console.log("approved: ", approved);
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

  async function approve() {
    console.log("")
  }

  async function stake() {
    try {
      loading = true;
      const resp = await joinSwapExternAmountIn(
        pool.chainId,
        pool,
        stakeAmount,
        calcBPTOut,
        $userAddress,
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

  async function switchNetwork() {
    await switchWalletNetwork(pool.chainId);
  }

  $: if ($connectedChainId) {
    if( isOpen ) {
      updateNetworkDisabled();
      updateBalance();
    }
  }
</script>

<Button text="LP" onclick={() => open()} />
{#if isOpen}
  <div class="modal" on:keydown={keydown} tabindex={0} autofocus>
    <div class="content-wrapper">
      <div class="button">
        <Button text="X" onclick={() => close()} disabled={loading} />
      </div>
      <div>
        <div class="container">
          <h3>Pool Data</h3>
          <p>DataToken Symbol: {pool.rowData.datatoken}</p>
          <p>Basetoken: {pool.rowData.basetoken}</p>
          <p>TVL: {parseInt(pool.rowData.tvl).toFixed(3)}</p>
          <p>Volume: {parseInt(pool.rowData.volume).toFixed(3)}</p>
        </div>
        {#if networkDisabled}
          <div class="button">
            <Button
                    text="Switch Network"
                    onclick={() => switchNetwork()}
                    disabled={!networkDisabled}
            />
          </div>
        {:else if pool && balance}
          <div class="container">
            <h3>Staking</h3>
            <p>
              {pool.rowData.basetoken} Balance: {parseInt(balance).toFixed(3)}
            </p>
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
              <p>Calc Pool Shares: {parseFloat(calcBPTOut).toFixed(3)}</p>
              {#if finalBPTOut > 0.0}
                <p>Final Pool Shares: {parseFloat(finalBPTOut).toFixed(3)}</p>
              {/if}
            {/if}
            <div class="button">
              {#if !approved}
                <Button
                        text="Approve"
                        onclick={() => approve()}
                        disabled={canStake || loading}
                />
              {:else}
                <Button
                        text="Stake"
                        onclick={() => stake()}
                        disabled={!canStake || loading}
                />
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

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
