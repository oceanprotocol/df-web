<script>
  import { userAddress, networkSigner } from "../../stores/web3";
  import Button from "../common/Button.svelte";
  import Swal from "sweetalert2";
  import { withdrawOcean } from "../../utils/ve";
  import { oceanUnlockDate, lockedOceanAmount } from "../../stores/veOcean";

  let loading = true;

  $: if ($userAddress) {
    loading = false;
  }

  const withdraw = async () => {
    loading = true;
    try {
      await withdrawOcean($networkSigner);
    } catch (error) {
      Swal.fire("Error!", error.message, "error").then(() => {});
      loading = false;
      return;
    }
    Swal.fire("Success!", "Oceans successfully withdrawn.", "success").then(
      async () => {
        loading = false;
      }
    );
  };
</script>

<div class={`container`}>
  <div class="item">
    <Button
      text={loading ? "Withdrawing..." : "Withdraw all locked"}
      secondary
      disabled={loading || !$lockedOceanAmount || new Date() < $oceanUnlockDate}
      onclick={() => withdraw()}
    />
  </div>
  <div class="item">
    <p>
      <strong>OCEAN</strong> withdrawal will be enabled as soon as the lock period
      is over.
    </p>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    grid-column: 1 / 3;
    width: 100%;
  }

  .item {
    width: 100%;
    margin-top: calc(var(--spacer) / 2);
    display: flex;
    justify-content: center;
  }

  .item p {
    font-size: var(--font-size-mini);
  }

  .item:last-child {
    margin-top: calc(var(--spacer) / 6);
    margin-bottom: 0;
  }
</style>
