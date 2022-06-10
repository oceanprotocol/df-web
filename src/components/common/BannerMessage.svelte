<script>
  export let title = undefined;
  export let message = undefined;
  export let type = "warning";
</script>

<div class={`container ${type === "warning" ? "warning" : "default"}`}>
  <span>
    {title}
  </span>
  <p>
    {message}
  </p>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: calc(var(--spacer) / 6) 0;
    width: 100%;
    color: var(--brand-black);
    font-size: var(--font-size-smaller);
  }
  .warning {
    background-color: var(--brand-alert-yellow);
  }
  span {
    font-weight: bold;
    margin-right: calc(var(--spacer) / 12);
  }
  p {
    margin: 0;
    font-weight: 500;
    font-size: var(--font-size-smaller);
  }
  @media (min-width: 640px) {
    .container {
      flex-direction: row;
      margin: 0;
    }
  }
</style>
