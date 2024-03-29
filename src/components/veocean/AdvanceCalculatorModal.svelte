<script>
  import { oceanPrice } from "../../stores/tokens";
  import { calculateNumberOFClaims } from "../../utils/rewards";
  import Input from "../common/Input.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import Modal from "../common/Modal.svelte";
  import Switch from "../common/Switch.svelte";
  import DisplayApYandRewards from "./DisplayAPYandRewards.svelte";
  import GroupedItemsDisplay from "./GroupedItemsDisplay.svelte";
  import CompoundsDetails from "./CompoundsDetails.svelte";
  
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
  export let compoundsData;
  export let claims = calculateNumberOFClaims(unlockDate);

  const formatValue = (value) => {
    return parseFloat(value).toFixed(0)
  }

  const onCompoundsChange = () => {
    lockAmountUpdates = compounds>=0 ? compounds : 0
    const numberOfMandatoryClaims = calculateNumberOFClaims(unlockDate)
    claims = compounds >= numberOfMandatoryClaims || numberOfMandatoryClaims - compounds==1 ? compounds + 1 : numberOfMandatoryClaims - compounds
    simpleFlowCostOcean = (fees.lock + lockAmountUpdates * fees.updateLockedAmount + lockEndDateUpdates * fees.updateUnlockDate + claims * fees.claim + fees.withdraw)
  }

  const calculateFees = () => {
    if(!fees) return
    simpleFlowCostOcean = (fees.lock + lockAmountUpdates * fees.updateLockedAmount + lockEndDateUpdates * fees.updateUnlockDate + claims * fees.claim + fees.withdraw)
  }

  $: lockEndDateUpdates>=0 && lockAmountUpdates>=0 && claims>=0 && fees && $oceanPrice && calculateFees() 
  $: compounds>=0 && onCompoundsChange(compounds) 

  </script>
  
  <Modal bind:showModal onClose={() => {claims = calculateNumberOFClaims(unlockDate)}}>
      <h3 slot="header">Passive yield calculation</h3>
        <div class="container">
            <GroupedItemsDisplay>
              <DisplayApYandRewards
                apyValue={apyValue}
                profitValue={rewards>0? rewards - simpleFlowCostOcean : 0}
                showCalculatorButton={false}
              />
            </GroupedItemsDisplay>
            <div class="compounding">
              <span class="title">Compounding</span>
              <span class="compoundingDetails"> Manually ( Claim rewards + Update locked amount )</span>
              <div class="compoundingActionable">
                <div class="compoundInputContainer">
                  <Input type="number" value={compounds} disabled={switchValue=='on'} min=0 onChange={(e) => {compounds=e.target.value=e.target.valueAsNumber >= 0 ? e.target.valueAsNumber : 0}}/>
                  <span>Compounds</span>
                </div>
                <div class="compoundInputContainer">
                  <Switch bind:value={switchValue} design="slider" fontSize={14}/>
                  <span>Optimal</span>
                </div>
              </div>
            </div>
          <div class="profitDetails">
            <ItemWithLabel title='Rewards' value={`${formatValue(rewards)} OCEAN`}/>
            <ItemWithLabel title='Fees' value={`${formatValue(simpleFlowCostOcean)} OCEAN`}/>
            <ItemWithLabel title='Profit' value={`${formatValue(rewards>0? rewards - simpleFlowCostOcean : 0)} OCEAN`}/>
          </div>
          <div class="feeDetails">
            <div class="gasPriceContainer">
              <span>Gas Price</span> <span class={fees?.gasPrice > 50 ? 'red' : 'green'} style="font-weight: bold">{`${parseFloat(fees?.gasPrice).toFixed(0)} gwei`}</span> <span class={fees?.gasPrice > 50 ? 'red' : 'green'}>{`| ${fees?.gasPrice > 50 ? 'high' : 'low'}`}</span>
            </div>
            <div class="feeDatailsRow">
              <ItemWithLabel title='Lock' value={`1 x ${formatValue(fees?.lock)}`}/>
              <ItemWithLabel title='Update amount' value={`x ${formatValue(fees?.updateLockedAmount)}`} bind:inputValue={lockAmountUpdates} min={compounds}/>
              <ItemWithLabel title='Update date' value={`x ${formatValue(fees?.updateUnlockDate)}`} bind:inputValue={lockEndDateUpdates}/>
              <ItemWithLabel title='Claim' value={`x ${formatValue(fees?.claim)}`} bind:inputValue={claims} min={compounds}/>
              <ItemWithLabel title='Withdraw' value={`1 x ${formatValue(fees?.withdraw)}`}/>
            </div>
          </div>
          <div class="compoundDetailsContainer">
            <CompoundsDetails compounds={compoundsData?.compoundDetails}/>
          </div>
        </div>
  </Modal>
  
  <style>
    .container{
     margin-top: calc(var(--spacer));
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     color: black;
    }
    .profitDetails,.feeDetails{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .profitDetails{ 
      margin: calc(var(--spacer)) 0 calc(var(--spacer) / 2) 0;
      display: flex;
      justify-content: space-between;
    }
    .feeDetails{
      display: flex;
      flex-direction: column;
      width: 100%;
      border: 2px solid var(--brand-grey-lighter);
      border-radius: var(--border-radius);
      padding: calc(var(--spacer)/2) 10px;
      position: relative;
    }
    .compounding{
      display: flex;
      flex-direction: column;
      margin-top: calc(var(--spacer));
    }
    .compounding .title{
      font-weight: bold;
    }
    .compoundingDetails{
      color: var(--brand-grey-light);
      font-size: var(--font-size-small);
      margin-top: calc(var(--spacer)/8);
    }
    .compoundingActionable{
      margin-top: calc(var(--spacer)/4);
      display: flex;
      justify-content: space-between;
      gap: calc(var(--spacer));
    }
    .compoundInputContainer{
      display: flex;
      align-items: center;
    }
    .compoundInputContainer span{
      margin-left: calc(var(--spacer)/6);
      font-size: var(--font-size-small);
    }
    :global(.compoundInputContainer input){
      width: 52px !important;
      height: fit-content !important;
      padding: 2px 5px !important;
      font-size: var(--font-size-small);
    }
    .gasPriceContainer{
      margin-bottom: calc(var(--spacer) / 8);
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
    .red{
      color: var(--brand-alert-red);
    }
    .green{
      color: var(--brand-alert-green);
    }
    .feeDatailsRow{
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      width: 100%;
      margin-top: calc(var(--spacer) / 6);
      gap: 10px;
    }
    .compoundDetailsContainer{
      margin-top: var(--spacer);
      width: 100%;
    }

    @media (min-width: 640px) {
      .feeDetails{
        padding: calc(var(--spacer)/2);
      }
      .feeDatailsRow{
        gap: calc(var(--spacer)/2)
      }
      .feeDatailsRow{
        flex-wrap: nowrap;
        justify-content: space-between;
      }
    }
  </style>
  