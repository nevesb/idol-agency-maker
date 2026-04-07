import type { FameTierVisual } from '$lib/types/simulation';

/** Pontos de fama → tier visual (GDD fame-rankings — faixas MVP) */
export function fameTierFromPoints(points: number): FameTierVisual {
	if (points < 200) return 'F';
	if (points < 500) return 'E';
	if (points < 1000) return 'D';
	if (points < 2000) return 'C';
	if (points < 4000) return 'B';
	if (points < 6500) return 'A';
	if (points < 8500) return 'S';
	if (points < 9500) return 'SS';
	return 'SSS';
}

export function famePointsOrder(tier: FameTierVisual): number {
	const order: FameTierVisual[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
	return order.indexOf(tier);
}

/** Idol com tier mínimo do job */
export function meetsMinFameTier(points: number, minTier: FameTierVisual | undefined): boolean {
	if (!minTier) return true;
	return famePointsOrder(fameTierFromPoints(points)) >= famePointsOrder(minTier);
}
