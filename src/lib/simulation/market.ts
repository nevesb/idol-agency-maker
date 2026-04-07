import type { IdolCore } from '$lib/types/game';
import type { IdolRuntime } from '$lib/types/simulation';
import { DEFAULT_WELLNESS } from '$lib/simulation/wellness';

/** Buyout MVP: preço base por PT e idade */
export function estimateBuyoutYen(idol: IdolCore): number {
	const pt = idol.potential;
	const base = 200_000 + pt * 15_000 - Math.max(0, idol.age - 18) * 8_000;
	return Math.max(50_000, Math.round(base));
}

export function idolCoreToRuntime(idol: IdolCore, agencyId: string | null): IdolRuntime {
	return {
		...idol,
		wellness: { ...DEFAULT_WELLNESS },
		famePoints: Math.round(idol.potential * 8 + 100),
		contractId: null,
		agencyId,
		weeksInactive: 0
	};
}
