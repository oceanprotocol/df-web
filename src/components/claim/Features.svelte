<script>
  import Card from "../common/Card.svelte";
  import * as features from "../../utils/metadata/rewards/features.json";
  const ExternalIcon = "/images/external.svg";
  import { oceanUnlockDate } from "../../stores/veOcean";

  let displayedFeatures;

  const chageDisplayedFeatures = () => {
    displayedFeatures = !$oceanUnlockDate
      ? features.default.slice(0, 3)
      : features.default.slice(3, 6);
  };

  $: $oceanUnlockDate && chageDisplayedFeatures();

  chageDisplayedFeatures();
</script>

<div class={`container`}>
  {#each displayedFeatures as card}
    <a href={card.link} target="_blank" rel="noreferrer">
      <Card title={card.title} className="featureCard" priority="secondary">
        <div class="featureContent">
          <img src={card.image} alt={card.title} />
          <p>{card.description}</p>
        </div>
        <div class="externalLinkIcon">
          <img src={ExternalIcon} alt="external link icon" />
        </div>
      </Card>
    </a>
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

  .container a {
    text-decoration: none;
    width: 100%;
  }

  :global(.featureCard) {
    position: relative !important;
    transition: all 0.3s ease-in-out;
    padding: calc(var(--spacer) / 2) var(--spacer) !important;
    height: 220px !important;
    justify-content: center !important;
    overflow: hidden !important;
  }

  :global(.featureCard):hover {
    cursor: pointer;
  }

  :global(.featureCard):hover .externalLinkIcon {
    transform: translateY(+200%);
    opacity: 1;
    transition: all 0.3s ease, opacity 1s linear;
  }

  .externalLinkIcon {
    position: absolute;
    top: -16px;
    right: 20px;
    height: 16px;
    text-align: center;
    opacity: 0;
    transition: all 0.3s ease, opacity 1s linear;
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

  .externalLinkIcon img {
    height: 100%;
    margin: 0;
  }

  @media (min-width: 640px) {
    .container {
      flex-direction: row;
      gap: calc(var(--spacer) / 2);
    }
  }
</style>
