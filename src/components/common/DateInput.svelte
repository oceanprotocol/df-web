<script>
  import moment from "moment";
  import { getThursdayOffset } from "../../utils/functions";

  export let value = undefined;
  export let placeholder = undefined;
  export let min = undefined;
  export let max = undefined;
  export let disabled = false;
  export let onChange = undefined;
  export let disableKeyboardInput = undefined;
  export let step = 1;
  export let selected = 0;

  const periods = [
    {
      label: "≈2 weeks",
      days: 14,
    },
    {
      label: "≈6 months",
      days: 180,
    },
    {
      label: "≈1 year",
      days: 365,
    },
    {
      label: "≈2 years",
      days: 730,
    },
    {
      label: "≈4 years",
      days: 1460,
    },
  ];

  const handleOnPeriodClick = (days) => {
    let targetDate = getThursdayOffset(moment().utc(), days, max);
    value = moment(targetDate).format("YYYY-MM-DD");
    selected = days
  };
</script>

<div class={`container`}>
  <input
    class={`input ${
      value < min && moment.utc().format("YYYY-MM-DD") <= min
        ? "inputError"
        : ""
    }`}
    type="date"
    {step}
    {min}
    {max}
    onkeydown={disableKeyboardInput ? disableKeyboardInput : undefined}
    bind:value
    {placeholder}
    on:input={() => {
      onChange
      selected = 0
    }}
    {disabled}
  />
  <ul class="periodList">
    {#each periods as period, index}
      <li class={`periodItem ${selected == period.days ? 'selected' : ''}`} on:click={() => handleOnPeriodClick(period.days)} on:keypress={()=>{}}>
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
    background-color: var(--background-content);
    color: var(--brand-black);
    font-weight: bold;
    border: 1.5px solid var(--brand-grey-lighter);
    padding: calc(var(--spacer) / 14) calc(var(--spacer) / 6);
    border-radius: 3px;
    width: 100%;
  }
  .input:disabled {
    background-color: var(--brand-grey-dimmed);
    color: var(--brand-grey-light);
  }
  .inputError {
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
    font-size: var(--font-size-small);
    color: var(--brand-grey-light);
  }
  .periodItem:hover {
    cursor: pointer;
    color: var(--brand-black);
  }
  input::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
  .selected{
    color: var(--brand-black);
    font-weight: bold;
  }

  /* if it is dark mode, invert the color of the calendar icon */
  @media (prefers-color-scheme: dark) {
    input::-webkit-calendar-picker-indicator {
      filter: invert(1);
    }
  }
</style>
