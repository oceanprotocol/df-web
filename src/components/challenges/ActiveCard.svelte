<script>
  import Card from "../common/Card.svelte"
  import { getUpcomingFirstWednesdayOfTheMonth } from '../../utils/epochs.js';
  import moment from "moment";
  import { getEpoch } from "../../utils/epochs";
  import Button from "../common/Button.svelte";

  const now = moment.utc();
  let curEpoch = getEpoch(now);

  let challengeDetails = {
    bannerTitle: `Challenge-DF ${curEpoch.id}`,
    challengeDescription: `Crunch some code and participate in the <strong>weekly</strong> data challenge. </br>Predict the price of Ethereum for a share of <strong>${curEpoch.streams[1].substreams[1].rewards} OCEAN</strong> rewards.`,
    reward: `${curEpoch.streams[1].substreams[1].rewards} OCEAN in Rewards`,
    buttonText: 'PARTICIPATE',
    deadlineText: 'Enter before ' + getUpcomingFirstWednesdayOfTheMonth().format('DD MMM YYYY'),
    url: 'https://github.com/oceanprotocol/predict-eth/blob/main/challenges/challenge-df.md'
  };
</script>

<div class="container">
  <Card title={challengeDetails.bannerTitle}>
    <p class="message">
      {@html challengeDetails.challengeDescription}
    </p>
    <div class="challenge-cta">
      <Button
        text={challengeDetails.buttonText}
        onclick={() => window.open(challengeDetails.url, '_blank')}
      />
      <p class="deadline">{challengeDetails.deadlineText}</p>
    </div>
  </Card>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-top: calc(var(--spacer) * 2);
  }
  .challenge-cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: calc(var(--spacer) / 2);
  }
  .deadline {
    padding-top: calc(var(--spacer) / 4);
    color: var(--brand-grey-light) !important;
  }
</style>