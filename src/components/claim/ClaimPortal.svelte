<script>
  import Pool from "../common/Pool.svelte";
  import { switchWalletNetwork } from "../../stores/web3";

  import AirdropListWithActions from "./AirdropListWithActions.svelte";
  import { web3, userAddress, selectedNetworks } from "../../stores/web3.js";
  import {
    airdrops,
    getAllBalances,
    getBalanceFromAirdrop,
  } from "../../utils/airdrops";

  const pools = [
    { farm: "NEO DF", network: "1", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", network: "56", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", network: "137", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", network: "1", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", network: "137", token: "PSD", earned: "$5.0" },
  ];

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
    {#each pools as pool}
      <Pool {pool} button={{ text: "Claim", onClick: claimRewards }} />
    {/each}
  </div>

  {#if airdrops}
    <AirdropListWithActions
      {airdrops}
      balances={airdropBalances}
      actions={[
        {
          text: "Claim",
          onClick: onFarmClaimClick,
        },
      ]}
    />
  {/if}
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
    background-color: var(--brand-white);
    box-shadow: 0 12px 30px 0 rgba(0, 0, 0, 0.1);
    transform: translate3d(0, -0.05rem, 0);
    border-radius: var(--border-radius);
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
