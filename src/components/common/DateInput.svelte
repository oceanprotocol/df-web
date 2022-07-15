<script>
  export let value;
  export let placeholder = undefined;
  export let min;
  export let max;
  export let onChange;
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
  />
  <ul class="periodList">
    <li class="periodItem">2 weeks</li>
    <li class="periodItem">1 month</li>
    <li class="periodItem">1 year</li>
    <li class="periodItem">2 years</li>
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
  }
  .periodItem {
    font-size: var(--font-size-mini);
  }
</style>
