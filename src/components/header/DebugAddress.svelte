<script>
  import Input from "../common/Input.svelte";
  import { userAddress } from "../../stores/web3";

  $: $userAddress && console.log($userAddress)
</script>

<div class="container">
  <Input
    bind:value={$userAddress}
    onChange={(event) => {
      userAddress.update(() => event.target.value);
    }}
  />
</div>

<style>
  .container {
    width: 100%;
  }
</style>
