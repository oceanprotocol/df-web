<script>
  import Pool from "../common/Pool.svelte";

  const pools = [
    {
      farm: "NEO DF",
      network: "1",
      apr: "60%",
      "Total Staked": "$14,333,232.002",
    },
    {
      farm: "NEO DF",
      network: "1",
      apr: "60%",
      "Total Staked": "$14,333,232.002",
    },
    {
      farm: "NEO DF",
      network: "3",
      apr: "60%",
      "Total Staked": "$14,333,232.002",
    },
    {
      farm: "NEO DF",
      network: "3",
      apr: "60%",
      "Total Staked": "$14,333,232.002",
    },
    {
      farm: "NEO DF",
      network: "1",
      apr: "60%",
      "Total Staked": "$14,333,232.002",
    },
  ];

  function viewPool() {
    console.log("view pool");
  }
</script>

<div class="container">
  <h1>Pool explorer</h1>
  <div class="pools">
    {#each pools as pool}
      <Pool {pool} button={{ text: "View", onClick: viewPool }} />
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
    border-radius: 10px;
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
