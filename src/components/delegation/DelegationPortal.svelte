<script>
    import DelegationMetrics from "./DelegationMetrics.svelte"
    import Delegate from "./Delegate.svelte"
    import {GET_DELEGATIONS} from "../../utils/delegations"
    import {userAddress} from "../../stores/web3.js"
    import {veDelegation, delegated, delegationReceived} from "../../stores/delegation.js"
    import {getDelegatedVeOcean, getReceivedDelegation} from "../../utils/delegations.js"
    import { query } from "svelte-apollo";

    let delegation

    const init = async () =>{
        let newDelegated = await getDelegatedVeOcean($userAddress)
        delegated.update(() => newDelegated)
        let received = await getReceivedDelegation($userAddress)
        delegationReceived.update(() => received)
    }

    $:if($userAddress){
        init()
        delegation = query(GET_DELEGATIONS, {
            variables: { userAddress: $userAddress.toLowerCase() },
        });
    }

    $: if ($delegation?.data) {
        console.log($delegation?.data)
        veDelegation.update(() => $delegation?.data.veDelegations[$delegation?.data.veDelegations.length - 1])
    }


</script>

<div class={`container`}>
  <DelegationMetrics />
  <Delegate onDelegationChange={() => delegation.refetch()}/>
</div>
<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    padding-top: calc(var(--spacer) * 2);
}
    
</style>
  