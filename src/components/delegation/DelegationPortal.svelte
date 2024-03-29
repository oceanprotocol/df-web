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
    let activeDelegation = $delegation?.data.veDelegations.find(
      (d) => parseInt(d.updates[0].amount) > 0
    );
    let createId = 1;
    $delegation?.data.veDelegations.forEach((delegation) => {
      createId += delegation.updates.length;
    });
    veDelegation.update(() => {
      return {
        ...activeDelegation,
        createId: createId,
      };
    });
  }
</script>

<div class={`container`} id="delegation">
  <h2 class="title">
    Delegate your allocation.
  </h2>
  <p class="message">
    Maximize your Active APY and skip transaction fees by delegating to a wallet
    that efficiently manages your allocation power. <br/><a href=https://docs.oceanprotocol.com/veocean-data-farming/delegation target=_blank rel="noreferrer" >Read more about delegation.</a>
  </p>
  <DelegationMetrics />
  <Delegate
    onDelegationChange={async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await delegation.refetch();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("subgraph refetch");
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
