import { expect, test } from '@playwright/test';

test('mercado e glossário carregam', async ({ page }) => {
	await page.goto('/mercado', { waitUntil: 'domcontentloaded' });
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

	await page.goto('/ajuda/glossario', { waitUntil: 'domcontentloaded' });
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('agência carrega', async ({ page }) => {
	await page.goto('/agencia', { waitUntil: 'domcontentloaded' });
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
