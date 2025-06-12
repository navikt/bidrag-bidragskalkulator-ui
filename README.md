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

**Dev-miljøet finner du på https://www.ekstern.dev.nav.no/barnebidrag/kalkulator/**

**Prod-miljøet finner du på https://www.nav.no/barnebidrag/kalkulator/**

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
npm run token:dev
```

## Testing

### End-to-End Testing

The application uses Playwright for end-to-end testing with comprehensive API mocking support.

#### Running Tests

```bash
# Run tests with real backend
npm run test:e2e

# Run tests with mocked backend
MOCK_BACKEND=true npm run test:e2e

# Run tests with debug output for mocks
MOCK_BACKEND=true DEBUG_MOCKS=true npm run test:e2e

# Run specific test file
MOCK_BACKEND=true npx playwright test beregning.spec.ts
```

#### API Mocking

When `MOCK_BACKEND=true` is set, all external API calls are automatically mocked using Playwright's built-in route interception. This provides:

- **Reliable testing**: No dependency on external services
- **Fast execution**: No network delays
- **Error simulation**: Test error conditions easily
- **Offline development**: Work without backend connectivity

For detailed mocking documentation, see [e2e/mocks/README.md](e2e/mocks/README.md).

**Example with custom mock data:**

```typescript
import { setupMocks, mockScenarios } from "./mocks";

test("high income calculation", async ({ page }) => {
  await setupMocks(page, {
    personinformasjon: { inntekt: 1500000 },
    bidragsutregning: {
      resultater: [
        {
          sum: 5000, // Higher amount
          bidragstype: "PLIKTIG",
        },
      ],
    },
  });

  await page.goto("/");
  // Test logic here
});

// Or use pre-defined scenarios
test("error handling", async ({ page }) => {
  await setupMocks(page, mockScenarios.calculationError);
  // Test error conditions
});
```

## Kjør lokalt

Du kan kjøre applikasjonen lokalt ved å bruke følgende kommando:

```bash
npm run dev
# Kjører på http://localhost:5173/barnebidrag/kalkulator/
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
