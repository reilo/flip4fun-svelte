<script>
	import { Heading, Button, Card, Spinner } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	let { title, description, action, enabled, buttonOk, loading } = $props();
</script>

<div>
	<Card>
		<Heading tag="h5" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{title}
		</Heading>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			{description}
		</p>
		{#if loading}
			<Button disabled={!enabled} class="w-fit">
				<Spinner class="me-3" size="4" color="white" />Laden ...
			</Button>
		{:else}
			<Button disabled={!enabled} on:click={action} class="w-fit">
				{buttonOk}<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
			</Button>
		{/if}
	</Card>
</div>
