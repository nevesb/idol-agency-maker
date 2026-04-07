import { describe, expect, it } from 'vitest';
import { headlinesAsNewsFeed, ledgerNetByKind, scoutingWeeklyBudgetHint } from './vertical-slice';

describe('vertical-slice', () => {
	it('headlinesAsNewsFeed preserva ordem', () => {
		const h = [
			{ week: 2, text: 'a', kind: 'job' as const },
			{ week: 2, text: 'b', kind: 'rival' as const }
		];
		expect(headlinesAsNewsFeed(h, 1)).toHaveLength(1);
	});

	it('ledgerNetByKind soma por kind', () => {
		expect(
			ledgerNetByKind([
				{ week: 1, kind: 'x', amountYen: 100, note: '' },
				{ week: 1, kind: 'x', amountYen: -40, note: '' }
			]).x
		).toBe(60);
	});

	it('scoutingWeeklyBudgetHint sobe com tier', () => {
		expect(scoutingWeeklyBudgetHint('garage')).toBeLessThan(scoutingWeeklyBudgetHint('elite'));
	});
});
