import { test, expect } from '@playwright/test';

test('merchant application loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Restaurant OS/i })).toBeVisible();
});
