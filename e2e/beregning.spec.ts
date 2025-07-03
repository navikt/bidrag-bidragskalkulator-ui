import { expect, test } from "@playwright/test";
import { sjekkTilgjengelighet } from "./uu-utils";

test.describe("Beregningstest", () => {
  test("En enkel beregning er tilgjengelig", async ({ page }) => {
    await page.goto("/barnebidrag/tjenester/kalkulator");
    await page.waitForSelector("body", { timeout: 10000 });

    await sjekkTilgjengelighet(page);

    await page.getByLabel("Hva heter medforelderen?").fill("Testforelder");
    await page.getByLabel("Hva heter medforelderen?").blur();

    await page.getByLabel("Hva heter barnet?").fill("Testperson");
    await page.getByLabel("Hva heter barnet?").blur();

    await page.getByLabel("Hvor gammel er Testperson?").fill("4");
    await page
      .getByLabel("Vi har avtale om fast bosted hos begge (delt fast bosted)")
      .check();
    await page.getByLabel("Kostnad for barnetilsyn").fill("1000");

    const dinHusstand = page.getByRole("group", { name: "Din husstand" });
    await dinHusstand.getByLabel("Nei").check();
    await dinHusstand.getByLabel("Antall barn som bor fast hos deg").fill("0");
    await dinHusstand
      .getByLabel("Antall barn med delt bosted hos deg")
      .fill("0");

    const medforelderensHusstand = page.getByRole("group", {
      name: "Testforelder sin husstand",
    });
    await medforelderensHusstand.getByLabel("Nei").check();
    await medforelderensHusstand
      .getByLabel("Antall barn som bor fast hos Testforelder")
      .fill("0");
    await medforelderensHusstand
      .getByLabel("Antall barn med delt bosted hos Testforelder")
      .fill("0");

    await page.getByLabel("Hva er årsinntekten din?").fill("400000");
    await page
      .getByLabel("Hva er årsinntekten til Testforelder?")
      .fill("600000");

    await sjekkTilgjengelighet(page);

    await page.getByRole("button", { name: "Beregn barnebidrag" }).click();

    await expect(
      page.getByText("Du skal motta 800 kr i barnebidrag per måned."),
    ).toBeVisible();

    await sjekkTilgjengelighet(page);

    const lesMerKnapper = await page
      .getByRole("button", { name: "Vis mer" })
      .all();

    lesMerKnapper.forEach((value) => value.click());

    await sjekkTilgjengelighet(page);
  });
});
