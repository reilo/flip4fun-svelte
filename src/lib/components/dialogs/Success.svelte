<script>
	import { Modal, Heading, Button } from 'flowbite-svelte';
	import { ThumbsUpOutline } from 'flowbite-svelte-icons';

	let { show, message, onClose } = $props();
</script>

<div>
	<Modal bind:open={show} size="xs">
		<div class="text-center">
			<ThumbsUpOutline class="mx-auto mb-4 text-green-700 w-12 h-12 dark:green-red-700" />
			<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				{message}
			</Heading>
			<Button color="alternative" onclick={onClose}>Schließen</Button>
		</div>
	</Modal>
</div>
