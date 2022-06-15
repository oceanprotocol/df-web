<script>
  import {
    connectWalletToSpecificProvider,
    isWalletConnectModalOpen,
  } from "../../stores/web3";
  import Button from "../common/Button.svelte";

  let loading = false;

  const onButtonClick = async (provider) => {
    await connectWalletToSpecificProvider(provider);
    isWalletConnectModalOpen.update(($isWalletConnectModalOpen) => false);
  };
</script>

{#if $isWalletConnectModalOpen}
  <div class="modal" tabindex={0}>
    <div class="content-wrapper">
      <div class="close-button">
        <Button
          text="X"
          onclick={() => {
            isWalletConnectModalOpen.update(
              ($isWalletConnectModalOpen) => false
            );
          }}
          disabled={loading}
        />
      </div>
      <span class="text">Connect your wallet</span>
      <div class="buttons-container">
        <Button
          text="Metamask"
          onclick={() => onButtonClick("injected")}
          disabled={loading}
        />
        <Button
          text="WalletConnect"
          onclick={() => onButtonClick("walletconnect")}
          disabled={loading}
        />
      </div>
    </div>
  </div>
{/if}

<style>
  div.modal {
    position: fixed;
    z-index: 100;
    top: calc(50vh - 100px);
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
    padding: var(--spacer) calc(var(--spacer) / 2);
    padding-top: calc(var(--spacer) / 2);
    border: 4px solid var(--brand-grey-dimmed);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .text {
    font-size: var(--font-size-normal);
    font-weight: bold;
    text-transform: uppercase;
  }
  .buttons-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    margin-top: var(--spacer);
  }
  .close-button {
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 10px;
    margin-bottom: calc(var(--spacer) / 2);
  }
</style>
