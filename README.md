# Bidragskalkulator

Bidragskalkulatoren er et verktøy som hjelper deg å beregne barnebidrag.

Kalkulatoren er under aktiv utvikling, så det er ikke sikkert at alt fungerer som det skal helt enda.

## Deployments

Man deployer automatisk til dev- og prod-miljøene når man merger en pull request til main-branchen.

### Manuell deploy til dev

For å deploye en spesifikk branch til dev-miljøet:
1. Gå til "Actions" i GitHub
2. Velg "Manuell deploy til dev" fra workflows-listen
3. Klikk "Run workflow"
4. Velg branchen du vil deploye
5. Klikk "Run workflow"

### Deploy til prod

Man kan deploye direkte til prod ved å lage en ny release i GitHub:
1. Gå til "Releases" i GitHub
2. Klikk på "Create a new release"
3. Velg en tag (f.eks. v1.2.3)
4. Skriv en tittel og beskrivelse av endringene
5. Klikk "Publish release"

Når releasen er publisert, vil applikasjonen automatisk deployes til prod-miljøet.

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
