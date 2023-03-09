<script>
    import Card from "../common/Card.svelte"
    import Input from "../common/Input.svelte"
    import Button from "../common/Button.svelte"
    import ItemWithLabel from "../common/ItemWithLabel.svelte"
    import * as yup from "yup"
    import moment from "moment"
    import { createForm } from "svelte-forms-lib";
    import {oceanUnlockDate, veOceanWithDelegations} from "../../stores/veOcean.js"
    import {userAddress, networkSigner} from "../../stores/web3.js"
    import {delegated, delegationReceived, veDelegation} from "../../stores/delegation.js"
    import {delegate, cancelDelegation} from "../../utils/delegations.js"

    let loading = false;
    let onDelegationChange;

    let schema = yup.object().shape({
        walletAddress: yup.string().required("Wallet address is requred").label("Wallet address")
    });

    let fields = {
        walletAddress: $veDelegation ? $veDelegation.receiver.id : ""
    };

    const delegateVeOcean = async (values) => {
        loading = true
        console.log('delegating')
        await delegate($userAddress, values.walletAddress, $oceanUnlockDate, $networkSigner, undefined)
        $delegated.update(() => $veOceanWithDelegations)
        loading = false
    }

    const removeVeOceanDelegation = async () => {
        loading = true
        await cancelDelegation($veDelegation.tokenId, $networkSigner)
        $delegated.update(() => 0)
        loading = false
    }

    const { form, errors, handleSubmit } = createForm({
        initialValues: fields,
        validationSchema: schema,
        onSubmit: (values) => {$veDelegation && delegated>0 ? removeVeOceanDelegation($veDelegation.tokenId) : delegateVeOcean(values)},
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
                {#if $veDelegation && $delegated>0}
                    <Input
                        type="text"
                        label="Receiver wallet address"
                        name="receiverWalletAddress"
                        placeholder="0x000..."
                        error={$errors.walletAddress}
                        disabled
                        direction="column"
                        value={`${$veDelegation.receiver.id?.substr(0, 6)}...${$veDelegation.receiver.id?.substr(
                            $veDelegation.receiver.id?.length - 6
                        )}`}
                    />
                {:else}
                    <Input
                        type="text"
                        label="Receiver wallet address"
                        name="receiverWalletAddress"
                        placeholder="0x000..."
                        error={$errors.walletAddress}
                        disabled={!$oceanUnlockDate || moment($oceanUnlockDate).isBefore(moment())}
                        direction="column"
                        bind:value={$form.walletAddress}
                    />
                {/if}
                </div>
                {#if $delegated > 0}
                    <Button
                        text={"Remove delegation"}
                        fullWidth={true}
                        {loading}
                        onclick={() => removeVeOceanDelegation()}
                        type="button"
                    />
                {:else}
                    <Button
                        text={"Delegate"}
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