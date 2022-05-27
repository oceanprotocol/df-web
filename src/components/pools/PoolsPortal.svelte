<script>
  import PoolRow from "./PoolRow.svelte";
  import {pools} from "../../stores/pools";

  function viewPool(pool) {
    window.open(pool.url, "_blank");
  }

</script>

<div class="container">
  <div class="pools">
    {#if $pools}
      {#each $pools as pool}
        <PoolRow
          pool={pool}
          rowObject={pool.rowData}
          buttons={[{ text: "View", onClick: viewPool }]}
        />
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
