<script>
  import Button from "./Button.svelte";

	export let showModal; // boolean
	export let onClose;

	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => {
		showModal = false
		onClose()
		}
	}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<div class="buttonContainer">
			<Button onclick={() => dialog.close()} type="button" textOnly text="X"/>
		</div>
		<slot name="header" />
		<slot />
	</div>
</dialog>

<style>
	dialog {
		border-radius: 0.2em;
		border: none;
		padding: 0;
		background-color: white;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.buttonContainer{
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	:global(dialog  button){
		color: var(--brand-grey-light) !important;
	}
	@media (min-width: 640px) {
      dialog{ 
        padding: calc(var(--spacer) / 2);
      }
    }
</style>
