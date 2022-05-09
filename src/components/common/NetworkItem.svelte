<script>
  import * as networksDataArray from "../../networks-metadata.json";
  import { getNetworkDataById } from "../../utils/web3";

  let networksData = networksDataArray.default;

  export let chainId;
  export let checked = undefined;
  export let onCheck = undefined;
  export let fontSize = "small";
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
  <span
    class={`networkName ${fontSize === "large" && "large"} ${
      fontSize === "normal" && "normal"
    }`}
  >
    {getNetworkDataById(networksData, parseInt(chainId))?.name}
  </span>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    margin-bottom: calc(var(--spacer) / 4);
  }
  input {
    margin-right: calc(var(--spacer) / 8);
  }
  .networkName {
    font-size: var(--font-size-small);
  }
  .large {
    font-size: var(--font-size-large);
  }
  .normal {
    font-size: var(--font-size-normal);
  }
  .margin0 {
    margin: 0;
  }
</style>
