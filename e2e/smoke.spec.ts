import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Smoke test", () => {
  test("Det initielle bildet er tilgjenglig utformet", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("body", { timeout: 10000 });

    const tilgjengelighetsresultater = await new AxeBuilder({ page })
      .exclude("#vite-plugin-checker-error-overlay") // Fjern vite-feiloverflaten
      .analyze();

    if (tilgjengelighetsresultater.violations.length > 0) {
      console.log("🚫♿️ Fant UU-feil ♿️🚫");
      console.log(
        JSON.stringify(tilgjengelighetsresultater.violations, null, 2),
      );
    }

    expect(tilgjengelighetsresultater.violations).toEqual([]);
  });
});
