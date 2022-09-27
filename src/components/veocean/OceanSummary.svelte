<script>
    import Card from "../common/Card.svelte";
    import ItemWithLabel from "../common/ItemWithLabel.svelte";
    import { query } from "svelte-apollo";
    import { TOTAL_LOCKED } from "../../utils/dataVeOCEAN";
    import { veOceanSummary } from "../../stores/subgraph";
    
    let summary = query(TOTAL_LOCKED);
    
    let totalLocked;
    // TODO - Implement avg lock time
    
    let loading = true;

    const convertToInternationalCurrencySystem = (value) => {
        return Math.abs(Number(value)) >= 1.0e+9
        ? (Math.abs(Number(value)) / 1.0e+9).toFixed(2) + "B"
        : Math.abs(Number(value)) >= 1.0e+6
        ? (Math.abs(Number(value)) / 1.0e+6).toFixed(2) + "M"
        : Math.abs(Number(value)) >= 1.0e+3
        ? (Math.abs(Number(value)) / 1.0e+3).toFixed(2) + "K"
        : Math.abs(Number(value));
    }

    const loadSummary = () => {
        veOceanSummary.update(() => $summary.data);
        let data = $summary.data.veOCEANs;
        
        totalLocked = data.reduce(function(total, user) {
            return total + parseInt(user.lockedAmount)
        }, 0);
    }

    $: if ($summary?.data) {
        if($summary.loading === false) {
            loadSummary();
            loading = false;
        }
    }
</script>

<div class={`container`}>
    <Card title="veOCEAN Metrics">
      <div class="veOcean-info">
        {#if loading === false}
            <ItemWithLabel
                title={`Total Locked`}
                value={`${convertToInternationalCurrencySystem(totalLocked)} OCEAN`}
                {loading}
            />
        {/if}
      </div>
    </Card>
  </div>
  
<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        grid-column: 1 / 3;
        width: 100%;
    }

    .veOcean-info {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
    }
</style>