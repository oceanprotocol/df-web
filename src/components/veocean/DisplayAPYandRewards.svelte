<script>
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import * as descriptions from "../../utils/metadata/descriptions.json";

    export let apyValue;
    export let profitValue;
    export let showCalculatorButton=true;
    export let openCalculator=undefined;
    
  </script>
  
  <div class="container">
    <div class={`valuesContainer  ${showCalculatorButton ? '' : 'showCalculatorButton'}`}>
      <div class="apyDisplay">
        <ItemWithLabel
          title={`Profit`}
          tooltipMessage={descriptions.tooltip_veocean_lock_profit}
        />
        <span class={`profit ${profitValue == 0 ? '' : profitValue > 0 ? 'green' : 'red'}`}>{`${parseFloat(profitValue).toFixed(2)} OCEAN`}</span>
      </div>
      <div class="apyDisplay">
        <ItemWithLabel
            title={`Passive APY`}
            tooltipMessage={descriptions.tooltip_veocean_lock_passiveAPY}
        />
        <div class="valueContainer">
          <span class="apy">
            {`${apyValue<0 ? '<' : ''}${parseFloat(apyValue>=0 ? apyValue : 0).toFixed(2)}%`}
          </span>
        </div>
      </div>
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
      justify-content: space-between;
    }
    .apyDisplay{
      display: column;
      justify-self: center;
      align-items: center;
    }
    .valuesContainer{
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
    .valueContainer{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .apy,.profit{
      font-size: var(--font-size-small);
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
      height: 25px;
      display: flex;
      padding: 0;
      justify-content: center;
      align-items: center;
    }
    button > img{
      height: 100%;
      width: 100%;
    }
    .green{
      color: var(--brand-alert-green);
    }
    .showCalculatorButton .profit,
    .showCalculatorButton .apy {
      font-size: var(--font-size-base) !important;
    }
    .red{
      color: var(--brand-alert-red);
    }
  </style>
  