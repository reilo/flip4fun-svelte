# Infos für den Anwender

## Umgebungsvariablen

Foldende Konstanten können bzw. müssen in der Datei .env im Root-Verzeichnis dieser App gesetzt werden:
- **DATABASE_URL**: Url zur Postgres-Datenbank nach dem Format:\
 postgresql://\<DB-Owner\>:\<DB-Passwort\>\@\<server\>:\<port\>/\<DB-Name\>.
 - **VITE_ADMIN_PASSWORD**: Admin-Passwort.
 - **VITE_APP_FULL**: wenn auf beliebigen Wert gesetzt, läuft die App mit voller Funktionalität, andernfalls im Readonly-Modus (für die Web-Version gedacht).
 - **VITE_KEEP_ADMIN**: wenn auf beliebigen Wert gesetzt, bleibt die App - nach einmaligen Einloggen - dauerhaft im Admin-Modus, andernfalls springt die App beim Verlassen des Liga-Admin-Bereichs in Read-Modus zurück.
 - **VITE_INCLUDE_TEST**: wenn auf beliebigen Wert gesetzt, werden auch Test-Turniere (enthalten "Test" im Namen) angezeigt, andernfalls nicht.

## Datenbank

Im normalen Spielbetrieb werden die Daten in der lokalen Postgres‑Datenbank gespeichert.
Die entsprechende Umgebungsvariable ist – wie oben beschrieben – auf `localhost` gesetzt.

Es wird empfohlen, regelmäßig manuell ein Backup der Datenbank zu erstellen bzw. die Tabellen als CSV zu exportieren.  
Insbesondere nach einem abgeschlossenen Spieltag sollte dies unbedingt durchgeführt werden.  
Eine detaillierte Anleitung findet sich weiter unten.

Für die Web‑Version der App müssen die Daten manuell in die bei **NeonDB** gehostete Datenbank importiert werden.  
Die dafür benötigte URL kann auf der NeonDB‑Website eingesehen werden, sofern man über gültige Zugangsdaten verfügt.
``
## Applikation starten

Die App läuft in der Entwicklungsumgebung – gestartet aus VS Code über `npm run dev` – unter **http://localhost:5173**.

In der Produktivumgebung – kompiliert mit `npm run build` und gestartet über `npm run preview` – ist die App unter **http://localhost:4173** erreichbar.  
Ein entsprechender Dienst wurde mit **nssm** eingerichtet (Service-Name: *isaramper*).

Sollte die App wider Erwarten nicht laufen, kann sie im Verzeichnis  
`C:/flip4fun-svelte`  
manuell durch das Kommando

```sh
npm run preview
```
gestartet werden

## Svelte Adapter

Im Repository ist der Svelte‑Adapter auf adapter-auto eingestellt. Diese Einstellung muss beibehalten werden, damit die unter Vercel gehostete Version korrekt funktioniert.

Auf dem System, auf dem das Projekt kompiliert, für den Service vorbereitet und im Ligabetrieb verwendet wird, muss der Adapter hingegen auf adapter-node umgestellt werden.

# Infos für Entwickler

## Resourcen

Svelte: https://svelte.dev/docs/svelte/overview

Svelte Kit: https://svelte.dev/docs/kit/introduction

Flowbite Svelte: https://flowbite-svelte.com/docs/pages/introduction

Tailwind CSS: https://tailwindcss.com/docs/styling-with-utility-classes

Markdown: https://www.markdownguide.org/cheat-sheet/#overview

## svelte-Projekte

Diese Informationen wurden für die Entwicklung mit Svelte 4 zusammengestellt.\
Da das Projekt inzwischen auf Svelte 5 umgestellt wurde, könnten Teile der Angaben nicht mehr aktuell sein.\
Es wird daher empfohlen, die neuesten Informationen im Internet nachzuschlagen.

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

### Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.


### Testing

```bash
npm run test
```

## Prisma

### Install Prisma
```bash
npm install prisma --save-dev
```
```bash
npx prisma init --datasource-provider postgresql
```

### Select database
Create an .env file in the root folder of your project, if it does not yet exist.\
Add an DATABASE_URL variable and set it to a valid connection string, e.g.
```bash
DATABASE_URL="postgresql://xxxxx:yyyyy-little-credit-30716388.eu-central-1.aws.neon.tech/IsarAmper?sslmode=require"
```

### Pull database
```bash
npx prisma db pull
```

### Push database after schema change
```bash
npx prisma db push
```
You may use this command to preserve migration history.\
I wouldn't recommend it when you work with different target databases, e.g. using development environments, or push to local and remote database.
```bash
npx prisma migrate dev --name=..comment..
```

### Update local prisma client
```bash
npx prisma generate
```

### Run prisma UI
Good for remote database.\
Would prefer pgadmin for local database.
```bash
npx prisma studio
```

## TailwindCSS

This information may be outdated as it was performed with Svelte 4, but currently used version is Svelte 5.

### Install Tailwind

```bash
npm install -D tailwindcss postcss autoprefixer
```
```bash
npx tailwindcss init -p
```

### Update configuration files

#### svelte.config.js

Add the following statements to svelte.config.js:

```bash
import { vitePreprocess } from '@sveltejs/kit/vite';
```
```bash
const config = {
  ...
  preprocess: vitePreprocess()
};
```

