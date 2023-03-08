<script>
    import Card from "../common/Card.svelte"
    import Input from "../common/Input.svelte"
    import Button from "../common/Button.svelte"
    import ItemWithLabel from "../common/ItemWithLabel.svelte"
    import * as yup from "yup"
    import moment from "moment"
    import { createForm } from "svelte-forms-lib";
    import {oceanUnlockDate} from "../../stores/veOcean.js"
    import {userAddress, networkSigner} from "../../stores/web3.js"
    import {delegated, delegationReceived} from "../../stores/delegation.js"
    import {delegate} from "../../utils/delegations.js"

    let loading = false;

    let schema = yup.object().shape({
        walletAddress: yup.string().required("Wallet address is requred").label("Wallet address")
    });

    let fields = {
        walletAddress: ""
    };

    const delegateVeOcean = async (values) => {
        loading = true
        await delegate($userAddress, values.walletAddress, $oceanUnlockDate, $networkSigner)
        loading = false
    }

    const { form, errors, handleSubmit } = createForm({
        initialValues: fields,
        validationSchema: schema,
        onSubmit: (values) => delegateVeOcean(values),
    });

</script>

<div class={`container`}>
    <Card title="Delegate">
        <div class="delegationForm">
            {#if delegationReceived>0}
                <ItemWithLabel
                    title={`Received`}
                    value={`${parseFloat(delegationReceived).toFixed(3)} veOCEAN`}
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
                {#if delegated > 0}
                    <Button
                        text={"Delegate"}
                        fullWidth={true}
                        {loading}
                        disabled={!$oceanUnlockDate || moment($oceanUnlockDate).isBefore(moment())}
                        type="submit"
                    />
                {:else}
                    <Button
                        text={"Remove delegation"}
                        fullWidth={true}
                        {loading}
                        disabled={!$oceanUnlockDate || moment($oceanUnlockDate).isBefore(moment())}
                        type="submit"
                    />
                {/if}
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