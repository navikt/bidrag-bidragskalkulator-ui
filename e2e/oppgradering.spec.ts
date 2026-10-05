import { expect, test } from "@playwright/test";

test("sider rendres med riktig tittel", async ({ page }) => {
  const respons = await page.goto("/barnebidrag/tjenester/");

  expect(respons?.status()).toBe(200);
  await expect(page).toHaveTitle("Barnebidragskalkulator");
  await expect(
    page.getByRole("heading", { name: "Barnebidragskalkulator", level: 1 }),
  ).toBeVisible();

  await page.goto("/barnebidrag/tjenester/privat-avtale");
  await expect(page).toHaveTitle("Veiledning");

  await page.goto("/barnebidrag/tjenester/privat-avtale/steg/om-deg");
  await expect(page).toHaveTitle("Om deg – Privat avtale om barnebidrag");
});
