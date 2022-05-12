<script>
  import NetworkRewards from "./NetworkRewards.svelte";
  import { switchWalletNetwork } from "../../stores/web3";
  import { web3, userAddress, selectedNetworks } from "../../stores/web3.js";
  import {
    airdrops,
    getAllClaimables,
    getClaimablesFromAirdrop,
  } from "../../utils/airdrops";

  let claimables = [];

  async function loadClaimables() {
    console.log("Selected networks: ", $selectedNetworks);
    claimables = await getAllClaimables(userAddress, $selectedNetworks);

    if( claimables && Object.entries(claimables).length === 0 ) {
      console.log("No claimables");
    } else {
      console.log("Number claimable contracts: ", Object.entries(claimables).length);
    }
  }

  async function claimRewards(chainId) {
    console.log("claim");
    switchWalletNetwork(chainId);

    try {
      const airdrop = airdrops[chainId];
      const airdropClaimables = claimables[chainId]
      let positiveClaimables = []

      // TODO - Make sure that claim is only done on non-zero tokens
      for (let i = 1; i < airdropClaimables.length; i++) {
        if( airdropClaimables[i] > 0 )
          positiveClaimables.push(airdrop.tokens[i])
      }

      const contract = new web3.eth.Contract(airdrops[chainId].abi, airdrops[chainId].airdropAddress)
      const results = await contract.methods.claim(positiveClaimables).send({ from: userAddress })

      const remainingClaimables = await getClaimablesFromAirdrop(chainId, airdrops[chainId].airdropAddress, userAddress);
      let success = true;
      for( const claimable of remainingClaimables ) {
        if( claimable > 0 ) {
          success = false;
          break;
        }
      }

      if (success === true) {
        console.log("Success claiming airdrop");
      } else {
        console.log("Error claiming airdrop");
      }
    } catch (error) {
      console.log("error :", error);
    }
  }

  $: if ($userAddress) {
    loadClaimables();
  }

  selectedNetworks.subscribe(value => {
    if ($userAddress) {
      loadClaimables();
    }
  });

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
