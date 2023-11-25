<script>
  import { calculateFees } from "../../utils/rewards";
  import Button from "../common/Button.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
import Modal from "../common/Modal.svelte";
  import DisplayApYandRewards from "./DisplayAPYandRewards.svelte";
  import GroupedItemsDisplay from "./GroupedItemsDisplay.svelte";
  
  export let showModal;
  export let apyValue;
  export let rewards;

  let fees = calculateFees()

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
            <ItemWithLabel title='Yield' value={'1400 OCEAN'} direction="row"/>
            <ItemWithLabel title='Fees' value={'1400 OCEAN'} direction="row"/>
            <ItemWithLabel title='Profit' value={rewards} direction="row"/>
          </div>
          <div class="feeDetails">
            <ItemWithLabel title='Lock' value={'$14'}/>
            <ItemWithLabel title='Lock amount update' value={'$14'}/>
            <ItemWithLabel title='Lock end date update' value={'$14'}/>
            <ItemWithLabel title='Claim' value={'$14'}/>
            <ItemWithLabel title='Withdraw' value={'$14'}/>
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
  