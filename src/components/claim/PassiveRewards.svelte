<script>
  import ClaimItem from "../common/ClaimItem.svelte";
</script>

<ClaimItem
  title="Passive"
  description="Shares based on user’s <strong>veOCEAN</strong> amount. 
    Lock your OCEAN to receive rewards."
  distributedAmount={roundInfo.passive}
  amount={`${parseFloat($veClaimables).toFixed(3)} OCEAN`}
  loading={claiming === "VE_REWARDS"}
  onClick={onClaimVeRewards}
  disabled={canClaimVE === false ||
    claiming !== undefined ||
    $veClaimables <= 0}
/>
