<script>
    import { onMount } from 'svelte';
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
    import { Tabs, Tab, TabContent } from "carbon-components-svelte"
    import * as delegationReceivers from "../../utils/metadata/delegation/receivers.json";


    export let onDelegationChange;

    let loading = false;
    let selected = 0;

    let schema = yup.object().shape({
        walletAddress: yup.string().required("Wallet address is requred").label("Wallet address")
    });

    let fields = {
        walletAddress: $veDelegation && $delegated>0 ? `${$veDelegation.receiver.id?.substr(0, 6)}...${$veDelegation.receiver.id?.substr(
                            $veDelegation.receiver.id?.length - 6
                        )}` : ""
    };

    const delegateVeOcean = async (walletAddress) => {
        loading = true
        if(moment($oceanUnlockDate).diff(moment(), 'days') < 7){
            errors.set({walletAddress : 'Current lock period must be grater than 1 week'})
            loading = false
            return
        }
        try{
            await delegate($userAddress, walletAddress, $oceanUnlockDate, $networkSigner, undefined)
        }catch(error){
            loading = false
        }    
        onDelegationChange()
        delegated.update(() => $veOceanWithDelegations)
        loading = false
    }

    const removeVeOceanDelegation = async () => {
        loading = true
        try{
            await cancelDelegation($veDelegation.tokenId, $networkSigner)
        }catch(error){
            loading = false
        }
        onDelegationChange()
        delegated.update(() => 0)
        loading = false
    }

    const { form, errors, handleSubmit } = createForm({
        initialValues: fields,
        validationSchema: schema,
        onSubmit: (values) => {$veDelegation && delegated>0 ? removeVeOceanDelegation($veDelegation.tokenId) : delegateVeOcean(values.walletAddress)},
    });

</script>

<div class={`delegationContainer`}>
    <Card title="Delegate">
        <p class="message">You will delegate your entire voting power until your current lock will end.</p>
        <p class="message">You can cancel your delegation at any time.</p>
        <Tabs bind:selected class="tabs">
            <Tab label="to custom address" autoWidth/>
            {#each delegationReceivers.default as receiver}
                <Tab label={`to ${receiver.name}`} autoWidth/>
            {/each}
            <svelte:fragment slot="content">
                <TabContent>
                    <div class="delegationFormContainer">
                        <form class="delegationForm" on:submit={handleSubmit}>
                            <div class="delegateInputContainer">
                                <Input
                                    type="text"
                                    label="Receiver wallet address"
                                    name="receiverWalletAddress"
                                    placeholder="0x000..."
                                    error={$errors.walletAddress}
                                    disabled={!$oceanUnlockDate || moment($oceanUnlockDate).isBefore(moment()) || $delegated > 0}
                                    direction="column"
                                    bind:value={$form.walletAddress}
                                />
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
                    </div>
                </TabContent>
                {#each delegationReceivers.default as receiver}
                    <TabContent>
                        <div class="delegateButtonContainer">
                            <Button
                                text={`Delegate to ${receiver.name}`}
                                fullWidth={true}
                                {loading}
                                disabled={!$oceanUnlockDate || moment($oceanUnlockDate).isBefore(moment())}
                                onclick={() => delegateVeOcean(receiver.wallet_address)}
                                className="delegateButton"
                                type="button"
                            />
                        </div>
                    </TabContent>
                {/each}
            </svelte:fragment>
          </Tabs>
      </Card>
</div>
<style lang="scss" global>
  @import "carbon-components/scss/components/tabs/_tabs.scss";
  .delegationContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-top: calc(var(--spacer) * 2);
    }
    .tabs{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .delegationForm{
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 100%;
        padding: calc(var(--spacer) / 2) 0;
    }
    .delegateInputContainer{
        min-width: 200px;
        margin-right: calc(var(--spacer)/2); 
    }
    .delegateButtonContainer{
        padding: calc(var(--spacer) / 2) 0 !important;
    }
</style>