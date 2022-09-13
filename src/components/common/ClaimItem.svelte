<script>
  export let title;
  export let amount;
  export let loading = false;
  export let onClick;

  const onClaimClicked = () => {
    loading = true;
    onClick()
  }
</script>

{#if loading === false}
  <div class="container" on:click={() => onClaimClicked()}>
    <div class="description">
      <span class="title">{title}</span>
      <span class="value">${amount}</span>
    </div>
    <div class="description">
      <span class="claim">Claim</span>
    </div>
  </div>
{:else}
  <div class="container">
    <div class="description">
      <span class="value">Loading</span>
    </div>
  </div>
{/if}


<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 200px;
    margin-bottom: calc(var(--spacer) / 4);
    border: 2px solid;
    padding: 20px;
    margin: 10px;
  }
  .description {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .title {
    font-size: var(--font-size-mini);
    margin-bottom: calc((var(--spacer) / 8));
  }
  .value {
    font-size: var(--font-size-small);
    font-weight: bold;
  }
  .claim {
    font-size: var(--font-size-large);
    font-weight: bold;
    color: palevioletred
  }
</style>
