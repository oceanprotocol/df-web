<script>
  const ExternalIcon = "/images/external.svg";
  export let text;
  export let url;
</script>

<a href={url} target="_blank" class="link">
  <span class="text">{text}</span>
  <img src={ExternalIcon} alt="external link" />
</a>

<style>
  .link {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    width: fit-content;
    height: fit-content;
  }
  .text {
    color: var(--brand-grey-light);
    font-size: var(--font-size-normal);
  }
  .text:hover {
    color: var(--brand-color-primary);
    cursor: pointer;
  }
  img {
    height: calc(var(--font-size-normal) / 2.5);
    margin-left: calc(var(--spacer) / 12);
  }
</style>
