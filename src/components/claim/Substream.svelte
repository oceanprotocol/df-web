<script>
    import { navigate } from "svelte-navigator";
    import Button from "../common/Button.svelte";
    import ItemWithLabel from "../common/ItemWithLabel.svelte";
  
    export let title = undefined;
    export let description = undefined;
    export let rewardAmount = 0;
    export let rewards = 0;
    export let apy = undefined;
    export let metric = {};
    export let action = {}
</script>
  
<div>
    <div class="title">
        <div class="titleSection">
            <h4>{title}</h4>
            <span class="rewardAmount">{rewardAmount}</span>
        </div>
        <ItemWithLabel title="rewards" value={rewards}/>
    </div>
    {#if apy}
        <span class="apy"></span>
    {/if}
    <p class="description">{description}</p>
    <div class="action">
        <Button 
        fullWidth
        text={action.text}
        onclick={() => navigate(action.location)}
        />
        <ItemWithLabel title={metric.name} value={metric.name}/>
    </div>
</div>