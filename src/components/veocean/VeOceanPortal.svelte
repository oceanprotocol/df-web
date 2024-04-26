<script>
  import { userAddress, connectedChainId } from "../../stores/web3";
  import OceanSummary from "./OceanSummary.svelte";
  import VeOceanCard from "./VeOceanCard.svelte";
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
  import { ethers } from "ethers";

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
    try{
      await approveToken(
      getAddressByChainIdKey($connectedChainId, "Ocean"),
      getAddressByChainIdKey(
        supportedChainId,
        "veOCEAN"
      ),
      0
      )
      setShowApprovalNotification(false, 0)
    }catch(e){
      console.error(e)
    }

  }

  $: if ($userAddress && $connectedChainId==import.meta.env.VITE_VE_SUPPORTED_CHAINID) {
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
        allowedTokenAmt = ethers.utils.formatEther(
          BigInt(allowedAmt).toString(10)
        )
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
    Withdraw your OCEAN tokens after your lock period has ended
  </h2>
  </div>
  <div class={`container`}>
  {#if showDismissAllowance}
    <ToastNotification
      fullWidth
      lowContrast
      hideCloseButton
      kind="warning"
      title={`REVOKE THE ${allowedTokenAmt > 1000000 ? '>1000000.00' : parseFloat(allowedTokenAmt).toFixed(2)} TOKEN LOCK APPROVAL!!`}
      subtitle="Passive-DF is stoped. Remove the current token approval to make sure no one else could lock the approved token in your behalf!"
      on:close={(e) => {
        e.preventDefault();
        showDismissAllowance = false;
      }}
    >
      <Button
        className="dismissAllowanceButton"
        text={"revoke token approval"}
        onclick={dismissTokenApproval}
        disabled={allowedTokenAmt==0}
      />
    </ToastNotification>
  {/if}
    <VeOceanCard />
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
