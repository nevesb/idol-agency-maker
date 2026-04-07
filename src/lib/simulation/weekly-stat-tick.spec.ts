import { describe, expect, it } from 'vitest';
import { createInitialGame } from './initial-state';
import { applyWeeklyIdolStatTick } from './weekly-stat-tick';
import { computeTalentAverage } from './stats';

describe('applyWeeklyIdolStatTick', () => {
	it('idol com job na semana ganha mais TA médio que sem job', () => {
		const g = createInitialGame(42);
		const base = g.idols[0]!;
		const ta0 = computeTalentAverage(base.visible);
		const noJob = applyWeeklyIdolStatTick(base, false);
		const withJob = applyWeeklyIdolStatTick(base, true);
		expect(computeTalentAverage(withJob.visible)).toBeGreaterThanOrEqual(ta0);
		expect(computeTalentAverage(withJob.visible)).toBeGreaterThanOrEqual(computeTalentAverage(noJob.visible));
	});
});
