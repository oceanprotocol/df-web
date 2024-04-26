<script>
  import Card from "../common/Card.svelte";
  import Countdown from "../common/CountDown.svelte";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  export let roundInfo = undefined;

  function getTotalRewards(){
    let totalRewards = 0
    roundInfo?.streams?.forEach((stream) => {
      totalRewards+=parseInt(stream.rewards)
    })
    return `${totalRewards.toLocaleString()} OCEAN`
  }
</script>

<Card
  title={`Data Farming Round ${roundInfo?.id}`}
  subtitle={getTotalRewards()}
  tooltipMessage={descriptions.default.tooltip_rewards_overview}
>
  <Countdown />
</Card>