<script>
  import { oceanUnlockDate } from "../../stores/veOcean";

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
      days: 30 - 7,
    },
    {
      label: "~6 months",
      days: 180 - 7,
    },
    {
      label: "~2 years",
      days: 730 - 7,
    },
    {
      label: "~4 years",
      days: 1460 - 7,
    },
  ];

  const handleOnPeriodClick = (days) => {
    const currentDate = $oceanUnlockDate
      ? $oceanUnlockDate
      : new Date(getThursdayDate());
    let date = new Date(currentDate).setDate(
      currentDate || new Date(currentDate).getDay() === 4
        ? new Date(currentDate).getDate() + days
        : new Date(getThursdayDate(currentDate)).getDate() + days
    );
    if (new Date(date) > new Date(max)) return;
    value =
      days % 7 === 0
        ? new Date(date).toLocaleDateString("en-CA")
        : new Date(getThursdayDate(new Date(date))).toLocaleDateString("en-CA");
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
