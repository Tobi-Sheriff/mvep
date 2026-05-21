import { test, expect } from '@playwright/test';

test.describe('Customer Storefront', () => {
  test('storefront loads and displays products without login', async ({ page }) => {
    await page.goto('/store');
    await expect(page.getByText('Wireless Noise-Cancelling Headphones')).toBeVisible({ timeout: 5000 });
  });

  test('search filters products in real time', async ({ page }) => {
    await page.goto('/store');
    await page.waitForSelector('text=Wireless Noise-Cancelling Headphones');
    await page.getByRole('searchbox').fill('keyboard');
    await expect(page.getByText('Mechanical Keyboard')).toBeVisible({ timeout: 3000 });
    await expect(page.queryByText('Running Shoes Pro')).not.toBeAttached();
  });

  test('product detail page renders name and add-to-cart button', async ({ page }) => {
    await page.goto('/store');
    await page.waitForSelector('text=Wireless Noise-Cancelling Headphones');
    await page.getByText('Wireless Noise-Cancelling Headphones').click();
    await page.waitForURL(/\/store\/product\//);
    await expect(page.getByText('Wireless Noise-Cancelling Headphones')).toBeVisible();
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
  });

  test.describe('authenticated customer', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.getByPlaceholder('you@example.com').fill('customer@mvep.dev');
      await page.getByPlaceholder('••••••••').fill('password');
      await page.getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/store/);
    });

    test('can add a product to the cart', async ({ page }) => {
      await page.goto('/store');
      await page.waitForSelector('text=Mechanical Keyboard');
      // Click Add to Cart on any product card
      await page.getByRole('button', { name: /add to cart/i }).first().click();
      // Cart badge should show 1
      await expect(page.getByLabel(/cart.*1 item/i)).toBeVisible({ timeout: 3000 });
    });

    test('cart page shows added items', async ({ page }) => {
      // Add item from product detail
      await page.goto('/store/product/p1');
      await page.getByRole('button', { name: /add to cart/i }).click();
      await page.goto('/store/cart');
      await expect(page.getByText('Wireless Noise-Cancelling Headphones')).toBeVisible();
    });

    test('checkout wizard progresses through all steps', async ({ page }) => {
      // Seed cart via localStorage to skip the add-to-cart step
      await page.evaluate(() => {
        localStorage.setItem(
          'mvep_cart',
          JSON.stringify([{ productId: 'p2', name: 'Mechanical Keyboard', price: 129.99, image: '', quantity: 1 }]),
        );
      });
      await page.goto('/store/checkout');
      // Step 1 — Address
      await expect(page.getByText(/address/i).first()).toBeVisible();
      await page.getByLabel(/street/i).fill('123 Test Street');
      await page.getByLabel(/city/i).fill('Lagos');
      await page.getByLabel(/state/i).fill('Lagos');
      await page.getByLabel(/zip/i).fill('100001');
      await page.getByLabel(/country/i).fill('Nigeria');
      await page.getByRole('button', { name: /next|continue/i }).click();
      // Step 2 — Payment
      await expect(page.getByText(/payment/i).first()).toBeVisible();
    });

    test('wishlist page shows wishlisted products', async ({ page }) => {
      // Add to wishlist from product detail
      await page.goto('/store/product/p8');
      await page.getByRole('button', { name: /wishlist|heart/i }).click();
      await page.goto('/store/wishlist');
      await expect(page.getByText('Ceramic Coffee Mug Set')).toBeVisible({ timeout: 5000 });
    });

    test('order history page is accessible', async ({ page }) => {
      await page.goto('/store/orders');
      await expect(page).toHaveURL(/\/store\/orders/);
    });
  });
});
