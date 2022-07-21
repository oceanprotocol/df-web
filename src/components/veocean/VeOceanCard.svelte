<script>
  import { userAddress } from "../../stores/web3";
  import Card from "../common/Card.svelte";
  import ItemWithLabel from "../common/ItemWithLabel.svelte";
  import { getVeOceanBalance } from "../../utils/ve";

  let balance = 0;
  let unlockDate = new Date();
  let votingPowerMultiplier = 0;
  let loading = false;

  const setVeOceanBalance = async () => {
    balance = await getVeOceanBalance($userAddress);
    console.log(balance);
  };

  $: if ($userAddress) {
    loading = false;
    setVeOceanBalance();
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
        value={`${new Date(unlockDate).toLocaleDateString()}`}
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
