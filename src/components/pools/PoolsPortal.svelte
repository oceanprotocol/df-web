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
    let res;
    try {
      res = await fetch(`http://test-df-sql.oceandao.org/pools`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });
    } catch (error) {
      console.log(error);
      return [];
    }
    let data = await res.json();
    return data;
  }

  function getRow(poolInfo, key) {
    return {
      id: key + poolInfo.chainID,
      network: getNetworkDataById(networksData, poolInfo.chainId)?.name,
      datatoken: poolInfo.DT_symbol,
      "datatoken address": poolInfo.DT_addr,
      basetoken: poolInfo.basetoken,
      "basetoken address": poolInfo.basetoken_addr,
      tvl: parseFloat(poolInfo.stake_amt).toFixed(3),
      volume: parseFloat(poolInfo.vol_amt).toFixed(3),
      "nft address": poolInfo.nft_addr,
      "pool address": poolInfo.pool_addr,
      action: poolInfo.url,
    };
  }

  // TODO - Perhaps we should use the token-symbol vs. farm
  // TODO - Fix row styling - See "Ethereum Mainnet" vs. "Ropsten".
  async function initPools() {
    const allPools = await getPools();
    if (allPools.length === 0) {
      pools = [];
      return;
    }
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
          { key: "datatoken address", value: "Datatoken Address" },
          { key: "basetoken", value: "Basetoken" },
          { key: "basetoken address", value: "Basetoken Address" },
          { key: "tvl", value: "TVL", display: (cost) => "$ " + cost },
          {
            key: "volume",
            value: "Volume",
            display: (volume) => "$ " + volume,
          },
          { key: "nft address", value: "NFT Address" },
          { key: "pool address", value: "Pool Address" },
          { key: "action", value: "Action" },
        ]}
        notHidableColumns={["Network", "Action"]}
        rowData={pools}
      />
    </div>
  {:else}
    <span class="loading">Loading...</span>
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

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
