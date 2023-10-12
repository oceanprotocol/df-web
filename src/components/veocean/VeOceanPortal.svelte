<script>
  import { userAddress, connectedChainId } from "../../stores/web3";
  import OceanSummary from "./OceanSummary.svelte";
  import VeOceanCard from "./VeOceanCard.svelte";
  import LockOcean from "./LockOcean.svelte";
  import Button from "../common/Button.svelte";
  import { getLockedOceanAmount, getLockedEndTime } from "../../utils/ve";
  import { lockedOceanAmount, oceanUnlockDate } from "../../stores/veOcean";
  import { ToastNotification } from "carbon-components-svelte";
  import {
    approve as approveToken,
    allowance
  } from "../../utils/tokens";
  import { getAddressByChainIdKey } from "../../utils/address/address";
  import moment from "moment";

  let loading = false;
  let showDismissAllowance = false;
  let allowedTokenAmt = 0;
  const supportedChainId = import.meta.env.VITE_VE_SUPPORTED_CHAINID;

  const setShowApprovalNotification = async(value, allowedTokens) => {
    allowedTokenAmt=allowedTokens
    showDismissAllowance=value
  }

  const loadValues = async () => {
    loading = true;
    let lockedOceans = await getLockedOceanAmount($userAddress);
    lockedOceanAmount.update(() => lockedOceans);
    if (!$oceanUnlockDate) {
      let unlockDateMilliseconds = await getLockedEndTime(
        $userAddress
      );
      await oceanUnlockDate.update(() =>
        unlockDateMilliseconds ? moment.utc(unlockDateMilliseconds) : undefined
      );
      let lockedOceans = await getLockedOceanAmount($userAddress);
      lockedOceanAmount.update(() => lockedOceans);
    }
    loading = false
  };

  oceanUnlockDate.subscribe((v) => {
    if(v!==null) {
      loading = false;
    }
  })

  const dismissTokenApproval = async() =>{
    await approveToken(
     getAddressByChainIdKey($connectedChainId, "Ocean"),
     getAddressByChainIdKey(
       supportedChainId,
       "veOCEAN"
     ),
     0
    )
  }

  $: if ($userAddress) {
    loadValues();
    allowance(
      getAddressByChainIdKey($connectedChainId, "Ocean"),
      $userAddress,
      getAddressByChainIdKey(
       supportedChainId,
       "veOCEAN"
     )
    ).then((allowedAmt) => {
      if(allowedAmt>0){
        allowedTokenAmt = allowedAmt
        showDismissAllowance = true
      }else{
        allowedTokenAmt = 0
        showDismissAllowance = false
      }
    })
  }
</script>

{#if !loading }
<div>
  <h2 class="title">
    Get Passive rewards by locking you OCEAN tokens.
  </h2>
  <p class="message">
    You can get veOCEAN tokens in exchage for OCEAN. The longer the lock period the more the veOCEAN received.
    </p>
  </div>
  <div class={`container`}>
  {#if showDismissAllowance}
    <ToastNotification
      lowContrast
      kind="warning"
      title={`You have ${allowedTokenAmt > 1000000 ? '>1000000.00' : parseFloat(allowedTokenAmt).toFixed(2)} approved tokens that are not locked.`}
      subtitle="If you don't want to lock your tokens then please dismiss token approval now! Otherwhise other people may be able lock your approved tokens for you."
      on:close={(e) => {
        e.preventDefault();
        showDismissAllowance = false;
      }}
    >
      <Button
        className="dismissAllowanceButton"
        text={"Dismiss token approval"}
        onclick={dismissTokenApproval}
      />
    </ToastNotification>
  {/if}
    <VeOceanCard />
    <LockOcean setShowApprovalNotification={setShowApprovalNotification}/>
    <OceanSummary />
  </div>
{:else}
  <h3 class="loading">Loading...</h3>
{/if}

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacer);
    padding-top: var(--spacer);
    width: 100%;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--brand-grey-light);
    height: calc(100vh - 115px);
    width: 100%;
  }

  .alignContentCenter {
    justify-content: center;
  }

  .title {
    width: 100%;
    margin-top: calc(var(--spacer) * 2);
    margin-bottom: calc(var(--spacer) / 2);
  }
  .message {
    width: 100%;
  }

  :global(.dismissAllowanceButton){
    margin-bottom: calc(var(--spacer)/3) !important;
  }

  @media (min-width: 640px) {
    .container {
      padding-top: var(--spacer);
      gap: var(--spacer);
    }
  }
</style>
