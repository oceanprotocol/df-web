<script>
  import WalletConnect from "./WalletConnect.svelte";
  import NetworkSelection from "./NetworkSelection.svelte";
  import { useTinyRouter } from "svelte-tiny-router";

  let aboutURL = "https://docs.oceanprotocol.com/veocean-data-farming";
  const router = useTinyRouter();
  
  // Simple reactive path tracking
  let currentPath = $state(typeof window !== "undefined" ? window.location.pathname : "/");
  
  $effect(() => {
    if (typeof window === "undefined") return;
    
    const update = () => currentPath = window.location.pathname;
    window.addEventListener("popstate", update);
    const interval = setInterval(update, 50);
    return () => {
      window.removeEventListener("popstate", update);
      clearInterval(interval);
    };
  });
  
  let isVeOceanActive = $derived(currentPath === "/veocean");
  let isRewardsActive = $derived(currentPath === "/rewards");
  
  function handleNavigate(e, path) {
    e.preventDefault();
    router?.navigate(path);
    currentPath = path;
  }
</script>

<svelte:head>
  <title>
    {`${
      currentPath?.substring(1) === "veocean"
        ? "veOCEAN"
        : currentPath?.substring(1) || ""
    } - Ocean Farm`}
  </title>
</svelte:head>
<header>
  <h1 class="logo">
    <a href="/" class="link" onclick={(e) => handleNavigate(e, "/")}>
      <img src={"/logo-ocean-svg.svg"} alt="SvelteKit" />
    </a>
  </h1>
  <nav>
    <ul>
      <li class:active={isVeOceanActive}>
        <a href="/veocean" class="link" onclick={(e) => handleNavigate(e, "/veocean")}>PASSIVE-DF</a>
      </li>
      <li class:active={isRewardsActive}>
        <a href="/rewards" class="link" onclick={(e) => handleNavigate(e, "/rewards")}>REWARDS</a>
      </li>
      <li class:active={false}>
        <a href={aboutURL} target="_blank" class="link" rel="noreferrer">ABOUT</a>
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
    padding: calc(var(--spacer)/3) 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
    display: flex;
    flex-wrap: wrap;
  }

  li {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(nav a) {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.4rem;
    padding-bottom: 1rem;
    color: var(--brand-grey-light);
    font-weight: 700;
    text-decoration: none;
    font-size: var(--font-size-base);
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  li > :global(a):hover {
    color: var(--brand-black);
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
      padding: 0.5rem 1rem;
    }
    .logo img {
      width: 5rem;
      height: 5rem;
    }
  }
</style>
