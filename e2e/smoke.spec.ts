import { test } from "@playwright/test";
import { setupMocks } from "./mocks";
import { sjekkTilgjengelighet } from "./uu-utils";

test.describe("Smoke test", () => {
  test("Det initielle bildet er tilgjengelig utformet", async ({ page }) => {
    await setupMocks(page);

    await page.goto("/");
    await page.waitForSelector("body", { timeout: 10000 });

    await sjekkTilgjengelighet(page);
  });
});
