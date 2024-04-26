<script>
    import { navigate } from "svelte-navigator";
    import Button from "../common/Button.svelte";
    import ItemWithLabel from "../common/ItemWithLabel.svelte";
  
    export let title;
    export let description;
    export let availableRewards = 0;
    export let rewards = 0;
    export let status = "ONGOING";
    export let apy=undefined;
    export let metric = {};
    export let action = {};
</script>

<div class={`container ${status=="STOPPED" ? "opac" : ''}`}>
    <div class="title">
        <div class="titleSection">
            <h4>{`${title} - ${availableRewards?.toLocaleString()} OCEAN`}</h4>
            {#if apy}
                <span class="apy">{apy.value}</span>
            {/if}
            {#if status == "STOPPED"}
                <span class="status">STOPPED - Claim your rewards</span>
            {/if}
        </div>
        {#if title.toLowerCase().includes("predictoor")}
        <a href={"https://github.com/oceanprotocol/pdr-backend/blob/main/READMEs/payout.md"} target="_blank" rel="noreferrer">claim rewards here</a>
        {:else}
        <ItemWithLabel title="rewards" value={`${parseFloat(rewards ? rewards : 0)?.toFixed(2)} OCEAN`} direction="row"/>
        {/if}
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
    .opac{
        opacity: 0.6;
    }
    .title, .action{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .titleSection{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: calc(var(--spacer)/6);
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
    .status{
        margin-left: calc(var(--spacer) / 2);
        font-weight: bold;
        color: var(--brand-alert-red);
    }
    :global(.action .button){
        margin-right: calc(var(--spacer)/3);
        width: 150px;
    }
    @media (min-width: 640px) {
        .titleSection{
            flex-direction: row;
            align-items: center;
            margin: 0;
        }
    }
</style>