<script>
  import Button from "../common/Button.svelte";
  import {
    isWalletConnectModalOpen,
    userAddress,
    disconnect,
    connectedChainId,
    web3Provider,
  } from "../../stores/web3";
  import Tooltip from "carbon-components-svelte/src/Tooltip/Tooltip.svelte";
  import ChevronDown from "carbon-icons-svelte/lib/ChevronDown.svelte";
  import NetworkItem from "../common/NetworkItem.svelte";
  import DebugAddress from "./DebugAddress.svelte";

  let enableDebugAddress = process.env.DEBUGGING === "enabled";
  const resetAccount = async () => {
    let signer = await $web3Provider.getSigner();
    let address = await signer.getAddress();
    userAddress.update(() => address);
  };
</script>

<div class="container">
  {#if !$userAddress}
    <Button
      onclick={() => {
        isWalletConnectModalOpen.update(($isWalletConnectModalOpen) => true);
      }}
      text={`Connect Wallet`}
      textOnly
      class="plausible-event-name=Button+Connect+wallet"
    />
  {:else}
    <div class="walletContainer">
      <div class="networkItemContainer">
        <NetworkItem chainId={$connectedChainId} minimal />
      </div>
      {#if enableDebugAddress}
        <DebugAddress />
      {:else}
        <span class="walletAddress">
          {$userAddress.substr(0, 6)}...{$userAddress.substr(
            $userAddress.length - 6
          )}
        </span>
      {/if}

      <Tooltip
        icon={ChevronDown}
        align="end"
        class={`disconnect ${
          enableDebugAddress ? "multipleButtons" : undefined
        }`}
      >
        {#if enableDebugAddress}
          <Button
            onclick={() => resetAccount()}
            text={`Reset to connected account`}
            textOnly
            class="plausible-event-name=Button+Reset+to+connected+account"
          />
        {/if}
        <Button onclick={() => disconnect()} text={`Disconnect`} textOnly class="plausible-event-name=Button+disconnect" />
      </Tooltip>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 8) calc(var(--spacer) / 6);
    background-color: var(--background-content);
  }
  .walletAddress {
    font-size: var(--font-size-small);
    color: var(--brand-black);
    margin-left: calc(var(--spacer) / 6);
    font-weight: bold;
    display: inline-flex;
    align-items: center;
  }
  .walletContainer {
    display: flex;
    font-weight: bold;
    color: var(--brand-grey-light);
  }
  .networkItemContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
  }
  :global(.disconnect > .bx--tooltip) {
    top: 35px !important;
  }
  :global(.disconnect) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :global(.disconnect .bx--tooltip__trigger) {
    background-color: transparent !important;
    width: 18px !important;
  }
  :global(.multipleButtons button) {
    margin: calc(var(--spacer) / 6) 0 !important;
  }
</style>
