<script>
  import Button from "../common/Button.svelte";
  import NetworkItem from "../common/NetworkItem.svelte";

  export let rowObject;
  export let clickData = undefined;
  export let buttons = undefined;
  export let size = "normal";
</script>

<div class={`container ${size === "large" && "large"}`}>
  {#each Object.entries(rowObject) as [title, value]}
    <div class="row">
      {#if title === "tvl"}
        <span class="title">total staked</span>
      {:else}
        <span class="title">{title}</span>
      {/if}
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
            onclick={() =>
              clickData ? button.onClick(clickData) : button.onClick(rowObject)}
            disabled={button.disabled}
          />
        </div>
      {/each}
    </div>
  {:else}
    <div class="row directionRow placeRowEnd" />
  {/if}
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: calc(var(--spacer) / 4) 8%;
    overflow-y: hidden;
    min-width: 450px;
    overflow-y: scroll;
  }
  .row {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    min-width: 100px;
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
  .row:nth-child(1) {
    align-items: flex-start;
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
    border-bottom: 1px solid var(--brand-grey-dimmed);
  }

  .buttonContainer {
    margin-right: 20px;
  }

  .buttonContainer:last-child {
    margin: 0;
  }
</style>
