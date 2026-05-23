import { test, expect } from "@playwright/test";

test.describe("Prumo Public Pages Smoke Test", () => {
  test("should load home page and verify structural layout elements", async ({ page }) => {
    // Visita a página inicial
    await page.goto("/");

    // Verifica se a logo ou marca "Prumo" está visível no header
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Teste de Regressão Visual - Tira um screenshot da página inteira e compara com a referência
    // Isso garante que mudanças inesperadas de CSS/estilos não degradem a experiência visual definida em .prumo-brand
    await expect(page).toHaveScreenshot("home-page.png", {
      maxDiffPixelRatio: 0.05,
    });
  });

  test("should navigate to plans page and display plans info", async ({ page }) => {
    await page.goto("/planos");
    await expect(page.locator("h1")).toBeVisible();
  });
});
