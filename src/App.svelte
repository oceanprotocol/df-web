<script>
	import Header from "../src/components/header/Header.svelte";
	import ClaimPortal from "./components/claim/ClaimPortal.svelte";
	import PoolsPortal from "./components/pools/PoolsPortal.svelte";
	import { connectWallet, userAddress, connectWalletFromLocalStorage } from "./stores/web3";
	import { Router, Route } from "svelte-navigator";

	if ($userAddress === "") {
    if(localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')){
      connectWalletFromLocalStorage();
    }else{
      connectWallet();
    }
  }
</script>

<Router>
	<Header/>
	<main>
		<Route path="/">
			<ClaimPortal/>
		</Route>
		<Route path="/pools">
			<PoolsPortal/>
		</Route>
	</main>
</Router>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>