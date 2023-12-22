<script>
    import DataTable from "carbon-components-svelte/src/DataTable/DataTable.svelte";
  import moment from "moment";
    
    export let compounds = []

    const headers = [
        { key: 'index', value: 'Order'},
        { key: 'date', value: 'When to compound'},
        { key: 'rewards', value: 'Rewards'},
        { key: 'fees', value: 'Fees'},
    ]
    
    let rows = []

    const createRows = () => {
        rows=[]
        compounds.forEach((d, i) => {
            rows.push({
                id: i,
                index: i + 1,
                date: moment(d?.date).format("DD-MM-YYYY"),
                rewards: parseFloat(d?.rewards).toFixed(),
                fees: parseFloat(d?.fees).toFixed()
            })
        })
    }

    $: compounds && createRows()
</script>

<div>
    <span class="title">Suggested Compounds</span>
    {#if rows}
        <DataTable
        headers={headers}
        rows={rows}
        class="compoundsTable"
        stickyHeader
        >
        </DataTable>
    {/if}
   
</div>


<style>
    :global(.compoundsTable){
        width: 100%;
        overflow: scroll;
    }
    :global(.compoundsTable table){
        height: 150px;
        min-width: 400px !important;
        background-color: var(--brand-grey-dimmed);
    }
    :global(.compoundsTable table::-webkit-scrollbar-track){
        color: white;
    }
    :global(.compoundsTable td, .compoundsTable th){
        font-size: var(--font-size-small) !important;
    }
    :global(.compoundsTable tr){
        height: 2rem !important;
    }
    :global(.compoundsTable th){
        padding: calc(var(--spacer) / 8) calc(var(--spacer) / 6) !important;
    }
    :global(.bx--data-table--sticky-header .bx--table-header-label){
        padding-top: 0 !important;
    }
    :global(.compoundsTable td){
        padding: calc(var(--spacer) / 6) !important;
    }
    .title{
        margin-bottom: calc(var(--spacer) / 5);
        font-weight: bold;
    }
    :global(.compoundsTable #index,#fees,#rewards){
            width: 180px;
        }
    :global(.compoundsTable tr td:first-child,td:nth-child(3),td:last-child){
        width: 180px !important;
    }
    @media (min-width: 640px) {
        :global(.compoundsTable #index,#fees,#rewards){
            width: 100%;
        }
        :global(.compoundsTable tr td:first-child,td:nth-child(3),td:last-child){
            width: 100% !important;
        }
        :global(.compoundsTable table){
            min-width: 600px !important;
        }
    }
</style>