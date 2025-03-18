# Bidragskalkulator

Bidragskalkulatoren er et verktøy som hjelper deg å beregne barnebidrag.

Kalkulatoren er under aktiv utvikling, så det er ikke sikkert at alt fungerer som det skal helt enda.

## Deployments

Man deployer automatisk til dev- og prod-miljøene når man merger en pull request til main-branchen.

**Dev-miljøet finner du på https://bidragskalkulator-v2.ekstern.dev.nav.no**

**Prod-miljøet finner du på https://barnebidragskalkulator.nav.no**

## Lokal utvikling

Installer avhengigheter:
```bash
npm install
```

Kopiér .env.example til .env.

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
<summary>Hvordan kjøre docker-containeren lokalt</summary>

Bygg et docker-image (husk å ha NODE_AUTH_TOKEN satt som miljøvariabel):

```bash
docker build --secret id=NODE_AUTH_TOKEN . -t bidragskalkulator
```

Kjør docker-containeren:

```bash
docker run -p 3000:3000 bidragskalkulator
```
</details>
