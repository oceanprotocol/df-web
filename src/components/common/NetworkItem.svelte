<script>
  import * as networksDataArray from "../../networks-metadata.json";
  import NetworkIcon from "../common/NetworkIcon.svelte";
  import { getNetworkDataById } from "../../stores/web3";

  let networksData = networksDataArray.default;

  export let chainId;
  export let checked = undefined;
  export let onCheck = undefined;
  export let fontSize = "small";
  export let minimal = false;

  let name = undefined;

  $: if (chainId) {
    name = minimal
      ? getNetworkDataById(networksData, parseInt(chainId))?.chain
      : getNetworkDataById(networksData, parseInt(chainId))?.name;
  }
</script>

<div class={`container ${checked === undefined && "margin0"}`}>
  {#if checked !== undefined && onCheck !== undefined}
    <input
      type="checkbox"
      value={chainId}
      {checked}
      on:change={(event) =>
        onCheck(event.target.checked, parseInt(event.target.value))}
    />
  {/if}
  <div class="networkDetails">
    <NetworkIcon {name} {minimal} />
    <span
      class={`networkName ${fontSize === "large" && "large"} ${
        fontSize === "normal" && "normal"
      }`}
    >
      {name}
    </span>
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: calc(var(--spacer) / 4);
  }
  input {
    margin-right: calc(var(--spacer) / 8);
  }
  .networkName {
    font-size: var(--font-size-small);
    color: var(--brand-black);
    text-align: start;
  }
  .large {
    font-size: var(--font-size-large);
  }
  .normal {
    font-size: var(--font-size-normal);
  }
  .networkDetails {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .margin0 {
    margin: 0;
  }
  .container:only-child {
    margin: 0;
  }
  .container:last-child {
    margin: 0;
  }
</style>
