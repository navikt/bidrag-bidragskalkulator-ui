import { test } from "@playwright/test";
import { sjekkTilgjengelighet } from "./uu-utils";

test.skip("Smoke test", () => {
  // test.describe("Smoke test", () => {
  test("Det fungerer å gå til kalkulatoren", async ({ page }) => {
    await page.goto("/barnebidrag/tjenester/");

    await page.waitForSelector("body", { timeout: 10000 });

    await sjekkTilgjengelighet(page);
    await page.getByRole("link", { name: "Prøv den nye kalkulatoren" }).click();

    await sjekkTilgjengelighet(page);
  });
});
