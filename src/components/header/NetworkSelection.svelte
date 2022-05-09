<script>
  import { selectedNetworks } from "../../stores/web3";
  import { Tooltip } from "carbon-components-svelte";
  import ChevronDown from "carbon-icons-svelte/lib/ChevronDown.svelte";
  import { supportedChainIds } from "../../app.config";
  import NetworkItem from "../common/NetworkItem.svelte";

  function onCheck(checked, value) {
    if (!checked) {
      selectedNetworks.update(() =>
        $selectedNetworks.filter((chainId) => chainId !== value)
      );
    } else {
      selectedNetworks.update(() => [...$selectedNetworks, value]);
    }
  }

  $: if ($selectedNetworks) {
    localStorage.setItem("selectedNetworks", JSON.stringify($selectedNetworks));
  }
</script>

<div class="container">
  <span class="text"> Selected networks </span>
  <Tooltip icon={ChevronDown} align="end">
    <div class="tooltipContainer">
      {#each supportedChainIds as chainId}
        <NetworkItem
          {chainId}
          checked={$selectedNetworks.includes(chainId)}
          {onCheck}
        />
      {/each}
    </div>
  </Tooltip>
</div>

<style>
  .container {
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 8) calc(var(--spacer) / 6);
    display: flex;
    align-items: center;
    margin-right: calc(var(--spacer) / 3);
    background-color: var(--background-content);
  }
  .tooltipContainer {
    position: absolute;
    top: 40px;
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 8) calc(var(--spacer) / 6);
    background-color: var(--brand-white);
    box-shadow: 0 12px 30px 0 rgba(0, 0, 0, 0.1);
    transform: translate3d(0, -0.05rem, 0);
    border-radius: 5px;
    width: 180px;
  }
  .text {
    color: var(--brand-black);
    font-size: var(--font-size-small);
    font-weight: bold;
  }
</style>
