<script>
  import moment from "moment";
  import Countdown from "svelte-countdown/src/index";
  import { getThursdayDate } from "../../utils/functions";
</script>

<Countdown
  from={"2022-10-06"}
  dateFormat="YYYY-MM-DD"
  zone="Europe/Athens"
  let:remaining
>
  <div class="countdown">
    <p class="countdownTitle">NEXT REWARDS DISTRIBUTION IN</p>
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
    font-size: var(--font-size-large);
    margin-bottom: calc(var(--spacer));
  }
  .countdownTitle {
    font-size: var(--font-size-normal);
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
    font-size: var(--font-size-mini);
  }
  .itemValue {
    font-weight: bold;
    font-size: var(--font-size-large);
    margin-bottom: calc(var(--spacer) / 10);
  }
</style>
