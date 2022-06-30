<script>
  import Row from "../common/Row.svelte";
  import ClaimRewards from "./ClaimRewards.svelte";

  export let chainId;
  export let airdropData;

  function getTokens() {
    return Object.keys(airdropData.tokensData);
  }
</script>

{#if airdropData}
  <div class="networkRewardsContainer">
    <ClaimRewards
      {chainId}
      estimatedRewards={airdropData["estimated rewards"]}
      totalRewards={airdropData.totalRewards}
      claimables={airdropData}
    />
    {#each getTokens() as token}
      <Row rowObject={airdropData.tokensData[token]} />
    {/each}
  </div>
{/if}

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
