<script>
    import DelegationMetrics from "./DelegationMetrics.svelte"
    import Delegate from "./Delegate.svelte"
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
  