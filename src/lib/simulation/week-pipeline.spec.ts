import { describe, expect, it } from 'vitest';
import { createInitialGame } from './initial-state';
import { hireMarketIdol, runWeekPipeline } from './week-pipeline';

describe('runWeekPipeline', () => {
	it('é determinístico para o mesmo estado (paridade com worker)', () => {
		const s = createInitialGame(99);
		expect(runWeekPipeline(s)).toEqual(runWeekPipeline(s));
	});

	it('incrementa semana, limpa escalações e gera resultados', () => {
		const s = createInitialGame(99);
		expect(s.assignedJobs.length).toBeGreaterThan(0);
		const next = runWeekPipeline(s);
		expect(next.absoluteWeek).toBe(s.absoluteWeek + 1);
		expect(next.assignedJobs).toEqual([]);
		expect(next.lastWeekLog?.jobResults.length).toBeGreaterThan(0);
		expect(next.ledger.some((l) => l.kind === 'upkeep')).toBe(true);
	});

	it('hireMarketIdol move idol e debita saldo', () => {
		const s = createInitialGame(1);
		const mid = s.marketIdols[0]!.id;
		const before = s.idols.length;
		const next = hireMarketIdol(s, mid);
		expect(next.marketIdols.length).toBe(s.marketIdols.length - 1);
		expect(next.idols.length).toBe(before + 1);
		expect(next.balanceYen).toBeLessThan(s.balanceYen);
	});

	it('hireMarketIdol noop se id inválido', () => {
		const s = createInitialGame(1);
		const next = hireMarketIdol(s, 'nope');
		expect(next).toEqual(s);
	});

	it('idols sem job resolvido na semana recebem tick de descanso (stress não sobe)', () => {
		const s = { ...createInitialGame(77), assignedJobs: [] };
		const stress0 = s.idols.map((i) => i.wellness.stress);
		const next = runWeekPipeline(s);
		const stress1 = next.idols.map((i) => i.wellness.stress);
		for (let i = 0; i < stress0.length; i++) {
			expect(stress1[i]).toBeLessThanOrEqual(stress0[i]!);
		}
	});
});
