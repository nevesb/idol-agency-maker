import type { AgencyEconomyTier, IdolRuntime, GameStateV1 } from '$lib/types/simulation';
import { fameTierFromPoints } from '$lib/simulation/fame';

/** Manutenção semanal fixa por tier (GDD agency-economy — valores MVP) */
export const WEEKLY_UPKEEP_YEN: Record<AgencyEconomyTier, number> = {
	garage: 50_000,
	small: 120_000,
	medium: 280_000,
	large: 600_000,
	elite: 1_200_000
};

export function weeklyUpkeepYen(tier: AgencyEconomyTier): number {
	return WEEKLY_UPKEEP_YEN[tier];
}

/** Salário mensal da idol → custo semanal aproximado */
export function weeklySalaryFromMonthly(monthlyYen: number): number {
	return Math.round(monthlyYen / 4);
}

/** P2-02: Merch revenue = base * fameMultiplier (weekly) */
export function weeklyMerchRevenue(idol: IdolRuntime): number {
	const tier = fameTierFromPoints(idol.famePoints);
	const mult: Record<string, number> = {
		F: 0,
		E: 0,
		D: 500,
		C: 2000,
		B: 5000,
		A: 12000,
		S: 25000,
		SS: 50000,
		SSS: 100000
	};
	return mult[tier] ?? 0;
}

/** P2-03: Facility costs per tier (weekly) */
const FACILITY_COST: Record<AgencyEconomyTier, number> = {
	garage: 0,
	small: 30_000,
	medium: 80_000,
	large: 200_000,
	elite: 500_000
};

export function weeklyFacilityCost(tier: AgencyEconomyTier): number {
	return FACILITY_COST[tier];
}

/** P2-03: Scouting budget (weekly, based on tier) */
const SCOUTING_COST: Record<AgencyEconomyTier, number> = {
	garage: 10_000,
	small: 25_000,
	medium: 50_000,
	large: 100_000,
	elite: 200_000
};

export function weeklyScoutingCost(tier: AgencyEconomyTier): number {
	return SCOUTING_COST[tier];
}

/** P2-04: Conditions for agency tier promotion */
const PROMO_REVENUE_THRESHOLD: Record<AgencyEconomyTier, number> = {
	garage: 500_000,
	small: 2_000_000,
	medium: 8_000_000,
	large: 25_000_000,
	elite: Infinity
};

const TIER_ORDER: AgencyEconomyTier[] = ['garage', 'small', 'medium', 'large', 'elite'];

/** P2-04: Check & apply tier promotion/demotion based on trailing 12-week revenue */
export function evaluateTierChange(state: GameStateV1): AgencyEconomyTier {
	const trailing12 = state.ledger
		.filter((e) => e.week > state.absoluteWeek - 12 && e.amountYen > 0)
		.reduce((sum, e) => sum + e.amountYen, 0);

	const currentIdx = TIER_ORDER.indexOf(state.agencyTier);
	const threshold = PROMO_REVENUE_THRESHOLD[state.agencyTier];

	if (trailing12 >= threshold && currentIdx < TIER_ORDER.length - 1) {
		return TIER_ORDER[currentIdx + 1]!;
	}

	if (currentIdx > 0) {
		const prevThreshold = PROMO_REVENUE_THRESHOLD[TIER_ORDER[currentIdx - 1]!]!;
		if (trailing12 < prevThreshold * 0.5) {
			return TIER_ORDER[currentIdx - 1]!;
		}
	}

	return state.agencyTier;
}

/** P2-16: Fame decay for inactive idols */
export function applyFameDecay(idol: IdolRuntime, hadJobThisWeek: boolean): number {
	if (hadJobThisWeek) return idol.famePoints;
	const decay = Math.max(1, Math.round(idol.famePoints * 0.005));
	return Math.max(0, idol.famePoints - decay);
}

/** P2-13: Rank idols globally by famePoints (descending) */
export function rankIdolsByFame(idols: IdolRuntime[]): { idolId: string; rank: number; famePoints: number }[] {
	const sorted = [...idols].sort((a, b) => b.famePoints - a.famePoints);
	return sorted.map((idol, i) => ({ idolId: idol.id, rank: i + 1, famePoints: idol.famePoints }));
}

/** P2-15: Agency fame = sum of idol fame * 0.01 */
export function agencyFameScore(idols: IdolRuntime[]): number {
	return Math.round(idols.reduce((sum, i) => sum + i.famePoints, 0) * 0.01);
}

/** P2-12: Wellness color class for UI (green/yellow/red/purple) */
export type WellnessColorLevel = 'green' | 'yellow' | 'red' | 'purple';

export function wellnessColorClass(value: number): WellnessColorLevel {
	if (value >= 70) return 'green';
	if (value >= 40) return 'yellow';
	if (value >= 20) return 'red';
	return 'purple';
}

/** Combined wellness score (avg of happiness + motivation - stress + physical) / 4 */
export function wellnessOverallScore(idol: IdolRuntime): number {
	const w = idol.wellness;
	return Math.round((w.happiness + w.motivation + w.physical + (100 - w.stress)) / 4);
}
