import { test } from "@playwright/test";
import { sjekkTilgjengelighet } from "./uu-utils";

test.describe("Smoke test", () => {
  test("Det initielle bildet er tilgjengelig utformet", async ({ page }) => {
    await page.goto("/barnebidrag/tjenester/kalkulator");
    await page.waitForSelector("body", { timeout: 10000 });

    await sjekkTilgjengelighet(page);
  });
});
