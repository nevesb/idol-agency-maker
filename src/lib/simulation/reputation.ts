import type { IdolRuntime, GameEvent } from '$lib/types/simulation';

/** P7-06: Reputação pública de uma idol. */
export interface IdolReputation {
	idolId: string;
	/** Imagem pública -100 (odiada) a 100 (amada) */
	publicImage: number;
	/** Afinidade com fãs 0–100 */
	fanAffinity: number;
	/** Títulos de legado conquistados */
	legacyTitles: string[];
}

function clamp(n: number, lo: number, hi: number): number {
	return Math.min(hi, Math.max(lo, n));
}

const EVENT_IMAGE_DELTA: Record<string, number> = {
	scandal_personal: -15,
	scandal_dating: -10,
	injury: -3,
	viral_moment: 12,
	fan_conflict: -8,
	group_tension: -5,
	media_praise: 10,
	award_nomination: 14,
	collab_opportunity: 6,
	charity_event: 8
};

const EVENT_AFFINITY_DELTA: Record<string, number> = {
	scandal_personal: -10,
	scandal_dating: -6,
	injury: 2,
	viral_moment: 8,
	fan_conflict: -12,
	group_tension: -4,
	media_praise: 6,
	award_nomination: 10,
	collab_opportunity: 4,
	charity_event: 12
};

const SEVERITY_MULT: Record<string, number> = {
	minor: 0.5,
	moderate: 1.0,
	major: 1.5
};

/** P7-07: Atualiza reputação com base em eventos da semana. */
export function updateReputation(
	rep: IdolReputation,
	events: GameEvent[]
): IdolReputation {
	let { publicImage, fanAffinity } = rep;

	for (const ev of events) {
		if (ev.targetId !== rep.idolId) continue;
		const mult = SEVERITY_MULT[ev.severity] ?? 1;
		publicImage += Math.round((EVENT_IMAGE_DELTA[ev.type] ?? 0) * mult);
		fanAffinity += Math.round((EVENT_AFFINITY_DELTA[ev.type] ?? 0) * mult);
	}

	return {
		...rep,
		publicImage: clamp(publicImage, -100, 100),
		fanAffinity: clamp(fanAffinity, 0, 100)
	};
}

/** P7-08: Adiciona título de legado à idol. */
export function awardLegacyTitle(rep: IdolReputation, title: string): IdolReputation {
	if (rep.legacyTitles.includes(title)) return rep;
	return { ...rep, legacyTitles: [...rep.legacyTitles, title] };
}
