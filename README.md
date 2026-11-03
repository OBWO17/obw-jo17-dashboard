# OBW JO17-1 · Teamdashboard 2026–2027

Werkende fase 1 met Next.js, TypeScript en Tailwind CSS. Gebruik Node.js 24 en npm 11.

## Lokaal starten

```sh
npm ci
npm run dev
```

De applicatie draait op poort 3000. Controleer met `npm run build` en `npm run typecheck`. Productiestart: `npm run start` na een geslaagde build.

## Wat werkt

- Responsief dashboard met de aangeleverde fase-1-balans: 4 gewonnen, 1 gelijk, 0 verloren. Geen verzonnen wedstrijdscores.
- Wedstrijden toevoegen, bekijken en verwijderen met datum, tegenstander, locatie, eindstand, observaties en optionele VEO-link.
- Spelers toevoegen en verwijderen, positie/rugnummer vastleggen en ontwikkeldoelen aanpassen.
- Videobibliotheek met toegestane HTTPS-links, type en bevestiging van gebruikstoestemming.
- Bewaren in localStorage, JSON-export en expliciet bevestigde verwijdering.
- Apart herkenbaar demovoorbeeld bij Instellingen.

## Grenzen van deze versie

Alle invoer blijft in de huidige browser en is niet versleuteld of beveiligd met accounts. Gebruik uitsluitend demogegevens. Browseropslag kan verloren gaan; exporteer een back-up. Het JSON-bestand is alleen een export, geen importformaat in de UI. Er zijn geen cloudservices of betaalde diensten ingeschakeld.

Rollen/authenticatie, Supabase-database met RLS en private videobuckets, gedetailleerde wedstrijdstatistieken, uploads, FFmpeg-wachtrij en AI-analyse zijn nog niet geïmplementeerd. Knoppen naar de werkruimtes voeren geen AI- of videoanalyse uit. De bekende fase-1-balans staat los van lokaal ingevoerde wedstrijden om dubbeltelling te vermijden.

## Vervolg en publicatie

Fase 2 vereist een Supabase-project en beveiliging op databaseniveau voordat echte jeugdspelersgegevens worden gebruikt. Koppel accounts via de beveiligde omgevingsinstellingen, nooit wachtwoorden in chat of Git. Verifieer roltoegang met aparte trainer-, staf- en speleraccounts. Voeg bewaartermijnen, toestemmingsregistratie en verwijdering toe.

Voor een technische demo kan deze Next.js-repository in Vercel worden geïmporteerd (framework Next.js, standaard build `npm run build`). Een publieke demo beschermt browsergegevens niet met accounts: voer geen echte persoonsgegevens of vertrouwelijke links in. Publiceer wedstrijdbeelden nooit automatisch. Betaalde diensten alleen na toestemming.

Fase 3 begint met onderzoek in officiële VEO-documentatie naar exports, Match Reports, events/tijdcodes, downloads, spelersstatistieken, API-toegang en Coach Assist. Er is nog geen officiële integratie onderzocht of gekoppeld; de huidige route is handmatige invoer en een externe VEO-link. Geen VEO-wachtwoorden opslaan of ongedocumenteerde endpoints gebruiken.

Fase 4: afzonderlijke FFmpeg-worker met wachtrij, MP4-upload en handmatige tijdcodes, conceptbewerking en expliciete definitieve montage. Pas daarna AI-selectie toevoegen; label handmatige, VEO- en werkelijk gedetecteerde events afzonderlijk.

## Functionele browsertest

Start de productieversie met `npm run start -- --port 3001` na de build. Voer in een tweede terminal `npm run test:smoke` uit. De test gebruikt Playwright met `/usr/bin/chromium`; stel `CHROMIUM_PATH` in als Chromium elders staat. `SMOKE_URL` overschrijft het standaard testadres. De test controleert wedstrijden, spelers, ontwikkeldoelen, persistentie na herladen, videolinks, JSON-export, wissen, mobiele navigatie en horizontale overflow. De test gebruikt een geïsoleerde browsercontext en uitsluitend demogegevens.

De npm-scripts gebruiken Webpack vanwege beperkte workerpoorten in de cloudomgeving. Laat dev-server en productiebuild achtereenvolgens draaien; beide gebruiken `.next`.


## Videomontage (browser)

Open Videomontage, download je toegestane VEO-opname via Download full game en selecteer het MP4-bestand. De bron blijft lokaal: geen upload, API, accountkoppeling of cloudopslag. ZIP-clips moeten eerst worden uitgepakt. Kies begin/einde in m:ss, voeg fragmenten toe en controleer hun volgorde. Richtduur is 180 seconden; de export gebruikt de werkelijk geselecteerde lengte (maximaal 600 seconden).

De browser monteert handmatig gekozen fragmenten in realtime met Canvas, Web Audio en MediaRecorder. Chrome/Edge op desktop worden aanbevolen. Export is WebM (geen MP4), maximaal 1280 pixels breed, met bronaudio indien aanwezig en een OBW-tekstbalk. Houd het tabblad zichtbaar tijdens export. Annuleren levert geen gedeeltelijk bestand. Download de montage vóór verlaten of herladen; video en selecties worden niet blijvend opgeslagen. Automatische AI-selectie, rechtstreekse VEO-sync en gedeelde online videobewaring zijn niet aanwezig.
