<script>
  import Button from "../common/Button.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";

  export let value;
  export let tooltipMessage;
  export let onClick;
</script>
  
  <div class="apyDisplay">
    <ItemWithLabel
        title={`Curr PASSIVE APY`}
        tooltipMessage={tooltipMessage}
    />
    <div class="valueContainer">
      <span class="apy">
        {value}
      </span>
      <Button
        className="apyMaxButton"
        text="max"
        textOnly
        onclick={() => onClick()}
      />
  </div>
  </div>
  
  <style>
    .apyDisplay{
      display: column;
      justify-self: center;
      align-items: center;
      width: 100%;
    }
    .valueContainer{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .apy{
      color: var(--brand-pink);
      margin-right: calc(var(--spacer)/10);
      font-weight: bold;
    }
    .apyDisplay :global(.apyMaxButton){
      color: var(--brand-grey-light);
      font-size: var(--font-size-small);
    }
  </style>
  