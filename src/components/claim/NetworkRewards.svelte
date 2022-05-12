<script>
  import Row from "../common/Row.svelte";
  import ClaimRewards from "./ClaimRewards.svelte";
  import { airdrops } from "../../utils/airdrops";

  export let chainId;

  const airdropData = airdrops[chainId];
  let totalRewards = 0;
</script>

<div class="networkRewardsContainer">
  <ClaimRewards {chainId} {totalRewards} />
  {#if airdropData}
    {#each airdropData.tokens as token}
      <Row rowObject={airdropData.tokensData[token]} />
    {/each}
  {/if}
</div>

<style>
  .networkRewardsContainer {
    display: flex;
    flex-direction: column;
    background-color: var(--brand-white);
    width: 100%;
    max-height: 55vh;
    overflow-y: auto;
    border-radius: var(--border-radius);
    border: 1px solid var(--brand-grey-lighter);
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
    margin-bottom: var(--spacer);
  }
</style>
