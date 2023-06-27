<script>
  import ActiveCard from "./ActiveCard.svelte";
  import HistoryCard from "./HistoryCard.svelte";
</script>

<div class={`container`}>
  <ActiveCard />
  <HistoryCard />
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
  }
  .cardsContainer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacer);
    padding-top: var(--spacer);
  }
  .title {
    width: 100%;
    margin-bottom: calc(var(--spacer) / 2);
  }
  .message {
    width: 100%;
  }
</style>
