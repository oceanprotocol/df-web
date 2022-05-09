<script>
  import Pool from "../common/Pool.svelte";
  import { switchWalletNetwork } from "../../stores/web3";

  const pools = [
    { farm: "NEO DF", network: "1", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", network: "56", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", network: "137", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", network: "1", token: "PSD", earned: "$5.0" },
    { farm: "NEO DF", network: "137", token: "PSD", earned: "$5.0" },
  ];

  function claimRewards(chainId) {
    console.log("claim");
    switchWalletNetwork(chainId);
  }
</script>

<div class="container">
  <h1>Claim Portal</h1>
  <div class="pools">
    {#each pools as pool}
      <Pool {pool} button={{ text: "Claim", onClick: claimRewards }} />
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
