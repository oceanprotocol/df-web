<script>
    import { Dropdown as CarbonDropdown } from "carbon-components-svelte";

    export let title = undefined;
    export let options = [];
    export let selectedOption = undefined;
    const optionBackgrounds = {
        '1': 'allocated',
        '2': 'reward',
        '3': 'published',
    };

    options = options.map(option => ({
        id: option.id,
        text: option.text,
        background: optionBackgrounds[option.id] || '',
    }));
</script>
  
<CarbonDropdown
    titleText={title}
    bind:selectedId={selectedOption}
    items={options}
    let:item
    let:index
>
    {item.text} <div class={`bg-dropdown ${item.background}`}></div>
</CarbonDropdown>


<style lang="scss" global>
    @import "carbon-components/scss/components/dropdown/_dropdown.scss";
    :global(.bx--list-box__label){
        font-size: var(--font-size-base);
    }
    :global(.bx--list-box__menu), :global(.bx--list-box__field){
        background-color: white;
    }
    :global(.bx--list-box__label), :global(.bx--list-box__menu-item--active){
        font-weight: bold;
    }
    :global(.bx--dropdown){
        border: 0;
        text-align: left;
    }
    :global(.bx--list-box__menu-item--highlighted){
        background-color: var(--background-content) !important;
    }

    .bg-dropdown {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-left: 10px;
        position: absolute;
        right: 12px;
        top: 12px;
    }

    .bg-dropdown.allocated {
        background-color: var(--brand-rank-gray);
    }
    
    .bg-dropdown.reward {
        background-color: var(--brand-rank-yellow);
    }
    
    .bg-dropdown.published {
        background-color: var(--brand-rank-red);
    }
</style>