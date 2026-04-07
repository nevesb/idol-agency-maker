import { describe, expect, it } from 'vitest';
import { defaultAgencyStrategy, jobPerformanceStrategyMultiplier, mergeAgencyStrategy } from './agency-strategy';

describe('agency-strategy', () => {
	it('multiplier varia com foco e categoria', () => {
		const s = defaultAgencyStrategy();
		const base = jobPerformanceStrategyMultiplier(s, 'streaming');
		const commercial = jobPerformanceStrategyMultiplier({ ...s, focus: 'commercial' }, 'streaming');
		expect(commercial).toBeGreaterThan(base);
	});

	it('merge tolera saves antigos', () => {
		expect(mergeAgencyStrategy(null).focus).toBe('balanced');
		expect(mergeAgencyStrategy({ focus: 'nope' }).focus).toBe('balanced');
	});
});
