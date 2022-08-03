<script>
  import { userAddress, networkSigner } from "../../stores/web3";
  import Button from "../common/Button.svelte";
  import Card from "../common/Card.svelte";
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
  <Card title="Withdraw OCEAN">
    <div>
      <div class="item">
        <p>
          <strong>OCEAN</strong> withdrawal will be enabled as soon as the lock period
          is over.
        </p>
      </div>
      <div class="item">
        <p>
          You can lock your <strong>OCEAN</strong> tokens again after you withdraw
          the current locked amount.
        </p>
      </div>
      <div class="item">
        <Button
          text={loading ? "Withdrawing..." : "Withdraw all"}
          disabled={loading ||
            !$lockedOceanAmount ||
            new Date() < $oceanUnlockDate}
          onclick={() => withdraw()}
        />
      </div>
    </div>
  </Card>
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

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .output-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .item {
    width: 100%;
    margin-bottom: calc(var(--spacer) / 3);
    display: flex;
    justify-content: center;
  }

  .item p {
    font-size: var(--font-size-small);
  }

  .item:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 640px) {
    .container {
      grid-column: 2 / 3;
    }
  }
</style>
