<script>
  const ExternalIcon = "/images/external.svg";

  export let text = undefined;
  export let url;
  export let className = undefined;
  export let color = undefined;
  export let hideIcon = false;
</script>

<a
  href={url}
  target="_blank"
  rel="noreferrer"
  style={color ? `color:${color}`: undefined}
  class={`link ${className ? className : undefined}`}
>
  {#if text}
    <span>{text}</span>
  {/if}
  <slot />
  {#if !hideIcon}
    <img src={ExternalIcon} alt="external link" />
  {/if}
</a>

<style>
  .link {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-decoration: none;
    height: fit-content;
  }
  a {
    color: var(--brand-grey-light);
    font-size: var(--font-size-small);
  }
  a:hover {
    color: var(--color-primary);
    cursor: pointer;
  }
  img {
    height: calc(var(--font-size-small) / 1.2);
    margin-left: calc(var(--spacer) / 12);
  }
</style>
