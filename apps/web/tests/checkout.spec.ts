import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Checkout flow passes accessibility and completes', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Test Ürün');
  await page.click('button:has-text("Sepete Ekle")');
  await page.goto('/cart');
  await page.click('text=Ödemeye Geç');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toHaveLength(0);

  await page.fill('input[name="card-number"]', '4242424242424242');
  await page.click('button:has-text("Öde")');
  await expect(page).toHaveURL('/order/success');
});
