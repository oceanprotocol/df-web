<script>
  import Link from "../common/Link.svelte";
  import NetworkIcon from "./NetworkIcon.svelte";
  import CustomTooltip from "./CustomTooltip.svelte";

  export let networkName = "";
  export let text = "";
  export let url = undefined;
  export let textColor = undefined;
  export let tooltipMessage = undefined;
  export let className = undefined
</script>

<Link className={`textWithNetwork ${className ? className : undefined}`} {url} color={textColor}>
  {#if networkName}
    <NetworkIcon name={networkName} minimal color={textColor}/>
  {/if}
  {#if tooltipMessage}
    <CustomTooltip
    text={"Item in purgatory. Remove all your allocations from this asset."}
    direction={"right"}
    align={"top"}
    state={"alert"}
  />
  {/if}
  <span class="text" style={textColor ? `color: ${textColor}` : ''}>{text}</span>
  <div class="fullText">
    <span>{text}</span>
  </div>
</Link>

<style>
  .text {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--font-size-base);
  }
  .fullText {
    display: none;
  }
  .text:hover + .fullText {
    display: block;
    position: absolute;
    transform: translateY(calc(-100%));
    word-break: normal;
    background-color: var(--background-content);
    box-shadow: var(--box-shadow);
    padding: calc(var(--spacer) / 6);
    z-index: 100;
    width: fit-content;
  }
  :global(.textWithNetwork  .bx--tooltip__trigger){
    margin: 0 !important;
    height: fit-content !important;
    padding: 0 !important;
    margin-right: 0.5rem !important;
  }
  @media (min-width: 640px) {
    .text {
      max-width: 180px;
    }
  }
</style>
