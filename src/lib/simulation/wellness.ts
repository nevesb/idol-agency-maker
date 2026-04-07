import type { JobOutcomeKind, WellnessState } from '$lib/types/simulation';

export const DEFAULT_WELLNESS: WellnessState = {
	physical: 75,
	happiness: 70,
	stress: 25,
	motivation: 65
};

function clamp(n: number, lo = 0, hi = 100): number {
	return Math.min(hi, Math.max(lo, n));
}

/** GDD job-assignment: health_factor × stress_factor */
export function wellnessPerformanceMultipliers(w: WellnessState): {
	healthFactor: number;
	stressFactor: number;
} {
	const healthFactor = w.physical >= 60 ? 1.0 : w.physical >= 35 ? 0.8 : 0.5;
	const stressFactor = w.stress <= 50 ? 1.0 : w.stress <= 75 ? 0.9 : 0.7;
	return { healthFactor, stressFactor };
}

/** Tick leve por semana (MVP) — `jobOutcome: null` = semana sem job resolvido (descanso). */
export function tickWellnessWeekly(
	w: WellnessState,
	opts: { overwork: boolean; jobOutcome: JobOutcomeKind | null }
): WellnessState {
	let { physical, happiness, stress, motivation } = { ...w };
	if (opts.overwork) {
		stress = clamp(stress + 8);
		physical = clamp(physical - 3);
		motivation = clamp(motivation - 2);
	} else {
		stress = clamp(stress - 4);
		physical = clamp(physical + 2);
	}
	if (opts.jobOutcome === 'success') {
		happiness = clamp(happiness + 3);
		motivation = clamp(motivation + 4);
	} else if (opts.jobOutcome === 'partial') {
		happiness = clamp(happiness + 1);
		motivation = clamp(motivation + 1);
		stress = clamp(stress + 2);
	} else if (opts.jobOutcome === 'failure') {
		happiness = clamp(happiness - 5);
		motivation = clamp(motivation - 6);
		stress = clamp(stress + 5);
	}
	return {
		physical: clamp(physical),
		happiness: clamp(happiness),
		stress: clamp(stress),
		motivation: clamp(motivation)
	};
}

/** 1/7 of the weekly tick — used by day-by-day (Live) simulation. */
export function tickWellnessDaily(
	w: WellnessState,
	opts: { overwork: boolean; jobOutcome: JobOutcomeKind | null }
): WellnessState {
	let { physical, happiness, stress, motivation } = { ...w };
	if (opts.overwork) {
		stress = clamp(stress + 8 / 7);
		physical = clamp(physical - 3 / 7);
		motivation = clamp(motivation - 2 / 7);
	} else {
		stress = clamp(stress - 4 / 7);
		physical = clamp(physical + 2 / 7);
	}
	if (opts.jobOutcome === 'success') {
		happiness = clamp(happiness + 3 / 7);
		motivation = clamp(motivation + 4 / 7);
	} else if (opts.jobOutcome === 'partial') {
		happiness = clamp(happiness + 1 / 7);
		motivation = clamp(motivation + 1 / 7);
		stress = clamp(stress + 2 / 7);
	} else if (opts.jobOutcome === 'failure') {
		happiness = clamp(happiness - 5 / 7);
		motivation = clamp(motivation - 6 / 7);
		stress = clamp(stress + 5 / 7);
	}
	return {
		physical: clamp(physical),
		happiness: clamp(happiness),
		stress: clamp(stress),
		motivation: clamp(motivation)
	};
}
