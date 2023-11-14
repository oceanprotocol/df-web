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
    <div class="valuContainer">
    <span class="apy">
      {`${parseFloat(value).toFixed(2)}%`}
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
    }
    .valuContainer{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .apy{
      color: var(--brand-pink);
      margin-right: calc(var(--spacer)/10);
    }
    .apyDisplay :global(.apyMaxButton){
      color: var(--brand-grey-light);
      font-size: var(--font-size-small);
    }
  </style>
  