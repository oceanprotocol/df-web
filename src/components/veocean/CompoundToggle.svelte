<script>
    import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import Switch from "../common/Switch.svelte";
    import GroupedItemsDisplay from "./GroupedItemsDisplay.svelte";
  
  
    export let switchValue;
    export let compounds;
</script>
    
<div class="compound">
    <GroupedItemsDisplay>
      <ItemWithLabel
          title={`${compounds} compounds`}
          tooltipMessage={'Hello'}
      />
      <div class="switch">
        <Switch bind:value={switchValue} design="slider" fontSize={12}/>
        <span>optimize</span>
      </div>
    </GroupedItemsDisplay>
</div>
    
<style>
  .compound{
    display: flex;
    flex-direction: column;
    width: max-content;
  }

  :global(.compound .title){
    font-weight: bold;
  }

  .switch{
    display: flex;
    width: max-content;
  }

  .switch span{
    margin-left: 28px;
    font-size: var(--font-size-small);
    display: flex;
    align-items: center;
  }
</style>
    