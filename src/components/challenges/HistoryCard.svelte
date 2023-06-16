<script>
  import Card from "../common/Card.svelte"
  import DataTable from "carbon-components-svelte/src/DataTable/DataTable.svelte";
  // import { dataChallenges, loadDataChallenges } from "../../stores/data";

  const ExternalIcon = "/images/external.svg";

  // let loading = true;
  let title = "Past Challenges";
  let description = "Learn about past Predict-Eth challenges and join the active one.";
  let pagination = { pageSize: 100, page: 1 };
  let headers = [
    { key: 'round', value: 'Round' },
    { key: 'first_prize', value: '1st Prize' },
    { key: 'first_place', value: 'Winner' },
    { key: 'second_prize', value: '2nd Prize' },
    { key: 'second_place', value: 'Winner' },
    { key: 'third_prize', value: '3rd Prize' },
    { key: 'third_place', value: 'Winner' }
  ];

  let rows = [
    { 
      id: '1', 
      round: 7, 
      first_prize: "$1250",
      first_place: "0xa6fb159f491ed6f33b077ee6e1d271b53ff2cb8b",
      second_prize: "$1250",
      second_place: "0xa6fb159f491ed6f33b077ee6e1d271b53ff2cb8b",
      third_prize: "$1250",
      third_place: "0xa6fb159f491ed6f33b077ee6e1d271b53ff2cb8b",
    },
    { 
      id: '2', 
      round: 6, 
      first_prize: "$1250",
      first_place: "0xA6Fb159F491ED6f33b077EE6E1D271b53Ff2cB8b",
      second_prize: "$1250",
      second_place: "0xA6Fb159F491ED6f33b077EE6E1D271b53Ff2cB8b",
      third_prize: "$1250",
      third_place: "0xA6Fb159F491ED6f33b077EE6E1D271b53Ff2cB8b",
    },
    { 
      id: '3', 
      round: 5, 
      first_prize: "$1250",
      first_place: "0xA6Fb159F491ED6f33b077EE6E1D271b53Ff2cB8b",
      second_prize: "$1250",
      second_place: "0xA6Fb159F491ED6f33b077EE6E1D271b53Ff2cB8b",
      third_prize: "$1250",
      third_place: "0xA6Fb159F491ED6f33b077EE6E1D271b53Ff2cB8b",
    },
    { 
      id: '4', 
      round: 4, 
      first_prize: "$1250",
      first_place: "0xA6Fb159F491ED6f33b077EE6E1D271b53Ff2cB8b",
      second_prize: "$1250",
      second_place: "0xA6Fb159F491ED6f33b077EE6E1D271b53Ff2cB8b",
      third_prize: "$1250",
      third_place: "0xA6Fb159F491ED6f33b077EE6E1D271b53Ff2cB8b",
    }
  ];

  // const init = async () => {
  //   if( dataChallenges.length === 0 ) 
  //     await loadDataChallenges();
  //   loading = false;
  // }

  // init();
</script>

<div class="container">
  <Card title={title}>
    <p class="message">
        {description}
    </p>
      <!-- {#if $dataChallenges.length > 0 && $loading !== false}
        {:else}
        <h3 class="loading">Loading...</h3>
      {/if} -->
      <div class="epochHistoryTableContainer">
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
      </div>
  </Card>
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
  :global(Card.container) {
    padding: 0;
    padding-top: calc(var(--spacer) / 2);
    padding-bottom: calc(var(--spacer) / 2);
  }
  .externalLink {
    width: 75%;
    height: auto;
    margin: 50%;
  }
</style>