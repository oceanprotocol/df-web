<script>
    import DataTable from "carbon-components-svelte/src/DataTable/DataTable.svelte";
    import DataTableSkeleton from "carbon-components-svelte/src/DataTable/DataTableSkeleton.svelte";
    
    export let compoundsData = [
        {
            date: '15.12.2023',
            rewards: 2000,
            fees: 300
        },
         {
            date: '15.01.2024',
            rewards: 2000,
            fees: 300
        },
         {
            date: '15.02.2024',
            rewards: 2000,
            fees: 300
        },
         {
            date: '15.01.2024',
            rewards: 2000,
            fees: 300
        },
         {
            date: '15.02.2024',
            rewards: 2000,
            fees: 300
        }
    ]

    const headers = [
        { key: 'index', value: 'Order'},
        { key: 'date', value: 'Compound date'},
        { key: 'rewards', value: 'Rewards'},
        { key: 'fees', value: 'Fees'},
    ]
    
    let rows = []

    const createRows = () => {
        compoundsData.forEach((d, i) => {
            rows.push({
                id: i,
                index: i + 1,
                date: d.date,
                rewards: d.rewards,
                fees: d.fees
            })
        })
    }

    $: compoundsData && createRows()
</script>

<div>
    <span class="title">Compounds Details</span>
    <DataTable
        headers={headers}
        rows={rows}
        class="compoundsTable"
        stickyHeader
    >
    </DataTable>
</div>


<style>
    :global(.compoundsTable tbody){
        height: 50px !important;
        overflow-y: scroll !important;
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
    div{
        width: 100%;
    }
</style>