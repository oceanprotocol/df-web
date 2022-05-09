<script>
  import Button from "../common/Button.svelte";

  export let pool;
  export let button;
</script>

<div class="container">
  {#each Object.entries(pool) as [title, value]}
    <div class="row">
      <span class="title">{title}</span>
      <span class="value">
        {value}
      </span>
    </div>
  {/each}
  <div class="row">
    <Button text={button.text} onclick={() => button.onClick()} />
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
  }
  .row {
    display: flex;
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
