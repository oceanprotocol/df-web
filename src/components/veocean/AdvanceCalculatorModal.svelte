<script>
  import Button from "../common/Button.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
import Modal from "../common/Modal.svelte";
  import DisplayApYandRewards from "./DisplayAPYandRewards.svelte";
  
  export let showModal;

  </script>
  
  <Modal bind:showModal>
      <h3 slot="header">Passive yield calculation</h3>
        <div class="container">
          <div class="metricsContainer">
            <DisplayApYandRewards
              apyValue={0}
              profitValue={0}
              tooltipMessage={''}
              onClick={() => {}}
            />
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
            <ItemWithLabel title='Profit' value={'1400 OCEAN'} direction="row"/>
          </div>
          <div class="feeDetails">
            <ItemWithLabel title='Lock' value={'1400 OCEAN'}/>
            <ItemWithLabel title='Lock amount update' value={'1400 OCEAN'}/>
            <ItemWithLabel title='Lock end date update' value={'1400 OCEAN'}/>
            <ItemWithLabel title='Claim' value={'1400 OCEAN'}/>
            <ItemWithLabel title='Withdraw' value={'1400 OCEAN'}/>
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
      width: fit-content;
    }
    .profitDetails,.feeDetails{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .profitDetails{ 
      margin: calc(var(--spacer)) 0;
    }
    .feeDetails{
      border: 2px solid var(--brand-grey-lighter);
      border-radius: var(--border-radius);
      padding: calc(var(--spacer)/3);
    }
    .buttonContainer{
      margin-top: calc(var(--spacer) / 4);
    }
  </style>
  