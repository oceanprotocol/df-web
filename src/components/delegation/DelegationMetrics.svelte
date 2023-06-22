<script>
    import Card from "../common/Card.svelte"
    import ItemWithLabel from "../common/ItemWithLabel.svelte"
    import {veOceanWithDelegations} from "../../stores/veOcean.js"
    import {userAddress} from "../../stores/web3.js"
    import {delegated, delegationReceived, veDelegation} from "../../stores/delegation.js"
    import {getDelegatedVeOcean, getReceivedDelegation, getTokenId} from "../../utils/delegations.js"
    import * as descriptions from "../../utils/metadata/descriptions.json";
    import { getAddressByChainIdKey } from "../../utils/address/address";
    import { userBalances } from "../../stores/tokens";
    import moment from "moment"

    let loading = false
    const supportedChainId = import.meta.env.VITE_VE_SUPPORTED_CHAINID
</script>

<div class={`container`}>
    <Card title="My Delegations" className="myDelegationsCard">
        <div class="delegationMetricsContainer"> 
            <div class="delegationMetrics">
                <ItemWithLabel
                    title={`Allocation power`}
                    value={`${parseFloat($veOceanWithDelegations ? $veOceanWithDelegations : 0).toFixed(3)} veOCEAN`}
                    tooltipMessage={descriptions.default.tooltip_veocean_my_voting_power}
                    {loading}
                />
                <ItemWithLabel
                    title={`Delegated`}
                    value={`${parseFloat($delegated ? $delegated : 0).toFixed(3)}/${
                        parseFloat($userBalances?
                              $userBalances[
                                getAddressByChainIdKey(
                                  supportedChainId,
                                  "veOCEAN"
                                )
                              ]
                          : '0').toFixed(3)
                      } veOCEAN`}
                    tooltipMessage={descriptions.default.tooltip_delegation_delegated}
                    {loading}
                />
            </div>
            <div class="delegationMetrics">
                <ItemWithLabel
                    title={`Delegation expiry`}
                    value={$veDelegation && $delegated > 0 ? moment($veDelegation?.expireTime * 1000).format("DD-MM-YYYY") : "-"}
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
        <div>
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
        padding: calc(var(--spacer) / 2) 0;
    }
    .delegationMetricsContainer{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }
    @media (min-width: 640px) {
        .delegationMetrics {
            width: 50%;
            justify-content: space-around;
        }
    } 
</style>