<script>
  export let value = undefined;
  export let placeholder = undefined;
  export let min = undefined;
  export let max = undefined;
  export let disabled = false;
  export let onChange = undefined;

  const periods = [
    {
      label: "~2 weeks",
      days: 14,
    },
    {
      label: "~1 month",
      days: 30,
    },
    {
      label: "~1 year",
      days: 365,
    },
    {
      label: "~2 years",
      days: 730,
    },
  ];

  const handleOnPeriodClick = (period) => {
    let date = new Date().setDate(new Date().getDate() + period);
    value = new Date(date).toLocaleDateString("en-CA");
  };
</script>

<div class={`container`}>
  <input
    class="input"
    type="date"
    {min}
    {max}
    bind:value
    {placeholder}
    on:input={onChange}
    {disabled}
  />
  <ul class="periodList">
    {#each periods as period, index}
      <li class="periodItem" on:click={() => handleOnPeriodClick(period.days)}>
        {period.label}
      </li>
    {/each}
  </ul>
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
  .periodList {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: calc(var(--spacer) / 12);
    padding: 0 calc(var(--spacer) / 8);
  }
  .periodItem {
    font-size: var(--font-size-mini);
    color: var(--brand-grey-light);
  }
  .periodItem:hover {
    cursor: pointer;
    color: var(--brand-color-primary);
  }
</style>
