# OBW O17-1 · Teamdashboard 2026–2027

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


## Selectie, wedstrijden en samenvattingen

De voorbereide uitbreiding vult bij een lege selectie de 16 aangeleverde spelers met naam en rugnummer in, plus de wedstrijden SKV–OBW en OBW–Blauw Geel. Publicatie van deze gegevens is door de gebruiker toegestaan. Er zijn geen VEO-opnamelinks opgenomen. Bestaande invoer blijft behouden. Posities blijven leeg totdat de trainer ze invult. SKV staat als officiële eindstand 2–1; alleen de eerste helft is opgenomen. In formulieren wordt de score altijd als OBW–tegenstander ingevoerd; bij uitwedstrijden wordt de weergave omgedraaid.

Spelers en wedstrijden zijn te bewerken. De videobibliotheek koppelt HTTPS-links en lokale MP4/WebM/MOV-bestanden (maximaal 250 MB) aan een wedstrijd. Lokale bestanden worden in IndexedDB bewaard en zijn af te spelen, te downloaden en waar ondersteund via het deelmenu te delen. Browserondersteuning voor MOV verschilt. Een lokaal bestand wordt niet naar Vercel geüpload en verschijnt niet op een ander apparaat. Voor delen met ouders gebruik je een videobestand als bijlage of een gedeelde HTTPS-link. Er is geen automatische VEO-import of online bestandsopslag.

JSON-export bevat alleen metadata, geen videobestanden. Download die apart. Het wissen van lokale gegevens verwijdert de metadata en lokale videobestanden. Er zijn nog geen accounts of rollen. Gebruik geen contactgegevens, medische informatie of vertrouwelijke beoordelingen.

## Competitiegegevens 2026–2027

De competitiepagina bevat een handmatig gecontroleerde momentopname van 4 november 2026 uit de openbare OBW-pagina’s: https://www.obw.nl/857/5039/competitie/ (fase 1) en https://www.obw.nl/857/5276/competitie/ (fase 2). Er is geen Voetbal.nl-accountkoppeling of automatische synchronisatie. Beide ranglijsten, zeven uitslagen en vijf geplande wedstrijden zijn opgenomen. Starttijden worden alleen weergegeven waar opgehaald. SKV 2–1 OBW is de officiële eindstand; het beperkte videomateriaal blijft apart vermeld.

Migratie naar setupVersion 2 voegt officiële wedstrijden eenmalig toe en werkt score, fase en programma bij, met behoud van bestaande wedstrijd-ID’s, observaties, VEO-links en videokoppelingen. Spelers en videobestanden blijven behouden.

## Stand verversen, oefenwedstrijden en topscorers

Fase 1 is duidelijk gemarkeerd als afgerond met definitieve eindstand. Fase 2 ververst bij openen van Competitie en vervolgens iedere vijf minuten vanuit de openbare OBW-stand. `/api/stand` controleert het bronformaat en de poule; bij een fout blijven de laatst bekende cijfers staan met een melding. De bron kan vertraagd zijn. Programma en uitslagen blijven een gedateerde momentopname. De servercache is maximaal vijf minuten.

Oefenwedstrijden Angerlo–OBW (25 augustus 2026, 3–1, Daan eenmaal) en DOVO O17-3–OBW (17 oktober 2026, 2–0) worden eenmalig toegevoegd. Topscorers telt uitsluitend geregistreerde makers en laat zien hoeveel doelpunten nog geen maker hebben. Je kunt per wedstrijd makers aanvullen; het totaal mag de OBW-score niet overschrijden. Filters scheiden competitie, fases en oefenwedstrijden. Er is nog geen automatische import van afgeschermde Voetbal.nl-verslagen.

## Bevestigde doelpuntenmakers

De zeven aangeleverde screenshots uit Voetbal.nl zijn verwerkt: 17 competitiedoelpunten (14 in fase 1 en 3 in fase 2). Daan scoorde daarnaast het reeds opgegeven oefendoelpunt. De import gebruikt bestaande speler-ID’s en voornamen; overige profielgegevens en screenshots worden niet gepubliceerd. Migratie 4 vult alleen de doelpuntenmakers van de bijbehorende wedstrijden aan, met behoud van observaties, videolinks en wedstrijd-ID’s. Gele kaarten uit het SKV-verslag zijn niet als doelpunten verwerkt.

## Seizoensoverzicht en spelersfoto’s

Het overzicht toont resultaten per fase, berekend uit de geregistreerde competitiewedstrijden met een eindstand. Fase 3 is alvast zichtbaar en vult zich bij invoer van wedstrijden met fase 3; oefenwedstrijden en ruststanden tellen niet mee.

