# flip4fun v1.1.0

Turnierverwaltung für Flipper-Ligen & Turniere. flip4fun unterstützt die Planung und Durchführung von Flipper-Ligen und TwinPin-Turnieren — von der Flipper-Auslosung über die Ergebniserfassung bis hin zur automatischen Rangliste und Urkundengenerierung.

**Tech Stack:** Svelte 5 • SvelteKit • Vite • Tailwind CSS • Flowbite • Prisma • PostgreSQL

---

# Infos für den Anwender

## Setup

### Erste Schritte

```bash
# Repository klonen
git clone https://github.com/reilo/flip4fun-svelte.git
cd flip4fun-svelte

# Abhängigkeiten installieren
npm install

# .env-Datei erstellen (siehe Umgebungsvariablen Abschnitt)
cp .env.example .env

# Entwicklungsserver starten
npm run dev
```

Die App ist dann verfügbar unter **http://localhost:5173**.

## Umgebungsvariablen

Folgende Konstanten können bzw. müssen in der Datei .env im Root-Verzeichnis dieser App gesetzt werden:
- **DATABASE_URL**: URL zur Postgres-Datenbank nach dem Format: `postgresql://<DB-Owner>:<DB-Passwort>@<server>:<port>/<DB-Name>`
- **VITE_ADMIN_PASSWORD**: Admin-Passwort
- **VITE_APP_FULL**: Wenn auf beliebigen Wert gesetzt, läuft die App mit voller Funktionalität, andernfalls im Readonly-Modus (für die Web-Version gedacht)
- **VITE_KEEP_ADMIN**: Wenn auf beliebigen Wert gesetzt, bleibt die App nach einmaligem Einloggen dauerhaft im Admin-Modus
- **VITE_INCLUDE_TEST**: Wenn auf beliebigen Wert gesetzt, werden auch Test-Turniere angezeigt

## Datenbank

### Umgebungen

#### Entwicklung (lokal)
- **Datenbank:** PostgreSQL lokal (`localhost`)
- **Adapter:** `adapter-auto` (in vite.config.js)
- **Starten:** `npm run dev` → **http://localhost:5173**
- **Anwendung:** Volle Funktionalität mit `VITE_APP_FULL` gesetzt

#### Spielbetrieb (lokal)
- **Datenbank:** PostgreSQL lokal (`localhost`)
- **Adapter:** `adapter-node` (muss manuell in vite.config.js umgestellt werden)
- **Starten:** `npm run build` gefolgt von `npm run preview` → **http://localhost:4173**
- **Service:** Registriert mit **nssm** (Service-Name: *isaramper*)

#### Web-Version (Vercel + NeonDB)
- **Datenbank:** PostgreSQL auf **NeonDB** (remote hosted)
- **Adapter:** `adapter-auto` (standard, für Vercel)
- **Deployment:** Automatisches Deployment über GitHub (Repository connected)
- **Daten:** Manuelle Synchronisation via CSV-Export/Import (siehe unten)

### Backup & Datensicherung

Es wird empfohlen, regelmäßig manuell ein Backup der Datenbank zu erstellen bzw. die Tabellen als CSV zu exportieren.
Insbesondere nach einem abgeschlossenen Spieltag sollte dies unbedingt durchgeführt werden.
Eine detaillierte Anleitung findet sich im Abschnitt "Daten exportieren / importieren" unten.

## Applikation starten

Siehe auch den Abschnitt "Setup" oben.

**Entwicklung:**
```bash
npm run dev
```
App unter **http://localhost:5173**

**Produktion (lokal):**
```bash
npm run build
npm run preview
```
App unter **http://localhost:4173**

Sollte die App nicht laufen, kann sie manuell im Verzeichnis `C:/flip4fun-svelte` durch `npm run preview` gestartet werden.

## Svelte Adapter

Im Repository ist der Svelte‑Adapter auf `adapter-auto` eingestellt. Diese Einstellung muss beibehalten werden, damit die unter Vercel gehostete Version korrekt funktioniert.

Auf dem System, auf dem das Projekt lokal im Spielbetrieb kompiliert wird, muss der Adapter auf `adapter-node` umgestellt werden (siehe auch Abschnitt "Umgebungen" oben).

# Infos für Entwickler

## Resourcen

- **Svelte:** https://svelte.dev/docs/svelte/overview
- **SvelteKit:** https://svelte.dev/docs/kit/introduction
- **Flowbite Svelte:** https://flowbite-svelte.com/docs/pages/introduction
- **Tailwind CSS:** https://tailwindcss.com/docs/styling-with-utility-classes
- **Markdown:** https://www.markdownguide.org/cheat-sheet/#overview

## NPM Scripts

```bash
npm run dev          # Entwicklungsserver mit HMR
npm run build        # Production Build
npm run preview      # Preview des Production Build
npm run lint         # Prettier & ESLint Check
npm run format       # Code automatisch formatieren
npm run test         # Vitest Tests ausführen
```

## Svelte 5 & SvelteKit

Das Projekt nutzt **Svelte 5** mit **SvelteKit**. Weitere Informationen in den Resourcen oben.

