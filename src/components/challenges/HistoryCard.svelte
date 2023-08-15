<script>
  import DataTable from "carbon-components-svelte/src/DataTable/DataTable.svelte";
  import DataTableSkeleton from "carbon-components-svelte/src/DataTable/DataTableSkeleton.svelte";
  import { dataChallenges, loadDFChallengeResults } from "../../stores/challenge";
  import { get } from 'svelte/store';
  import { onDestroy } from 'svelte';

  const ExternalIcon = "/images/external.svg";

  let loading = true;
  let title = "Past Challenges";
  let headers = [
    { key: 'round', value: 'Round' },
    { key: 'first_prize', value: '1st Prize Winner' },
    { key: 'second_prize', value: '2nd Prize Winner' },
    { key: 'third_prize', value: '3rd Prize Winner' },
  ];

  let rows = [];

  const formatDFChallengeResults = () => {
    // Retrieve the current value from the dataChallenges store
    const data = get(dataChallenges);
    
    // Map the data array to an array of row objects
    let results=[]
    data.forEach((row, index) => {
      results.push( {
        id: String(index + 1),
        round: row[0],
        first_prize: `${parseInt(row[1]).toLocaleString()} OCEAN - ${row[2]} - NMSE ${row[3]}`,
        second_prize: `${parseInt(row[4]).toLocaleString()} OCEAN - ${row[5]} - NMSE ${row[6]}`,
        third_prize: `${parseInt(row[7]).toLocaleString()} OCEAN - ${row[8]} - NMSE ${row[9]}`,
      });
    });

    return results.sort((a, b) => (a.round < b.round)? 1 : -1)
  }
  
  let unsubscribe;  // For cleaning up the subscription
  
  $: {
    if (!unsubscribe) { // Ensure we only subscribe once
      unsubscribe = dataChallenges.subscribe(async (value) => {
        if( !value ) {
          await loadDFChallengeResults();
          
          const formattedResults = formatDFChallengeResults();
          rows = formattedResults;

          loading = false;
        }  else {
          const formattedResults = formatDFChallengeResults();
          rows = formattedResults;

          loading = false;
        }
    });
    }
  }

  onDestroy(() => {
  // Unsubscribe when the component is unmounted
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
});
</script>

<div class="container">
    <h2 class="title">{title}</h2>
        <div class="epochHistoryTableContainer">
          {#if !$dataChallenges?.length >= 0 && !loading}
          <DataTable {headers} {rows} class="customTable">
            <svelte:fragment slot="cell-header" let:header>
              <div class="headerContainer">
                {header.value}
              </div>
            </svelte:fragment>
            <svelte:fragment slot="cell" let:cell let:row>
              <div class="cellContainer">
                {#if cell.key === 'first_prize' || cell.key === 'second_prize' || cell.key === 'third_prize'}
                  <a
                    href={'https://etherscan.io/address/' + cell.value.split(' - ')[1]}
                    target="_blank"
                    rel="noreferrer"
                    class="link"
                  >
                  <div class="challengeWinnerAndReward">
                    <span>{`${cell.value.split(' - ')[0]} - ${cell.value.split(' - ')[1].toLowerCase().substr(0, 6) + '...' + cell.value.split(' - ')[1].toLowerCase().substr(cell.value.split(' - ')[1].toLowerCase().length - 6)}`}</span>
                    <img class="externalLink" src={ExternalIcon} alt="external link" />
                  </div>
                  <span class="nmse">{cell.value.split(' - ')[2]}</span>
                  </a>
                {:else if cell.key === 'first_prize' || cell.key === 'second_prize' || cell.key === 'third_prize'}
                  {`${cell.value} OCEAN`}
                {:else if cell.key==='round'}
                  {`DF ${cell.value}`}                  
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
  .link{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-decoration: none;
  }
  .externalLink {
    width: 10px;
    height: auto;
    margin-left: calc(var(--spacer) / 6);
  }
  .challengeWinnerAndReward{
    display: flex;
    font-weight: bold;
    margin-bottom: calc(var(--spacer)/12);
  }
  .nmse{
    font-size: var(--font-size-small);
  }
</style>