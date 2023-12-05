<script>
  import {
    userAddress,
    connectedChainId,
    switchWalletNetwork,
    getNetworkDataById,
  } from "../../stores/web3";
  import Button from "../common/Button.svelte";
  import Card from "../common/Card.svelte";
  import Swal from "sweetalert2";
  import Input from "../common/Input.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import TokenApproval from "../common/TokenApproval.svelte";
  import AgreementCheckbox from "../common/AgreementCheckbox.svelte";
  import { allowance, getTokenPriceFromCoingecko } from "../../utils/tokens";
  import {
    ethPrice,
    getOceanBalance,
    oceanPrice,
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
    totalVeOceanSupply,
    veOceanWithDelegations,
  } from "../../stores/veOcean";
  import * as networksDataArray from "../../networks-metadata.json";
  import { getThursdayDate, getThursdayOffset } from "../../utils/functions";
  import { getUserVotingPowerWithDelegations } from "../../utils/delegations";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import moment from "moment";
  import * as descriptions from "../../utils/metadata/descriptions.json";
  import StepsComponent from "../common/StepsComponent.svelte";
  import {
    calculateFees,
    calculateNumberOFClaims,
    getMaxDate,
    getPassiveUserRewardsData,
  } from "../../utils/rewards";
  import DisplayApYandRewards from "./DisplayAPYandRewards.svelte";
  import AdvanceCalculatorModal from "./AdvanceCalculatorModal.svelte";
  import GroupedItemsDisplay from "./GroupedItemsDisplay.svelte";
  import Switch from "../common/Switch.svelte";
  import CompoundToggle from "./CompoundToggle.svelte";
  import { calculateOptimalCompoundInterestWithFees } from "../../utils/compound";

  export let setShowApprovalNotification;

  const formatApyForDisplay = (apy, rewards) => {
    return { apy: apy, profit: rewards };
  };

  let networksData = networksDataArray.default;
  let oceanBalance = 0;
  let calculatedVotingPower = 0;
  let loading = false;
  let updateLockButtonText = "UPDATE LOCK";
  let tokenApproved = false;
  let displayedAPY = formatApyForDisplay(0, 0);
  let showModal = false;
  let simpleFlowCostOcean = 0;
  let compounds = 0;
  let switchValue = true;
  let fees;

  const supportedChainId = import.meta.env.VITE_VE_SUPPORTED_CHAINID;

  let steps = [
    { text: "Approve OCEAN" },
    { text: "Lock" },
    { text: "Receive veOCEAN" },
  ];
  let currentStep = 0;

  let schema, fields, form, errors;
  var handleSubmit;
  const initForm = () => {
    schema = yup.object().shape({
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
            : getThursdayDate(moment().utc().add(7, "days"))
        )
        .max(getMaxDate().format("YYYY-MM-DD"))
        .required("Unlock date is requred")
        .label("Unlock Date"),
      ageement: yup
        .boolean()
        .required("Agreement is requirement.")
        .label("User Agreement"),
    });
    fields = {
      amount: 0,
      unlockDate: $oceanUnlockDate
        ? $oceanUnlockDate.format("YYYY-MM-DD")
        : moment
            .utc(getThursdayDate(moment.utc().add(7, "days")))
            .format("YYYY-MM-DD"),
      ageement: false,
    };
    const resp = createForm({
      initialValues: fields,
      validationSchema: schema,
      onSubmit: (values) => onFormSubmit(values),
    });
    form = resp.form;
    errors = resp.errors;
    handleSubmit = resp.handleSubmit;
  };
  initForm();

  async function init() {
    await updateUserBalanceOcean($userAddress);
    oceanBalance =
      $connectedChainId != import.meta.env.VITE_VE_SUPPORTED_CHAINID
        ? 0
        : getOceanBalance($connectedChainId);
    initForm();
  }

  oceanUnlockDate.subscribe((unlockDate) => {
    form.update((value) => {
      value.unlockDate = unlockDate ? unlockDate.format("YYYY-MM-DD") : null;
      return value;
    });
  });

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
          await updateLockedOceanAmount(values.amount);
        }
        if (moment.utc(values.unlockDate).isAfter($oceanUnlockDate)) {
          await updateLockPeriod(unlockTimestamp);
        }
      } else {
        await lockOcean(values.amount, unlockTimestamp);
      }
      let allowedAmountLeft = await allowance(
        getAddressByChainIdKey($connectedChainId, "Ocean"),
        $userAddress,
        getAddressByChainIdKey(supportedChainId, "veOCEAN")
      );
      if (allowedAmountLeft > 0)
        setShowApprovalNotification(true, allowedAmountLeft);
    } catch (error) {
      console.log(error);
      Swal.fire("Error!", error.message, "error").then(() => {});
      loading = false;
      currentStep = 1;
      return;
    }

    Swal.fire("Success!", "OCEAN tokens successfully locked.", "success").then(
      async () => {
        loading = false;
        $form.ageement = false;
        await updateUserBalanceVeOcean($userAddress);
        await updateUserBalanceOcean($userAddress);
        let unlockDateMilliseconds = await getLockedEndTime($userAddress);
        let lockedOceans = await getLockedOceanAmount($userAddress);
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

  const updateLockButtonTextFunction = () => {
    updateLockButtonText = getUpdateLockButtonText();
  };

  $: loading && updateLockButtonTextFunction();

  $: if ($form) {
    updateLockButtonTextFunction();
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

  const updateVotingPower = async () => {
    $ethPrice && calculateFees(moment($form.unlockDate), $ethPrice);
    if ($form.unlockDate && moment($form.unlockDate) > moment()) {
      // 4 years = 100% voting power
      var today = moment.utc();
      var unlockDate = moment.utc($form.unlockDate);
      const msDelta = unlockDate.diff(today);
      calculatedVotingPower = (
        (msDelta / getMaxDate().diff(today)) *
        ($form.amount + parseFloat($lockedOceanAmount))
      ).toFixed(3);
    } else {
      calculatedVotingPower = 0;
    }
  };

  const calculateAPY = async () => {
    if (
      calculatedVotingPower <= 0 ||
      (!$lockedOceanAmount && $form.amount <= 0) ||
      !fees
    ) {
      displayedAPY = formatApyForDisplay(0, 0);
      return;
    }
    const votingPowerForAPY = parseFloat(calculatedVotingPower);
    const compoundCost =
      (fees.updateFormAmount + fees.updateUnlockDate + fees.claim) /
      $oceanPrice;
    const data = await getPassiveUserRewardsData(
      votingPowerForAPY,
      $form.amount > 0
        ? $form.amount + parseFloat($lockedOceanAmount)
        : parseFloat($lockedOceanAmount),
      $totalVeOceanSupply + votingPowerForAPY,
      moment($form.unlockDate),
      compounds,
      compoundCost,
      simpleFlowCostOcean
    );
    displayedAPY = formatApyForDisplay(
      data.apy,
      data.rewards,
      data.rewardsWithoutFees
    );
  };

  const fetchTokenPrices = async () => {
    const ethTokenPrice = await getTokenPriceFromCoingecko("ethereum", "usd");
    ethPrice.update((p) => ethTokenPrice);
    const oceanTokenPrice = await getTokenPriceFromCoingecko(
      "ocean-protocol",
      "usd"
    );
    oceanPrice.update((p) => oceanTokenPrice);
  };

  const getFeesCosts = async () => {
    const resp = await calculateFees(
      $form.unlockDate ? moment($form.unlockDate) : moment(),
      $ethPrice,
      compounds
    );
    fees = resp.fees;
    simpleFlowCostOcean = resp.simpleFlowFeesCost / $oceanPrice;
  };

  const calculateSimpleFlowCost = () => {
    simpleFlowCostOcean =
      (fees.lock +
        calculateNumberOFClaims(moment($form.unlockDate)) * fees.claim +
        fees.withdraw) /
      $oceanPrice;
  };

  const calculateOptimalCompounds = async () => {
    console.log('fees', fees)

    const optimumComp = await calculateOptimalCompoundInterestWithFees({
      lockedOceanAmount: $lockedOceanAmount,
      formAmount: $form.amount,
      formUnlockDate: $form.unlockDate,
      fees,
      totalVeOceanSupply: $totalVeOceanSupply,
    });
    console.log('optimumComp',optimumComp)
    //compounds = optimalCompounds; // Set to the optimal number of compounds
    //await calculateCompoundInterestWithFees(); // Recalculate with the optimal number
  };

  $: $form && updateVotingPower();
  $: $totalVeOceanSupply && calculatedVotingPower && fees && calculateAPY();
  $: fetchTokenPrices();
  $: $ethPrice && $oceanPrice && getFeesCosts();
  $: $form.unlockDate && calculateSimpleFlowCost();
  $: $form &&
    (async () => {
      if ($form.amount && $form.unlockDate) {
        await calculateOptimalCompounds();
      }
    })();

  const updateFormAmount = () => {
    let _amount = $form.amount;
    _amount = _amount == null ? 0 : parseInt(_amount);
    _amount = _amount < 0 ? 0 : parseInt(_amount);
    _amount = parseInt(_amount);
    $form.amount = _amount;
  };
</script>

<div class={`container`}>
  {#if showModal}
    <AdvanceCalculatorModal
      bind:showModal
      bind:simpleFlowCostOcean
      bind:compounds
      unlockDate={moment($form.unlockDate)}
      apyValue={displayedAPY.apy}
      rewards={displayedAPY.profit}
      {fees}
    />
  {/if}
  <Card
    title={$oceanUnlockDate ? `Update veOCEAN Lock` : `Lock OCEAN, get veOCEAN`}
  >
    <form
      class="content"
      on:submit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
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
            : getThursdayDate(moment().utc().add(7, "days"))}
          disabled={getOceanBalance($connectedChainId) < 0 ||
            ($oceanUnlockDate && $oceanUnlockDate.isBefore(moment()))}
          max={getMaxDate().format("YYYY-MM-DD")}
          bind:value={$form.unlockDate}
        />
      </div>
      <div class="item">
        <GroupedItemsDisplay>
          <DisplayApYandRewards
            apyValue={displayedAPY.apy}
            profitValue={displayedAPY.profit}
            tooltipMessage={descriptions.default
              .tooltip_veocean_lock_passiveAPY}
            onClick={() => {
              $form.unlockDate = getMaxDate().format("YYYY-MM-DD");
              $form.amount = parseInt(oceanBalance);
            }}
            openCalculator={() => (showModal = true)}
          />
        </GroupedItemsDisplay>
      </div>
      <div class="item">
        <div class="output-container">
          <GroupedItemsDisplay>
            <ItemWithLabel
              title={`Receive`}
              value={`${parseFloat(calculatedVotingPower)} veOCEAN`}
              tooltipMessage={descriptions.default.tooltip_veocean_receive}
              small={true}
            />
          </GroupedItemsDisplay>
        </div>
        <CompoundToggle switchValue {compounds} />
      </div>
      <AgreementCheckbox
        text="By using this software I may allow all my tokens to be locked up for a period of up to 4 years. I have familiarized myself with veOCEAN, <a href='/terms'><strong>terms of use</strong></a>, waive all rights, and assume all risks."
        bind:value={$form.ageement}
      />
      <div class="item buttonContainer">
        {#if $connectedChainId?.toString() !== supportedChainId}
          <Button
            text={!$userAddress
              ? "Connect Wallet"
              : `Switch Network to ${
                  getNetworkDataById(networksData, parseInt(supportedChainId))
                    ?.name
                }`}
            onclick={() => switchWalletNetwork(supportedChainId)}
            fullWidth={true}
            disabled={!$userAddress}
          />
        {:else}
          <TokenApproval
            tokenAddress={getAddressByChainIdKey($connectedChainId, "Ocean")}
            tokenName={"OCEAN"}
            approvalModalMessage="Approve only if you are going to lock right away.<br> Make sure you only approve the amount that you are going to lock."
            spender={getAddressByChainIdKey(supportedChainId, "veOCEAN")}
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
                  $form.amount > getOceanBalance($connectedChainId) ||
                  $oceanUnlockDate.isBefore(moment()) ||
                  (moment.utc($form.unlockDate).isSame($oceanUnlockDate) &&
                    $form.amount == 0)}
                type="submit"
              />
            {:else}<Button
                text={loading ? "Locking..." : "Lock OCEAN"}
                fullWidth={true}
                disabled={loading ||
                  !$form.ageement ||
                  getOceanBalance($connectedChainId) <= 0 ||
                  $form.amount > getOceanBalance($connectedChainId)}
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
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .item {
    width: 100%;
    margin-bottom: calc(var(--spacer) / 3);
    display: flex;
    justify-content: center;
    gap: calc(var(--spacer) / 4);
  }

  .item:last-child {
    margin-bottom: 0;
  }

  .buttonContainer {
    flex-direction: column;
  }

  .stepsContainer {
    width: 360px !important;
    margin-top: calc(var(--spacer) / 5);
  }

  @media (min-width: 640px) {
    .container {
      grid-column: 2 / 3;
    }
  }
</style>
