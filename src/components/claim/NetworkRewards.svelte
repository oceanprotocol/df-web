<script>
  import Row from "../common/Row.svelte";
  import ClaimRewards from "./ClaimRewards.svelte";
  import { airdrops } from "../../utils/airdrops";
  import { ethers } from "ethers";
  import { onMount } from "svelte";

  export let chainId;

  const pools = [
    { farm: "NEO DF", earned: "$5.0", token: "PSD" },
    { farm: "NEO DF", earned: "$5.0", token: "PSD" },
    { farm: "NEO DF", earned: "$5.0", token: "PSD" },
  ];

  const airdropData = airdrops[chainId];

  onMount(async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://rinkeby.infura.io/v4/05d2b0098cf44eb789387708af2527a1`
    );
    const airdropContract = new ethers.Contract(
      airdropData.airdropAddress,
      airdropData.abi,
      provider
    );
  });
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
    margin-bottom: var(--spacer);
  }
</style>
