import { expect, test } from "@playwright/test";
import { sjekkTilgjengelighet } from "./uu-utils";

test.describe("Beregningstest", () => {
  test("En enkel beregning er tilgjengelig", async ({ page }) => {
    await page.goto("/barnebidrag/tjenester/kalkulator");
    await page.waitForSelector("body", { timeout: 10000 });

    await sjekkTilgjengelighet(page);

    await page.getByLabel("Hvor gammelt er barnet?").fill("4");
    await page
      .getByLabel("Vi har avtale om fast bosted hos begge (delt fast bosted)")
      .check();
    await page
      .getByLabel("Hva koster barnepass for barnet per måned?")
      .fill("1000");

    const dinHusstand = page.getByRole("group", { name: "Din bosituasjon" });
    const dinHusstandBorMedAnnenVoksen = page.getByRole("group", {
      name: "Bor du med en annen voksen?",
    });
    await dinHusstandBorMedAnnenVoksen.getByLabel("Nei").check();

    const dinHusstandBorMedAndreBarn = page.getByRole("group", {
      name: "Bor du med andre barn enn de som er nevnt over?",
    });
    await dinHusstandBorMedAndreBarn.getByLabel("Ja").check();

    await dinHusstand.getByLabel("Antall barn som bor fast hos deg").fill("0");
    await dinHusstand
      .getByLabel("Antall barn med delt bosted hos deg")
      .fill("0");

    const medforelderensHusstand = page.getByRole("group", {
      name: "Den andre forelderen sin bosituasjon",
    });
    const medforelderensHusstandBorMedAnnenVoksen = page.getByRole("group", {
      name: "Bor den andre forelderen med en annen voksen?",
    });
    await medforelderensHusstandBorMedAnnenVoksen.getByLabel("Nei").check();

    const medforelderensHusstandBorMedAndreBarn = page.getByRole("group", {
      name: "Bor den andre forelderen med andre barn enn de som er nevnt over?",
    });
    await medforelderensHusstandBorMedAndreBarn.getByLabel("Ja").check();
    await medforelderensHusstand
      .getByLabel("Antall barn som bor fast hos den andre forelderen")
      .fill("0");
    await medforelderensHusstand
      .getByLabel("Antall barn med delt bosted hos den andre forelderen")
      .fill("0");

    await page
      .getByLabel("Hva har du hatt i inntekt de siste 12 månedene?")
      .fill("400000");
    await page
      .getByLabel(
        "Hva har den andre forelderen hatt i inntekt de siste 12 månedene?",
      )
      .fill("600000");

    await sjekkTilgjengelighet(page);

    await page.getByRole("button", { name: "Beregn barnebidraget" }).click();

    await expect(
      page.getByText("Du skal motta 800 kr i barnebidrag per måned"),
    ).toBeVisible();

    await sjekkTilgjengelighet(page);

    const lesMerKnapper = await page
      .getByRole("button", { name: "Vis mer" })
      .all();

    lesMerKnapper.forEach((value) => value.click());

    await sjekkTilgjengelighet(page);
  });
});
