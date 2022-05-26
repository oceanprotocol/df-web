<script>
  import Table from "../common/Table.svelte";
  import * as networksDataArray from "../../networks-metadata.json";
  import { getNetworkDataById } from "../../utils/web3";
  import * as poolInfoChain3 from "../../utils/metadata/pools/poolinfo-chain3.csv";
  import * as poolInfoChain4 from "../../utils/metadata/pools/poolinfo-chain4.csv";

  export const poolInfo = {
    3: poolInfoChain3,
    4: poolInfoChain4,
  };

  const networksData = networksDataArray.default;
  let pools = undefined;

  async function getPools() {
    const query = {};
    const res = await fetch(`http://test-df-sql.oceandao.org/pools`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });
    let data = await res.json();
    console.log(data);
    return data;
  }

  function getRow(poolInfo, key) {
    return {
      id: key + poolInfo.chainID,
      network: getNetworkDataById(networksData, poolInfo.chainId)?.name,
      datatoken: poolInfo.DT_symbol,
      basetoken: poolInfo.basetoken,
      tvl: parseFloat(poolInfo.stake_amt).toFixed(3),
      volume: parseFloat(poolInfo.vol_amt).toFixed(3),
      action: poolInfo.url,
    };
  }

  // TODO - Perhaps we should use the token-symbol vs. farm
  // TODO - Fix row styling - See "Ethereum Mainnet" vs. "Ropsten".
  async function initPools() {
    const allPools = await getPools();
    poolInfo.totalPools = allPools.length;
    poolInfo.totalTVL = allPools.reduce(
      (total, pool) => total + parseFloat(pool.stake_amt)
    );

    pools = [];
    allPools.forEach((poolInfo, key) => {
      pools.push(getRow(poolInfo, key));
    });
  }

  $: if (!pools) {
    initPools();
  }
</script>

<div class="container">
  <h1>Pool Explorer</h1>
  {#if pools}
    <div class="pools">
      <Table
        colData={[
          { key: "network", value: "Network" },
          { key: "datatoken", value: "Datatoken" },
          { key: "basetoken", value: "Basetoken" },
          { key: "tvl", value: "TVL", display: (cost) => "$ " + cost },
          {
            key: "volume",
            value: "Volume",
            display: (volume) => "$ " + volume,
          },
          { key: "action", value: "Action" },
        ]}
        rowData={pools}
        description="Explore all the pools that are eligible for staking, and stake your Ocean token to get rewards."
      />
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  h1 {
    margin: calc(var(--spacer) * 2) 0;
  }

  .pools {
    width: 100%;
    background-color: var(--brand-white);
    box-shadow: 0 12px 30px 0 rgba(0, 0, 0, 0.1);
    transform: translate3d(0, -0.05rem, 0);
    border-radius: var(--border-radius);
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
