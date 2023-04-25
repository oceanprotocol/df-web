<script>
  import { networkSigner, userAddress, connectedChainId } from "../../stores/web3";
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

  const loadValues = async () => {
    loading = true;
    let lockedOceans = await getLockedOceanAmount($userAddress, $networkSigner);
    lockedOceanAmount.update(() => lockedOceans);
    if (!$oceanUnlockDate) {
      let unlockDateMilliseconds = await getLockedEndTime(
        $userAddress,
        $networkSigner
      );
      await oceanUnlockDate.update(() =>
        unlockDateMilliseconds ? moment.utc(unlockDateMilliseconds) : undefined
      );
    }

    loading = false;
  };

  const dismissTokenApproval = async() =>{
    let tx = await approveToken(
     getAddressByChainIdKey($connectedChainId, "Ocean"),
     getAddressByChainIdKey(
       process.env.VE_SUPPORTED_CHAINID,
       "veOCEAN"
     ),
     0,
     $networkSigner
    );
    await tx.wait();
  }

  $: if ($userAddress) {
    loadValues();
    allowance(
      getAddressByChainIdKey($connectedChainId, "Ocean"),
      $userAddress,
      getAddressByChainIdKey(
       process.env.VE_SUPPORTED_CHAINID,
       "veOCEAN"
     ),
     $networkSigner
    ).then((allowedAmt) => {
      console.log(allowedAmt)
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

{#if !loading}
  <div class={`container`}>
  {#if showDismissAllowance}
    <ToastNotification
      lowContrast
      kind="warning"
      title={`You have ${parseFloat(allowedTokenAmt).toFixed(2)} approved tokens that are not locked.`}
      subtitle="If you don't want to lock your tokens then please dismiss token approval now! Otherwhise other people may be able lock your approved tokens."
    >
      <Button
        className="dismissAllowanceButton"
        text={"Dismiss token approval"}
        onclick={dismissTokenApproval}
      />
    </ToastNotification>
  {/if}
    <VeOceanCard />
    <LockOcean />
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
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--brand-grey-light);
    height: calc(100vh - 115px);
  }

  .alignContentCenter {
    justify-content: center;
  }

  :global(.dismissAllowanceButton){
    margin-bottom: calc(var(--spacer)/3) !important;
  }

  @media (min-width: 640px) {
    .container {
      padding-top: calc(var(--spacer) * 2);
      gap: var(--spacer);
    }
  }
</style>
