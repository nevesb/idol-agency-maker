import { expect, test } from '@playwright/test';

test('portal e navegação principal', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await page.locator('nav[aria-label="Main"]').locator('a[href$="/roster"]').first().click();
	await expect(page).toHaveURL(/\/roster/);
});
