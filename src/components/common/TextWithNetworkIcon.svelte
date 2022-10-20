<script>
  import NetworkIcon from "./NetworkIcon.svelte";

  export let networkName = "Ethereum";
  export let text = "";
</script>

<div class="textWithNetwork">
  <NetworkIcon name={networkName} minimal />
  <span class="text">{text}</span>
  <div class="fullText">
    <span>{text}</span>
  </div>
</div>

<style>
  .textWithNetwork {
    display: flex;
  }
  .text {
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fullText {
    display: none;
  }

  .text:hover + .fullText {
    display: block;
    position: absolute;
    transform: translateY(calc(-100% - 5px));
    word-break: normal;
    background-color: var(--background-content);
    box-shadow: var(--box-shadow);
    padding: calc(var(--spacer) / 6);
    z-index: 100;
    width: fit-content;
  }
  @media (min-width: 640px) {
    .text {
      width: 180px;
    }
  }
</style>
