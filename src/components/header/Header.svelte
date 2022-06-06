<script>
  import WalletConnect from "./WalletConnect.svelte";
  import NetworkSelection from "./NetworkSelection.svelte";
  import { Link, useLocation, useNavigate } from "svelte-navigator";

  const aboutURL =
    "https://docs.google.com/document/d/1BVwgZ_reNC25pcYc64Yllcz3tEw43JbwYhS8bQ6IIlg/edit";
  const location = useLocation();
  const navigate = useNavigate();
  $: if ($location.pathname !== "/pools") {
    navigate("/rewards");
  }
</script>

<svelte:head>
  <title>
    {`${$location.pathname
      .charAt(1)
      .toUpperCase()}${$location.pathname.substring(2)} - Ocean Farm`}
  </title>
</svelte:head>
<header>
  <div class="logo">
    <Link to="/" class="link">
      <img src={"/logo-ocean-svg.svg"} alt="SvelteKit" />
    </Link>
  </div>
  <nav>
    <ul>
      <li class:active={$location.pathname === "/rewards"}>
        <Link to="/rewards" class="link">CLAIM PORTAL</Link>
      </li>
      <li class:active={$location.pathname === "/pools"}>
        <Link to="/pools" class="link">POOL EXPLORER</Link>
      </li>
      <li class:active={false}>
        <a href={aboutURL} target="_blank" class="link">ABOUT</a>
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
    height: 80px;
    margin: auto;
    margin-top: calc(var(--spacer) / 4);
  }

  .headerActions {
    display: flex;
  }

  .logo a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .logo img {
    width: 4em;
    height: 4em;
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

  li > :global(a) {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1em;
    color: var(--brand-grey-light);
    font-weight: 700;
    text-decoration: none;
    font-size: var(--font-size-small);
    text-transform: uppercase;
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
    background-color: var(--brand-white);
    z-index: 100;
  }

  @media (min-width: 640px) {
    header {
      flex-direction: row;
      margin: 0;
    }
  }
</style>
