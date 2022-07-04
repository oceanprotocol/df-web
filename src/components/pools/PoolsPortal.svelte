<script>
  import { loadPools, pools, columnsData } from "../../stores/pools";
  import { getAllPoolSharesForLPAddress } from "../../utils/poolShares";
  import { userStakes } from "../../stores/poolShares";
  import { userAddress } from "../../stores/web3";
  import Table from "../common/Table.svelte";

  $: if (!$pools) {
    loadPools(`${process.env.BACKEND_API}/pools`);
    getAllPoolSharesForLPAddress($userAddress).then((resp) => {
      userStakes.update(() => resp);
    });
  }
</script>

<div class="container">
  {#if $pools}
    <div class="pools">
      <Table
        colData={columnsData}
        notHidableColumns={["Action", "LP"]}
        rowData={$pools}
        description="Explore all the pools that are eligible for staking, and stake your Ocean token to get rewards."
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
    justify-content: flex-start;
    height: calc(100vh - 115px);
  }

  .pools {
    width: 100%;
    background-color: var(--brand-white);
    box-shadow: 0 12px 30px 0 rgba(0, 0, 0, 0.1);
    transform: translate3d(0, -0.05rem, 0);
    border-radius: var(--border-radius);
    margin-top: calc(var(--spacer) * 2);
  }

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
  }

  @media (min-width: 640px) {
    .pools {
      margin-top: calc(var(--spacer) / 2);
    }
  }
</style>
