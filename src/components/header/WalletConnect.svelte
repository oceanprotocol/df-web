<script>
  import Button from "../common/Button.svelte";
  import {
    isWalletConnectModalOpen,
    userAddress,
    disconnect,
    connectedChainId,
  } from "../../stores/web3";
  import { Tooltip } from "carbon-components-svelte";
  import ChevronDown from "carbon-icons-svelte/lib/ChevronDown.svelte";
  import NetworkItem from "../common/NetworkItem.svelte";
</script>

<div class="container">
  {#if !$userAddress}
    <Button
      onclick={() => {
        isWalletConnectModalOpen.update(($isWalletConnectModalOpen) => true);
      }}
      text={`Connect Wallet`}
      textOnly
    />
  {:else}
    <div class="walletContainer">
      <NetworkItem chainId={$connectedChainId} minimal />
      <span class="walletAddress">
        {$userAddress.substr(0, 6)}...{$userAddress.substr(
          $userAddress.length - 6
        )}
      </span>
      <Tooltip icon={ChevronDown} align="end">
        <Button onclick={() => disconnect()} text={`Disconnect`} textOnly />
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
</style>
