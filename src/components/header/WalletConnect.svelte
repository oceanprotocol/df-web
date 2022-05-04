<script>
	import Button from '../common/Button.svelte';
	import { connectWallet, userAddress, disconnect } from "../../stores/web3";
</script>

<div class="flex h-screen justify-center">
	<div class="m-auto flex justify-center flex-col">
		{#if !$userAddress}	
			<Button onclick={() => connectWallet()} text={`Connect Wallet`} />
		{:else}
			<div>
				<span>
					{$userAddress.substr(0, 5)}...{$userAddress.substr(
						$userAddress.length - 5
					)}
				</span>
				<Button onclick={() => disconnect()} text={`Disconnect`} />
			</div>
		{/if}
	</div>
</div>
