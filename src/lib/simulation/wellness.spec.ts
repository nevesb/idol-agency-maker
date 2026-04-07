import { describe, expect, it } from 'vitest';
import { DEFAULT_WELLNESS, tickWellnessWeekly } from './wellness';

describe('tickWellnessWeekly', () => {
	it('descanso reduz stress e não altera happiness como sucesso', () => {
		const w = { ...DEFAULT_WELLNESS, stress: 40, happiness: 50 };
		const next = tickWellnessWeekly(w, { overwork: false, jobOutcome: null });
		expect(next.stress).toBeLessThan(w.stress);
		expect(next.happiness).toBe(w.happiness);
	});

	it('sucesso melhora happiness; falha piora; parcial é intermédio', () => {
		const base = { ...DEFAULT_WELLNESS, happiness: 50, motivation: 50, stress: 30 };
		const ok = tickWellnessWeekly(base, { overwork: false, jobOutcome: 'success' });
		const mid = tickWellnessWeekly(base, { overwork: false, jobOutcome: 'partial' });
		const bad = tickWellnessWeekly(base, { overwork: false, jobOutcome: 'failure' });
		expect(ok.happiness).toBeGreaterThan(base.happiness);
		expect(bad.happiness).toBeLessThan(base.happiness);
		expect(mid.happiness).toBeGreaterThan(base.happiness);
		expect(mid.happiness).toBeLessThan(ok.happiness);
		expect(mid.stress).toBeGreaterThan(ok.stress);
		expect(mid.stress).toBeLessThan(bad.stress);
	});
});
