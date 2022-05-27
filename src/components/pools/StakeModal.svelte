<script>
  import Button from "../common/Button.svelte";
  import {connectWallet, connectWalletFromLocalStorage, userAddress} from "../../stores/web3";
  import {userBalances, balanceOf} from "../../stores/tokens";
  import {ethers} from "ethers";

  export let pool;
  let isOpen;
  let tokenBalance;

  async function open() {
    if ($userAddress === "") {
      if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
          connectWalletFromLocalStorage();
      } else {
          connectWallet();
      }
    } else {
      isOpen = true;
      const balanceInWei = await balanceOf($userBalances, pool.chainID, pool.basetokenAddress, $userAddress);
      tokenBalance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10))
    }
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

  function connect() {

  }

  function stake() {
      console.log("Staked assets into pool")
  }

  function unstake() {
      console.log("Remove staked position")
  }

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
    width: 20vw;
    height: 30vh;
    border-radius: 0.3rem;
    background-color: white;
    border: 4px solid var(--brand-grey-dimmed);
    overflow: hidden;
  }
  .container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: calc(var(--spacer) / 4) 8%;
      overflow-y: hidden;
  }
  .closeButton {
      display: flex;
      justify-content: left;
      align-items: center;
  }
</style>

<Button text="LP" onclick={() => open()}/>
{#if isOpen}
  <div class="modal" on:keydown={keydown} tabindex={0} autofocus>
    <div class="content-wrapper">
        <div class="closeButton">
            <Button text="X" onclick={() => close()}/>
        </div>
        <div>
            {#if pool && tokenBalance}
                <p>DataToken Symbol: {pool.rowData.datatoken}</p>
                <p>Basetoken: {pool.rowData.basetoken}</p>
                <p>TVL: {pool.rowData.tvl}</p>
                <p>Volume: {pool.rowData.volume}</p>
                <p>Your token balance: {tokenBalance}</p>
            {:else}
                <p>Loading...</p>
            {/if}
        </div>

        <div class="container">
            <Button text="Stake" onclick={() => stake()}/>
            <Button text="Unstake" onclick={() => unstake()}/>
        </div>
    </div>
  </div>
{/if}
