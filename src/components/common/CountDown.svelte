<script>
  import moment from "moment";
  import Countdown from "svelte-countdown/src/index";
  import { getThursdayDate } from "../../utils/functions";

  export let title = undefined;

  let countdownEnd = moment(getThursdayDate(moment().utc()))
    .set({ hour: 6 })
    .add(moment().utcOffset(), "minutes")
    .format("YYYY-MM-DD H:m:s");
</script>

<Countdown
  from={countdownEnd}
  dateFormat="YYYY-MM-DD H:m:s"
  zone="Europe/Athens"
  let:remaining
>
  <div class="countdown">
    {#if title}
      <p class="countdownTitle">{title}</p>
    {/if}
    <div class="countdownContent">
      <div class="item">
        <span class="itemValue">{remaining.days}</span>
        <span class="itemTitle">DAYS</span>
      </div>
      :
      <div class="item">
        <span class="itemValue">{remaining.hours}</span>
        <span class="itemTitle">HOURS</span>
      </div>
      :
      <div class="item">
        <span class="itemValue">{remaining.minutes}</span>
        <span class="itemTitle">MINUTES</span>
      </div>
      :
      <div class="item">
        <span class="itemValue">{remaining.seconds}</span>
        <span class="itemTitle">SECONDS</span>
      </div>
    </div>
  </div>
</Countdown>

<style>
  .countdown {
    height: fit-content;
    font-size: bold;
    font-size: var(--font-size-h3);
  }
  .countdownTitle {
    font-size: var(--font-size-large);
    margin-bottom: calc(var(--spacer) / 6);
  }
  .countdownContent {
    display: flex;
  }
  .item {
    display: flex;
    flex-direction: column;
    margin: 0 calc(var(--spacer) / 6);
  }
  .itemTitle {
    font-size: var(--font-size-base);
  }
  .itemValue {
    font-weight: bold;
    font-size: var(--font-size-h3);
    margin-bottom: calc(var(--spacer) / 10);
  }
</style>
