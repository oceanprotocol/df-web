<script>
  import { APYs } from "../../stores/airdrops";
  import { calcTotalAPY } from "../../utils/rewards";
  import Card from "../common/Card.svelte";
  import Countdown from "../common/CountDown.svelte";

  export let roundInfo = undefined;

  let totalApy;

  $: if ($APYs) {
    console.log($APYs);
    totalApy = calcTotalAPY($APYs.active, $APYs.passive);
  }
</script>

<Card
  title={`Round ${roundInfo.id}  -  ${
    parseInt(roundInfo.passive) + parseInt(roundInfo.active)
  } OCEAN rewards distributed in`}
  tag={`${
    $APYs
      ? $APYs?.passive + $APYs?.activeAVG > 10000
        ? "over 10000"
        : `${parseFloat($APYs?.passive + $APYs?.activeAVG).toFixed(3)}`
      : 0
  }% APY`}
  className="rewardsOverview"
>
  <Countdown />
</Card>

<style>
  :global(.rewardsOverview .title) {
    font-size: var(--font-size-large) !important;
  }
</style>
