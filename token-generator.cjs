const fs = require("fs");
const readline = require("readline");

(async function kjør() {
  try {
    const { personident, valgtMiljo } = parseArgumenter();
    const serverUrl = await velgServerUrl(valgtMiljo);
    const token = await hentToken(personident, serverUrl);

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
  let valgtMiljo = null;

  if (!arg1) {
    // Interaktiv modus uten argumenter
  } else if (/^\d{11}$/.test(arg1) && !arg2) {
    personident = arg1; // kun PID, miljø velges manuelt
  } else if (/^\d{11}$/.test(arg1) && ["dev", "lokalt"].includes(arg2)) {
    personident = arg1;
    valgtMiljo = arg2;
  } else if (!/^\d{11}$/.test(arg1)) {
    console.error("❌ Må angi fødselsnummer som første argument (11 siffer).");
    process.exit(1);
  } else {
    console.error(
      "❌ Ugyldig eller manglende miljøargument. Bruk 'lokalt' eller 'dev'.",
    );
    process.exit(1);
  }

  return { personident, valgtMiljo };
}

async function hentToken(personident, serverUrl) {
  const url = `${serverUrl}/api/v1/mock-login?ident=${personident}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.token;
}

async function velgServerUrl(valgtMiljo) {
  if (valgtMiljo === "dev") {
    return "https://bidragskalkulator-api.intern.dev.nav.no";
  } else if (valgtMiljo === "lokalt") {
    return "http://localhost:8080";
  }

  console.log("\n📡 Det er 2 miljø du kan velge mellom: dev eller lokalt.");
  console.log("1) lokalt");
  console.log("2) dev-miljøet");

  while (true) {
    const choice = await spør("Velg 1 eller 2: ");
    if (choice === "1") {
      return "http://localhost:8080";
    } else if (choice === "2") {
      return "https://bidragskalkulator-api.intern.dev.nav.no";
    } else {
      console.log("❗ Ugyldig valg. Vennligst skriv 1 eller 2.");
    }
  }
}

function skrivTilEnvFil(token, serverUrl) {
  const envFile = ".env";
  const tokenEnvName = "BIDRAG_BIDRAGSKALKULATOR_TOKEN";
  const serverEnvName = "SERVER_URL";

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
  fs.writeFileSync(envFile, envContent.trim() + "\n");

  console.log("✅ Token og Server-URL lagret i .env");
}
