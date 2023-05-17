<script>
  import DelegationMetrics from "./DelegationMetrics.svelte";
  import Delegate from "./Delegate.svelte";
  import { GET_USER_LAST_DELEGATION } from "../../utils/delegations";
  import { userAddress } from "../../stores/web3.js";
  import {
    veDelegation,
    delegated,
    delegationReceived,
  } from "../../stores/delegation.js";
  import {
    getDelegatedVeOcean,
    getReceivedDelegation,
  } from "../../utils/delegations.js";
  import { query } from "svelte-apollo";

  let delegation;

  const init = async () => {
    let newDelegated = await getDelegatedVeOcean($userAddress);
    delegated.update(() => newDelegated);
    let received = await getReceivedDelegation($userAddress);
    delegationReceived.update(() => received);
  };

  $: if ($userAddress) {
    init();
    delegation = query(GET_USER_LAST_DELEGATION, {
      variables: { userAddress: $userAddress.toLowerCase() },
    });
  }

  $: if ($delegation?.data) {
    console.log($delegation?.data);
    let activeDelegation = $delegation?.data.veDelegations.find(
      (d) => parseInt(d.updates[0].amount) > 0
    );

    console.log(activeDelegation, activeDelegation?.updates?.length);
    veDelegation.update(() => {
      return {
        ...activeDelegation,
        createId: activeDelegation?.updates?.length,
      };
    });
  }
</script>

<div class={`container`}>
  <h2 class="title">
    Allow other wallet to manage your veOCEAN allocation by delegating.
  </h2>
  <p class="message">
    Maximize your active APY and skip transaction fees by delegating to a wallet
    that efficiently manages your allocation power.
  </p>
  <DelegationMetrics />
  <Delegate
    onDelegationChange={async () => {
      await setTimeout(5000);
      delegation.refetch();
    }}
  />
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    padding-top: calc(var(--spacer) * 2);
  }
  .cardsContainer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacer);
    padding-top: var(--spacer);
  }
  .title {
    width: 100%;
    margin-bottom: calc(var(--spacer) / 2);
  }
  .message {
    width: 100%;
  }
</style>
