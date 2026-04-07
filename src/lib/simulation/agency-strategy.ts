import type {
	AgencyStrategyV1,
	AgendaPosture,
	GrowthPosture,
	ImagePosture,
	JobCategory,
	StrategyFocus
} from '$lib/types/simulation';

function isRecord(x: unknown): x is Record<string, unknown> {
	return typeof x === 'object' && x !== null && !Array.isArray(x);
}

const FOCUS: StrategyFocus[] = ['balanced', 'commercial', 'artistic', 'scouting'];
const AGENDA: AgendaPosture[] = ['light', 'normal', 'packed'];
const IMAGE: ImagePosture[] = ['safe', 'edgy', 'viral'];
const GROWTH: GrowthPosture[] = ['organic', 'aggressive'];

export function mergeAgencyStrategy(raw: unknown): AgencyStrategyV1 {
	const d = defaultAgencyStrategy();
	if (!isRecord(raw)) return d;
	return {
		focus: FOCUS.includes(raw.focus as StrategyFocus) ? (raw.focus as StrategyFocus) : d.focus,
		agendaPosture: AGENDA.includes(raw.agendaPosture as AgendaPosture)
			? (raw.agendaPosture as AgendaPosture)
			: d.agendaPosture,
		imagePosture: IMAGE.includes(raw.imagePosture as ImagePosture)
			? (raw.imagePosture as ImagePosture)
			: d.imagePosture,
		growthPosture: GROWTH.includes(raw.growthPosture as GrowthPosture)
			? (raw.growthPosture as GrowthPosture)
			: d.growthPosture
	};
}

export function defaultAgencyStrategy(): AgencyStrategyV1 {
	return {
		focus: 'balanced',
		agendaPosture: 'normal',
		imagePosture: 'safe',
		growthPosture: 'organic'
	};
}

/** Perfil legível para UI (P3-31). */
export function strategyProfileLabel(s: AgencyStrategyV1): string {
	if (s.focus === 'commercial' && s.growthPosture === 'aggressive') return 'Fábrica comercial';
	if (s.focus === 'artistic' && s.agendaPosture === 'light') return 'Studio boutique';
	if (s.focus === 'scouting') return 'Caça-talentos';
	return 'Operação equilibrada';
}

const COMMERCIAL: JobCategory[] = ['endorsement', 'streaming', 'photo', 'meet_greet', 'event'];
const ARTISTIC: JobCategory[] = ['recording', 'composition', 'show', 'dubbing'];

/** Multiplicador de performance de job (P3-29). */
export function jobPerformanceStrategyMultiplier(
	strategy: AgencyStrategyV1,
	category: JobCategory
): number {
	let m = 1;
	if (strategy.focus === 'commercial' && COMMERCIAL.includes(category)) m *= 1.06;
	if (strategy.focus === 'artistic' && ARTISTIC.includes(category)) m *= 1.06;
	if (strategy.focus === 'scouting') m *= 0.98;
	if (strategy.agendaPosture === 'packed') m *= 0.97;
	if (strategy.agendaPosture === 'light') m *= 1.03;
	if (strategy.imagePosture === 'viral' && category === 'streaming') m *= 1.04;
	if (strategy.imagePosture === 'edgy' && category === 'tv') m *= 1.03;
	if (strategy.growthPosture === 'aggressive') m *= 1.02;
	return m;
}

/** P3-29: Strategy fame modifier applied to fame delta after jobs */
export function strategyFameModifier(strategy: AgencyStrategyV1): number {
	let m = 1;
	if (strategy.focus === 'commercial') m *= 1.08;
	if (strategy.imagePosture === 'viral') m *= 1.1;
	if (strategy.imagePosture === 'edgy') m *= 1.05;
	if (strategy.focus === 'artistic') m *= 0.95;
	if (strategy.agendaPosture === 'packed') m *= 1.04;
	return m;
}

/** P3-29: Strategy stress modifier applied to stress changes */
export function strategyStressModifier(strategy: AgencyStrategyV1): number {
	let m = 1;
	if (strategy.agendaPosture === 'packed') m *= 1.15;
	if (strategy.agendaPosture === 'light') m *= 0.8;
	if (strategy.growthPosture === 'aggressive') m *= 1.1;
	if (strategy.imagePosture === 'viral') m *= 1.05;
	return m;
}

/** P3-30: Structural effects of strategy on perception/volatility */
export interface StructuralEffects {
	fanType: 'casual' | 'dedicated' | 'volatile';
	mediaPerception: 'positive' | 'neutral' | 'negative';
	volatility: number;
}

export function computeStructuralEffects(strategy: AgencyStrategyV1): StructuralEffects {
	let fanType: StructuralEffects['fanType'] = 'casual';
	if (strategy.focus === 'artistic' && strategy.agendaPosture === 'light') fanType = 'dedicated';
	if (strategy.imagePosture === 'viral') fanType = 'volatile';

	let mediaPerception: StructuralEffects['mediaPerception'] = 'neutral';
	if (strategy.imagePosture === 'safe' && strategy.focus !== 'scouting') mediaPerception = 'positive';
	if (strategy.imagePosture === 'edgy') mediaPerception = 'negative';

	let volatility = 0.5;
	if (strategy.imagePosture === 'viral') volatility += 0.2;
	if (strategy.growthPosture === 'aggressive') volatility += 0.15;
	if (strategy.agendaPosture === 'light') volatility -= 0.1;
	if (strategy.focus === 'artistic') volatility -= 0.1;

	return { fanType, mediaPerception, volatility: Math.max(0, Math.min(1, volatility)) };
}
