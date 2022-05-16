<script>
  import Row from "../common/Row.svelte";

  // TODO - Perhaps we should use the token-symbol vs. farm
  // TODO - Fix row styling - See "Ethereum Mainnet" vs. "Ropsten".
  const pools = [
    {
      network: "1",
      farm: "NEO DF",
      did: "7Bce67697eD2858d0683c631DdE7Af823b7eea38",
      apr: "60%",
      tvl: "$14,333,232.002"
    },
    {
      network: "1",
      farm: "NEO DF",
      did: "7Bce67697eD2858d0683c631DdE7Af823b7eea38",
      apr: "60%",
      tvl: "$14,333,232.002"
    },
    {
      network: "3",
      farm: "NEO DF",
      did: "7Bce67697eD2858d0683c631DdE7Af823b7eea38",
      apr: "60%",
      tvl: "$14,333,232.002"
    },
    {
      network: "3",
      farm: "NEO DF",
      did: "7Bce67697eD2858d0683c631DdE7Af823b7eea38",
      apr: "60%",
      tvl: "$14,333,232.002"
    },
    {
      network: "1",
      farm: "NEO DF",
      did: "7Bce67697eD2858d0683c631DdE7Af823b7eea38",
      apr: "60%",
      tvl: "$14,333,232.002"
    }
  ];

  function viewPool(poolDID) {
    window.open("https://market.oceanprotocol.com/asset/did:op:" + poolDID, "_blank");
  }

  function getRow(pool) {
    return {
      network: pool.network,
      farm: pool.farm,
      apr: pool.apr,
      tvl: pool.tvl
    }
  }

</script>

<div class="container">
  <h1>Pool Explorer</h1>
  <div class="pools">
    {#each pools as pool}
      <Row
        rowObject={getRow(pool)}
        clickData={pool.did}
        buttons={[{ text: "View", onClick: viewPool }]} />
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
