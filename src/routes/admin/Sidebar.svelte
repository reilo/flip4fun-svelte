<script>
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  import { UserSolid, RocketSolid } from 'flowbite-svelte-icons';
  let spanClass = 'flex-1 ms-3 whitespace-nowrap';
</script>

<Sidebar>
  <SidebarWrapper>
    <SidebarGroup>
      <SidebarItem label="Spielerverwaltung" {spanClass}>
        <svelte:fragment slot="icon">
          <UserSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
        <svelte:fragment slot="subtext">
            <span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"> 25 </span>
          </svelte:fragment>
    </SidebarItem>
    <SidebarItem label="Flipperverwaltung" {spanClass}>
        <svelte:fragment slot="icon">
          <RocketSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
        <svelte:fragment slot="subtext">
            <span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"> 110 </span>
          </svelte:fragment>
    </SidebarItem>
    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>