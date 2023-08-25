<script>
  import { APYs } from "../../stores/airdrops";
  import { userBalances } from "../../stores/tokens";
  import { userAddress } from "../../stores/web3";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import { calcTotalAPY } from "../../utils/rewards";
  import Card from "../common/Card.svelte";
  import Countdown from "../common/CountDown.svelte";
  import * as descriptions from "../../utils/metadata/descriptions.json";

  export let roundInfo = undefined;
  let totalApy, totalApyUser;
  const supportedChainId = import.meta.env.VITE_VE_SUPPORTED_CHAINID

  $: if ($APYs) {
    totalApy = calcTotalAPY($APYs.active, $APYs.passive);
    totalApyUser = calcTotalAPY($APYs.activeUser, $APYs.passiveUser);
  }

  function getTotalRewards(){
    let totalRewards = 0
    roundInfo?.streams?.forEach((stream) => {
      totalRewards+=parseInt(stream.rewards)
    })
    return `${totalRewards.toLocaleString()} OCEAN`
  }

  function calculateApyString(
    apyValue,
    userApyValue,
    userBalances,
    supportedChainId
  ) {
    const veOceanAddress = getAddressByChainIdKey(supportedChainId,"veOCEAN")
    const userBalance = veOceanAddress && userBalances[veOceanAddress] ? userBalances[veOceanAddress] : 0;
    const formattedApyValue = apyValue > 10000 ? "over 10000" : `${parseFloat(apyValue).toFixed(2)}`;
    
    if (userApyValue && userBalance > 0) {
      const formattedUserApyValue = userApyValue > 10000 ? "over 10000" : `${parseFloat(userApyValue).toFixed(2)}`;
      return `${formattedUserApyValue}% Your APY | ${formattedApyValue}% Avg APY`;
    }
    
    return apyValue > 0 ? `${formattedApyValue}% Avg APY` : "";
  }
</script>

<Card
  title={`Data Farming Round ${roundInfo?.id}`}
  subtitle={getTotalRewards()}
  tag={calculateApyString(
    totalApy,
    totalApyUser,
    supportedChainId
  )}
  tooltipMessage={descriptions.default.tooltip_rewards_overview}
>
  <Countdown />
</Card>