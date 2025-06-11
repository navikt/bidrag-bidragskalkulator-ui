const fs = require("fs");
const readline = require("readline");

(async function kjør() {
  try {
    const { personident, valgtMiljø } = parseArgumenter();
    const serverUrl = await velgServerUrl(valgtMiljø);
    const token = await hentToken(personident, valgtMiljø);

    if (!token) {
      throw new Error("token ble ikke funnet i responsen");
    }

    skrivTilEnvFil(token, serverUrl);
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

async function hentToken(personident, valgtMiljø) {
  const serverUrl =
    valgtMiljø === "lokalt"
      ? "http://localhost:5173"
      : "https://www.ekstern.dev.nav.no";
  const url = `${serverUrl}/barnebidrag/kalkulator/api/internal/mock-login?ident=${personident}`;
  console.info("🔑 Henter token fra:", url);
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.token;
  } catch (err) {
    if (err.message.includes("fetch failed")) {
      console.error(
        "❌ Feil ved henting av token. Har du startet dev-serveren?",
      );
      throw err;
    }
    console.error("❌ Feil ved henting av token:", err.message);
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

function skrivTilEnvFil(token, serverUrl) {
  const envFile = ".env";
  const tokenEnvName = "BIDRAG_BIDRAGSKALKULATOR_TOKEN";
  const serverEnvName = "SERVER_URL";
  const enviromentEnvName = "ENVIRONMENT";

  let envContent = fs.existsSync(envFile)
    ? fs.readFileSync(envFile, "utf8")
    : "";

  const setEnvVar = (content, key, value) => {
    const line = `${key}=${value}`;
    const regex = new RegExp(`^${key}=.*$`, "m");
    return regex.test(content)
      ? content.replace(regex, line)
      : content.trim() + `\n${line}`;
  };

  envContent = setEnvVar(envContent, tokenEnvName, token);
  envContent = setEnvVar(envContent, serverEnvName, serverUrl);
  envContent = setEnvVar(envContent, enviromentEnvName, "local");
  fs.writeFileSync(envFile, envContent.trim() + "\n");

  console.log("✅ Token og Server-URL lagret i .env");
}
