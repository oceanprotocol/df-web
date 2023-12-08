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
    claims = numberOfMandatoryClaims + (compounds > numberOfMandatoryClaims ? compounds - numberOfMandatoryClaims : 0)
    simpleFlowCostOcean = (fees.lock + lockAmountUpdates * fees.updateLockedAmount + lockEndDateUpdates * fees.updateUnlockDate + claims * fees.claim + fees.withdraw + compounds * fees.updateLockedAmount)
  }

  const calculateFees = () => {
    if(!fees) return
    console.log('herre')
    simpleFlowCostOcean = (fees.lock + lockAmountUpdates * fees.updateLockedAmount + lockEndDateUpdates * fees.updateUnlockDate + claims * fees.claim + fees.withdraw + compounds * fees.updateLockedAmount)
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
                profitValue={rewards - simpleFlowCostOcean}
                tooltipMessage={''}
                showCalculatorButton={false}
              />
            </GroupedItemsDisplay>
            <div class="compounding">
              <span class="title">Compounding</span>
              <span class="compoundingDetails">( Claim amount + Update locked amount )</span>
              <div class="compoundingActionable">
                <div class="compoundInputContainer">
                  <Input type="number" value={compounds} disabled={switchValue=='on'} min=0 onChange={(e) => {compounds=e.target.value=e.target.valueAsNumber >= 0 ? e.target.valueAsNumber : 0}}/>
                  <span>compounds</span>
                </div>
                <div class="compoundInputContainer">
                  <Switch bind:value={switchValue} design="slider" fontSize={14}/>
                  <span>optimal</span>
                </div>
              </div>
            </div>
          <div class="profitDetails">
            <ItemWithLabel title='Rewards' value={`${formatValue(rewards)} OCEAN`} direction="row"/>
            <ItemWithLabel title='Fees' value={`${formatValue(simpleFlowCostOcean)} OCEAN`} direction="row"/>
            <ItemWithLabel title='Profit' value={`${formatValue(rewards - simpleFlowCostOcean)} OCEAN`} direction="row"/>
          </div>
          <div class="feeDetails">
            <div class="gasPriceContainer">
              <span>Gas Price</span> <span class={fees?.gasPrice > 50 ? 'red' : 'green'} style="font-weight: bold">{`${parseFloat(fees?.gasPrice).toFixed(0)} gwei`}</span> <span class={fees?.gasPrice > 50 ? 'red' : 'green'}>{`| ${fees?.gasPrice > 50 ? 'high' : 'low'}`}</span>
            </div>
            <div class="feeDatailsRow">
              <ItemWithLabel title='Lock' value={`1 x ${formatValue(fees?.lock)}`}/>
              <ItemWithLabel title='Update locked amount' value={`x ${formatValue(fees?.updateLockedAmount)}`} bind:inputValue={lockAmountUpdates}/>
              <ItemWithLabel title='Update lock end date' value={`x ${formatValue(fees?.updateUnlockDate)}`} bind:inputValue={lockEndDateUpdates}/>
              <ItemWithLabel title='Claim' value={`x ${formatValue(fees?.claim)}`} bind:inputValue={claims}/>
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
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     color: black;
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
      padding: calc(var(--spacer)/2);
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
      justify-content: space-between;
      width: 100%;
      margin-top: calc(var(--spacer) / 6);
    }
    .compoundDetailsContainer{
      margin-top: var(--spacer);
      width: 100%;
    }
  </style>
  