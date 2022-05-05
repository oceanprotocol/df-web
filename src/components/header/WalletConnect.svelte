<script>
  import Button from "../common/Button.svelte";
  import { connectWallet, userAddress, disconnect } from "../../stores/web3";
  import { Tooltip } from "carbon-components-svelte";
  import ChevronDown from "carbon-icons-svelte/lib/ChevronDown.svelte";

  let component = null;
</script>

<div class="container">
  {#if !$userAddress}
    <Button onclick={() => connectWallet()} text={`Connect Wallet`} textOnly />
  {:else}
    <div class="walletContainer">
      <span class="walletAddress" bind:this={component}>
        {$userAddress.substr(0, 6)}...{$userAddress.substr(
          $userAddress.length - 6
        )}
      </span>
      <Tooltip ref={component} icon={ChevronDown}>
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
  }
  .walletAddress {
    color: var(--brand-black);
    font-size: var(--font-size-small);
    font-weight: bold;
  }
  .walletContainer {
    display: flex;
  }
  .tooltipContent {
    position: absolute;
    z-index: 100;
  }
</style>
