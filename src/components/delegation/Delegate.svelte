<script>
    import Card from "../common/Card.svelte"
    import Input from "../common/Input.svelte"
    import Button from "../common/Button.svelte"
    import ItemWithLabel from "../common/ItemWithLabel.svelte"
    import * as yup from "yup"
    import moment from "moment"
    import { createForm } from "svelte-forms-lib";
    import {oceanUnlockDate} from "../../stores/veOcean.js"

    let received = 0;
    let loading = false;

    let schema = yup.object().shape({
        walletAddress: yup.string().required("Wallet address is requred").label("Wallet address")
    });

  let fields = {
    walletAddress: ""
  };

  const { form, errors, handleSubmit } = createForm({
    initialValues: fields,
    validationSchema: schema,
    onSubmit: (values) => onFormSubmit(values),
  });

</script>

<div class={`container`}>
    <Card title="Delegate">
        <div class="delegationForm">
            {#if received>0}
                <ItemWithLabel
                    title={`Received`}
                    value={`${parseFloat(received).toFixed(3)} veOCEAN`}
                    tooltipMessage={"descriptions.default.tooltip_veocean_my_voting_power"}
                    {loading}
                />
            {:else}
            <form class="form" on:submit={handleSubmit}>
                <div class="inputContainer">
                <Input
                    type="text"
                    label="Receiver wallet address"
                    name="receiverWalletAddress"
                    placeholder="0x000..."
                    error={$errors.walletAddress}
                    direction="column"
                    bind:value={$form.walletAddress}
                />
                </div>
                <Button
                    text={"Delegate"}
                    fullWidth={true}
                    disabled={!$oceanUnlockDate || moment($oceanUnlockDate).isBefore(moment())}
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
    .form{
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 100%;
    }
    .inputContainer{
        min-width: 200px;
        margin-right: calc(var(--spacer)/2); 
    }
</style>