<script>
  import { userAddress } from "../../stores/web3";
  import Button from "../common/Button.svelte";
  import Card from "../common/Card.svelte";
  import Input from "../common/Input.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import TokenApproval from "../common/TokenApproval.svelte";

  let multiplier = 0;
  let apy = 0;
  let amountToLock = undefined;
  let loading = true;

  $: if ($userAddress) {
    loading = false;
  }

  const lockOcean = () => {};
</script>

<div class={`container`}>
  <Card title="Lock OCEAN to get veOCEAN">
    <div class="content">
      <div class="item">
        <Input
          type="number"
          label="How much do you want to lock?"
          direction="column"
          bind:value={amountToLock}
        />
      </div>
      <div class="item">
        <Input
          type="number"
          label="Lock until"
          direction="column"
          bind:value={amountToLock}
        />
      </div>
      <div class="item">
        <div class="output-container">
          <ItemWithLabel
            title={`Votin power multiplier`}
            value={loading || `${parseFloat(multiplier).toFixed(1)} X`}
          />
          <ItemWithLabel
            title={`APY`}
            value={loading || `${parseFloat(apy)}%`}
          />
        </div>
      </div>
      <TokenApproval
        tokenAddress={""}
        tokenName={""}
        poolAddress={""}
        amount={""}
        disabled={""}
        bind:loading
      >
        <Button
          text={loading ? "Locking" : "Lock OCEAN"}
          onclick={() => lockOcean()}
          disabled={loading}
        />
      </TokenApproval>
    </div>
  </Card>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    grid-column: 1 / 3;
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .output-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .item {
    width: 100%;
    margin-bottom: calc(var(--spacer) / 3);
    display: flex;
    justify-content: center;
  }

  @media (min-width: 640px) {
    .container {
      grid-column: 2 / 3;
    }
  }
</style>
