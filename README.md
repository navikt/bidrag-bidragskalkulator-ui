# Bidragskalkulator

Bidragskalkulatoren er et verktøy som hjelper deg å beregne barnebidrag.

Kalkulatoren er under aktiv utvikling, så det er ikke sikkert at alt fungerer som det skal helt enda.

## Deployments

Man deployer manuelt til dev- og prod-miljøene ved behov.

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

**Dev-miljøet finner du på https://www.ekstern.dev.nav.no/barnebidrag/tjenester/**

**Prod-miljøet finner du på https://www.nav.no/barnebidrag/tjenester/**

## Lokal utvikling

For å installere npm pakker med @navikt-scope trenger du en `.npmrc`-fil med følgende:

```
//npm.pkg.github.com/:_authToken=TOKEN
@navikt:registry=https://npm.pkg.github.com
```

Token genererer du under [developer settings på Github](https://github.com/settings/tokens). Den trenger kun `read:packages`. Husk å enable SSO for navikt-orgen!

Installer avhengigheter:

```bash
npm install
```

Kopiér .env.example til .env.

```bash
cp .env.example .env
```

### Generer token og sette nødvendige miljøvariabler

Genererer token og setter nødvendige miljøvariabler basert på om applikasjonen skal kjøres mot lokal backend eller mot dev-miljøet.

Hvis du vil bli spurt om personident og miljø, kan du kjøre:

```bash
npm run token
```

Du kan også automatisere dette ved å sende inn personident og miljø som argumenter:

```bash
npm run token -- --ident personident --miljø miljø
# Eller
npm run token -- -i personident -m miljø
```

For eksempel

```bash
npm run token --ident 11528433741 --miljø dev
```

Om hvilken testperson du bruker ikke er så viktig, kan du bruke disse to scriptene for å generere tokens mot henholdsvis lokal server og dev-miljøet:

```bash
npm run token:local
```

eller

```bash
npm run token:dev
```

## Testing

### Ende-til-ende testing

Bidragskalkulatoren har oppsett for ende-til-ende testing med Playwright, med og uten mocking av backenden.

Mocking av backenden er i stor grad satt opp for å kunne kjøre testene i Github Actions, som en del av PR review-prosessen.

Målet med disse testene er i stor grad å verifisere at de viktigste funksjonene i applikasjonen fungerer som forventet, og at det ikke er noen regresjoner ved endringer i koden. Dette gjelder spesielt med tanke på universell utforming og tilgjengelighet.

Det anbefales å kjøre testene lokalt (mot dev-server, eller mot lokal server) før du lager en PR, for å sikre at alt fungerer som forventet. I PRen vil man kjøre testene med mocking av backenden.

#### Kjøring av tester

```bash
# Kjør tester mot dev-miljøet (da trenger du en gyldig token)
npm run token:dev
npm run test:e2e

# Kjør tester med mocking av backenden
npm run test:e2e:mock
```

## Kjør lokalt

Du kan kjøre applikasjonen lokalt ved å bruke følgende kommando:

```bash
npm run dev
# Kjører på http://localhost:5173/barnebidrag/tjenester/
```

Det er også mulig å bruke et skript for å først generere token (for samme testperson som er brukt i `token:local` og `token:dev`) og så kjøre applikasjonen:

```bash
npm run start:local
```

eller

```bash
npm run start:dev
```

### Kjøre backend lokalt

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
