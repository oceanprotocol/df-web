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
    position: relative;
    cursor: pointer;
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
    top: -60px;
    background-color: var(--background-body);
    padding: calc(var(--spacer) / 6);
  }
  @media (min-width: 640px) {
    .text {
      width: 180px;
    }
  }
</style>
