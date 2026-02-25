<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	goto('/liga/flipliga/' + page.params.id + '/statistics/general', { replaceState: true });
</script>
