<script>
  import Row from "../common/Row.svelte";
  import ClaimRewards from "./ClaimRewards.svelte";

  export let chainId;

  const pools = [
    { farm: "NEO DF", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", token: "PSD", earned: "$5.0" },
  ];
</script>

<div class="networkRewardsContainer">
  <ClaimRewards {chainId} />
  {#each pools as pool}
    <Row rowObject={pool} />
  {/each}
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
    margin-bottom: calc(var(--spacer) / 2);
  }
</style>
