Benutzer-Dokumentation
- Wo Datenbank? Wie Daten bearbeiten? Backup erstellen.
- Wie lokal starten?

Code kommentieren, insbes. Component Parameter
Strings lokalisieren
Fehlerbehandlung

Wait Cursor
Zeilenhintergrund alternierend nach Spielstärke

Essentiell: Liga/Turnier-Framework
- Strafpunkte variabel / Spielstärke?
- Ergebnis-PDF erstellen...
- Titel/Untertitel, Erklärungstexte bearbeiten
- Match DB Tabelle
- App als Service starten
- Check alle Admin-Seiten gesperrt
- Create/Update Pins, Kürzel abfragen
- Round/Match Namen inkrementieren
- Admin Löschseite, Turniere, Pins, Spieler
- Fehleingaben korrigieren
- JSON.stringify({ tournament: tournament }) sinnvoll allgemein?
- Turniername checken auf duplikate, umbenennen ermöglichen, sure dialog
...
- leere String in DB speichern?
- Spieler-Fotos wo?
- Pyramide
- Styling allgemein
- Spieler Liga-Admin -> Tabellenlayout

Unit Tests...
Env Variablen in Service-Mode
Device Phone eliminieren

ferner (falls Zeit ist):
- Usability: von Admin direkt zurück zum Turnier -> Admin-Rolle raus
- Ranking Style refactorn und parametriesieren
- Rest APIs: expand parameter
- Flipperliste mehr Funktionen
- Mehr Pin-Details: Auflage, Designer, Art Designer, Link zu ipdb


##################################################

Passing props to dynamic components

<script>
	import Page1 from './Page1.svelte';
	import Page2 from './Page2.svelte';
	
	let component;
	let props;
	
	const page1 = () => {
		component = Page1;
		props = {page1Prop: 1};
	};
	
	const page2 = () => {
		component = Page2;
		props = {page2Prop: 2};
	};
	
	page1();
</script>

<button on:click={page1}>page1</button>
<button on:click={page2}>page2</button>
<svelte:component this={component} {...props}/>

--------------------------------------------------

Sidebars

<Sidebar asideClass="w-56">
	<SidebarWrapper>
		<SidebarGroup>
			<SidebarItem label="Flipper losen" href=/liga/flipliga/{id}/draw {spanClass}>
				<ClapperboardPlaySolid
					class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
				/>
			</SidebarItem>
			<SidebarItem label="Rangliste" href="/admin/players" {spanClass}>
				<ListSolid
					class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
				/>
			</SidebarItem>
			<SidebarItem label="Matches" href="/admin/tournaments" {spanClass}>
				<ClipboardListSolid
					class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
				/>
			</SidebarItem>
			<SidebarItem label="Pyramide" href="/admin/tournaments" {spanClass}>
				<MountainSunSolid
					class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
				/>
			</SidebarItem>
			<SidebarItem label="Matcheingabe" href="/admin/tournaments" {spanClass}>
				<TerminalSolid
					class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
				/>
			</SidebarItem>
			<SidebarItem label="Statistik" href="/admin/tournaments" {spanClass}>
				<DatabaseSolid
					class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
				/>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
