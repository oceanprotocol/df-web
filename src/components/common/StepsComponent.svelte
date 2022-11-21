<script>
  import { Steps } from "svelte-steps";

  export let steps;
  export let current = 0;
</script>

<Steps
  {steps}
  {current}
  clickable={false}
  size="1.2rem"
  line="0.2rem"
  primary="var(--brand-color-primary)"
  secondary="var(--brand-grey-lighter)"
  dark="var(--brand-grey-lighter)"
/>

<style>
  :global(.steps-container) {
    width: 100%;
  }
  :global(.steps__label) {
    margin-top: 4px !important;
    font-size: var(--font-size-mini) !important;
    color: var(--brand-grey-light);
  }
</style>
