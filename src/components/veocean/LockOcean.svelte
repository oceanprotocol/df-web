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
  import AgreementCheckbox from "../common/AgreementCheckbox.svelte";
  import {
    getOceanBalance,
    addUserOceanBalanceToBalances,
    addUserVeOceanBalanceToBalances,
  } from "../../stores/tokens";
  import {
    getLockedEndTime,
    lockOcean,
    updateLockedOceanAmount,
    updateLockPeriod,
  } from "../../utils/ve";
  import * as yup from "yup";
  import { createForm } from "svelte-forms-lib";
  import { getOceanTokenAddressByChainId } from "../../utils/tokens";
  import {
    lockedOceanAmount,
    oceanUnlockDate,
    veOceanWithDelegations,
  } from "../../stores/veOcean";
  import * as networksDataArray from "../../networks-metadata.json";
  import {
    getThursdayDate
  } from "../../utils/functions";
  import { getUserVotingPowerWithDelegations } from "../../utils/delegations";
  import moment from "moment";

  let networksData = networksDataArray.default;

  let calculatedVotingPower = 0;
  let calculatedMultiplier = 0;
  let loading = false;
  let updateLockButtonText = "UPDATE LOCK";

  let schema = yup.object().shape({
    amount: yup
      .number()
      .required("Amount is requred")
      .min($oceanUnlockDate ? 0 : 1)
      .max(parseInt(getOceanBalance($connectedChainId)))
      .label("Amount"),
    unlockDate: yup
      .date()
      .required("Unlock date is requred")
      .label("Unlock Date"),
    ageement: yup
      .boolean()
      .required("Agreement is requirement.")
      .label("User Agreement"),
  });

  let fields = {
    amount: 0,
    unlockDate:
      $oceanUnlockDate
        ? $oceanUnlockDate.format("YYYY-MM-DD")
        : moment.utc(getThursdayDate(moment.utc())).format("YYYY-MM-DD"),
    ageement: false,
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
    const unlockTimestamp = moment.utc(values.unlockDate).unix();

    try {
      if ($oceanUnlockDate) {
        if (values.amount > 0) {
          await updateLockedOceanAmount(values.amount, $networkSigner);
        }
        if (moment.utc(values.unlockDate).isAfter($oceanUnlockDate)) {
          await updateLockPeriod(unlockTimestamp, $networkSigner);
        }
      } else {
        await lockOcean(values.amount, unlockTimestamp, $networkSigner);
      }
    } catch (error) {
      Swal.fire("Error!", error.message, "error").then(() => {});
      loading = false;
      return;
    }oceanUnlockDate
    Swal.fire("Success!", "OCEAN tokens successfully locked.", "success").then(
      async () => {
        loading = false;
        $form.ageement = false;
        await addUserVeOceanBalanceToBalances($userAddress, $web3Provider);
        await addUserOceanBalanceToBalances(process.env.VE_SUPPORTED_CHAINID);
        let unlockDateMilliseconds = await getLockedEndTime(
          $userAddress,
          $networkSigner
        );
        await oceanUnlockDate.update(() =>
          unlockDateMilliseconds ? moment.utc(unlockDateMilliseconds) : undefined
        );
        const newVeOceansWithDelegations =
          await getUserVotingPowerWithDelegations($userAddress);
        veOceanWithDelegations.update(() => newVeOceansWithDelegations);
        loading = false;
      }
    );
  };

  const getUpdateLockButtonText = () => {
    let unlockDate = moment.utc($form.unlockDate);
    if (loading) return "LOADING...";
    if ($form.amount > 0 && unlockDate.isAfter($oceanUnlockDate))
      return "UPDATE LOCKED AMOUNT AND LOCK END DATE";
    if ($form.amount > 0) {
      return "UPDATE LOCKED AMOUNT";
    } else if (unlockDate.isAfter($oceanUnlockDate)) {
      return "UPDATE LOCK END DATE";
    } else {
      return "UPDATE LOCK";
    }
  };

  $: if ($form) {
    updateLockButtonText = getUpdateLockButtonText();
  }

  const DAY = 60 * 60 * 24;
  const MAXDAYS = 4 * 365;
  const MAX_MS = MAXDAYS * DAY * 1000;

  const getMaxDate = () => {
    let max = moment.utc().add(MAXDAYS, 'days');
    return max;
  };

  const updateMultiplier = () => {
    if ($form.unlockDate && $form.amount > 0) {
      // 4 years = 100% voting power
      var today = moment.utc();
      var unlockDate = moment.utc($form.unlockDate);
      const msDelta = unlockDate.diff(today);
      calculatedMultiplier = ((msDelta / MAX_MS) * 100.0).toFixed(3);
      calculatedVotingPower = ((msDelta / MAX_MS) * $form.amount).toFixed(3);
    } else {
      calculatedVotingPower = 0;
    }
  };
  
  $: calculatedMultiplier, $form.unlockDate, updateMultiplier();
</script>

<div class={`container`}>
  <Card
    title={$oceanUnlockDate
      ? `Update veOCEAN Lock`
      : `Lock OCEAN, get veOCEAN`}
  >
    <form class="content" on:submit={handleSubmit}>
      <div class="item">
        <Input
          type="number"
          name="amount"
          min={$lockedOceanAmount ? 0 : 1}
          max={$userAddress && getOceanBalance($connectedChainId)
            ? parseFloat(getOceanBalance($connectedChainId)).toFixed(3)
            : 0}
          error={$errors.amount}
          disabled={getOceanBalance($connectedChainId) <= 0 ||
            moment().isAfter($oceanUnlockDate)}
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
          min={$oceanUnlockDate
            ? $oceanUnlockDate.format("YYYY-MM-DD")
            : getThursdayDate(moment())}
          disabled={getOceanBalance($connectedChainId) <= 0}
          max={getMaxDate().format("YYYY-MM-DD")}
          bind:value={$form.unlockDate}
        />
      </div>
      <div class="item">
        <div class="output-container">
          <ItemWithLabel
            title={`Lock Multiplier`}
            value={`${parseFloat(calculatedMultiplier).toFixed(2)}%`}
          />
          <ItemWithLabel
            title={`Receive`}
            value={`${parseFloat(calculatedVotingPower)} veOCEAN`}
          />
        </div>
      </div>
      <div class="item">
        {#if $connectedChainId !== parseInt(process.env.VE_SUPPORTED_CHAINID)}
          <Button
            text={!$userAddress
              ? "Connect Wallet"
              : `Switch Network to ${
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
            disabled={loading ||
              getOceanBalance($connectedChainId) <= 0 ||
              $form.amount > getOceanBalance($connectedChainId)}
            bind:agreed={$form.ageement}
          >
            {#if $oceanUnlockDate}
              <Button
                text={updateLockButtonText}
                disabled={loading ||
                  !$form.ageement ||
                  getOceanBalance($connectedChainId) <= 0 ||
                  $form.amount > getOceanBalance($connectedChainId) ||
                  ($form.amount <= 0 &&
                    moment($form.unlockDate).isBefore($oceanUnlockDate))}
                type="submit"
              />
            {:else}<Button
                text={loading ? "Locking..." : "Lock OCEAN"}
                disabled={loading ||
                  !$form.ageement ||
                  getOceanBalance($connectedChainId) <= 0 ||
                  $form.amount > getOceanBalance($connectedChainId) ||
                  $form.amount <= 0}
                type="submit"
              />
            {/if}
          </TokenApproval>
        {/if}
      </div>
      <AgreementCheckbox
        text="I have familiarized myself with veOCEAN, wave all rights, and assume all risks from using this software."
        bind:value={$form.ageement}
      />
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
