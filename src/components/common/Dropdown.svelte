<script>
    import { Dropdown as CarbonDropdown } from "carbon-components-svelte";

    export let title = undefined;
    export let options = [];
    export let selectedOption = undefined;
</script>
  
<CarbonDropdown
    titleText={title}
    bind:selectedId={selectedOption}
    items={options}
/>

<style>
    :global(.bx--list-box__menu){
        background-color: white;
    }
    :global(.bx--dropdown__wrapper){

    }
    :global(.bx--list-box__field){
        background-color: white;
    }
    :global(.bx--list-box__label){
        font-weight: bold;
    }
    :global(.bx--dropdown){
        border: 0;
    }
    :global(.bx--list-box__menu-item--active){
       font-weight: bold;
    }
    :global(.bx--list-box__menu-item--highlighted){
        background-color: var(--background-content) !important;
    }
</style>