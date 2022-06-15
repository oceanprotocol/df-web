<script>
  import Button from "../common/Button.svelte";
  import {
    isWalletConnectModalOpen,
    connectWalletFromLocalStorage,
    userAddress,
    connectedChainId,
  } from "../../stores/web3";
  import Swal from "sweetalert2";
  import PoolInfo from "./PoolInfo.svelte";
  import Stake from "./Stake.svelte";
  import { updateAllClaimables } from "../../stores/airdrops";

  export let pool;

  let isOpen = false;
  let networkDisabled = false;
  let loading = false;

  // MODAL
  async function open() {
    if ($userAddress === "") {
      networkDisabled = true;
      if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
        connectWalletFromLocalStorage();
      } else {
        isWalletConnectModalOpen.update(($isWalletConnectModalOpen) => true);
      }
    } else {
      isOpen = true;

      console.log("Pool chain id: ", pool.chainId);
      console.log("Connected chain id: ", $connectedChainId);
      console.log("Network disabled: ", networkDisabled);
    }
  }

  function close() {
    isOpen = false;
  }

  function keydown(e) {
    e.stopPropagation();
    if (e.key === "Escape") {
      close();
    }
  }
</script>

<Button text="LP" onclick={() => open()} />
{#if isOpen}
  <div class="modal" on:keydown={keydown} tabindex={0}>
    <div class="content-wrapper">
      <div class="button">
        <Button text="X" onclick={() => close()} disabled={loading} />
      </div>
      <div>
        {#if pool && isOpen}
          <div class="container">
            <PoolInfo {pool} />
          </div>
          <div class="container">
            <Stake {pool} bind:loading />
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  div.modal {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div.content-wrapper {
    width: 50vw;
    border-radius: 0.3rem;
    background-color: white;
    padding: 0 calc(var(--spacer) / 2);
    border: 4px solid var(--brand-grey-dimmed);
    overflow: hidden;
    padding-bottom: calc(var(--spacer) / 2);
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px;
    overflow-y: hidden;
    margin-bottom: calc(var(--spacer) / 2);
  }
  .button {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 10px;
  }
</style>
