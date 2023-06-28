<script>
  import Button from "../common/Button.svelte";

  export let challengeDetails = {};
</script>

<div class="challenge-component">
  <div class="banner" style="background: linear-gradient(to right, #7B1173, #FF4092);">
    <h3 class="banner-title">{challengeDetails.bannerTitle}</h3>
  </div>
  <div class="challenge-details">
    <strong class="challenge-description">{challengeDetails.challengeDescription}</strong>
    <p class="reward">{parseInt(challengeDetails.reward).toLocaleString()}</p>
  </div>
  <div class="challenge-cta">
    <Button 
      text={challengeDetails.buttonText}
      onclick={() => window.open(challengeDetails.url, '_blank')}
    />
    <p class="deadline">{challengeDetails.deadlineText}</p>
  </div>
</div>

<style>
  .challenge-component {
    width: 100%;
    height: 175px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: 1px solid #D9D9D9;
    margin-top: calc(var(--spacer) / 4);
  }
  .banner {
    width: 100%;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .banner-title {
    color: white;
    font-size: 20px;
  }
  .challenge-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: calc(var(--spacer) / 4);
  }
  .challenge-cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: calc(var(--spacer) / 2);
  }
  .challenge-description, .reward {
    margin: 0;
  }
  .deadline {
    padding: calc(var(--spacer) / 4);
    color: var(--brand-grey-light) !important;
  }

  @media (min-width: 640px) {
    .challenge-component {
      width: 475px;
    }
  }  
</style>