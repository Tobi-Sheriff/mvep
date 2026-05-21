import { test, expect } from '@playwright/test';

test.describe('Vendor Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as vendor
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('vendor@mvep.dev');
    await page.getByPlaceholder('••••••••').fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/vendor/);
  });

  test('vendor dashboard page renders stat cards', async ({ page }) => {
    await page.goto('/vendor/dashboard');
    await expect(page.getByText(/total revenue/i)).toBeVisible({ timeout: 5000 });
  });

  test('products page renders the product table', async ({ page }) => {
    await page.goto('/vendor/products');
    // Wait for products to load
    await expect(page.getByText('Wireless Noise-Cancelling Headphones')).toBeVisible({ timeout: 5000 });
  });

  test('can open the Add Product modal', async ({ page }) => {
    await page.goto('/vendor/products');
    await page.getByRole('button', { name: /add product/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('can create a new product', async ({ page }) => {
    await page.goto('/vendor/products');
    await page.getByRole('button', { name: /add product/i }).click();
    await page.getByRole('dialog').getByLabel(/name/i).fill('E2E Test Product');
    await page.getByRole('dialog').getByLabel(/description/i).fill('A product created by E2E tests');
    await page.getByRole('dialog').getByLabel(/price/i).fill('9.99');
    await page.getByRole('dialog').getByLabel(/stock/i).fill('10');
    await page.getByRole('dialog').getByRole('button', { name: /save|create|add/i }).click();
    await expect(page.getByText('E2E Test Product')).toBeVisible({ timeout: 5000 });
  });

  test('orders page shows order list', async ({ page }) => {
    await page.goto('/vendor/orders');
    await expect(page.getByText(/orders/i).first()).toBeVisible();
  });

  test('analytics page renders the revenue chart section', async ({ page }) => {
    await page.goto('/vendor/analytics');
    await expect(page.getByText(/revenue/i).first()).toBeVisible({ timeout: 5000 });
  });
});
