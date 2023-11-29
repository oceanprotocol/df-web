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
          title={`Optimize compounding`}
          tooltipMessage={''}
      />
      <div class="switch">
        <Switch bind:value={switchValue} design="slider" fontSize={12} displayDirection="column"/>
        <span>{`${compounds} compounds`}</span>
      </div>
    </GroupedItemsDisplay>
</div>
    
<style>
  .compound{
    display: flex;
    flex-direction: row;
    width: max-content;
  }

  .switch{
    display: flex;
    width: max-content;
  }

  .switch span{
    margin-left: 25px;
    font-size: var(--font-size-small);
    display: flex;
    align-items: center;
  }
</style>
    