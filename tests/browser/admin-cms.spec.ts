import { test, expect } from '@playwright/test';

test.describe('Admin CMS Routes', () => {
  test('Login page renders correctly', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Verify login form is present
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('Protected routes redirect to login when unauthenticated', async ({ page }) => {
    // Attempt to access protected dashboard pages
    await page.goto('/admin/inbox');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/admin\/login/);

    await page.goto('/admin/projects');
    await expect(page).toHaveURL(/.*\/admin\/login/);

    await page.goto('/admin/experience');
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });
});
