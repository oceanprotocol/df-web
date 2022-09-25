<script>
  import { oceanUnlockDate } from "../../stores/veOcean";

  import {
    getThursdayDate,
    getThursdayDateRoundingDown,
  } from "../../utils/functions";

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

  // TODO - Off by 7 days.
  const handleOnPeriodClick = (days) => {
    let targetDate = new Date(getThursdayDate());
    targetDate = new Date(targetDate.setDate(targetDate.getDate() + (days)));
    console.log("targetDate:", targetDate);
    console.log("targetDate.getUTCDay()", targetDate.getUTCDay());

    if(targetDate.getUTCDay() < 4) {
      targetDate = new Date(getThursdayDateRoundingDown(targetDate));
    } else if(targetDate.getUTCDay() != 4){
      targetDate = new Date(getThursdayDate(targetDate));
    }
    if(targetDate > new Date(max)) {
      targetDate = new Date(getThursdayDateRoundingDown(new Date(max)));
    }

    if (targetDate > new Date(max)) return;
    
    console.log("final targetDate:", targetDate);
    value = targetDate.toLocaleDateString("en-CA");
  };
</script>

<div class={`container`}>
  {#if value <= min}
    <input
      class="inputError"
      type="date"
      {step}
      {min}
      {max}
      bind:value
      {placeholder}
      on:input={onChange}
      {disabled}
    />
  {:else}
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
  {/if}
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
  .inputError {
    border: 1px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 14) calc(var(--spacer) / 6);
    border-radius: 3px;
    width: 100%;
    color: var(--brand-alert-red);
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
