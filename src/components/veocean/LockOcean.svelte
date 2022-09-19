<script>
  import {
    userAddress,
    connectedChainId,
    networkSigner,
    switchWalletNetwork,
    getNetworkDataById,
    web3Provider,
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
    updateLockPeriod,
  } from "../../utils/ve";
  import * as yup from "yup";
  import { createForm } from "svelte-forms-lib";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";
  import { lockedOceanAmount, oceanUnlockDate } from "../../stores/veOcean";
  import * as networksDataArray from "../../networks-metadata.json";
  import { getThursdayDate } from "../../utils/functions";

  let networksData = networksDataArray.default;

  let calculatedVotingPower = 0;
  let calculatedMultiplier = 0;
  let maxDate = new Date(getThursdayDate());
  let loading = true;
  let updateLockButtonText = "UPDATE LOCK";

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

  $: if ($userAddress) {
    loading = false;
  }

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
          await updateLockPeriod(timeDifference / 1000, $networkSigner);
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
        await addUserVeOceanBalanceToBalances($userAddress, $web3Provider);
        await addUserOceanBalanceToBalances(process.env.VE_SUPPORTED_CHAINID);
      }
    );
  };

  const getUpdateLockButtonText = () => {
    let unlockDate = new Date($form.unlockDate);
    if (loading) return "LOADING...";
    if ($form.amount > 0 && unlockDate > $oceanUnlockDate)
      return "UPDATE LOCKED AMOUNT AND LOCK END DATE";
    if ($form.amount > 0) {
      return "UPDATE LOCKED AMOUNT";
    } else if (unlockDate > $oceanUnlockDate) {
      return "UPDATE LOCK END DATE";
    } else {
      return "UPDATE LOCK";
    }
  };

  $: if ($form) {
    updateLockButtonText = getUpdateLockButtonText();
  }

  const getMaxTime = () => {
    let thursdayDate = new Date(getThursdayDate());
    let date = new Date(
      getThursdayDate(
        new Date(
          new Date(thursdayDate).setDate(thursdayDate.getDate() + 4 * 365 - 7)
        )
      )
    );
    return date.getDay() === 4
      ? date - thursdayDate
      : new Date(getThursdayDate(date)) - thursdayDate;
  };

  const MAXTIME = getMaxTime();

  const updateMultiplier = () => {
    if ($form.unlockDate) {
      // 4 years = 100% voting power
      var thursday = new Date(getThursdayDate());
      const lockDateDiff = new Date($form.unlockDate) - thursday;
      var msDelta =
        lockDateDiff > 0
          ? lockDateDiff
          : new Date($form.unlockDate) - new Date();
      calculatedMultiplier = ((msDelta / MAXTIME) * 100.0).toFixed(3);
      if ($form.amount > 0) {
        calculatedVotingPower = ((msDelta / MAXTIME) * $form.amount).toFixed(3);
      } else {
        calculatedVotingPower = 0;
      }
    } else {
      calculatedMultiplier = 0;
    }
  };

  $: calculatedMultiplier, $form.unlockDate, updateMultiplier();
</script>

<div class={`container`}>
  <Card
    title={$lockedOceanAmount > 0
      ? `Update veOCEAN Lock`
      : `Lock OCEAN, get veOCEAN`}
  >
    <form class="content" on:submit={handleSubmit}>
      <div class="item">
        <Input
          type="number"
          name="amount"
          min={$lockedOceanAmount ? 0 : 1}
          max={parseFloat(getOceanBalance($connectedChainId)).toFixed(3)}
          error={$errors.amount}
          disabled={getOceanBalance($connectedChainId) <= 0 ||
            new Date() > $oceanUnlockDate}
          label="OCEAN Amount"
          direction="column"
          bind:value={$form.amount}
          maxValueLabel="Balance: "
          showMaxValue={true}
          showMaxButton={true}
        />
      </div>
      <div class="item">
        <Input
          type="date"
          label="Lock End Date"
          name="unlockDate"
          step="7"
          error={$errors.unlockDate}
          direction="column"
          min={$lockedOceanAmount > 0
            ? new Date($oceanUnlockDate).toLocaleDateString("en-CA")
            : getThursdayDate()}
          disabled={getOceanBalance($connectedChainId) <= 0}
          max={new Date(
            getThursdayDate(
              new Date(maxDate.setDate(maxDate.getDate() + 4 * 365 - 7))
            )
          ).toLocaleDateString("en-CA")}
          bind:value={$form.unlockDate}
        />
      </div>
      <div class="item">
        <div class="output-container">
          <ItemWithLabel
            title={`Lock Multiplier`}
            value={loading
              ? "loading"
              : `${parseFloat(calculatedMultiplier).toFixed(1)}%`}
          />
          <ItemWithLabel
            title={`Allocation Power`}
            value={loading
              ? "loading"
              : `${parseFloat(calculatedVotingPower)} veOCEAN`}
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
            spender={process.env.VE_OCEAN_CONTRACT}
            amount={$form.amount}
            disabled={loading || getOceanBalance($connectedChainId) <= 0}
            bind:loading
          >
            {#if $lockedOceanAmount > 0}
              <Button
                text={updateLockButtonText}
                disabled={loading ||
                  getOceanBalance($connectedChainId) <= 0 ||
                  ($form.amount <= 0 &&
                    new Date($form.unlockDate) <= $oceanUnlockDate)}
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
