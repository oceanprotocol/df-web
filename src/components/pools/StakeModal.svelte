<script>
  import Button from "../common/Button.svelte";

  let isOpen;
  let pool;

  function open() {
    console.log("Open StakeModal!");
    console.log("Pooldata is:", pool);
    isOpen = true;
  }
  function close() {
    isOpen = false;
  }

  function keydown(e) {
    e.stopPropagation();
    if (e.key === 'Escape') {
      close();
    }
  }

  // TODO - Is there any pooldata (BPools) that we need to be queries to calculate stake params?
  function loadPoolData() {

  }

  function stake() {
      console.log("Staked assets into pool")
  }

  function unstake() {
      console.log("Remove staked position")
  }

</script>

<style>
  div.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div.content-wrapper {
    position: absolute;
    width: 20vw;
    height: 20vh;
    border-radius: 0.3rem;
    background-color: white;
    border: 4px solid var(--brand-grey-dimmed);
    overflow: hidden;
  }
  .container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: calc(var(--spacer) / 4) 8%;
      overflow-y: hidden;
  }
  .closeButton {
      display: flex;
      justify-content: left;
      align-items: center;
  }
</style>

<Button text="LP" onclick={() => open()}/>
{#if isOpen}
  <div class="modal" on:keydown={keydown} tabindex={0} autofocus>
    <div class="content-wrapper">
        <div class="closeButton">
            <Button text="X" onclick={() => close()}/>
        </div>
        <div>
            {#if pool}
                <p>DataToken Symbol: {pool.DT_symbol}</p>
                <p>Basetoken: {pool.basetoken}</p>
                <p>TVL: {pool.tvl}</p>
                <p>Volume: {pool.volume}</p>
            {:else}
                <p>Loading...</p>
            {/if}
        </div>

        <div class="container">
            <Button text="Stake" onclick={() => stake()}/>
            <Button text="Unstake" onclick={() => unstake()}/>
        </div>
    </div>
  </div>
{/if}
