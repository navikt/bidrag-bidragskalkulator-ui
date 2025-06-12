const fs = require("fs");
const readline = require("readline");
const Arg = require("arg");
const { input, select } = require("@inquirer/prompts");

(async function kjør() {
  try {
    const { ident, miljø } = await hentInput();
    const serverUrl = await velgServerUrl(miljø);
    const token = await hentTokenFraTokenX(ident);

    if (!token) {
      throw new Error("token ble ikke funnet i responsen");
    }

    oppdaterEnvFil(token, serverUrl);
  } catch (err) {
    console.error("❌ Feil:", err.message);
  }
})();

async function hentInput() {
  const arg = Arg({
    "--ident": String,
    "--miljø": String,
    "-i": "--ident",
    "-m": "--miljø",
    "-e": "--miljø",
  });

  let ident = arg["--ident"];
  if (!ident) {
    ident = await input({
      message: "Skriv inn fødselsnummer (11 siffer):",
      required: true,
      validate: (input) => {
        if (/^\d{11}$/.test(input)) {
          return true;
        }
        return "❌ Må angi gyldig fødselsnummer (11 siffer).";
      },
    });
  }

  let miljø = arg["--miljø"];
  if (!miljø || !["lokalt", "dev"].includes(miljø)) {
    miljø = await select({
      message: "Hvilken server vil du bruke?",
      choices: [
        { name: "Lokal server", value: "lokalt" },
        { name: "Dev-miljøet", value: "dev" },
      ],
    });
  }
  return { ident, miljø };
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

async function velgServerUrl(valgtMiljø) {
  if (valgtMiljø === "lokalt") {
    return "http://localhost:8080";
  } else {
    return "https://bidragskalkulator-api.intern.dev.nav.no";
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
