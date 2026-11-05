# Besloten OBW O17-1 dashboard — voorbereiding

Deze branch is nog niet geactiveerd. Main blijft de huidige openbare versie totdat een Supabase-project, accounts, privévideo’s en productieconfiguratie samen zijn getest. Zonder configuratie sluit deze branch af: alleen de inlogpagina is beschikbaar.

## Benodigde koppeling

Verbind Supabase en Vercel. Inspecteer eerst bestaande projecten; maak geen betaald project of abonnement zonder opdracht. Stel NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in voor de bedoelde omgeving, via Vercel. Er is geen service-role sleutel nodig in deze app. Geen geheimen in chat, broncode of GitHub.

## Database en toegang

Voer supabase/migrations/20261105_private_team.sql eenmaal uit in een schoon, gecontroleerd project. Geen bestaande tabel/policy overschrijven. Zet publieke registratie en anonymous sign-ins uit. Maak individuele accounts aan via Auth-beheer; de app heeft geen registratieformulier. Voeg vervolgens auth.users.id toe aan app_members met role admin (trainer) of viewer en active=true. Alleen Auth-inloggen is onvoldoende: zonder actief lidmaatschap blijven dashboard, bestanden en API’s dicht. Verwijderen/deactiveren van app_members trekt toegang in bij de volgende aanvraag. Bestaande getekende videolinks lopen maximaal 5 minuten door.

Voorbeeld na aanmaken van de account (parameter veilig invullen in de databasebeheeromgeving):

```sql
insert into public.app_members(user_id,role) select id,'admin' from auth.users where id = '<UUID-van-de-beheerder>'::uuid;
```

Gebruik een persoonlijke account per ouder/speler. Wachtwoorden en herstel worden door Supabase verzorgd. Configureer een eigen SMTP-dienst voordat uitnodigingen/herstelmails naar ouders worden verstuurd. Die berichten zijn in deze voorbereiding niet verstuurd.

## Video’s

De bucket team-videos is privé en beperkt tot MP4 van maximaal 50 MiB. Alleen actieve leden mogen gepubliceerde video’s lezen. Er zijn geen browseruploadrechten. De beheerder uploadt via het dashboard van Supabase; published blijft false totdat de juiste versies zijn gecontroleerd. Gebruik de compacte SKV-v3 versie (28 MB). Maak voor Blauw Geel eerst een gecontroleerde export onder 50 MiB; de Full-HD-originelen zijn groter. Geen betaalde limietverhoging vereist in deze voorbereiding. Publiceer pas na uploadcontrole met het juiste storage_path en published=true. De app geeft na een servercontrole een videolink af die 5 minuten geldig is. De /watch-pagina opent in de eigen besloten omgeving en bevat een videospeler.

## Validatie vóór omschakelen

1. Test ontbrekende configuratie: /, /api/videos/id, /api/stand en foto-URL’s mogen geen teaminhoud retourneren.
2. Test vier identiteiten: anoniem, ingelogd zonder lidmaatschap, actief lid, gedeactiveerd lid. Controleer alle routes en directe Storage REST-verzoeken, inclusief public object-URL: die laatste mag nooit toegang geven.
3. Verifieer inloggen, verversen van sessies, uitloggen, vervallen cookie, herhaald fout wachtwoord (Supabase rate limits), RLS, caching en geen persoonsdata op de loginpagina.
4. Test beide echte video's: correct doelpunt SKV v3, geluid, speelduur, mobiel afspelen, seek/Range en opnieuw laden na verlopen link.
5. Accountgebonden lokale metadata voorkomt dat een ouder in dezelfde browser de lokale metadata van een andere account krijgt. Alleen admin kan bestaande lokale data uit de oude versie meenemen. Deze wijziging maakt observaties/metadata nog niet gedeeld in een database. Verwijderen van lokale media wist vooralsnog de browsermediaopslag als geheel; deze blijft lokaal.
6. Controleer eerdere openbare routes en deployments. De eerder goedgekeurde portretten en teamfoto staan ook in de openbare GitHub-repository en geschiedenis; een login verwijdert die eerdere openbaarmaking niet. De video’s komen daar nooit in. Nieuwe privéprofielen moeten naar privé-opslag. Publiceer de branch pas na de integratietests en gecontroleerde productieconfiguratie.

Lokale controle `python scripts/private-smoke.py` controleert de afgesloten toestand zonder backend en de Origin-controle op inloggen.

Geen echte Auth/Storage-integratietest is mogelijk zonder gekoppeld Supabase-project. Een succesvolle build bewijst deze toegangsregels niet. Geen accounts of videobestanden zijn door het schrijven van deze branch openbaar gemaakt of geüpload.
