<script>
  export let title;
  export let value;
</script>

<div class="item">
  <span class="title">{title}</span><span class="value">{value}</span>
</div>

<style>
  .item {
    display: flex;
    flex-direction: column;
  }
  .title {
    font-size: var(--font-size-mini);
    margin-bottom: calc((var(--spacer) / 8));
  }
  .value {
    font-size: var(--font-size-small);
    font-weight: bold;
  }
</style>
