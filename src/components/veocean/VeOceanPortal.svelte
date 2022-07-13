<script>
  import { userAddress } from "../../stores/web3";
  import VeOceanCard from "./VeOceanCard.svelte";
  import OceanCard from "./OceanCard.svelte";

  $: if ($userAddress) {
  }
</script>

<div class={`container`}>
  <VeOceanCard />
  <OceanCard />
  <OceanCard />
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: calc(var(--spacer) / 2);
    padding-top: calc(var(--spacer) * 2);
  }

  .loading {
    font-size: var(--font-size-normal);
    color: var(--brand-grey-light);
  }

  .alignContentCenter {
    justify-content: center;
  }

  @media (min-width: 640px) {
    .container {
      padding-top: calc(var(--spacer) / 2);
    }
  }
</style>
