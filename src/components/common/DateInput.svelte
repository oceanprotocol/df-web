<script>
  import { getThursdayDate } from "../../utils/functions";

  export let value = undefined;
  export let placeholder = undefined;
  export let min = undefined;
  export let max = undefined;
  export let disabled = false;
  export let onChange = undefined;
  export let step = 1;

  const periods = [
    {
      label: "~1 week",
      days: 7,
    },
    {
      label: "~1 month",
      days: 30,
    },
    {
      label: "~6 months",
      days: 180,
    },
    {
      label: "~2 years",
      days: 730,
    },
    {
      label: "~4 years",
      days: 1460,
    },
  ];

  const handleOnPeriodClick = (days) => {
    let thursdayDate = getThursdayDate();
    let date = new Date(thursdayDate).setDate(
      new Date(thursdayDate).getDate() + days
    );
    value = new Date(date).toLocaleDateString("en-CA");
  };
</script>

<div class={`container`}>
  <input
    class="input"
    type="date"
    {step}
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
