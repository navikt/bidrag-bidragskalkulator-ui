import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Smoke test", () => {
  test("Det initielle bildet er tilgjengelig utformet", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("body", { timeout: 10000 });

    const tilgjengelighetsresultater = await new AxeBuilder({ page })
      .include("#maincontent")
      .analyze();

    if (tilgjengelighetsresultater.violations.length > 0) {
      console.error("🚫♿️ Fant UU-feil ♿️🚫");
      console.error(
        JSON.stringify(tilgjengelighetsresultater.violations, null, 2),
      );
    }

    expect(tilgjengelighetsresultater.violations).toEqual([]);
  });
});
