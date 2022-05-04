<script>
	import WalletConnect from './WalletConnect.svelte';
	import { Link } from "svelte-navigator";
</script>

<header>
	<div class="logo">
		<a href="https://kit.svelte.dev">
			<img src={'/logo-ocean-svg.svg'} alt="SvelteKit" />
		</a>
	</div>
	<nav>
		<ul>
			<li class:active={window.location.href === '/'}>
				<Link to="/" class="link">CLAIM PORTAL</Link>
			</li>
			<li class:active={window.location.href === '/pools'}>
				<Link to="/pools" class="link">POOL EXPLORER</Link>
			</li>
		</ul>
	</nav>
	<div>
		<WalletConnect />
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		max-width: 1024px;
		margin: auto;
	}

	.logo a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.logo img {
		width: 3em;
		height: 3em;
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

	.link {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	.link:hover {
		color: var(--accent-color);
	}
</style>
