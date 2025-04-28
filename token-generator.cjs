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

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  const tokenUrl =
    "https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:bidrag:bidrag-bidragskalkulator-api";

  try {
    await page.goto(tokenUrl, { waitUntil: "networkidle2" });

    console.log("🔑 Vennligst logg inn via nettleseren som ble åpnet.");

    // Wait for the page that returns the JSON response with the token
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

    if (!token) {
      throw new Error("access_token ble ikke funnet i responsen");
    }

    await browser.close();

    // Write token to .env
    const envFile = ".env";
    const tokenEnvName = "BIDRAG_BIDRAGSKALKULATOR_TOKEN";
    const serverEnvName = "SERVER_URL";

    let envContent = fs.existsSync(envFile)
      ? fs.readFileSync(envFile, "utf8")
      : "";

    const setEnvVar = (content, key, value) => {
      const line = `${key}=${value}`;
      const regex = new RegExp(`^${key}=.*$`, "m");
      if (regex.test(content)) {
        return content.replace(regex, line);
      } else {
        return content.trim() + `\n${line}`;
      }
    };

    envContent = setEnvVar(envContent, tokenEnvName, token);

    // Prompt for backend environment
    console.log("\n📡 Hvilken backend-miljø vil du bruke?");
    console.log("1) lokalt");
    console.log("2) dev-miljøet");

    let serverUrl = "";
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

    envContent = setEnvVar(envContent, serverEnvName, serverUrl);

    fs.writeFileSync(envFile, envContent.trim() + "\n");

    console.log("✅ Token og Server-URL lagret i .env");
  } catch (err) {
    console.error("❌ Feil:", err.message);
  }
})();
