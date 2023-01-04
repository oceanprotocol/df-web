<script>
  import { APYs } from "../../stores/airdrops";
  import { userBalances } from "../../stores/tokens";
  import { lockedOceanAmount } from "../../stores/veOcean";
  import { userAddress } from "../../stores/web3";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import { calcTotalAPY } from "../../utils/rewards";
  import Card from "../common/Card.svelte";
  import Countdown from "../common/CountDown.svelte";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  export let roundInfo = undefined;
  let totalApy, totalApyUser;

  $: if ($APYs) {
    totalApy = calcTotalAPY($APYs.active, $APYs.passive);
    totalApyUser = calcTotalAPY($APYs.activeUser, $APYs.passiveUser);
  }
</script>

<Card
  title={`Round ${roundInfo?.id}  -  ${
    parseInt(roundInfo?.passive) + parseInt(roundInfo?.active)
  } OCEAN`}
  tag={`${
    $APYs
      ? totalApy > 10000
        ? "over 10000"
        : `${parseFloat(totalApy).toFixed(2)}`
      : parseFloat(0).toFixed(2)
  }% Avg APY ${
    $userAddress
      ? `| ${
          $APYs &&
          $userBalances[
            getAddressByChainIdKey(
              import.meta.env.VITE_VE_SUPPORTED_CHAINID,
              "veOCEAN"
            )
          ] > 0
            ? totalApyUser > 10000
              ? "over 10000"
              : `${parseFloat(totalApyUser).toFixed(2)}`
            : parseFloat(0).toFixed(2)
        }% Your APY`
      : ""
  }`}
  tooltipMessage={descriptions.default.tooltip_rewards_overview}
  className="rewardsOverview"
>
  <Countdown />
</Card>

<style>
  :global(.rewardsOverview .title) {
    font-size: var(--font-size-large) !important;
  }
</style>
