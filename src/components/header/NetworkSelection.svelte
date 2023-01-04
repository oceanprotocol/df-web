<script>
  import { onMount } from "svelte";
  import {
    connectedChainId,
    getNetworkDataById,
    selectedNetworks,
    switchWalletNetwork,
    userAddress,
  } from "../../stores/web3";
  import { Tooltip } from "carbon-components-svelte";
  import ChevronDown from "carbon-icons-svelte/lib/ChevronDown.svelte";
  import NetworkItem from "../common/NetworkItem.svelte";
  import Button from "../common/Button.svelte";
  import * as networksDataArray from "../../networks-metadata.json";

  let networksData = networksDataArray.default;

  function onCheck(checked, value) {
    if (!checked) {
      selectedNetworks.update(() =>
        $selectedNetworks.filter((chainId) => chainId !== value)
      );
    } else {
      selectedNetworks.update(() => [...$selectedNetworks, value]);
    }
  }

  onMount(() => {
    if (!localStorage.getItem("SupportedChainIds")) {
      localStorage.setItem(
        "SupportedChainIds",
        JSON.stringify(JSON.parse(import.meta.env.VITE_SUPPORTED_CHAIN_IDS))
      );
    } else {
      let localStorageSupportedChainIds = JSON.parse(
        localStorage.getItem("SupportedChainIds")
      );
      let envSupportedChainIds = JSON.parse(
        import.meta.env.VITE_SUPPORTED_CHAIN_IDS
      );
      if (
        envSupportedChainIds.length != localStorageSupportedChainIds.length ||
        envSupportedChainIds.every(function (element, index) {
          return element !== localStorageSupportedChainIds[index];
        })
      ) {
        selectedNetworks.update(() => envSupportedChainIds);
        localStorage.setItem(
          "SupportedChainIds",
          JSON.stringify(envSupportedChainIds)
        );
      }
    }
  });

  $: if ($selectedNetworks) {
    localStorage.setItem("selectedNetworks", JSON.stringify($selectedNetworks));
  }
</script>

{#if $selectedNetworks?.length < 2}
  {#if $connectedChainId && $selectedNetworks[0] !== $connectedChainId}
    <div class="container">
      <Button
        text={`Switch Network to ${
          getNetworkDataById(networksData, parseInt($selectedNetworks[0]))?.name
        }`}
        onclick={() => switchWalletNetwork(parseInt($selectedNetworks[0]))}
        className="switchNetworkHeaderButton"
        textOnly
        disabled={!$userAddress}
      />
    </div>
  {/if}
{:else}
  <div class="container">
    <span class="text"> Selected networks </span>
    <Tooltip icon={ChevronDown} align="end">
      {#if $selectedNetworks}
        {#each JSON.parse(import.meta.env.VITE_SUPPORTED_CHAIN_IDS) as chainId}
          <NetworkItem
            {chainId}
            checked={$selectedNetworks.find((id) => id === chainId) !==
              undefined}
            {onCheck}
          />
        {/each}
      {/if}
    </Tooltip>
  </div>
{/if}

<style>
  .container {
    border: 1px solid var(--brand-alert-red);
    padding: calc(var(--spacer) / 8) calc(var(--spacer) / 6);
    display: flex;
    align-items: center;
    margin-right: calc(var(--spacer) / 3);
    background-color: var(--background-content);
  }
  .container :global(.switchNetworkHeaderButton) {
    color: var(--brand-alert-red);
  }

  .container :global(.switchNetworkHeaderButton):hover {
    color: var(--brand-alert-red) !important;
  }
  .text {
    color: var(--brand-black);
    font-size: var(--font-size-small);
    font-weight: bold;
  }
</style>
