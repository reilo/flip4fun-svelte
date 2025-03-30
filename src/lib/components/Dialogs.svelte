<script module>
	import { Modal, Button } from 'flowbite-svelte';
	import { CloseCircleOutline } from 'flowbite-svelte-icons';

	export { showAlert };
</script>

{#snippet showAlert(options)}
	<Modal bind:open={options.bindParam} size="xs" autoclose>
		<div class="text-center">
			<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				{options.messageText}
			</h3>
			<Button color="alternative">{options.buttonText}</Button>
		</div>
	</Modal>
{/snippet}
