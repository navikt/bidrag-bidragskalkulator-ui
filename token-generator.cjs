const puppeteer = require("puppeteer");
const fs = require("fs");
const readline = require("readline");

const ask = (query) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });

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

const isInteractive = !personident;
const tokenUrl =
  "https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:bidrag:bidrag-bidragskalkulator-api";

(async () => {
  const browser = await puppeteer.launch({
    headless: !isInteractive,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.goto(tokenUrl, { waitUntil: "networkidle2" });

    if (personident) {
      await page.waitForSelector('a[href="/authorize/testid2"]');
      await page.click('a[href="/authorize/testid2"]');

      await page.waitForSelector("#pid");
      await page.type("#pid", personident);

      await page.waitForFunction(
        () => document.querySelector("#pid").value.length === 11,
      );
      await page.click("#submit");
    } else {
      console.log("🔑 Vennligst logg inn via nettleseren som ble åpnet.");
    }

    await page.waitForFunction(
      () => {
        try {
          JSON.parse(document.body.innerText);
          return true;
        } catch {
          return false;
        }
      },
      { timeout: 60000 },
    );

    const responseJson = await page.evaluate(() =>
      JSON.parse(document.body.innerText),
    );
    const token = responseJson.access_token;
    if (!token) throw new Error("access_token ble ikke funnet i responsen");

    await browser.close();

    // Miljøvalg
    let serverUrl = "";
    const serverEnvName = "SERVER_URL";
    const tokenEnvName = "BIDRAG_BIDRAGSKALKULATOR_TOKEN";

    if (valgtMiljo === "dev") {
      serverUrl = "https://bidragskalkulator-api.intern.dev.nav.no";
    } else if (valgtMiljo === "lokalt") {
      serverUrl = "http://localhost:8080";
    } else {
      console.log("\n📡 Det er 2 miljø du kan velge mellom: dev eller lokalt.");
      console.log("1) lokalt");
      console.log("2) dev-miljøet");
      while (!serverUrl) {
        const choice = await ask("Velg 1 eller 2: ");
        if (choice === "1") {
          serverUrl = "http://localhost:8080";
        } else if (choice === "2") {
          serverUrl = "https://bidragskalkulator-api.intern.dev.nav.no";
        } else {
          console.log("❗ Ugyldig valg. Vennligst skriv 1 eller 2.");
        }
      }
    }

    // Skriv til .env
    const envFile = ".env";
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
  } catch (err) {
    await browser.close();
    console.error("❌ Feil:", err.message);
  }
})();
