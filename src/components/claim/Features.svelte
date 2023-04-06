<script>
  import Card from "../common/Card.svelte";
  import * as features from "../../utils/metadata/rewards/features.json";
</script>

<div class={`container`}>
  {#each features.default as card}
    <Card title={card.title} className="featureCard" priority="secondary">
      <div class="featureContent">
        <img src={card.image} alt={card.title} />
        <p>{card.description}</p>
      </div>
    </Card>
  {/each}
</div>

<style>
  .container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: calc(var(--spacer) / 2);
    flex-direction: column;
    margin-top: calc(var(--spacer) * 2);
  }

  :global(.featureCard) {
    transition: all 0.3s ease-in-out;
    height: 220px !important;
    justify-content: center !important;
  }

  :global(.featureCard):hover {
    transform: scale(1.1);
    cursor: pointer;
  }

  .featureContent {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  img {
    height: var(--spacer);
    object-fit: contain;
    margin: auto;
    margin-bottom: calc(var(--spacer) / 4);
  }

  @media (min-width: 640px) {
    .container {
      flex-direction: row;
      gap: calc(var(--spacer) / 2);
    }
  }
</style>