Op iedere spelerskaart kan een trainer lokaal een JPG/PNG/WebP-foto (maximaal 8 MB) toevoegen, vervangen of verwijderen. Foto’s worden als bestanden in dezelfde IndexedDB-opslag als video’s bewaard. Er is geen upload naar Vercel of GitHub en geen synchronisatie tussen apparaten. JSON-back-ups bevatten de fotobestanden niet. Bewaar de originelen.

## Portretten, staf en sponsoren

Publicatie van de 18 aangeleverde portretten is expliciet toegestaan: 15 spelers en 3 stafleden (Jos Boonman trainer / coach; Ralph en René trainers). De geoptimaliseerde WebP-bestanden in public/portraits zijn openbaar, evenals de bronrepository. Koppelingen volgen bestandsnamen en bestaande speler-ID’s. Coen Schut (#25) heeft nog geen portret. Lokale vervangingen blijven in IndexedDB; verwijderen herstelt het standaardportret. Staf is zichtbaar op een eigen pagina.

Sponsoren bevat Slagman en Scheers Logistics, ook onderaan Overzicht. Logo’s komen van de officiële bronnen https://www.slagmangroep.nl/templates/img/CMYK_Logo_Slagman_Payoff.svg en https://www.scheerslogistics.nl/img/logo-scheerslogistics.svg en worden lokaal geserveerd. Iedere kaart linkt naar de bedrijfswebsite.

## Overzicht met ranglijsten

Sponsoren staan als compacte logobalk boven de laatste en komende wedstrijd. Spelers in ontwikkeling is uit het overzicht verwijderd; spelersbeheer blijft beschikbaar. Elk faseblok bevat naast de eigen resultaten de positie en ranglijst (G, P, doelsaldo), met OBW gemarkeerd. Fase 1 gebruikt de definitieve eindstand; fase 2 probeert dezelfde /api/stand-bron bij openen en iedere vijf minuten te verversen. Bij bronfouten blijft de gedateerde momentopname zichtbaar met foutstatus en bronlink. Fase 3 toont nog geen verzonnen indeling of stand.

Bovenaan Overzicht staan snelkoppelingen naar https://app.veo.co/ en https://www.voetbal.nl/. Beide openen in een nieuw tabblad. Ze verwijzen naar de algemene platformomgeving (teamkeuze na eventueel inloggen), zonder accountgegevens of automatische koppeling.

## Selectie en samenvattingen

De blauwe seizoensbalk begint Overzicht; de sponsorstrook staat onderaan en de sponsorlogo’s bij de teamfoto blijven staan. De fototitel is Selectie OBW O17-1. De selectiepagina toont onder de spelers ook alle stafleden. Samenvattingen vervangt de trainersacties en verwijst naar de bestaande native ChatGPT-bestanden OBW-Blauw-Geel-1080p-wedstrijdklok.mp4 (versie 3) en SKV-OBW-eerste-helft-1080p-v3.mp4 (actuele versie 2). Dit zijn accountgebonden links, geen openbare videohosting of gedeelde ouderlinks. Geen videobestanden of tijdelijke download-URL’s worden gepubliceerd.

## Wedstrijdkaarten en videoposters

De laatste en komende wedstrijd gebruiken automatisch de kaartopmaak met thuis/uit-volgorde, clublogo's en uitslag of aanvang. Bekende logo's: OBW (bestaand logo), DCS (https://www.svdcs.nl/wp-content/uploads/svdcs/2017/08/log-512.jpg), Blauw Geel '55 (logo uit de eigen clubwebshop: https://blauwgeel55.clubwereld.nl/media/cache/my_logo_filter/uploads/avatar/8e243d5ca306f7194e4680e55dd84b59.jpeg). Onbekende of ontbrekende logo's hebben een afkorting als terugval.

Videokaarten bevatten de teams en de officiële eindstand. De gebruiker heeft afzonderlijk toestemming gegeven voor openbare publicatie van de twee stilstaande videobeelden op de website en in GitHub. De posters komen van 18 seconden uit de laatste aangeleverde montages. SKV is expliciet alleen eerste helft; 2–1 is de eindstand van de hele wedstrijd. De zichtbare score in het beeld is de tussenstand op dat moment. De bestaande ChatGPT-videolinks blijven accountgebonden zolang de privé-opslag niet gekoppeld is. De voorbereiding voor besloten toegang staat apart in feature/private-team-access; main is nog openbaar. Er is nog geen automatische Club.Dataservice-synchronisatie; een wijziging van een opgeslagen wedstrijd wordt wel automatisch met de juiste kaartopmaak getoond.
