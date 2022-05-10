<script>
  import Button from "../common/Button.svelte";
  import NetworkItem from "../common/NetworkItem.svelte";

  export let pool;
  export let button;
</script>

<div class="container">
  {#each Object.entries(pool) as [title, value]}
    <div class="row">
      <span class="title">{title}</span>
      <span class="value">
        {#if title === "network"}
          <NetworkItem chainId={value} fontSize="normal" />
        {:else}
          {value}
        {/if}
      </span>
    </div>
  {/each}
  <div class="row">
    <Button text={button.text} onclick={() => button.onClick(pool.network)} />
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: calc(var(--spacer) / 4) 0;
    border-bottom: 2px solid var(--brand-grey-dimmed);
    width: 100%;
    overflow-y: scroll;
  }
  .row {
    display: flex;
    margin: 0 4%;
    flex-direction: column;
    align-items: flex-start;
  }
  .title {
    font-size: var(--font-size-small);
    margin-bottom: calc((var(--spacer) / 8));
  }
  .value {
    font-size: var(--font-size-normal);
    font-weight: bold;
  }
</style>
