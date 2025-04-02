# Infos für den Anwender

under construction

# Infos für Entwickler

## svelte-Projekte

Diese Informationen wurden für die Entwicklung mit Svelte 4 zusammengestellt.\
Da das Projekt inzwischen auf Svelte 5 umgestellt wurde, sind die Informationen u. U. teilweise nicht mehr aktuell.

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

### Install Flawbite

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

Um Daten von einer Datenbank in eine andere Datenbank zu bringen, z. B. von lokal nach remote, folgendermaßen vorgehen:

- Export aus pgadmin als CSV, Delimiter |
- Import via psql-Kommandos:

```bash
\copy pin FROM 'C:\Users\rloch\Downloads\postgres/Pin.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```
```bash
\copy player FROM 'C:\Users\rloch\Downloads\postgres/Player.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```
```bash
\copy tourney FROM 'C:\Users\rloch\Downloads\postgres/Tournament.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```
```bash
\copy round FROM 'C:\Users\rloch\Downloads\postgres/Round.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```
```bash
\copy match FROM 'C:\Users\rloch\Downloads\postgres/Match.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```

Dabei folgendes beachten:
- Als Delimiter immer ein Zeichen angeben, das in den Daten mit Sicherheit nicht benutzt wird. Am besten '|', auf keinen Fall ','.
- Als Quote ebenfalls ein Zeichen wählen, das in den Daten nicht vorkommt, z. B '^'.
- UTF8-Encoding verwenden, weil sonst Umlaute nicht korrekt importiert werden.
- Ggf. müssen die Spalten explizit in richtiger Reihenfolge angegeben werden, in Klammern direkt hinter dem Tabellennamen. In der csv-Datei kontrollieren.
- HEADER-Option verwenden, wenn die csv-Datei mit Header erstellt wurde.
- Tabellen- und Spaltennamen, die nicht vollständig lowercase sind, müssen immer in Anführungszeichen eingeschlossen werden.

## Datenformate

### Tabelle "Tournament"

#### Flipliga

`tournament.settings`
-    `baseline`:      Basispunkte für jeden Spieler zu Saisonbeginn
-    `challengeSame`: Wie oft darf der gleiche Gegner je Saison gefordert werden
-    `matchBonus`:    Bonuspunkt(e) für jedes absolvierte Match
-    `matchPenalty`:  Strafpunkt(e) für Fehlmatches pro Spieltag
-    `minMatches`:    Wie viele Matches muss ein Spieler pro Spieltag spielen?
-    `minRound`:      Ab welcher Runde erfolgen Punktabzüge?

### Tabelle "Round"

`round.settings.rankInit`
-    `bonus`:      Bonuspunkte zu Spieltagbeginn
-    `player`:     player ID
-    `points`:     Punkte zu Spieltagbeginn
-    `matches`:    Anzahl Matches zu Spieltagbeginn
-    `penalty`:    Strafpunkte zu Spieltagbeginn
-    `strength`:   Spielstärke zu Spieltagbeginn

`round.results.rankFinal`
-    `bonus`:      Bonuspunkte Gesamt nach Spieltag
-    `player`:     player ID,
-    `points`:     Gesamtpunkte nach Spieltag
-    `matches`:    Gesamtanzahl Matches nach Spieltag
-    `penalty`:    Strafpunkte Gesamt nach Spieltag
-    `rankChange`: Rangänderung nach Spieltag  