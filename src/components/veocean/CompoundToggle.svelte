<script>
    import ItemWithLabel from "../common/ItemWithLabel.svelte";
    import Switch from "../common/Switch.svelte";
    import GroupedItemsDisplay from "./GroupedItemsDisplay.svelte";
    import * as descriptions from "../../utils/metadata/descriptions.json";
  
  
    export let switchValue;
    export let compounds;
</script>
    
<div class="compound">
    <GroupedItemsDisplay>
      <ItemWithLabel
          title={`${compounds} compounds`}
          tooltipMessage={descriptions.tooltip_veocean_lock_compounds}
      />
      <div class="switch">
        <Switch bind:value={switchValue} design="slider" fontSize={12}/>
        <span>optimal</span>
      </div>
    </GroupedItemsDisplay>
</div>
    
<style>
  .compound{
    min-width: 50%;
    display: flex;
    flex-direction: column;
    width: max-content;
  }

  :global(.compound .title){
    font-weight: bold;
  }

  .switch{
    display: flex;
    justify-content: center; 
    width: 100%;
  }

  .switch span{
    margin-left: 5px;
    font-size: var(--font-size-small);
    display: flex;
    align-items: center;
  }
</style>
    