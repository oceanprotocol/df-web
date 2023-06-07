<script>
    import { navigate } from "svelte-navigator";
    import Button from "../common/Button.svelte";
    import ItemWithLabel from "../common/ItemWithLabel.svelte";
  
    export let title = undefined;
    export let description = undefined;
    export let availableRewards = 0;
    export let rewards = 0;
    export let apy = undefined;
    export let metric = {};
    export let action = {}
</script>
  
<div class="container">
    <div class="title">
        <div class="titleSection">
        <h4>{`${title} - ${availableRewards} OCEAN`}</h4>
        {#if apy}
            <span class="apy">{apy.value}</span>
        {/if}
        </div>
        <ItemWithLabel title="rewards" value={rewards} direction="row"/>
    </div>
    <p class="description">{description}</p>
    <div class="action">
        <Button 
            text={action.text}
            onclick={() => navigate(action.location)}
            secondary
        />
        <ItemWithLabel title={metric.name} value={metric.value} direction="row"/>
    </div>
</div>

<style>
    .container{
        width: 100%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        margin: calc(var(--spacer)/3) 0;
    }
    .title, .action{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .titleSection{
        display: flex;
        align-items: center;
    }
    h4{
        margin-right: calc(var(--spacer)/4);
    }
    .apy {
        color: var(--color-primary);
        font-weight: bold;
    }
    .description{
        text-align: start;
    }
    .action{
     justify-content: flex-start;
    }
    :global(.action .button){
        margin-right: calc(var(--spacer)/3);
        width: 150px;
    }
</style>