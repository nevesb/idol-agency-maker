import { describe, expect, it } from 'vitest';
import { tickRivalWeek } from './rival-tick';

describe('tickRivalWeek', () => {
	it('é determinístico', () => {
		const rivals = [
			{ id: 'r1', name: 'A', tier: 'small' as const, budgetYen: 1_000_000 },
			{ id: 'r2', name: 'B', tier: 'medium' as const, budgetYen: 2_000_000 }
		];
		const a = tickRivalWeek(rivals, 42, 10);
		const b = tickRivalWeek(rivals, 42, 10);
		expect(a).toEqual(b);
	});

	it('mantém orçamento mínimo', () => {
		const rivals = [{ id: 'r1', name: 'A', tier: 'small' as const, budgetYen: 250_000 }];
		const { rivals: out } = tickRivalWeek(rivals, 99, 500);
		expect(out[0]!.budgetYen).toBeGreaterThanOrEqual(200_000);
	});
});
