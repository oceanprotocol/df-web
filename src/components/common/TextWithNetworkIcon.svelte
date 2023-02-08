<script>
  import Link from "../common/Link.svelte";
  import NetworkIcon from "./NetworkIcon.svelte";

  export let networkName = "";
  export let text = "";
  export let url = undefined;
</script>

<Link className="textWithNetwork" {url}>
  <NetworkIcon name={networkName} minimal />
  <span class="text">{text}</span>
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
  @media (min-width: 640px) {
    .text {
      max-width: 180px;
    }
  }
</style>
