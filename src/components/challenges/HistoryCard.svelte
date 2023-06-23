<script>
  import DataTable from "carbon-components-svelte/src/DataTable/DataTable.svelte";
  import DataTableSkeleton from "carbon-components-svelte/src/DataTable/DataTableSkeleton.svelte";
  import { dataChallenges, loadDFChallengeResults } from "../../stores/data";
  import { get } from 'svelte/store';

  const ExternalIcon = "/images/external.svg";

  let loading = true;
  let title = "Past Challenges";
  let headers = [
    { key: 'round', value: 'Round' },
    { key: 'first_prize', value: '1st Prize' },
    { key: 'first_place', value: 'Winner' },
    { key: 'second_prize', value: '2nd Prize' },
    { key: 'second_place', value: 'Winner' },
    { key: 'third_prize', value: '3rd Prize' },
    { key: 'third_place', value: 'Winner' }
  ];

  let rows = [];

  const formatDFChallengeResults = () => {
    // Retrieve the current value from the dataChallenges store
    const data = get(dataChallenges);
    
    // Map the data array to an array of row objects
    const results = data.map((row, index) => {
      return {
        id: String(index + 1),
        round: row[0],
        first_prize: row[1],
        first_place: row[2],
        second_prize: row[3],
        second_place: row[4],
        third_prize: row[5],
        third_place: row[6]
      };
    });

    return results;
  }

  const init = async () => {
    // Subscribe to get the value of dataChallenges
    dataChallenges.subscribe(async (value) => {
      if( !value || value.length === 0 ) {
        await loadDFChallengeResults();
        
        const formattedResults = formatDFChallengeResults();
        rows = formattedResults;

        loading = false;
      }
    });
  }

  init();
</script>

<div class="container">
    <h2 class="title">{title}</h2>
        <div class="epochHistoryTableContainer">
          {#if $dataChallenges.length > 0 && !loading}
          <DataTable {headers} {rows} class="customTable">
            <svelte:fragment slot="cell-header" let:header>
              <div class="headerContainer">
                {header.value}
              </div>
            </svelte:fragment>
            <svelte:fragment slot="cell" let:cell let:row>
              <div class="cellContainer">
                {#if cell.key === 'first_place' || cell.key === 'second_place' || cell.key === 'third_place'}
                  {cell.value.toLowerCase().substr(0, 6) + '...' + cell.value.toLowerCase().substr(cell.value.length - 6)}
                  <a
                    href={'https://etherscan.io/address/' + cell.value}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img class="externalLink" src={ExternalIcon} alt="external link" />
                  </a>
                {:else}
                  {cell.value}
                {/if}
              </div>
            </svelte:fragment>
          </DataTable>
          {:else}
          <DataTableSkeleton {headers} showHeader={false} showToolbar={false}/>
        {/if}
        </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-top: calc(var(--spacer) * 2);
  }
  .title{
    margin-bottom: calc(var(--spacer) / 2);
  }
  .externalLink {
    width: 75%;
    height: auto;
    margin: 50%;
  }
</style>