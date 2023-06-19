<script>
  import Card from "../common/Card.svelte"
  import ActiveCTA from './ActiveCTA.svelte';
  import { getUpcomingFirstWednesdayOfTheMonth } from '../../utils/epochs.js';
  
  let title = "Active Challenges";
  let description = "Crunch some code and participate in the active data challenge. Data Farming challenges are a substream of Ocean Protocol Active Rewards, running over periods of 1 week. You can claim your prize in the Rewards page.";
  let challengeDetails = {
    bannerTitle: 'Predict-ETH',
    challengeDescription: 'Predict the price of Ethereum',
    reward: '$2500 Rewards',
    buttonText: 'PARTICIPATE',
    deadlineText: 'Enter before ' + getUpcomingFirstWednesdayOfTheMonth().format('DD MMM YYYY'),
    url: 'https://github.com/oceanprotocol/predict-eth/blob/main/challenges/challenge-df.md'
  };
</script>

<div class="container">
  <Card title={title}>
    <p class="message">
      {description}
    </p>
    <div class="cta-padding">
      <ActiveCTA {challengeDetails} />
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
  .cta-padding {
    padding-top: calc(var(--spacer) / 4);
  }
</style>