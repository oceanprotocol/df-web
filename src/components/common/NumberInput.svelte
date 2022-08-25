<script>
  export let value = undefined;
  export let placeholder = undefined;
  export let min = undefined;
  export let max = undefined;
  export let disabled = false;
  export let onChange = undefined;
  export let showMax = false;
  
  const handleOnMaxClick = (period) => {
    value = max
  };
</script>

<div class={`container`}>
  <input
    class="input"
    type="number"
    {disabled}
    {min}
    {max}
    bind:value
    {placeholder}
    on:input={onChange}
  />
</div>
<div class="container-right">
  {#if showMax === true}
    <p class="maxItem" on:click={() => handleOnMaxClick()}>max</p>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .input {
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 14) calc(var(--spacer) / 6);
    border-radius: 3px;
    width: 100%;
  }
  .container-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
  }
  .maxItem {
    font-size: var(--font-size-mini);
    color: var(--brand-grey-light);
  }
  .maxItem:hover {
    cursor: pointer;
    color: var(--brand-color-primary);
  }
</style>
