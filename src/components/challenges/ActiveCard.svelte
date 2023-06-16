<script>
  import Card from "../common/Card.svelte"
  import ActiveCTA from './ActiveCTA.svelte';

  let title = "Active Challenges";
  let description = "Crunch some code and participate in one of the active data challenges. Data Farming challenges are a substream of oceanprotocol active reward stream, running over periods of 1 week.Rewards can be claimed at data farming webpage.";
  let challengeDetails = {
    bannerTitle: 'Cryptocurrency',
    challengeDescription: 'OCEAN Token Sentiment Analysis Challenge',
    reward: '$2500 Rewards',
    buttonText: 'PARTICIPATE',
    deadlineText: 'Enter before 15 Jun 2023',
    url: 'https://github.com/oceanprotocol/predict-eth/blob/main/challenges/main7.md'
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