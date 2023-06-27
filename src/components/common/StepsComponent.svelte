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
  primary="var(--color-primary)"
  secondary="var(--brand-grey-lighter)"
  dark="var(--brand-grey-lighter)"
/>

