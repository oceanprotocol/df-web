<script>
  import NetworkRewards from "./NetworkRewards.svelte";
  import { switchWalletNetwork } from "../../stores/web3";
  import { web3, userAddress, selectedNetworks } from "../../stores/web3.js";
  import {
    airdrops,
    getAllBalances,
    getBalanceFromAirdrop,
  } from "../../utils/airdrops";

  let airdropBalances = [];

  async function loadClaimables() {
    airdropBalances = await getAllBalances(userAddress, selectedNetworks);
  }

  const onFarmClaimClick = async (balance) => {
    try {
      const airdrop = airdrops[balance[0]];

      const contract = new web3.eth.Contract(claimABI, airdrop.airdropAddress);
      await contract.methods.claim().send({ from: userAddress });

      balance[1] = await getBalanceFromAirdrop(
        userAddress,
        airdrop.airdropAddress
      );
      if (balance[1] <= 0) {
        console.log("Success claiming airdrop");
      } else {
        console.log("Error claiming airdrop");
      }
    } catch (error) {
      console.log("error :", error);
    }
  };

  function claimRewards(chainId) {
    console.log("claim");
    switchWalletNetwork(chainId);
  }

  loadClaimables();
</script>

<div class="container">
  <h1>Claim Portal</h1>
  <div class="pools">
    {#each $selectedNetworks as chainId}
      <NetworkRewards {chainId} />
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .pools {
    width: 100%;
  }

  h1 {
    margin: calc(var(--spacer) * 2) 0;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
