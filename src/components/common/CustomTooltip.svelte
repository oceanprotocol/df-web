<script>
  import { Tooltip } from "carbon-components-svelte";

  export let text = undefined;
  export let direction = "top";
  export let align = "center";
  export let open = false;
</script>

<div on:mouseleave={() => (open = false)} on:mouseenter={() => (open = true)}>
  <Tooltip {align} {direction} size={10} {open}>
    <div class="textContainer">
      <p class="text">
        {text}
      </p>
    </div>
  </Tooltip>
</div>

<style>
  .textContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    background-color: var(--brand-white);
    width: 160px;
  }
  .text {
    color: black;
    font-size: var(--font-size-mini);
  }
</style>
