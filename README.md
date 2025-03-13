# Bidragskalkulator

Bidragskalkulatoren er et verktøy som hjelper deg å beregne barnebidrag.

Kalkulatoren er under aktiv utvikling, så det er ikke sikkert at alt fungerer som det skal.

## Deployments

Man deployer automatisk til dev-miljøet når man merger en pull request til main-branchen.

**Dev-miljøet finner du på https://bidragskalkulator-v2.ekstern.dev.nav.no/barnebidragskalkulator**

**Prod-miljøet finner du på https://www.nav.no/barnebidragskalkulator**

## Lokal utvikling

Installer avhengigheter:
```bash
npm install
```

Kopiér .env.example til .env og sett SERVER_URL til URLen du ønsker. Det kan være localhost:8080 om du vil koble til serveren lokalt.

```bash
cp .env.example .env
```

Kjør lokalt:

```bash
npm run dev
# Kjører på http://localhost:5173
```

### Server

For å kunne kalkulere lokalt, må du også kjøre serveren lokalt.
For å kjøre serveren lokalt, kan du følge instruksene her: https://github.com/navikt/bidrag-bidragskalkulator-api

<details>
<summary>Docker</summary>

Bygg et docker-image (husk å ha NODE_AUTH_TOKEN satt som miljøvariabel):

```bash
docker build --secret id=NODE_AUTH_TOKEN . -t bidragskalkulator
```

Kjør docker-containeren:

```bash
docker run -p 3000:3000 bidragskalkulator
```
</details>
