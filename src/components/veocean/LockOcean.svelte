<script>
  import {
    userAddress,
    connectedChainId,
    networkSigner,
    switchWalletNetwork,
    getNetworkDataById,
  } from "../../stores/web3";
  import Button from "../common/Button.svelte";
  import Card from "../common/Card.svelte";
  import Swal from "sweetalert2";
  import Input from "../common/Input.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import TokenApproval from "../common/TokenApproval.svelte";
  import {
    getOceanBalance,
    addUserOceanBalanceToBalances,
    addUserVeOceanBalanceToBalances,
  } from "../../stores/tokens";
  import {
    lockOcean,
    updateLockedOceanAmount,
    updateLuckPeriod,
  } from "../../utils/ve";
  import * as yup from "yup";
  import { createForm } from "svelte-forms-lib";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";
  import { lockedOceanAmount, oceanUnlockDate } from "../../stores/veOcean";
  import * as networksDataArray from "../../networks-metadata.json";

  let networksData = networksDataArray.default;

  let multiplier = 0;
  let apy = 0;
  let maxDate = new Date();
  let loading = true;

  const getThursdayDate = () => {
    var curr = new Date();
    if (curr.getDay() > 4) curr.setDate(curr.getDate() + 4); // get current date
    var first = curr.getDate() - curr.getDay();
    return new Date(curr.setDate(first + 4)).toLocaleDateString("en-CA");
  };

  $: if ($userAddress) {
    loading = false;
  }
  let schema = yup.object().shape({
    amount: yup
      .number()
      .required("Amount is requred")
      .min($lockedOceanAmount ? 0 : 1)
      .max(parseInt(getOceanBalance($connectedChainId)))
      .label("Amount"),
    unlockDate: yup
      .date()
      .required("Unlock date is requred")
      .label("Unlock Date"),
  });
  let fields = {
    amount: 0,
    unlockDate:
      $lockedOceanAmount > 0
        ? new Date($oceanUnlockDate).toLocaleDateString("en-CA")
        : getThursdayDate(),
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
      if ($lockedOceanAmount > 0) {
        if (values.amount > 0) {
          await updateLockedOceanAmount(values.amount, $networkSigner);
        }
        if (new Date(values.unlockDate) > new Date($oceanUnlockDate)) {
          await updateLuckPeriod(timeDifference / 1000, $networkSigner);
        }
      } else {
        await lockOcean(values.amount, timeDifference / 1000, $networkSigner);
      }
    } catch (error) {
      Swal.fire("Error!", error.message, "error").then(() => {});
      loading = false;
      return;
    }
    Swal.fire("Success!", "Oceans successfully locked.", "success").then(
      async () => {
        loading = false;
        await addUserVeOceanBalanceToBalances($userAddress);
        await addUserOceanBalanceToBalances(process.env.VE_SUPPORTED_CHAINID);
      }
    );
  };
</script>

<div class={`container`}>
  <Card
    title={$lockedOceanAmount > 0
      ? `Update lock values`
      : `Lock OCEAN to get veOCEAN`}
  >
    <form class="content" on:submit={handleSubmit}>
      <div class="item">
        <Input
          type="number"
          name="amount"
          min={$lockedOceanAmount ? 0 : 1}
          max={parseInt(getOceanBalance($connectedChainId))}
          error={$errors.amount}
          disabled={getOceanBalance($connectedChainId) <= 0}
          label={`How much ${
            $lockedOceanAmount > 0 ? "extra tokens" : ""
          } do you want to lock?`}
          direction="column"
          bind:value={$form.amount}
          showMax={true}
        />
      </div>
      <div class="item">
        <Input
          type="date"
          label={$lockedOceanAmount > 0 ? "Extend lock until" : "Lock until"}
          name="unlockDate"
          step="7"
          error={$errors.unlockDate}
          direction="column"
          min={$lockedOceanAmount > 0
            ? new Date($oceanUnlockDate).toLocaleDateString("en-CA")
            : getThursdayDate()}
          disabled={getOceanBalance($connectedChainId) <= 0}
          max={new Date(
            maxDate.setFullYear(maxDate.getFullYear() + 4)
          ).toLocaleDateString("en-CA")}
          bind:value={$form.unlockDate}
        />
      </div>
      <div class="item">
        <div class="output-container">
          <ItemWithLabel
            title={`Voting power multiplier`}
            value={loading
              ? "loading"
              : `${parseFloat(multiplier).toFixed(1)} X`}
          />
          <ItemWithLabel
            title={`APY`}
            value={loading ? "loading" : `${parseFloat(apy)}%`}
          />
        </div>
      </div>
      <div class="item">
        {#if $connectedChainId !== parseInt(process.env.VE_SUPPORTED_CHAINID)}
          <Button
            text={`Switch Network to ${
              getNetworkDataById(
                networksData,
                parseInt(process.env.VE_SUPPORTED_CHAINID)
              )?.name
            }`}
            onclick={() =>
              switchWalletNetwork(process.env.VE_SUPPORTED_CHAINID)}
            disabled={!$userAddress}
          />
        {:else}
          <TokenApproval
            tokenAddress={getOceanTokenAddressByChainId($connectedChainId)}
            tokenName={"OCEAN"}
            poolAddress={process.env.VE_OCEAN_CONTRACT}
            amount={$form.amount}
            disabled={loading || getOceanBalance($connectedChainId) <= 0}
            bind:loading
          >
            {#if $lockedOceanAmount > 0}
              <Button
                text={loading ? "Extending lock..." : "Extend OCEAN lock"}
                disabled={loading ||
                  getOceanBalance($connectedChainId) <= 0 ||
                  $form.amount < 0}
                type="submit"
              />
            {:else}<Button
                text={loading ? "Locking..." : "Lock OCEAN"}
                disabled={loading ||
                  getOceanBalance($connectedChainId) <= 0 ||
                  $form.amount <= 0}
                type="submit"
              />
            {/if}
          </TokenApproval>
        {/if}
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
