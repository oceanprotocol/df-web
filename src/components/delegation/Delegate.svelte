<script>
  import Card from "../common/Card.svelte";
  import Input from "../common/Input.svelte";
  import Button from "../common/Button.svelte";
  import * as yup from "yup";
  import moment from "moment";
  import { createForm } from "svelte-forms-lib";
  import {
    oceanUnlockDate,
    veOceanWithDelegations,
  } from "../../stores/veOcean.js";
  import { userAddress, networkSigner } from "../../stores/web3.js";
  import { delegated, veDelegation } from "../../stores/delegation.js";
  import {
    delegate,
    cancelDelegation,
    getDelegatedVeOcean,
    getUserVotingPowerWithDelegations,
  } from "../../utils/delegations.js";
  import Swal from "sweetalert2";

  let loading = false;
  export let onDelegationChange;

  let schema = yup.object().shape({
    walletAddress: yup
      .string()
      .required("Wallet address is requred")
      .label("Wallet address"),
  });

  let fields = {
    walletAddress:
      $veDelegation && $delegated > 0
        ? `${$veDelegation.receiver.id?.substr(
            0,
            6
          )}...${$veDelegation.receiver.id?.substr(
            $veDelegation.receiver.id?.length - 6
          )}`
        : "",
  };

  const delegateVeOcean = async (values) => {
    loading = true;
    if (moment($oceanUnlockDate).diff(moment(), "days") < 7) {
      errors.set({
        walletAddress: "Current lock period must be grater than 1 week",
      });
      loading = false;
      return;
    }
    try {
      await delegate(
        $userAddress,
        values.walletAddress,
        $oceanUnlockDate,
        $networkSigner,
        $veDelegation.createId
      );
    } catch (error) {
      Swal.fire("Error!", "Delegation failed.", "error");
      loading = false;
      return;
    }
    let newDelegated = await getDelegatedVeOcean($userAddress);
    delegated.update(() => newDelegated);
    let newVeOceansWithDelegations = await getUserVotingPowerWithDelegations(
      $userAddress
    );
    veOceanWithDelegations.update(() => newVeOceansWithDelegations);
    onDelegationChange();
    Swal.fire(
      "Success!",
      `You've delegated you veOCEAN allocation!`,
      "success"
    );
    loading = false;
  };

  const cancelVeOceanDelegation = async () => {
    loading = true;
    try {
      await cancelDelegation($veDelegation.tokenId, $networkSigner);
    } catch (error) {
      Swal.fire("Error!", "Cancel delegation failed.", "error");
      loading = false;
      return;
    }
    let newDelegated = await getDelegatedVeOcean($userAddress);
    delegated.update(() => newDelegated);
    let newVeOceansWithDelegations = await getUserVotingPowerWithDelegations(
      $userAddress
    );
    veOceanWithDelegations.update(() => newVeOceansWithDelegations);
    onDelegationChange();
    Swal.fire(
      "Success!",
      `You've canceled your veOCEAN allocation!`,
      "success"
    );
    loading = false;
  };

  const { form, errors, handleSubmit } = createForm({
    initialValues: fields,
    validationSchema: schema,
    onSubmit: (values) => {
      $veDelegation && delegated > 0
        ? removeVeOceanDelegation($veDelegation.tokenId)
        : delegateVeOcean(values);
    },
  });
</script>

<div class={`container`}>
  <Card title="Delegate">
    <p class="message">
      You will delegate your entire veOCEAN allocation until your current lock
      will end, and you can cancel at any time.
    </p>
    <p class="message">
      The wallet address you delegate to it's going to receive 100% of your
      rewards
    </p>
    <div class="delegateContainer">
      {#if $delegated > 0}
        <fragment>
          <span class="delegatedText">
            Delegated to
            <b>
              {`${
                $veDelegation
                  ? `${$veDelegation.receiver.id?.substr(
                      0,
                      6
                    )}...${$veDelegation.receiver.id?.substr(
                      $veDelegation.receiver.id?.length - 6
                    )}`
                  : ""
              }`}
            </b>
          </span>
          <Button
            text={"Cancel delegation"}
            fullWidth={true}
            {loading}
            onclick={() => cancelVeOceanDelegation()}
            className="cancelDelegationButton"
            type="button"
          />
        </fragment>
      {:else}
        <form class="form" on:submit={handleSubmit}>
          <div class="inputContainer">
            <Input
              type="text"
              label="Receiver wallet address"
              name="receiverWalletAddress"
              placeholder="0x000..."
              error={$errors.walletAddress}
              disabled={!$oceanUnlockDate ||
                moment($oceanUnlockDate).isBefore(moment()) ||
                $delegated > 0}
              direction="column"
              bind:value={$form.walletAddress}
            />
          </div>
          <Button
            text={"Delegate"}
            fullWidth={true}
            {loading}
            disabled={!$oceanUnlockDate ||
              moment($oceanUnlockDate).isBefore(moment())}
            type="submit"
          />
        </form>
      {/if}
    </div>
  </Card>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-top: calc(var(--spacer) * 2);
  }
  .form {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
  }
  .delegateContainer {
    padding: calc(var(--spacer) / 2) 0;
  }
  .inputContainer {
    min-width: 200px;
    margin-right: calc(var(--spacer) / 2);
  }
  :global(.cancelDelegationButton) {
    margin-top: calc(var(--spacer) / 4) !important;
  }
  .delegatedText {
    font-weight: bold;
  }
</style>
