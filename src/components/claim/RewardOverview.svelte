<script>
  import { APYs } from "../../stores/airdrops";
  import { userAddress } from "../../stores/web3";
  import { calcTotalAPY } from "../../utils/rewards";
  import Card from "../common/Card.svelte";
  import Countdown from "../common/CountDown.svelte";

  export let roundInfo = undefined;
  let totalApy, totalApyUser;

  $: if ($APYs) {
    totalApy = calcTotalAPY($APYs.active, $APYs.passive);
    totalApyUser = calcTotalAPY($APYs.activeUser, $APYs.passive);
  }
</script>

<Card
  title={`Round ${roundInfo?.id}  -  ${
    parseInt(roundInfo?.passive) + parseInt(roundInfo?.active)
  } OCEAN rewards distributed in`}
  tag={`${
    $APYs
      ? totalApy > 10000
        ? "over 10000"
        : `${parseFloat(totalApy).toFixed(3)}`
      : 0
  }% Avg APY ${
    $userAddress
      ? `| ${
          $APYs
            ? totalApyUser > 10000
              ? "over 10000"
              : `${parseFloat(totalApyUser).toFixed(3)}`
            : 0
        }% Your APY`
      : ""
  }`}
  className="rewardsOverview"
>
  <Countdown />
</Card>

<style>
  :global(.rewardsOverview .title) {
    font-size: var(--font-size-large) !important;
  }
</style>
