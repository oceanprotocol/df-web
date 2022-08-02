<script>
  import {
    userAddress,
    connectedChainId,
    networkSigner,
  } from "../../stores/web3";
  import Button from "../common/Button.svelte";
  import Card from "../common/Card.svelte";
  import Swal from "sweetalert2";
  import Input from "../common/Input.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import TokenApproval from "../common/TokenApproval.svelte";
  import { getOceanBalance } from "../../stores/tokens";
  import { lockOcean } from "../../utils/ve";
  import * as yup from "yup";
  import { createForm } from "svelte-forms-lib";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";
  import { lockedOceanAmount } from "../../stores/veOcean";

  let multiplier = 0;
  let apy = 0;
  let currentDate = new Date();
  let maxDate = new Date();
  let minDate = new Date();
  let loading = true;

  $: if ($userAddress) {
    loading = false;
  }
  let schema = yup.object().shape({
    amount: yup
      .number()
      .required("Amount is requred")
      .min(1)
      .max(parseInt(getOceanBalance($connectedChainId)))
      .label("Amount"),
    unlockDate: yup
      .date()
      .required("Unlock date is requred")
      .label("Unlock Date"),
  });
  let fields = {
    amount: 0,
    unlockDate: new Date(
      minDate.setDate(currentDate.getDate() + 1)
    ).toLocaleDateString("en-CA"),
  };
  const { form, errors, handleSubmit } = createForm({
    initialValues: fields,
    validationSchema: schema,
    onSubmit: (values) => onFormSubmit(values),
  });

  const onFormSubmit = async (values) => {
    loading = true;
    const timeDifference = new Date(values.unlockDate).getTime();
    try {
      await lockOcean(values.amount, timeDifference / 1000, $networkSigner);
    } catch (error) {
      Swal.fire("Error!", error.message, "error").then(() => {});
      loading = false;
      return;
    }
    Swal.fire("Success!", "Oceans successfully locked.", "success").then(
      async () => {
        loading = false;
      }
    );
  };
</script>

<div class={`container`}>
  <Card title="Lock OCEAN to get veOCEAN">
    <form class="content" on:submit={handleSubmit}>
      <div class="item">
        <Input
          type="number"
          name="amount"
          error={$errors.amount}
          label="How much do you want to lock?"
          direction="column"
          bind:value={$form.amount}
        />
      </div>
      <div class="item">
        <Input
          type="date"
          label="Lock until"
          name="unlockDate"
          error={$errors.unlockDate}
          direction="column"
          min={minDate.toLocaleDateString("en-CA")}
          max={new Date(
            maxDate.setFullYear(maxDate.getFullYear() + 4)
          ).toLocaleDateString("en-CA")}
          bind:value={$form.unlockDate}
        />
      </div>
      <div class="item">
        <div class="output-container">
          <ItemWithLabel
            title={`Votin power multiplier`}
            value={loading || `${parseFloat(multiplier).toFixed(1)} X`}
          />
          <ItemWithLabel
            title={`APY`}
            value={loading || `${parseFloat(apy)}%`}
          />
        </div>
      </div>
      <div class="item">
        <TokenApproval
          tokenAddress={getOceanTokenAddressByChainId($connectedChainId)}
          tokenName={"OCEAN"}
          poolAddress={process.env.VE_OCEAN_CONTRACT}
          amount={$form.amount}
          disabled={loading || $lockedOceanAmount}
          bind:loading
        >
          <Button
            text={loading ? "Locking..." : "Lock OCEAN"}
            disabled={loading || $lockedOceanAmount}
            type="submit"
          />
        </TokenApproval>
      </div>
    </form>
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

  .item:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 640px) {
    .container {
      grid-column: 2 / 3;
    }
  }
</style>
