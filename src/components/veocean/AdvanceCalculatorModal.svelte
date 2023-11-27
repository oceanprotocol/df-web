<script>
  import Button from "../common/Button.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
import Modal from "../common/Modal.svelte";
  import DisplayApYandRewards from "./DisplayAPYandRewards.svelte";
  import GroupedItemsDisplay from "./GroupedItemsDisplay.svelte";
  
  export let showModal;
  export let apyValue;
  export let rewards;
  export let simpleFlowCostOcean;
  export let fees

  const formatValue = (value) => {
    return parseFloat(value).toFixed(0)
  }

  </script>
  
  <Modal bind:showModal>
      <h3 slot="header">Passive yield calculation</h3>
        <div class="container">
          <div class="metricsContainer">
            <GroupedItemsDisplay>
              <DisplayApYandRewards
                apyValue={apyValue}
                profitValue={rewards}
                tooltipMessage={''}
                showCalculatorButton={false}
                onClick={() => {}}
              />
            </GroupedItemsDisplay>
            <div class="buttonContainer">
              <Button
                textOnly
                text='MAX OUT YIELD'
              />
            </div>
          </div>
          <div class="profitDetails">
            <ItemWithLabel title='Yield' value={`${formatValue(rewards)} OCEAN`} direction="row"/>
            <ItemWithLabel title='Fees' value={`${formatValue(simpleFlowCostOcean)} OCEAN`} direction="row"/>
            <ItemWithLabel title='Profit' value={`${formatValue(rewards - simpleFlowCostOcean)} OCEAN`} direction="row"/>
          </div>
          <div class="feeDetails">
            <ItemWithLabel title='Lock' value={`$${formatValue(fees?.lock)}`}/>
            <ItemWithLabel title='Lock amount update' value={`$${formatValue(fees?.updateLockedAmount)}`}/>
            <ItemWithLabel title='Lock end date update' value={`$${formatValue(fees?.updateUnlockDate)}`}/>
            <ItemWithLabel title='Claim' value={`$${formatValue(fees?.claim)}`}/>
            <ItemWithLabel title='Withdraw' value={`$${formatValue(fees?.withdraw)}`}/>
          </div>
        </div>
  </Modal>
  
  <style>
    .container{
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
    }
    .metricsContainer{
      margin-top: calc(var(--spacer));
      width: 100%;
    }
    .profitDetails,.feeDetails{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .profitDetails{ 
      margin: calc(var(--spacer)) 0;
      gap: calc(var(--spacer) * 2);
    }
    .feeDetails{
      width: 100%;
      border: 2px solid var(--brand-grey-lighter);
      border-radius: var(--border-radius);
      padding: calc(var(--spacer)/3);
    }
    .buttonContainer{
      margin-top: calc(var(--spacer) / 4);
    }
  </style>
  