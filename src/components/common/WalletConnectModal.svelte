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
          textOnly
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
    z-index: 300;
    top: calc(100vh - (100vh + var(--spacer) / 4));
    bottom: 0;
    width: 100vw;
    height: calc(100vh + var(--spacer) / 4);
    background-color: rgba(191, 191, 191, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div.content-wrapper {
    width: 80vw;
    border-radius: 0.3rem;
    background-color: white;
    padding: var(--spacer) calc(var(--spacer) / 5);
    padding-top: calc(var(--spacer) / 2);
    border: 2px solid var(--brand-grey-dimmed);
    box-shadow: var(--box-shadow);
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
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: var(--spacer);
  }
  .close-button {
    width: 100%;
    display: flex;
    justify-content: right;
    align-items: center;
    margin-bottom: calc(var(--spacer) / 2);
  }

  @media (min-width: 640px) {
    div.modal {
      top: 0;
    }
    div.content-wrapper {
      width: 50vw;
      max-width: 500px;
      padding: var(--spacer) var(--spacer);
    }
  }
</style>
