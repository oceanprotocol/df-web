<script>
  import ItemWithLabel from "../common/ItemWithLabel.svelte";

    export let apyValue;
    export let profitValue;
    export let tooltipMessage;
    export let onClick;
    export let showCalculatorButton=true;
    export let openCalculator;
    

    /*
         <Button
          className="apyMaxButton"
          text="max"
          textOnly
          onclick={() => onClick()}
        />
    */
  </script>
  
  <div class="container">
    <div class="apyDisplay">
      <ItemWithLabel
          title={`PASSIVE APY`}
          tooltipMessage={tooltipMessage}
      />
      <div class="valueContainer">
        <span class="apy">
          {`${parseFloat(apyValue).toFixed(2)}%`}
        </span>
      </div>
    </div>
    <div class="apyDisplay">
      <ItemWithLabel
        title={`Profit with Fees`}
        tooltipMessage={tooltipMessage}
      />
      <span class="profit">{`${parseFloat(profitValue).toFixed(2)} OCEAN`}</span>
    </div>
    {#if showCalculatorButton}
      <button type="button" on:click={openCalculator}>
        <img src="/images/calculator.png" alt="podium" class="podiumImage"/>
      </button>
    {/if}
  </div>
  
  <style>
    .container{
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
    }
    .apyDisplay{
      display: column;
      justify-self: center;
      align-items: center;
    }
    .valueContainer{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .apy{
      color: var(--brand-pink);
      margin-right: calc(var(--spacer)/10);
      font-weight: bold;
    }
    .profit{
      font-weight: bold;
      color: black;
    }
    .apyDisplay :global(.apyMaxButton){
      color: var(--brand-grey-light);
      font-size: var(--font-size-small);
    }
    button{
      background-color: transparent;
      height: 100%;
      padding: 0 calc(var(--spacer) / 8);
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    button > img{
      height: 100%;
      width: 100%;
    }
  </style>
  