## Prisma

### Häufige Kommandos

**Datenbank-Schema mit der Datenbank synchronisieren:**
```bash
npx prisma db push
```

**Nach Schema-Änderung Migration erstellen:**
```bash
npx prisma migrate dev --name=<beschreibung>
```

**Prisma Client neu generieren:**
```bash
npx prisma generate
```

**Prisma Studio starten (Web-UI für Datenbankdaten):**
```bash
npx prisma studio
```
Empfohlen für Remote-Datenbanken. Für lokale Datenbanken wird pgAdmin bevorzugt.

## CSS & Komponenten

Das Projekt nutzt **Tailwind CSS** für Styling und **Flowbite Svelte** für vorgefertigte UI-Komponenten.

```bash
npm install tailwindcss flowbite flowbite-svelte
```

## Lokale PostgreSQL-Installation

1. PostgreSQL herunterladen: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
2. Installation abschließen, pgAdmin ist im Paket enthalten
3. Datenbank über pgAdmin erstellen
4. `DATABASE_URL` in .env setzen
5. Schema pushen:
   ```bash
   npx prisma db push
   ```

## Daten exportieren / importieren

Die unten angegebenen psql-Kommandos befinden sich auch im `psql`-Verzeichnis.

Um Daten von einer Datenbank in eine andere zu bringen (z.B. lokal ↔ remote via NeonDB):

**Export (Quellsystem):**
```bash
\copy (SELECT * FROM pin) to '..\pin.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
\copy (SELECT * FROM player) to '..\player.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
\copy (SELECT * FROM tourney) to '..\tourney.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
\copy (SELECT * FROM round) to '..\round.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
\copy (SELECT * FROM match) to '..\match.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
\copy (SELECT * FROM matchn) to '..\matchn.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
\copy (SELECT * FROM frame) to '..\frame.csv' WITH CSV DELIMITER '|' QUOTE '^' HEADER ENCODING 'UTF8'
```

**Hinweise:**
- Delimiter sollte ein Zeichen sein, das nicht in den Daten vorkommt (z.B. `|`, nicht `,`)
- Quote-Zeichen auch ungefährlich wählen (z.B. `^`)
- Immer UTF8-Encoding verwenden für korrekte Umlaute
- HEADER-Option verwenden

**Import (Zielsystem):**

Erst Tabellen leeren (optional):
```bash
DELETE FROM pin; DELETE FROM player; DELETE FROM tourney;
DELETE FROM round; DELETE FROM match; DELETE FROM matchn; DELETE FROM frame;
```

Dann importieren:
```bash
\copy pin FROM '..\pin.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
\copy player FROM '..\player.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
\copy tourney FROM '..\tourney.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
\copy round FROM '..\round.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
\copy match FROM '..\match.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
\copy matchn FROM '..\matchn.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
\copy frame FROM '..\frame.csv' DELIMITER '|' QUOTE '^' CSV HEADER ENCODING 'UTF8'
```

## Datenformate

### Tabelle "Tournament"

#### Flipliga

`tournament.settings`
- `baseline`: Basispunkte für jeden Spieler zu Saisonbeginn
- `challengeSame`: Wie oft darf der gleiche Gegner je Saison gefordert werden
- `matchBonus`: Bonuspunkt(e) für jedes absolvierte Match
- `matchPenalty`: Strafpunkt(e) für Fehlmatches pro Spieltag (neu)
- `showToast`: Toast-Benachrichtigungen nach Match-Eingabe anzeigen
- `minMatchesRound`: Wie viele Matches muss ein Spieler pro Spieltag spielen?
- `penaltyFirstRound`: Ab welcher Runde erfolgen Punktabzüge?

#### Flipfinal

`tournament.settings`
- `numFinalists`: Wieviele Spieler sollen in die Finalebene aufrücken
- `pinTypes`: Welche Art von Flipper sollen beim Double-Match gewählt werden (0 = beliebig, 1 = 1xDMD 1xEarly, 2 = mindestens 1xDMD)
- `maxStartBonus`: Wie hoch soll der maximale Startbonus sein

#### Twinpin

`tournament.settings`
- `allowBye`: Freilos erlauben bei 4n+1 Spielern

### Tabelle "Round"

`round.settings.rankInit`
- `bonus`: Bonuspunkte zu Spieltagbeginn
- `player`: player ID
- `points`: Punkte zu Spieltagbeginn
- `matches`: Anzahl Matches zu Spieltagbeginn
- `mismatch`: Anzahl der fehlenden Spiele
- `penalty`: Strafpunkte zu Spieltagbeginn
- `strength`: Spielstärke zu Spieltagbeginn

`round.results.rankFinal`
- `bonus`: Bonuspunkte Gesamt nach Spieltag
- `player`: player ID
- `points`: Gesamtpunkte nach Spieltag
- `matches`: Gesamtanzahl Matches nach Spieltag
- `mismatch`: Anzahl der fehlenden Spiele
- `penalty`: Strafpunkte Gesamt nach Spieltag
- `rankChange`: Rangänderung nach Spieltag
