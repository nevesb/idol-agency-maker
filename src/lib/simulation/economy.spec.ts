import { describe, expect, it } from 'vitest';
import {
	weeklyMerchRevenue,
	evaluateTierChange,
	applyFameDecay,
	wellnessColorClass,
	wellnessOverallScore,
	rankIdolsByFame,
	agencyFameScore
} from './economy';
import type { IdolRuntime, GameStateV1 } from '$lib/types/simulation';

function makeIdol(overrides: Partial<IdolRuntime> = {}): IdolRuntime {
	return {
		id: 'test',
		nameRomaji: 'Test',
		nameJp: 'Test',
		age: 18,
		gender: 'female',
		potential: 50,
		visible: {
			vocal: 50,
			dance: 50,
			acting: 50,
			variety: 50,
			visual: 50,
			charisma: 50,
			communication: 50,
			aura: 50,
			stamina: 50,
			discipline: 50,
			mentality: 50,
			adaptability: 50
		},
		hidden: { consistency: 10, ambition: 10, loyalty: 10, temperament: 10, personalLife: 10 },
		activityState: 'active',
		personalityLabelKey: 'personality.balanced',
		visualSeed: 12345,
		regionId: 'tokyo',
		wellness: { physical: 80, happiness: 80, stress: 20, motivation: 80 },
		famePoints: 0,
		contractId: null,
		agencyId: 'ag1',
		weeksInactive: 0,
		...overrides
	};
}

describe('economy', () => {
	it('merch revenue scales with fame tier', () => {
		expect(weeklyMerchRevenue(makeIdol({ famePoints: 0 }))).toBe(0);
		expect(weeklyMerchRevenue(makeIdol({ famePoints: 1000 }))).toBe(2000);
		expect(weeklyMerchRevenue(makeIdol({ famePoints: 9500 }))).toBe(100000);
	});

	it('fame decay reduces points for inactive idols', () => {
		const idol = makeIdol({ famePoints: 1000 });
		const after = applyFameDecay(idol, false);
		expect(after).toBeLessThan(1000);
		expect(after).toBeGreaterThan(0);
	});

	it('fame decay does not apply when idol worked', () => {
		const idol = makeIdol({ famePoints: 1000 });
		expect(applyFameDecay(idol, true)).toBe(1000);
	});

	it('wellness color class', () => {
		expect(wellnessColorClass(80)).toBe('green');
		expect(wellnessColorClass(50)).toBe('yellow');
		expect(wellnessColorClass(25)).toBe('red');
		expect(wellnessColorClass(10)).toBe('purple');
	});

	it('wellness overall score', () => {
		const idol = makeIdol({ wellness: { physical: 80, happiness: 80, stress: 20, motivation: 80 } });
		expect(wellnessOverallScore(idol)).toBe(80);
	});

	it('rankIdolsByFame sorts descending', () => {
		const a = makeIdol({ id: 'a', famePoints: 100 });
		const b = makeIdol({ id: 'b', famePoints: 500 });
		const ranked = rankIdolsByFame([a, b]);
		expect(ranked[0]!.idolId).toBe('b');
		expect(ranked[0]!.rank).toBe(1);
	});

	it('agencyFameScore sums idol fame * 0.01', () => {
		const a = makeIdol({ famePoints: 1000 });
		const b = makeIdol({ famePoints: 2000 });
		expect(agencyFameScore([a, b])).toBe(30);
	});

	it('evaluateTierChange promotes on high revenue', () => {
		const state = {
			agencyTier: 'garage',
			absoluteWeek: 20,
			ledger: Array.from({ length: 12 }, (_, i) => ({
				week: 20 - i,
				kind: 'job_revenue',
				amountYen: 50_000,
				note: ''
			}))
		} as unknown as GameStateV1;
		expect(evaluateTierChange(state)).toBe('small');
	});

	it('evaluateTierChange keeps tier when revenue is moderate', () => {
		const state = {
			agencyTier: 'small',
			absoluteWeek: 20,
			ledger: Array.from({ length: 12 }, (_, i) => ({
				week: 20 - i,
				kind: 'job_revenue',
				amountYen: 100_000,
				note: ''
			}))
		} as unknown as GameStateV1;
		expect(evaluateTierChange(state)).toBe('small');
	});
});
