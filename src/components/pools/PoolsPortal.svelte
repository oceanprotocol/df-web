<script>
  import Row from "../common/Row.svelte";
  import * as poolInfoChain3 from "../../utils/metadata/pools/poolinfo-chain3.csv";
  import * as poolInfoChain4 from "../../utils/metadata/pools/poolinfo-chain4.csv";

  export const poolInfo = {
    3: poolInfoChain3,
    4: poolInfoChain4,
  }

  const pools = [];

  function getRow(poolInfo) {
    return {
      url: poolInfo.url,
      rowData: {
        network: poolInfo.chainID,
        datatoken: poolInfo.DT_symbol,
        token: poolInfo.basetoken,
        tvl: parseFloat(poolInfo.stake_amt),
        volume: parseFloat(poolInfo.vol_amt)
      }
    }
  }

  // TODO - Perhaps we should use the token-symbol vs. farm
  // TODO - Fix row styling - See "Ethereum Mainnet" vs. "Ropsten".
  function initPools() {
    for (const poolsByChain of Object.values(poolInfo)) {
      poolInfo.totalPools = Object.entries(poolsByChain.default).length;
      poolInfo.totalTVL = Object.values(poolsByChain.default).reduce((total, pool) => total + parseFloat(pool.stake_amt));

      poolsByChain.default.forEach(poolInfo => {
        pools.push(getRow(poolInfo));
      });
    }
  }

  function viewPool(url) {
    window.open(url, "_blank");
  }

  initPools();

</script>

<div class="container">
  <h1>Pool Explorer</h1>
  <div class="pools">
    {#if pools}
      {#each pools as pool}
        <Row
          rowObject={pool.rowData}
          clickData={pool.url}
          buttons={[{ text: "View", onClick: viewPool }]} />
      {/each}
    {/if}
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
