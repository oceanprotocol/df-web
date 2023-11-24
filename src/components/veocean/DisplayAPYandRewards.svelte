<script>
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import AdvanceCalculatorModal from "./AdvanceCalculatorModal.svelte";


    export let apyValue;
    export let profitValue;
    export let tooltipMessage;
    export let onClick;
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
          {apyValue}
        </span>
      </div>
    </div>
    <div class="apyDisplay">
      <ItemWithLabel
        title={`Profit with Fees`}
        tooltipMessage={tooltipMessage}
      />
      <span>{profitValue}</span>
    </div>
    <button type="button" on:click={openCalculator}>
      <img src="/images/calculator.png" alt="podium" class="podiumImage"/>
    </button>
  </div>
  
  <style>
    .container{
      display: flex;
      background-color: var(--brand-grey-lighter);
      padding: 10px;
      border-radius: 10px;
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
    .apyDisplay :global(.apyMaxButton){
      color: var(--brand-grey-light);
      font-size: var(--font-size-small);
    }
    button{
      background-color: transparent;
      height: 100%;
      padding: 0;
      width: 20px;
    }
    button > img{
      height: 100%;
      width: 100%;
    }
  </style>
  