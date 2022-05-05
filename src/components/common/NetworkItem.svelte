<script>
  import * as networksDataArray from "../../networks-metadata.json";
  import { getNetworkDataById } from "../../utils/web3";

  let networksData = networksDataArray.default;

  export let chainId;
  export let checked;
  export let onCheck;
</script>

<div class="container">
  <input
    type="checkbox"
    value={chainId}
    {checked}
    on:change={(event) =>
      onCheck(event.target.checked, parseInt(event.target.value))}
  />
  <span class="networkName">
    {getNetworkDataById(networksData, chainId).name}
  </span>
</div>

<style>
  .container {
    display: flex;
    margin-bottom: calc(var(--spacer) / 4);
  }
  input {
    margin-right: calc(var(--spacer) / 8);
  }
  .networkName {
    font-size: var(--font-size-small);
  }
</style>
