<script>
  import Button from "../common/Button.svelte";
  import NetworkItem from "../common/NetworkItem.svelte";

  export let rowObject;
  export let buttons;
  export let size = "normal";
</script>

<div class={`container ${size === "large" && "large"}`}>
  {#each Object.entries(rowObject) as [title, value]}
    <div class="row">
      <span class="title">{title}</span>
      <span class="value">
        {#if title === "network"}
          <NetworkItem chainId={value} fontSize="normal" />
        {:else}
          {value}
        {/if}
      </span>
    </div>
  {/each}
  {#if buttons}
    <div class="row directionRow placeRowEnd">
      {#each buttons as button}
        <div class="buttonContainer">
          <Button
            text={button.text}
            onclick={() => button.onClick(rowObject.network)}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: calc(var(--spacer) / 4) 8%;
    border-bottom: 2px solid var(--brand-grey-dimmed);
    overflow-y: scroll;
  }
  .row {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
  }
  .title {
    font-size: var(--font-size-mini);
    margin-bottom: calc((var(--spacer) / 8));
  }
  .value {
    font-size: var(--font-size-small);
    font-weight: bold;
  }
  .directionRow {
    flex-direction: row;
  }
  .row:nth-child(2) {
    align-items: center;
  }
  .row:last-child {
    align-items: center;
  }
  .placeRowEnd {
    justify-content: flex-end;
  }
  .large .title {
    font-size: var(--font-size-small);
  }

  .large .value {
    font-size: var(--font-size-normal);
  }

  .large {
    padding: calc(var(--spacer) / 3) 8%;
    border-bottom: 2px solid var(--brand-grey-lighter);
  }

  .buttonContainer {
    margin-right: 20px;
  }

  .buttonContainer:last-child {
    margin: 0;
  }
</style>
