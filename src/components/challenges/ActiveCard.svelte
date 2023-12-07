<script>
  import Card from "../common/Card.svelte"
  import moment from "moment";
  import { getEpoch } from "../../utils/epochs";
  import Button from "../common/Button.svelte";

  const now = moment.utc();
  let curEpoch = getEpoch(now);

  let challengeDetails = {
    bannerTitle: `Challenge-DF 66 - Last round`,
    challengeDescription: `Crunch some code and participate in the active data challenge for <strong>predicting the price of Ethereum</strong>. Data Farming challenges are a substream of Ocean Protocol Active Rewards, running over <strong>periods of 1 week</strong>. You can claim your prize from the <a href="https://df.oceandao.org/rewards">Rewards page</a>. </br></br> Round 66 marked the conclusion of Challenge-DF. Keep submitting your predictions within Predictoor to qualify for Predictoor-DF rewards.`,
    reward: `${curEpoch?.streams && curEpoch?.streams[1]?.substreams ? curEpoch?.streams[1]?.substreams[1]?.rewards : 0} OCEAN in Rewards`,
    buttonText: 'PARTICIPATE',
    deadlineText: 'Closed',
    url: 'https://github.com/oceanprotocol/predict-eth/blob/main/challenges/challenge-df.md'
  };
</script>

<div class="container">
  <Card title={challengeDetails.bannerTitle}>
    <img src="/images/features/podium.png" alt="podium" class="podiumImage"/>
    <p class="description">
      {@html challengeDetails.challengeDescription}
    </p>
    {#if curEpoch?.streams && curEpoch?.streams[1]?.substreams && curEpoch?.streams[1]?.substreams[1]?.prizes}
    <div class="prizes">
      {#each curEpoch?.streams[1]?.substreams[1]?.prizes as prize, i}
        <div class="prize">
          <span class="place">{`${i + 1}${i == 0 ? 'st' : i == 1 ? 'nd' : 'rd'}`}</span> - {`${parseInt(prize).toLocaleString()} OCEAN`}
        </div>
      {/each}
    </div>
    {/if}
    <div class="challenge-cta">
      <Button
        text={challengeDetails.buttonText}
        onclick={() => window.open(challengeDetails.url, '_blank')}
        disabled
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
  .description{
    margin-bottom: calc(var(--spacer) / 3);
    margin-top: calc(var(--spacer) / 6);
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
  .prizes{
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }
  .prize{
    margin: 0;
    font-size: var(--font-size-large);
  }
  .place{
    color: var(--brand-pink);
  }
  .podiumImage{
    height: 40px;
  }

  @media (min-width: 489px) {
  .prize{
    margin: 0 calc(var(--spacer));
  }
}
</style>