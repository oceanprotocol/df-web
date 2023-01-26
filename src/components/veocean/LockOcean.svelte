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
    updateUserBalanceOcean,
    updateUserBalanceVeOcean,
  } from "../../stores/tokens";
  import {
    getLockedEndTime,
    getLockedOceanAmount,
    lockOcean,
    updateLockedOceanAmount,
    updateLockPeriod,
  } from "../../utils/ve";
  import * as yup from "yup";
  import { createForm } from "svelte-forms-lib";
  import {
    lockedOceanAmount,
    oceanUnlockDate,
    veOceanWithDelegations,
  } from "../../stores/veOcean";
  import * as networksDataArray from "../../networks-metadata.json";
  import { getThursdayDate, getThursdayOffset } from "../../utils/functions";
  import { getUserVotingPowerWithDelegations } from "../../utils/delegations";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import moment from "moment";
  import * as descriptions from "../../utils/metadata/descriptions.json";
  import StepsComponent from "../common/StepsComponent.svelte";

  let networksData = networksDataArray.default;

  let oceanBalance = 0;
  let calculatedVotingPower = 0;
  let calculatedMultiplier = 0;
  let loading = false;
  let updateLockButtonText = "UPDATE LOCK";
  let tokenApproved = false;

  const MAXDAYS = 4 * 365;

  let steps = [
    { text: "Approve OCEAN" },
    { text: "Lock" },
    { text: "Receive veOCEAN" },
  ];
  let currentStep = 0;

  const getMaxDate = () => {
    let max = moment.utc().add(MAXDAYS, "days");
    return moment.utc(getThursdayOffset(moment().utc(), MAXDAYS, max));
  };

  let schema = yup.object().shape({
    amount: yup
      .number()
      .required("Amount is requred")
      .min($oceanUnlockDate ? 0 : 1)
      .max(parseInt(getOceanBalance($connectedChainId)))
      .label("Amount"),
    unlockDate: yup
      .date()
      .min(
        $oceanUnlockDate
          ? $oceanUnlockDate.format("YYYY-MM-DD")
          : getThursdayDate(moment().utc())
      )
      .max(getMaxDate().format("YYYY-MM-DD"))
      .required("Unlock date is requred")
      .label("Unlock Date"),
    ageement: yup
      .boolean()
      .required("Agreement is requirement.")
      .label("User Agreement"),
  });

  let fields = {
    amount: 0,
    unlockDate: $oceanUnlockDate
      ? $oceanUnlockDate.format("YYYY-MM-DD")
      : moment.utc(getThursdayDate(moment.utc())).format("YYYY-MM-DD"),
    ageement: false,
  };

  const { form, errors, handleSubmit } = createForm({
    initialValues: fields,
    validationSchema: schema,
    onSubmit: (values) => onFormSubmit(values),
  });

  async function init() {
    await updateUserBalanceOcean($userAddress, $web3Provider);
    oceanBalance = getOceanBalance($connectedChainId);
  }

  $: if ($userAddress) {
    loading = false;
    init();
  }

  const onFormSubmit = async (values) => {
    loading = true;
    const unlockTimestamp = moment.utc(values.unlockDate).unix();
    currentStep = 2;

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
      currentStep = 1;
      return;
    }
    Swal.fire("Success!", "OCEAN tokens successfully locked.", "success").then(
      async () => {
        loading = false;
        $form.ageement = false;
        await updateUserBalanceVeOcean($userAddress, $web3Provider);
        await updateUserBalanceOcean($userAddress, $web3Provider);
        let unlockDateMilliseconds = await getLockedEndTime(
          $userAddress,
          $networkSigner
        );
        let lockedOceans = await getLockedOceanAmount(
          $userAddress,
          $networkSigner
        );
        lockedOceanAmount.update(() => lockedOceans);
        await oceanUnlockDate.update(() =>
          unlockDateMilliseconds
            ? moment.utc(unlockDateMilliseconds)
            : undefined
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

  $: if (tokenApproved !== undefined) {
    if (tokenApproved === true) {
      currentStep = 1;
    } else {
      currentStep = 0;
    }
    if ($oceanUnlockDate) {
      steps[1].text = "Update";
      steps[2].text = "Get more veOCEAN";
    } else {
      steps[1].text = "Lock";
      steps[2].text = "Receive veOCEAN";
    }
  }

  const updateMultiplier = () => {
    if ($form.unlockDate && moment($form.unlockDate) > moment()) {
      // 4 years = 100% voting power
      var today = moment.utc();
      var unlockDate = moment.utc($form.unlockDate);
      const msDelta = unlockDate.diff(today);
      calculatedMultiplier = (
        (msDelta / getMaxDate().diff(today)) *
        100
      ).toFixed(3);
      calculatedVotingPower = (
        (msDelta / getMaxDate().diff(today)) *
        $form.amount
      ).toFixed(3);
    } else {
      calculatedVotingPower = 0;
    }
  };

  $: calculatedMultiplier, $form.unlockDate, updateMultiplier();

  const updateFormAmount = () => {
    let _amount = $form.amount;
    _amount = _amount == null ? 0 : parseInt(_amount);
    _amount = _amount < 0 ? 0 : parseInt(_amount);
    _amount = _amount > oceanBalance ? oceanBalance : parseInt(_amount);

    $form.amount = _amount;
  };
</script>

<div class={`container`}>
  <Card
    title={$oceanUnlockDate ? `Update veOCEAN Lock` : `Lock OCEAN, get veOCEAN`}
  >
    <form class="content" on:submit={handleSubmit}>
      <div class="item">
        <Input
          type="number"
          name="amount"
          min={$lockedOceanAmount ? 0 : 1}
          max={parseInt(oceanBalance)}
          error={$errors.amount}
          disabled={getOceanBalance($connectedChainId) <= 0 ||
            moment().utc().isAfter($oceanUnlockDate)}
          label="OCEAN Amount"
          direction="column"
          bind:value={$form.amount}
          maxValueLabel="Balance: "
          showMaxValue={true}
          showMaxButton={true}
          onChange={() => updateFormAmount()}
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
          disableKeyboardInput="return false"
          min={$oceanUnlockDate
            ? $oceanUnlockDate.format("YYYY-MM-DD")
            : getThursdayDate(moment().utc())}
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
            tooltipMessage={descriptions.default.tooltip_veocean_lock_multiplier}
          />
          <ItemWithLabel
            title={`Receive`}
            value={`${parseFloat(calculatedVotingPower)} veOCEAN`}
            tooltipMessage={descriptions.default.tooltip_veocean_receive}
          />
        </div>
      </div>
      <AgreementCheckbox
        text="By using this software I may allow all my tokens to be locked up for a period of up to 4 years. I have familiarized myself with veOCEAN, waive all rights, and assume all risks."
        bind:value={$form.ageement}
      />
      <div class="item buttonContainer">
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
            fullWidth={true}
            disabled={!$userAddress}
          />
        {:else}
          <!-- Todo #398 - disable update lock button, if unlock date == same date inside Date Input -->
          <TokenApproval
            tokenAddress={getAddressByChainIdKey($connectedChainId, "Ocean")}
            tokenName={"OCEAN"}
            spender={getAddressByChainIdKey(
              process.env.VE_SUPPORTED_CHAINID,
              "veOCEAN"
            )}
            amount={$form.amount}
            disabled={loading ||
              getOceanBalance($connectedChainId) <= 0 ||
              $form.amount > getOceanBalance($connectedChainId)}
            bind:agreed={$form.ageement}
            bind:approved={tokenApproved}
            bind:hasLock={$oceanUnlockDate}
          >
            {#if $oceanUnlockDate}
              <Button
                text={updateLockButtonText}
                fullWidth={true}
                disabled={loading ||
                  !$form.ageement ||
                  getOceanBalance($connectedChainId) <= 0 ||
                  $form.amount > getOceanBalance($connectedChainId) ||
                  moment($form.unlockDate).isBefore($oceanUnlockDate)}
                type="submit"
              />
            {:else}<Button
                text={loading ? "Locking..." : "Lock OCEAN"}
                fullWidth={true}
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
        <div class="stepsContainer">
          <StepsComponent {steps} current={currentStep} />
        </div>
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

  .buttonContainer {
    flex-direction: column;
  }

  .stepsContainer {
    margin-top: calc(var(--spacer) / 5);
  }

  @media (min-width: 640px) {
    .container {
      grid-column: 2 / 3;
    }
  }
</style>
