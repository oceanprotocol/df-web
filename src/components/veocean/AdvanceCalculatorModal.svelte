<script>
  import { oceanPrice } from "../../stores/tokens";
  import { calculateNumberOFClaims } from "../../utils/rewards";
  import Input from "../common/Input.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import Modal from "../common/Modal.svelte";
  import Switch from "../common/Switch.svelte";
  import DisplayApYandRewards from "./DisplayAPYandRewards.svelte";
  import GroupedItemsDisplay from "./GroupedItemsDisplay.svelte";
  
  export let showModal;
  export let switchValue;
  export let apyValue;
  export let rewards;
  export let simpleFlowCostOcean;
  export let fees;
  export let lockAmountUpdates = 0;
  export let lockEndDateUpdates = 0;
  export let unlockDate;
  export let compounds;
  export let claims = calculateNumberOFClaims(unlockDate);

  const formatValue = (value) => {
    return parseFloat(value).toFixed(0)
  }

  const onCompoundsChange = () => {
    lockAmountUpdates = compounds
    lockEndDateUpdates = compounds
    claims = compounds + calculateNumberOFClaims(unlockDate)
  }

  const calculateFees = () => {
    if(!fees) return
    simpleFlowCostOcean = (fees.lock + lockAmountUpdates * fees.updateLockedAmount + lockEndDateUpdates * fees.updateUnlockDate + claims * fees.claim + fees.withdraw + compounds * (fees.claim + fees.updateLockedAmount + fees.updateUnlockDate)) / $oceanPrice
  }

  $: lockEndDateUpdates>=0 && lockEndDateUpdates>=0 && claims>=0 && fees && $oceanPrice && calculateFees() 
  $: compounds && onCompoundsChange()

  </script>
  
  <Modal bind:showModal onClose={() => {claims = calculateNumberOFClaims(unlockDate)}}>
      <h3 slot="header">Passive yield calculation</h3>
        <div class="container">
            <GroupedItemsDisplay>
              <DisplayApYandRewards
                apyValue={apyValue}
                profitValue={rewards - simpleFlowCostOcean}
                tooltipMessage={''}
                showCalculatorButton={false}
                onClick={() => {}}
              />
            </GroupedItemsDisplay>
            <div class="compounding">
              <span>Compounding</span>
              <span class="compoundingDetails">( Claim amount + Locked amount update )</span>
              <div class="compoundingActionable">
                <div class="compoundInputContainer">
                  <Input type="number" bind:value={compounds}/>
                  <span>compounds</span>
                </div>
                <div class="compoundInputContainer">
                  <Switch bind:value={switchValue} design="slider" fontSize={14} displayDirection="column"/>
                  <span>optimize</span>
                </div>
              </div>
            </div>
          <div class="profitDetails">
            <ItemWithLabel title='Yield' value={`${formatValue(rewards)} OCEAN`} direction="row"/>
            <ItemWithLabel title='Fees' value={`${formatValue(simpleFlowCostOcean)} OCEAN`} direction="row"/>
            <ItemWithLabel title='Profit' value={`${formatValue(rewards - simpleFlowCostOcean)} OCEAN`} direction="row"/>
          </div>
          <div class="feeDetails">
            <div class="feeDatailsRow">
              <ItemWithLabel title='Lock' value={`$${formatValue(fees?.lock)}`}/>
              <ItemWithLabel title='Lock amount update' value={`$${formatValue(fees?.updateLockedAmount * lockAmountUpdates)}`} bind:input={lockAmountUpdates}/>
              <ItemWithLabel title='Lock end date update' value={`$${formatValue(fees?.updateUnlockDate * lockEndDateUpdates)}`} bind:input={lockEndDateUpdates}/>
              <ItemWithLabel title='Claim' value={`$${formatValue(fees?.claim * claims)}`} bind:input={claims}/>
              <ItemWithLabel title='Withdraw' value={`$${formatValue(fees?.withdraw)}`}/>
            </div>
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
    h3{
      margin-bottom: calc(var(--spacer));
    }
    .profitDetails,.feeDetails{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .profitDetails{ 
      margin: calc(var(--spacer)) 0 calc(var(--spacer) / 2) 0;
      gap: calc(var(--spacer) * 2);
    }
    .feeDetails{
      display: flex;
      flex-direction: column;
      width: 100%;
      border: 2px solid var(--brand-grey-lighter);
      border-radius: var(--border-radius);
      padding: calc(var(--spacer)/3);
      position: relative;
    }
    .compounding{
      color: black;
      display: flex;
      flex-direction: column;
      margin-top: calc(var(--spacer));
    }
    .compoundingDetails{
      color: var(--brand-grey-light);
      font-size: var(--font-size-small);
      margin-top: calc(var(--spacer)/8);
    }
    .compoundingActionable{
      margin-top: calc(var(--spacer)/4);
      display: flex;
      gap: calc(var(--spacer));
    }
    .compoundInputContainer{
      display: flex;
      align-items: center;
    }
    .compoundInputContainer span{
      margin-left: calc(var(--spacer)/6);
    }
    :global(.compoundInputContainer input){
      width: 50px !important;
      height: fit-content !important;
    }
    .feeDetails::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent; /* Adjust the size of the triangle as needed */
      border-right: 8px solid transparent;
      border-bottom: 10px solid var(--brand-grey-lighter); /* Match the background color of your div */
    }
    .feeDatailsRow{
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin: calc(var(--spacer) / 4) 0;
    }
  </style>
  