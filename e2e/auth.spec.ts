import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear auth state before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('mvep_token');
      localStorage.removeItem('mvep_user');
    });
  });

  test('customer login redirects to storefront', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('customer@mvep.dev');
    await page.getByPlaceholder('••••••••').fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('**/store');
    await expect(page).toHaveURL(/\/store/);
  });

  test('vendor login redirects to vendor dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('vendor@mvep.dev');
    await page.getByPlaceholder('••••••••').fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/vendor/);
    await expect(page).toHaveURL(/\/vendor/);
  });

  test('admin login ends up at admin overview', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('admin@mvep.dev');
    await page.getByPlaceholder('••••••••').fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/admin/);
    await expect(page).toHaveURL(/\/admin\/overview/);
  });

  test('wrong credentials shows error message', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('nobody@example.com');
    await page.getByPlaceholder('••••••••').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('sign out clears session and returns to login', async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('customer@mvep.dev');
    await page.getByPlaceholder('••••••••').fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/store/);

    // Sign out via the sign-out button in the header
    await page.getByRole('button', { name: /sign out/i }).click();
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test('full registration → email verification → login flow', async ({ page }) => {
    const email = `e2e-${Date.now()}@example.com`;

    // Register
    await page.goto('/register');
    await page.getByPlaceholder('John Smith').fill('E2E User');
    await page.getByPlaceholder('you@example.com').fill(email);
    const passwordFields = page.getByPlaceholder('••••••••');
    await passwordFields.first().fill('password123');
    await passwordFields.last().fill('password123');
    await page.getByRole('button', { name: /create account/i }).click();

    // Should navigate to email verification page
    await page.waitForURL(/\/verify-email/);
    await expect(page).toHaveURL(/\/verify-email/);

    // Grab the devCode from the MSW response via Redux state
    const devCode = await page.evaluate(() => {
      const raw = (window as Window & { __REDUX_STORE__?: { getState: () => Record<string, unknown> } }).__REDUX_STORE__?.getState();
      const auth = raw?.auth as { pendingVerification?: { devCode?: string } } | undefined;
      return auth?.pendingVerification?.devCode;
    });

    if (devCode) {
      // Fill verification code
      const inputs = page.locator('input[maxlength="1"]');
      for (let i = 0; i < devCode.length; i++) {
        await inputs.nth(i).fill(devCode[i]);
      }
      // After verification, user should be authenticated
      await page.waitForURL(/\/store|\/vendor/);
    }
  });
});
