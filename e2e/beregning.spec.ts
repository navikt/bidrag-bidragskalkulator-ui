import { expect, test } from "@playwright/test";
import { sjekkTilgjengelighet } from "./uu-utils";

test.describe.skip("Beregningstest", () => {
  test("En enkel beregning er tilgjengelig", async ({ page }) => {
    await page.goto("/barnebidrag/tjenester/kalkulator");
    await page.waitForSelector("body", { timeout: 10000 });

    await sjekkTilgjengelighet(page);

    await page.getByLabel("Hvilket år er barnet født?").selectOption("2022");

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
      page.getByText(
        "Kalkulatoren foreslår at du mottar 760 kr i barnebidrag per måned",
      ),
    ).toBeVisible();

    await sjekkTilgjengelighet(page);

    const lesMerKnapper = await page
      .getByRole("button", { name: "Vis mer" })
      .all();

    lesMerKnapper.forEach((knapp) => knapp.click());

    await sjekkTilgjengelighet(page);
  });
});
