<script>
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { ClapperboardPlaySolid, TerminalSolid, DatabaseSolid, MountainSunSolid, ListSolid, ClipboardListSolid } from 'flowbite-svelte-icons';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	let id = 123; // test!
</script>

<Sidebar asideClass="w-56">
	<SidebarWrapper>
		<SidebarGroup>
			<SidebarItem label="Flipper losen" href=/liga/flipliga/{id}/draw {spanClass}>
				{#snippet icon()}
							
						<ClapperboardPlaySolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					
							{/snippet}
			</SidebarItem>
			<SidebarItem label="Rangliste" href="/admin/players" {spanClass}>
				{#snippet icon()}
							
						<ListSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					
							{/snippet}
			</SidebarItem>
			<SidebarItem label="Matches" href="/admin/tournaments" {spanClass}>
				{#snippet icon()}
							
						<ClipboardListSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					
							{/snippet}
			</SidebarItem>
			<SidebarItem label="Pyramide" href="/admin/tournaments" {spanClass}>
				{#snippet icon()}
							
						<MountainSunSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					
							{/snippet}
			</SidebarItem>
			<SidebarItem label="Matcheingabe" href="/admin/tournaments" {spanClass}>
				{#snippet icon()}
							
						<TerminalSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					
							{/snippet}
			</SidebarItem>
			<SidebarItem label="Statistik" href="/admin/tournaments" {spanClass}>
				{#snippet icon()}
							
						<DatabaseSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					
							{/snippet}
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
