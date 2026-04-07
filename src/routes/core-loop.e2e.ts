import { expect, test } from '@playwright/test';

test('core loop: saltar semana e abrir resultados', async ({ page }) => {
	await page.goto('/', { waitUntil: 'domcontentloaded' });
	await expect(page.getByTestId('tt-week-label')).toBeVisible();
	const before = (await page.getByTestId('tt-week-label').textContent())?.trim() ?? '';
	await page.getByTestId('tt-skip-week').click();
	await expect(page.getByTestId('tt-week-label')).not.toHaveText(before, { timeout: 20_000 });
	await page.goto('/operacoes/resultados', { waitUntil: 'domcontentloaded' });
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
