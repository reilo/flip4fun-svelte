<script>
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { UserSolid, RocketSolid, ClapperboardPlaySolid } from 'flowbite-svelte-icons';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
</script>

<Sidebar asideClass="w-56">
	<SidebarWrapper>
		<SidebarGroup>
			<SidebarItem label="Flipperverwaltung" href="/admin/pins" {spanClass}>
				{#snippet icon()}
							
						<RocketSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					
							{/snippet}
			</SidebarItem>
			<SidebarItem label="Spielerverwaltung" href="/admin/players" {spanClass}>
				{#snippet icon()}
							
						<UserSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					
							{/snippet}
			</SidebarItem>
			<SidebarItem label="Turnierverwaltung" href="/admin/tournaments" {spanClass}>
				{#snippet icon()}
							
						<ClapperboardPlaySolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					
							{/snippet}
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
