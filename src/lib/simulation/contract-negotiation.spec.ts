import { describe, expect, it } from 'vitest';
import type { IdolCore } from '$lib/types/game';
import { acceptanceProbability, autoFillClausesForIdol } from './contract-negotiation';
import { defaultContractClauses } from './contract';

const idol = {
	id: 't',
	nameRomaji: 'T',
	nameJp: 'T',
	age: 20,
	gender: 'female' as const,
	potential: 55,
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
	hidden: {
		consistency: 12,
		ambition: 12,
		loyalty: 12,
		temperament: 10,
		personalLife: 8
	},
	activityState: 'active' as const,
	personalityLabelKey: 'personality.balanced',
	visualSeed: 1,
	regionId: 'tokyo'
} satisfies IdolCore;

describe('contract-negotiation', () => {
	it('probabilidade no intervalo 0–1', () => {
		const c = defaultContractClauses(80_000);
		const p = acceptanceProbability(c, idol);
		expect(p).toBeGreaterThanOrEqual(0.05);
		expect(p).toBeLessThanOrEqual(0.98);
	});

	it('auto-fill não reduz aceitação de forma extrema', () => {
		const base = defaultContractClauses(70_000);
		const auto = autoFillClausesForIdol(base, idol);
		const p0 = acceptanceProbability(base, idol);
		const p1 = acceptanceProbability(auto, idol);
		expect(p1).toBeGreaterThan(0.2);
		expect(Math.abs(p1 - p0)).toBeLessThan(0.5);
	});
});
