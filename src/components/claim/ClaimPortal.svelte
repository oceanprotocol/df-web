<script>
  import AirdropListWithActions from "./AirdropListWithActions.svelte";
  import { web3, userAddress, selectedNetworks } from "../../stores/web3.js";
  import { airdrops , claimABI, getAllBalances, getBalanceFromAirdrop} from "../../utils/airdrops"

  let airdropBalances = [];

  async function loadClaimables() {
    airdropBalances = await getAllBalances(userAddress, selectedNetworks)
  }

  const onFarmClaimClick = async (balance) => {
    try {
      const airdrop = airdrops[balance[0]];

      const contract = new web3.eth.Contract(claimABI, airdrop.airdropAddress)
      await contract.methods.claim().send({ from: userAddress })

      balance[1] = await getBalanceFromAirdrop(userAddress, airdrop.airdropAddress)
      if( balance[1] <= 0 ) {
        console.log("Success claiming airdrop")
      } else {
        console.log("Error claiming airdrop")
      }
    } catch (error) {
      console.log("error :", error)
    }
  }

  loadClaimables()
</script>

<div>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>

  {#if airdrops}
    <AirdropListWithActions
      airdrops={airdrops}
      balances={airdropBalances}
      actions={[
        {
            "text": "Claim",
            "onClick": onFarmClaimClick
        }
      ]}/>
  {/if}
</div>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
