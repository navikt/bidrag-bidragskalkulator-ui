const fs = require("fs");
const readline = require("readline");

(async function kjør() {
  try {
    const { personident, valgtMiljø } = parseArgumenter();
    const serverUrl = await velgServerUrl(valgtMiljø);
    const token = await hentTokenFraTokenX(personident);

    if (!token) {
      throw new Error("token ble ikke funnet i responsen");
    }

    oppdaterEnvFil(token, serverUrl);
  } catch (err) {
    console.error("❌ Feil:", err.message);
  }
})();

function spør(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function parseArgumenter() {
  const [, , arg1, arg2] = process.argv;
  let personident = null;
  let valgtMiljø = null;

  if (!arg1) {
    // Interaktiv modus uten argumenter
  } else if (/^\d{11}$/.test(arg1) && !arg2) {
    personident = arg1; // kun PID, miljø velges manuelt
  } else if (/^\d{11}$/.test(arg1) && ["dev", "lokalt"].includes(arg2)) {
    personident = arg1;
    valgtMiljø = arg2;
  } else if (!/^\d{11}$/.test(arg1)) {
    console.error("❌ Må angi fødselsnummer som første argument (11 siffer).");
    process.exit(1);
  } else {
    console.error(
      "❌ Ugyldig eller manglende miljøargument. Bruk 'lokalt' eller 'dev'.",
    );
    process.exit(1);
  }

  return { personident, valgtMiljø };
}

async function hentTokenFraTokenX(personident) {
  const url = "https://tokenx-token-generator.intern.dev.nav.no/api/public/obo";
  const formData = new FormData();
  formData.append("pid", personident);
  formData.append("aud", "dev-gcp:bidrag:bidrag-bidragskalkulator-api");
  console.info("🔑 Henter token fra TokenX");
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  } catch (err) {
    console.error("❌ Feil ved henting av token fra TokenX:", err.message);
    return null;
  }
}

async function velgServerUrl(valgtMiljo) {
  const LOKAL_URL = "http://localhost:8080";
  const DEV_URL = "https://bidragskalkulator-api.intern.dev.nav.no";

  if (valgtMiljo === "dev") {
    return DEV_URL;
  } else if (valgtMiljo === "lokalt") {
    return LOKAL_URL;
  }

  console.log("\n📡 Det er 2 miljø du kan velge mellom: dev eller lokalt.");
  console.log("1) lokalt");
  console.log("2) dev-miljøet");

  while (true) {
    const choice = await spør("Velg 1 eller 2: ");
    if (choice === "1") {
      return LOKAL_URL;
    } else if (choice === "2") {
      return DEV_URL;
    } else {
      console.log("❗ Ugyldig valg. Vennligst skriv 1 eller 2.");
    }
  }
}

function oppdaterEnvFil(token, serverUrl) {
  const envs = parseEnvFil();
  envs.BIDRAG_BIDRAGSKALKULATOR_TOKEN = token;
  envs.SERVER_URL = serverUrl;
  envs.ENVIRONMENT = "local";

  skrivEnvFil(envs);
  console.log("✅ Token og Server-URL lagret i .env");
}

function parseEnvFil() {
  if (!fs.existsSync(".env")) {
    return {};
  }

  const envContent = fs.readFileSync(".env", "utf8");
  const envVars = {};

  envContent.split("\n").forEach((line) => {
    line = line.trim();

    // Hopp over tomme linjer og kommentarer
    if (!line || line.startsWith("#")) {
      return;
    }

    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) {
      return;
    }

    const key = line.substring(0, equalsIndex).trim();
    let value = line.substring(equalsIndex + 1).trim();

    // Fjern quotes hvis de finnes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    envVars[key] = value;
  });

  return envVars;
}

function skrivEnvFil(envVars) {
  const envLines = Object.entries(envVars).map(([key, value]) => {
    // Legg til quotes hvis verdien inneholder mellomrom eller spesialtegn
    const needsQuotes = /[\s#=]/.test(value);
    const quotedValue = needsQuotes ? `"${value}"` : value;
    return `${key}=${quotedValue}`;
  });

  const envContent = envLines.join("\n") + "\n";
  fs.writeFileSync(".env", envContent);
}
