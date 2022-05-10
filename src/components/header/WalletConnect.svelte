<script>
  import Button from "../common/Button.svelte";
  import { connectWallet, userAddress, disconnect } from "../../stores/web3";
  import { Tooltip } from "carbon-components-svelte";
  import ChevronDown from "carbon-icons-svelte/lib/ChevronDown.svelte";
</script>

<div class="container">
  {#if !$userAddress}
    <Button onclick={() => connectWallet()} text={`Connect Wallet`} textOnly />
  {:else}
    <div class="walletContainer">
      <span class="walletAddress">
        {$userAddress.substr(0, 6)}...{$userAddress.substr(
          $userAddress.length - 6
        )}
      </span>
      <Tooltip icon={ChevronDown} align="end">
        <div class="tooltipContent">
          <Button onclick={() => disconnect()} text={`Disconnect`} textOnly />
        </div>
      </Tooltip>
    </div>
  {/if}
</div>

<style>
  .container {
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 8) calc(var(--spacer) / 6);
    background-color: var(--background-content);
  }
  .walletAddress {
    color: var(--brand-black);
    font-size: var(--font-size-small);
    font-weight: bold;
    display: inline-flex;
    align-items: center;
  }
  .walletContainer {
    display: flex;
  }
  .tooltipContent {
    position: fixed;
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 8) calc(var(--spacer) / 6);
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 8) calc(var(--spacer) / 6);
    background-color: var(--brand-white);
    box-shadow: 0 12px 30px 0 rgba(0, 0, 0, 0.1);
    width: 180px;
  }
  :global(div [class*="tooltip__trigger"]) {
    display: flex !important;
    align-items: center !important;
  }
</style>
