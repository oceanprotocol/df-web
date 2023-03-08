<script>
    import DelegationMetrics from "./DelegationMetrics.svelte"
    import Delegate from "./Delegate.svelte"
    import {GET_DELEGATIONS} from "../../utils/delegations"
    import {userAddress} from "../../stores/web3.js"
    import {veDelegation} from "../../stores/delegation.js"
    import { query } from "svelte-apollo";

    let delegation

    $: if ($userAddress) {
        delegation = query(GET_DELEGATIONS, {
        variables: { userAddress: $userAddress.toLowerCase() },
        });
    }

    $: if ($delegation?.data) {
        console.log($delegation?.data)
        veDelegation.update(() => $delegation?.data.veDelegations[0])
    }

</script>

<div class={`container`}>
  <DelegationMetrics />
  <Delegate/>
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
  