import { expect, test } from "@playwright/test";
import { mockScenarios, setupMocks } from "./mocks";
import { sjekkTilgjengelighet } from "./uu-utils";

test.describe("Beregningstest", () => {
  test("En enkel beregning er tilgjengelig", async ({ page }) => {
    await setupMocks(page);

    await page.goto("/");
    await page.waitForSelector("body", { timeout: 10000 });

    await sjekkTilgjengelighet(page);

    await page.getByLabel("Hvor gammelt er barnet?").fill("4");
    await page
      .getByLabel("Vi har avtale om fast bosted hos begge (delt fast bosted)")
      .check();

    const dinHusstand = page.getByRole("group", { name: "Din husstand" });
    await dinHusstand.getByLabel("Nei").check();
    await dinHusstand.getByLabel("Antall barn som bor fast hos deg").fill("0");
    await dinHusstand
      .getByLabel("Antall barn med delt bosted hos deg")
      .fill("0");

    const medforelderensHusstand = page.getByRole("group", {
      name: "Medforelderens husstand",
    });
    await medforelderensHusstand.getByLabel("Nei").check();
    await medforelderensHusstand
      .getByLabel("Antall barn som bor fast hos den andre forelderen")
      .fill("0");
    await medforelderensHusstand
      .getByLabel("Antall barn med delt bosted hos den andre forelderen")
      .fill("0");

    await page.getByLabel("Hva er årsinntekten din?").fill("400000");
    await page
      .getByLabel("Hva er årsinntekten til den andre forelderen?")
      .fill("600000");

    await sjekkTilgjengelighet(page);

    await page.getByRole("button", { name: "Beregn barnebidrag" }).click();

    await expect(
      page.getByText("Du skal motta 700 kr i barnebidrag per måned."),
    ).toBeVisible();

    await sjekkTilgjengelighet(page);

    await page.getByRole("button", { name: "Vis mer" }).click();

    await sjekkTilgjengelighet(page);
  });

  test("Test with no children scenario", async ({ page }) => {
    // Test with no children using mock scenario
    await setupMocks(page, mockScenarios.noChildren);

    await page.goto("/med-barn");
    await page.waitForSelector("body", { timeout: 10000 });

    // Should show "no children" message
    await expect(page.getByText("Ingen barn")).toBeVisible();
  });

  test("Test calculation error handling", async ({ page }) => {
    // Test error scenario
    await setupMocks(page, mockScenarios.calculationError);

    await page.goto("/");
    await page.waitForSelector("body", { timeout: 10000 });

    // Fill in basic form data
    await page.getByLabel("Hvor gammelt er barnet?").fill("4");
    await page.getByLabel("Hva er årsinntekten din?").fill("400000");
    await page
      .getByLabel("Hva er årsinntekten til den andre forelderen?")
      .fill("600000");

    // Submit and expect error
    await page.getByRole("button", { name: "Beregn barnebidrag" }).click();
    await expect(page.getByText("Det oppstod en feil")).toBeVisible();
  });
});
