<script>
  import Input from "../common/Input.svelte";
  import { userAddress } from "../../stores/web3";
</script>

<div class="container">
  <Input
    bind:value={$userAddress}
    onChange={(event) => {
      console.log(event.target.value, $userAddress);
      userAddress.update(() => event.target.value);
    }}
  />
</div>

<style>
  .container {
    width: 100%;
  }
</style>
