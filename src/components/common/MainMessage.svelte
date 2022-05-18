<script>
  export let title = undefined;
  export let message = undefined;
</script>

<div class="container">
  <span>{title}</span>
  <p>{message}</p>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: calc(var(--spacer) / 4);
  }
  span {
    font-weight: bold;
  }
  p {
    font-size: var(--font-size-normal);
  }
</style>
