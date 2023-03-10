<script>
    import Card from "../common/Card.svelte"
    import ItemWithLabel from "../common/ItemWithLabel.svelte"
    import {veOceanWithDelegations} from "../../stores/veOcean.js"
    import {userAddress} from "../../stores/web3.js"
    import {delegated, delegationReceived, veDelegation} from "../../stores/delegation.js"
    import {getDelegatedVeOcean, getReceivedDelegation, getTokenId} from "../../utils/delegations.js"
    import * as descriptions from "../../utils/metadata/descriptions.json";
    import moment from "moment"

    let loading = false
</script>

<div class={`container`}>
    <Card title="My Delegations">
        <div class="delegationMetrics">
            <ItemWithLabel
                title={`Allocation power`}
                value={`${parseFloat($veOceanWithDelegations ? $veOceanWithDelegations : 0).toFixed(3)} veOCEAN`}
                tooltipMessage={descriptions.default.tooltip_veocean_my_voting_power}
                {loading}
            />
            <ItemWithLabel
                title={`Delegated`}
                value={`${parseFloat($delegated ? $delegated : 0).toFixed(3)} veOCEAN`}
                tooltipMessage={descriptions.default.tooltip_delegation_delegated}
                {loading}
            />
            <ItemWithLabel
                title={`Delegation expiry`}
                value={$veDelegation && $delegated > 0 ? moment($veDelegation?.expireTime * 1000).format("YYYY-MM-DD") : "-"}
                tooltipMessage={descriptions.default.tooltip_delegation_expiry_date}
                {loading}
            />
            <ItemWithLabel
                title={`Received`}
                value={`${parseFloat($delegationReceived ? $delegationReceived : 0).toFixed(3)} veOCEAN`}
                tooltipMessage={descriptions.default.tooltip_delegation_received}
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