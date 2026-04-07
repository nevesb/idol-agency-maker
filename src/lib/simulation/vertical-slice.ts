import type { AgencyEconomyTier, GameStateV1, Headline } from '$lib/types/simulation';

/** P6-14 MVP — feed a partir das manchetes já calculadas. */
export function headlinesAsNewsFeed(headlines: Headline[], limit = 25): {
	week: number;
	text: string;
	kind: Headline['kind'];
}[] {
	return headlines.slice(0, limit).map((h) => ({ week: h.week, text: h.text, kind: h.kind }));
}

/** P6-01 MVP — orçamento indicativo de scouting por tier. */
export function scoutingWeeklyBudgetHint(tier: AgencyEconomyTier): number {
	const map: Record<AgencyEconomyTier, number> = {
		garage: 45_000,
		small: 110_000,
		medium: 195_000,
		large: 320_000,
		elite: 480_000
	};
	return map[tier];
}

/** P6-17 MVP — agrega ledger por tipo de lançamento. */
export function ledgerNetByKind(ledger: GameStateV1['ledger']): Record<string, number> {
	const acc: Record<string, number> = {};
	for (const row of ledger) {
		acc[row.kind] = (acc[row.kind] ?? 0) + row.amountYen;
	}
	return acc;
}
