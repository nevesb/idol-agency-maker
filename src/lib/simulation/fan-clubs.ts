import type { IdolRuntime, GameEvent } from '$lib/types/simulation';

export type FanSegment = 'casual' | 'dedicated' | 'whale' | 'toxic';

/** P7-09: Fan club de uma idol. */
export interface FanClub {
	idolId: string;
	/** Tamanho total do fandom (número abstrato) */
	size: number;
	/** Humor coletivo -100 a 100 */
	mood: number;
	/** Lealdade 0–100 */
	loyalty: number;
	/** Nível de toxicidade 0–100 */
	toxicity: number;
}

function clamp(n: number, lo: number, hi: number): number {
	return Math.min(hi, Math.max(lo, n));
}

/** P7-10: Cria fan club com valores padrão para idol recém-debutada. */
export function initFanClub(idolId: string): FanClub {
	return {
		idolId,
		size: 100,
		mood: 50,
		loyalty: 40,
		toxicity: 5
	};
}

/** Distribuição de segmentos derivada do estado do club. */
export function fanSegmentDistribution(club: FanClub): Record<FanSegment, number> {
	const toxicPct = clamp(club.toxicity, 0, 100) / 100;
	const whalePct = clamp(club.loyalty * 0.15, 0, 25) / 100;
	const dedicatedPct = clamp(club.loyalty * 0.4, 0, 50) / 100;
	const casualPct = Math.max(0, 1 - toxicPct - whalePct - dedicatedPct);

	return {
		casual: Math.round(club.size * casualPct),
		dedicated: Math.round(club.size * dedicatedPct),
		whale: Math.round(club.size * whalePct),
		toxic: Math.round(club.size * toxicPct)
	};
}

const EVENT_MOOD_DELTA: Record<string, number> = {
	scandal_personal: -12,
	scandal_dating: -8,
	injury: -3,
	viral_moment: 10,
	fan_conflict: -15,
	group_tension: -5,
	media_praise: 8,
	award_nomination: 12,
	collab_opportunity: 5,
	charity_event: 10
};

/** P7-11: Tick semanal do fan club — atualiza size/mood/loyalty/toxicity. */
export function tickFanClub(
	club: FanClub,
	idol: IdolRuntime,
	events: GameEvent[]
): FanClub {
	let { size, mood, loyalty, toxicity } = club;

	for (const ev of events) {
		if (ev.targetId !== club.idolId) continue;
		mood += EVENT_MOOD_DELTA[ev.type] ?? 0;
		if (ev.type === 'fan_conflict') toxicity += 5;
		if (ev.type === 'charity_event') toxicity = Math.max(0, toxicity - 3);
	}

	const fameGrowth = Math.round(idol.famePoints * 0.005);
	size += mood > 0 ? fameGrowth : -Math.round(fameGrowth * 0.5);
	size = Math.max(0, size);

	if (mood > 30) loyalty += 1;
	if (mood < -20) loyalty -= 2;

	if (toxicity > 50) {
		mood -= 3;
		loyalty -= 1;
	}

	return {
		...club,
		size: Math.max(0, size),
		mood: clamp(mood, -100, 100),
		loyalty: clamp(loyalty, 0, 100),
		toxicity: clamp(toxicity, 0, 100)
	};
}

/** P7-13: Receita semanal de merch derivada do fan club. */
export function merchRevenueFromFans(club: FanClub): number {
	const segments = fanSegmentDistribution(club);
	const perCasual = 50;
	const perDedicated = 200;
	const perWhale = 1500;
	const perToxic = 20;

	const moodMult = club.mood >= 0 ? 1 + club.mood * 0.005 : Math.max(0.3, 1 + club.mood * 0.003);

	const raw =
		segments.casual * perCasual +
		segments.dedicated * perDedicated +
		segments.whale * perWhale +
		segments.toxic * perToxic;

	return Math.round(raw * moodMult);
}
