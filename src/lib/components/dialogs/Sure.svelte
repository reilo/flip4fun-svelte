<script>
	import { Modal, Label, Button } from 'flowbite-svelte';
	import { QuestionCircleOutline } from 'flowbite-svelte-icons';

	let { show, title, message, actionOk, actionCancel, buttonOk, buttonCancel } = $props();
</script>

<div>
	<Modal {title} bind:open={show} autoclose={false} class="max-w-sm">
		<div class="text-center">
			<QuestionCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
			<form class="flex flex-col space-y-6" action="#">
				<Label class="space-y-2">{message}</Label>
				<Button color="alternative" onclick={actionOk}>{buttonOk ? buttonOk : 'Ok'}</Button>
				<Button color="primary" onclick={actionCancel}
					>{buttonCancel ? buttonCancel : 'Nein, abbrechen!'}</Button
				>
			</form>
		</div>
	</Modal>
</div>
