<script>
  import WalletConnect from "./WalletConnect.svelte";
  import NetworkSelection from "./NetworkSelection.svelte";
  import { Link, useLocation } from "svelte-navigator";

  let aboutURL = "https://docs.oceanprotocol.com/veocean-data-farming";
  const location = useLocation();
</script>

<svelte:head>
  <title>
    {`${
      $location.pathname.substring(1) === "veocean"
        ? "veOCEAN"
        : $location.pathname.substring(1)
    } - Ocean Farm`}
  </title>
</svelte:head>
<header>
  <h1 class="logo">
    <Link to="/" class="link plausible-event-name=Link+to+df-homepage">
      <img src={"/logo-ocean-svg.svg"} alt="SvelteKit" />
    </Link>
  </h1>
  <nav>
    <ul>
      <li class:active={$location.pathname === "/veocean"}>
        <Link
          to="/veocean"
          class="link plausible-event-name=Link+to+veOcean+page">veOCEAN</Link
        >
      </li>
      <li class:active={$location.pathname === "/datafarming"}>
        <Link
          to="/datafarming"
          class="link plausible-event-name=Link+to+datafarming+page">FARMS</Link
        >
      </li>
      <li class:active={$location.pathname === "/activerewards"}>
        <Link
          to="/activerewards"
          class="link plausible-event-name=Link+to+activerewards+page"
          >REWARDS</Link
        >
      </li>
      <li class:active={false}>
        <a
          href={aboutURL}
          target="_blank"
          class="link plausible-event-name=Link+external+to+about+blog+post"
          >ABOUT</a
        >
      </li>
    </ul>
  </nav>
  <div class="headerActions">
    <NetworkSelection />
    <WalletConnect />
  </div>
</header>

<style>
  header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    padding-top: calc(var(--spacer) / 4);
  }

  .headerActions {
    display: flex;
  }

  .logo {
    margin-bottom: 0;
  }

  .logo img {
    width: 4rem;
    height: 4rem;
    object-fit: contain;
  }

  nav {
    display: flex;
    justify-content: center;
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 4em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  :global(nav a) {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.4em;
    color: var(--brand-grey-light);
    font-weight: 700;
    text-decoration: none;
    font-size: var(--font-size-base);
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  li > :global(a):hover {
    color: var(--accent-color);
  }

  .active > :global(a) {
    color: var(--brand-black);
  }

  :global(div [class*="tooltip"]) {
    background-color: transparent;
  }

  @media (min-width: 660px) {
    header {
      flex-direction: row;
      margin: 0;
      padding: 0;
      margin-top: calc(var(--spacer) / 2);
    }
    li > :global(a) {
      padding: 0 1em;
    }
    .logo img {
      width: 5rem;
      height: 5rem;
    }
  }
</style>
