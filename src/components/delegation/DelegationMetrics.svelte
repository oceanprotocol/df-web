<script>
    import Card from "../common/Card.svelte"
    import ItemWithLabel from "../common/ItemWithLabel.svelte"
    import {veOceanWithDelegations} from "../../stores/veOcean.js"
    import {userAddress} from "../../stores/web3.js"
    import {delegated, delegationReceived, veDelegation} from "../../stores/delegation.js"
    import {getDelegatedVeOcean, getReceivedDelegation, getTokenId} from "../../utils/delegations.js"
    import moment from "moment"

    let loading = false

    const init = async () =>{
        let newDelegated = await getDelegatedVeOcean($userAddress)
        delegated.update(() => newDelegated)
        let received = await getReceivedDelegation($userAddress)
        delegationReceived.update(() => received)
        await getTokenId($userAddress)
    }

    $:if($userAddress){
        init()
    }

    $:if($veDelegation){
        console.log($veDelegation)
        console.log(moment($veDelegation.expireTime * 1000))
    }
</script>

<div class={`container`}>
    <Card title="My Delegations">
        <div class="delegationMetrics">
            <ItemWithLabel
                title={`Allocation power`}
                value={`${parseFloat($veOceanWithDelegations ? $veOceanWithDelegations : 0).toFixed(3)} veOCEAN`}
                tooltipMessage={"descriptions.default.tooltip_veocean_my_voting_power"}
                {loading}
            />
            <ItemWithLabel
                title={`Delegated`}
                value={`${parseFloat($delegated ? $delegated : 0).toFixed(3)} veOCEAN`}
                tooltipMessage={"descriptions.default.tooltip_veocean_my_voting_power"}
                {loading}
            />
            <ItemWithLabel
                title={`Delegation expiry`}
                value={$veDelegation ? moment($veDelegation?.expireTime * 1000).format("YYYY-MM-DD") : "-"}
                tooltipMessage={"descriptions.default.tooltip_veocean_my_voting_power"}
                {loading}
            />
            <ItemWithLabel
                title={`Received`}
                value={`${parseFloat($delegationReceived ? $delegationReceived : 0).toFixed(3)} veOCEAN`}
                tooltipMessage={"descriptions.default.tooltip_veocean_my_voting_power"}
                {loading}
            />
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

    .delegationMetrics {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
</style>