#### tailwind.config.js

Add the following statement to tailwind.config.js:

```bash
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    ...
  ],
  ...
}
```

### Update application files

#### app.css

Add the following statements to app.css:

```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### +layout.svelte

Add the following statement to your layout file:

```bash
import "../app.css";
```

## Flowbite

### Install Flowbite

```bash
npm install flowbite flowbite-svelte tailwind-merge @popperjs/core
```

## Lokale DB-Installation

Laden von
```bash
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
```

Dann Datenbank anlegen via
```bash
pgadmin
```
Dann Datenbank-Tabellen pushen via:
```bash
npx prisma db push
```

## Daten exportieren / importieren

(Die unten angegebenen psql-Kommandos sind auch unter im 'psql'-Verzeichnis zu finden.)

Um Daten von einer Datenbank in eine andere Datenbank zu bringen, z. B. von lokal nach remote, folgendermaßen vorgehen:

- Quellsystem: Export entweder via pgadmin oder via psql-Kommando:

```bash
\copy (SELECT * FROM pin) to '..\pin.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
```
```bash
\copy (SELECT * FROM player) to '..\player.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
```
```bash
\copy (SELECT * FROM tourney) to '..\tourney.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
```
```bash
\copy (SELECT * FROM round) to '..\round.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
```
```bash
\copy (SELECT * FROM match) to '..\match.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
```
```bash
\copy (SELECT * FROM frame) to '..\frame.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
```

Dabei folgendes beachten:
- Als Delimiter immer ein Zeichen angeben, das in den Daten mit Sicherheit nicht benutzt wird. Am besten '|'. Auf keinen Fall ',' verwenden, da es in JSON-Elemente vorkommt.
- Als Quote ebenfalls ein Zeichen wählen, das in den Daten nicht vorkommt, z. B '^'.
- UTF8-Encoding verwenden, weil sonst Umlaute nicht korrekt importiert werden.
- HEADER-Option verwenden, um die csv-Datei mit Header zu erstellen.
- Tabellen- und Spaltennamen, die nicht vollständig lowercase sind, müssen immer in Anführungszeichen eingeschlossen werden. In diesem Projekt ist alles lowercase.

- Zielsystem: Tabelleninhalte löschen, falls notwendig

```bash
DELETE FROM pin;
DELETE FROM player;
DELETE FROM tourney;
DELETE FROM round;
DELETE FROM match;
DELETE FROM frame;
```

- Zielsystem: Import via psql-Kommandos:

```bash
\copy pin FROM '..\pin.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```
```bash
\copy player FROM '..\player.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```
```bash
\copy tourney FROM '..\tourney.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```
```bash
\copy round FROM '..\round.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```
```bash
\copy match FROM '..\match.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```
```bash
\copy frame FROM '..\frame.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```

Dabei folgendes beachten:
- Delimiter und Quote wie beim Export angeben.
- UTF8-Encoding verwenden, weil sonst Umlaute nicht korrekt importiert werden.
- Ggf. müssen die Spalten explizit in richtiger Reihenfolge angegeben werden, in Klammern direkt hinter dem Tabellennamen. In der csv-Datei kontrollieren.
- HEADER-Option verwenden, da die csv-Datei mit Header erstellt wurde.

## Datenformate

### Tabelle "Tournament"

#### Flipliga

`tournament.settings`
-    `baseline`:          Basispunkte für jeden Spieler zu Saisonbeginn
-    `challengeSame`:     Wie oft darf der gleiche Gegner je Saison gefordert werden
-    `matchBonus`:        Bonuspunkt(e) für jedes absolvierte Match
-    `matchPenalty`:      Strafpunkt(e) für Fehlmatches pro Spieltag (neu)
-    `minMatchesRound`:   Wie viele Matches muss ein Spieler pro Spieltag spielen?
-    `penaltyFirstRound`: Ab welcher Runde erfolgen Punktabzüge?

#### Flipfinal

`tournament.settings`
-    `numFinalists`:      Wieviele Spieler sollen in die Finalebene aufrücken
-    `pinTypes`:          Welche Art von Flipper sollen beim Double-Match gewählt werden
                          (0 = beliebig, 1 = 1xDMD, 1xEarly, 2 = mindestens 1xDMD)

### Tabelle "Round"

`round.settings.rankInit`
-    `bonus`:      Bonuspunkte zu Spieltagbeginn
-    `player`:     player ID
-    `points`:     Punkte zu Spieltagbeginn
-    `matches`:    Anzahl Matches zu Spieltagbeginn
-    `mismatch`:   Anzahl der fehldenden Spiele
-    `penalty`:    Strafpunkte zu Spieltagbeginn
-    `strength`:   Spielstärke zu Spieltagbeginn

`round.results.rankFinal`
-    `bonus`:      Bonuspunkte Gesamt nach Spieltag
-    `player`:     player ID,
-    `points`:     Gesamtpunkte nach Spieltag
-    `matches`:    Gesamtanzahl Matches nach Spieltag
-    `mismatch`:   Anzahl der fehldenden Spiele
-    `penalty`:    Strafpunkte Gesamt nach Spieltag
-    `rankChange`: Rangänderung nach Spieltag  