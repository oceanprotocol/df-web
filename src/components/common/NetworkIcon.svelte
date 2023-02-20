<script>
  const EthIcon = "/images/eth.svg";
  const PolygonIcon = "/images/polygon.svg";
  const MoonbeamIcon = "/images/moonbeam.svg";
  const BscIcon = "/images/bsc.svg";
  const EnergywebIcon = "/images/energyweb.svg";

  export let name;
  export let minimal = false;
  export let color = undefined;

  let IconMapped = undefined;

  $: if (name) {
    IconMapped = name.includes("ETH")
      ? EthIcon
      : name.includes(minimal ? "Polygon" : "Polygon") ||
        name.includes(minimal ? "Mumbai" : "Mumbai")
      ? PolygonIcon
      : name.includes(minimal ? "Moon" : "Moon")
      ? MoonbeamIcon
      : name.includes(minimal ? "BSC" : "Binance")
      ? BscIcon
      : name.includes(minimal ? "Energy Web" : "Energy Web")
      ? EnergywebIcon
      : EthIcon; // ETH icon as fallback
  }
</script>

<div class="imageContainer">
  <img src={IconMapped} alt={name} style={color ? `color:${color}` : ''}/>
</div>

<style>
  img {
    height: 0.8rem;
  }
  .imageContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--spacer) / 4);
    margin-right: calc(var(--spacer) / 8);
  }
</style>
