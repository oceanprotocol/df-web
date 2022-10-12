<script>
  import Card from "../common/Card.svelte";
  import Countdown from "../common/CountDown.svelte";

  export let roundInfo = undefined;
  console.log(roundInfo);
</script>

<Card
  title={`Round ${roundInfo.index}  -  ${roundInfo.passive} OCEAN rewards distributed in`}
>
  <Countdown />
</Card>
