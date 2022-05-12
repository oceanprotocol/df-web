<script>
  import Row from "../common/Row.svelte";
  import ClaimRewards from "./ClaimRewards.svelte";
  import { airdrops } from "../../utils/airdrops";
  import { userAddress, web3Provider } from "../../stores/web3";
  import { getRpcUrlByChainId } from "../../utils/web3";
  import { ethers } from "ethers";
  import { BigNumber } from "bignumber.js";
  import * as tokenAbi from "../../utils/tokenAbi";

  export let chainId;

  const airdropData = airdrops[chainId];
  let totalRewards = 0;

  const getData = async () => {
    const provider = await new ethers.providers.JsonRpcProvider(
      getRpcUrlByChainId(chainId)
    );
    const airdropContract = new ethers.Contract(
      airdropData.airdropAddress,
      airdropData.abi,
      provider
    );
    console.log($web3Provider.getSigner());
      /*const tokenContract = new ethers.Contract(
      "0x8967bcf84170c91b0d24d4302c2376283b0b3a07",
      tokenAbi.default,
      $web3Provider.getSigner()
    );
    const result = await tokenContract.approve(
      $userAddress,
      "40000000000000000000"
    );
    const contractWithWallet = new ethers.Contract(
      airdropData.airdropAddress,
      airdropData.abi,
      $web3Provider.getSigner()
    );
    const rewards = await airdropContract.claimables(
      $userAddress,
      airdropData.tokens
    );
    const vvalue = await new BigNumber("10");
    const resp = await contractWithWallet.allocate(
      [$userAddress],
      [vvalue],
      "0x8967bcf84170c91b0d24d4302c2376283b0b3a07"
    );*/
    console.log(rewards);
    rewards.forEach((reward) => {
      totalRewards += parseInt(reward);
    });
  };

  $: if ($userAddress) {
    getData();
  }
</script>

<div class="networkRewardsContainer">
  <ClaimRewards {chainId} {totalRewards} />
  {#each airdropData.tokens as token}
    <Row rowObject={airdropData.tokensData[token]} />
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
