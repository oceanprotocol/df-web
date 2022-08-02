<script>
  import { userAddress } from "../../stores/web3";
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import { getVeOceanBalance, getLockedEndTime } from "../../utils/ve";

  let balance = 0;
  let unlockDate = undefined;
  let votingPowerMultiplier = 0;
  let loading = true;

  const setValues = async () => {
    balance = await getVeOceanBalance($userAddress);
    let unlockDateMilliseconds = await getLockedEndTime($userAddress);
    unlockDate = new Date(unlockDateMilliseconds);
    loading = false;
  };

  $: if ($userAddress) {
    setValues();
  }
</script>

<div class={`container`}>
  <Card title="My veOCEAN">
    <div class="veOcean-info">
      <ItemWithLabel
        title={`veOcean Balance`}
        value={`${parseFloat(balance).toFixed(3)} veOCEAN`}
        {loading}
      />
      <ItemWithLabel
        title={`Locked until`}
        value={`${
          unlockDate ? new Date(unlockDate).toLocaleDateString() : "no value"
        }`}
        {loading}
      />
      <ItemWithLabel
        title={`Voting power multiplier`}
        value={`${parseFloat(votingPowerMultiplier).toFixed(3)} X`}
        {loading}
      />
    </div>
  </Card>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    grid-column: 1 / 3;
    width: 100%;
  }

  .veOcean-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  @media (min-width: 640px) {
  }
</style>
