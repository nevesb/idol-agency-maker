import type {
	IdolActivityState,
	IdolHiddenStats,
	IdolTier,
	IdolVisibleStats
} from '$lib/types/game';

/** Multiplicadores de tier por PT (GDD) */
export const TIER_MULTIPLIER: Record<IdolTier, number> = {
	F: 0.4,
	E: 0.6,
	D: 0.8,
	C: 1.0,
	B: 1.3,
	A: 1.6,
	S: 2.0,
	SS: 2.5,
	SSS: 3.0
};

export function tierFromPotential(pt: number): IdolTier {
	const p = Math.round(pt);
	if (p <= 20) return 'F';
	if (p <= 35) return 'E';
	if (p <= 50) return 'D';
	if (p <= 65) return 'C';
	if (p <= 75) return 'B';
	if (p <= 85) return 'A';
	if (p <= 92) return 'S';
	if (p <= 97) return 'SS';
	return 'SSS';
}

/** TA = média simples dos 12 visíveis */
export function computeTalentAverage(visible: IdolVisibleStats): number {
	const values = [
		visible.vocal,
		visible.dance,
		visible.acting,
		visible.variety,
		visible.visual,
		visible.charisma,
		visible.communication,
		visible.aura,
		visible.stamina,
		visible.discipline,
		visible.mentality,
		visible.adaptability
	];
	return values.reduce((a, b) => a + b, 0) / 12;
}

/**
 * Duração de burnout em semanas.
 * media_resiliencia = média dos 4 de Resiliência visíveis (1–100)
 * semanas = ceil(8 - (media/100 * 7))
 */
export function burnoutRecoveryWeeks(visible: IdolVisibleStats): number {
	const mean =
		(visible.stamina + visible.discipline + visible.mentality + visible.adaptability) / 4;
	const weeks = Math.ceil(8 - (mean / 100) * 7);
	return Math.min(8, Math.max(1, weeks));
}

type GrowthSource = 'natural' | 'training' | 'jobRelated';

const SOURCE_FACTOR: Record<GrowthSource, number> = {
	natural: 0.5,
	training: 1.0,
	jobRelated: 1.5
};

const ACTIVITY_GROWTH: Record<IdolActivityState, number> = {
	aspirant: 0,
	training: 1.2,
	active: 1.0,
	overwork: 0.5,
	burnout: 0,
	crisis: 0,
	veteran: 0.3,
	debuted: 0
};

/** Fator de idade para crescimento (GDD curva) */
export function ageGrowthMultiplier(age: number): number {
	if (age >= 12 && age <= 15) return 1.5;
	if (age >= 16 && age <= 19) return 1.3;
	if (age >= 20 && age <= 23) return 1.0;
	if (age >= 24 && age <= 27) return 0.7;
	if (age >= 28 && age <= 31) return 0.4;
	if (age >= 32 && age <= 35) return 0.2;
	return 0.1;
}

/** Limiar TA ≥ PT × fator(ambição) desacelera crescimento (GDD) */
function ambitionGrowthSlowMultiplier(pt: number, ta: number, ambition: number): number {
	const thresholdRatio = ambition < 8 ? 0.7 : ambition <= 14 ? 0.85 : 0.95;
	if (ta < pt * thresholdRatio) return 1;
	if (ambition < 8) return 0.25;
	if (ambition <= 14) return 0.5;
	return 0.8;
}

/**
 * Crescimento semanal de um atributo (GDD).
 * crescimento = base × mult_tier × mult_disciplina × mult_idade × mult_estado × fonte
 * mult_disciplina = disciplina_visível / 50
 */
export function weeklyAttributeGrowth(input: {
	pt: number;
	attributeValue: number;
	attributeCap: number;
	age: number;
	visible: IdolVisibleStats;
	hidden: IdolHiddenStats;
	activity: IdolActivityState;
	source: GrowthSource;
	basePerWeek?: number;
}): number {
	const {
		pt,
		attributeValue,
		attributeCap,
		age,
		visible,
		hidden,
		activity,
		source,
		basePerWeek = 0.5
	} = input;
	if (attributeValue >= attributeCap) return 0;
	if (ACTIVITY_GROWTH[activity] === 0) return 0;

	const tier = tierFromPotential(pt);
	const multTier = TIER_MULTIPLIER[tier];
	const multDisc = visible.discipline / 50;
	const multAge = ageGrowthMultiplier(age);
	const multState = ACTIVITY_GROWTH[activity];
	const fonte = SOURCE_FACTOR[source];

	const ta = computeTalentAverage(visible);
	const ambitionSlow = ambitionGrowthSlowMultiplier(pt, ta, hidden.ambition);

	let delta = basePerWeek * multTier * multDisc * multAge * multState * fonte * ambitionSlow;
	if (attributeValue + delta > attributeCap) delta = attributeCap - attributeValue;
	return Math.max(0, delta);
}

export type DecayAttributeKey = 'stamina' | 'dance' | 'visual';

const DECAY_ATTRS: DecayAttributeKey[] = ['stamina', 'dance', 'visual'];

/** taxa_base semanal por faixa etária (após início de declínio) */
export function physicalDecayBaseRate(age: number, decayStartAge = 24): number {
	if (age < decayStartAge) return 0;
	if (age <= 27) return 0.25;
	if (age <= 31) return 0.5;
	if (age <= 35) return 1.0;
	return 1.5;
}

const DECAY_STATE_MULT: Record<IdolActivityState, number> = {
	aspirant: 1,
	training: 1,
	active: 1,
	overwork: 2,
	burnout: 1.5,
	crisis: 1.5,
	veteran: 1,
	debuted: 1
};

/** Decaimento semanal para Resistência/Dança/Visual (GDD) */
export function weeklyPhysicalDecay(input: {
	age: number;
	activity: IdolActivityState;
	visible: IdolVisibleStats;
	decayStartAge?: number;
}): Partial<Record<DecayAttributeKey, number>> {
	const rate = physicalDecayBaseRate(input.age, input.decayStartAge ?? 24);
	if (rate === 0) return {};
	const mult = DECAY_STATE_MULT[input.activity];
	const out: Partial<Record<DecayAttributeKey, number>> = {};
	for (const key of DECAY_ATTRS) {
		const current = input.visible[key];
		const loss = rate * mult;
		out[key] = Math.min(loss, Math.max(0, current - 1));
	}
	return out;
}

/** Rótulo de personalidade (chave i18n) a partir dos ocultos — heurística MVP */
export function personalityLabelKey(hidden: IdolHiddenStats): string {
	const { consistency, ambition, loyalty, temperament, personalLife } = hidden;
	if (temperament <= 6 && ambition >= 14) return 'personality.unstable_ambitious';
	if (consistency >= 16 && ambition >= 12) return 'personality.disciplined_star';
	if (loyalty >= 15 && temperament >= 14) return 'personality.golden_heart';
	if (consistency <= 8 && temperament <= 7) return 'personality.time_bomb';
	if (ambition <= 6 && consistency >= 12) return 'personality.silent_pillar';
	if (personalLife >= 15) return 'personality.public_life';
	return 'personality.balanced';
}
