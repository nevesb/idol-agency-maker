import { describe, expect, it } from 'vitest';
import type { IdolHiddenStats, IdolVisibleStats } from '$lib/types/game';
import {
	burnoutRecoveryWeeks,
	computeTalentAverage,
	personalityLabelKey,
	tierFromPotential,
	weeklyAttributeGrowth,
	weeklyPhysicalDecay
} from './stats';

const baseVisible = (): IdolVisibleStats => ({
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
});

const baseHidden = (): IdolHiddenStats => ({
	consistency: 10,
	ambition: 10,
	loyalty: 10,
	temperament: 10,
	personalLife: 10
});

describe('tierFromPotential', () => {
	it('mapeia limites GDD', () => {
		expect(tierFromPotential(1)).toBe('F');
		expect(tierFromPotential(20)).toBe('F');
		expect(tierFromPotential(21)).toBe('E');
		expect(tierFromPotential(98)).toBe('SSS');
	});
});

describe('computeTalentAverage', () => {
	it('média dos 12', () => {
		const v = baseVisible();
		v.vocal = 60;
		expect(computeTalentAverage(v)).toBeCloseTo(50 + 10 / 12, 5);
	});
});

describe('burnoutRecoveryWeeks', () => {
	it('resiliência máxima → 1 semana', () => {
		const v = baseVisible();
		v.stamina = v.discipline = v.mentality = v.adaptability = 100;
		expect(burnoutRecoveryWeeks(v)).toBe(1);
	});
	it('resiliência baixa → até 8 semanas', () => {
		const v = baseVisible();
		v.stamina = v.discipline = v.mentality = v.adaptability = 1;
		expect(burnoutRecoveryWeeks(v)).toBe(8);
	});
});

describe('weeklyAttributeGrowth', () => {
	it('burnout não cresce', () => {
		const g = weeklyAttributeGrowth({
			pt: 80,
			attributeValue: 40,
			attributeCap: 90,
			age: 18,
			visible: baseVisible(),
			hidden: baseHidden(),
			activity: 'burnout',
			source: 'training'
		});
		expect(g).toBe(0);
	});
	it('treino aumenta vs natural', () => {
		const input = {
			pt: 60,
			attributeValue: 40,
			attributeCap: 90,
			age: 18,
			visible: baseVisible(),
			hidden: baseHidden(),
			activity: 'training' as const,
			source: 'natural' as const
		};
		const n = weeklyAttributeGrowth({ ...input, source: 'natural' });
		const t = weeklyAttributeGrowth({ ...input, source: 'training' });
		expect(t).toBeGreaterThan(n);
	});
});

describe('weeklyPhysicalDecay', () => {
	it('antes do pico não decai', () => {
		const d = weeklyPhysicalDecay({
			age: 20,
			activity: 'active',
			visible: baseVisible()
		});
		expect(Object.keys(d).length).toBe(0);
	});
	it('após 24 decai stamina/dance/visual', () => {
		const d = weeklyPhysicalDecay({
			age: 25,
			activity: 'active',
			visible: baseVisible()
		});
		expect(d.stamina).toBeGreaterThan(0);
	});
});

describe('personalityLabelKey', () => {
	it('retorna chave estável', () => {
		const key = personalityLabelKey(baseHidden());
		expect(key.startsWith('personality.')).toBe(true);
	});
});
