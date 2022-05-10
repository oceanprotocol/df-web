<script>
  const EthIcon = "/images/eth.svg";
  const PolygonIcon = "/images/polygon.svg";
  const MoonbeamIcon = "/images/moonbeam.svg";
  const BscIcon = "/images/bsc.svg";
  const EnergywebIcon = "/images/energyweb.svg";

  export let name;
  export let minimal = false;

  const IconMapped = name.includes("ETH")
    ? EthIcon
    : name.includes(minimal ? "Polygon" : "Polygon")
    ? PolygonIcon
    : name.includes(minimal ? "Moon" : "Moon")
    ? MoonbeamIcon
    : name.includes(minimal ? "BSC" : "Binance")
    ? BscIcon
    : name.includes(minimal ? "Energy Web" : "Energy Web")
    ? EnergywebIcon
    : EthIcon; // ETH icon as fallback
</script>

<div class="imageContainer">
  <img src={IconMapped} alt={name} />
</div>

<style>
  img {
    height: 1rem;
  }
  .imageContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--spacer) / 4);
    margin-right: calc(var(--spacer) / 8);
  }
</style>
