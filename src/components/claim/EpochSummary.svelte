<script>
  import Card from "../common/Card.svelte";
  import Countdown from "../common/CountDown.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import {getEpoch} from "../../utils/epochs"
  import moment from "moment";
  
  let loading = true;
  let epoch;

  const init = () => {
    const now = moment();
    epoch = getEpoch(now);
    loading = false;
  };

  init();
</script>

<div class={`container`}>
  <Card title="Data Farming Round {epoch.index}">
    <Countdown />
    <div class="veOcean-info">
      {#if loading === false}
        <ItemWithLabel
          title="Passive Rewards"
          value={epoch.passive}
        />
        <ItemWithLabel
          title="Active Rewards"
          value={epoch.active}
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
