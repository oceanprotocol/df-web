<script>
  import Card from "../common/Card.svelte";
  import Countdown from "../common/CountDown.svelte";

  export let roundInfo = undefined;
  console.log(roundInfo);
</script>

<Card>
  <h1 class="title">
    {`Round ${roundInfo.index}  -  ${roundInfo.passive} OCEAN rewards distributed in`}
  </h1>
  <Countdown />
</Card>

<style>
  .title {
    font-size: var(--font-size-large);
    font-weight: bold;
    margin-bottom: calc(var(--spacer) / 2);
  }
</style>
