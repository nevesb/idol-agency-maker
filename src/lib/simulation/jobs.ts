import type { IdolVisibleStats } from '$lib/types/game';
import type { JobOutcomeKind, JobPosting, JobResultLog } from '$lib/types/simulation';
import { computeTalentAverage } from '$lib/simulation/stats';
import { meetsMinFameTier } from '$lib/simulation/fame';
import { wellnessPerformanceMultipliers } from '$lib/simulation/wellness';
import type { IdolRuntime } from '$lib/types/simulation';
import { mulberry32, randomBetween } from '$lib/simulation/rng';

const CONSISTENCY_WEIGHT = 0.3;

/** Requisito médio mínimo: 10 + difficulty * 5 (GDD job-assignment) */
export function jobAverageStatRequirement(difficulty: number): number {
	return 10 + difficulty * 5;
}

export function idolAverageOnJobStats(
	visible: IdolVisibleStats,
	keys: (keyof IdolVisibleStats)[]
): number {
	if (keys.length === 0) return computeTalentAverage(visible);
	let sum = 0;
	for (const k of keys) sum += visible[k];
	return sum / keys.length;
}

export function canIdolTakeJob(idol: IdolRuntime, job: JobPosting): boolean {
	if (!meetsMinFameTier(idol.famePoints, job.minFameTier)) return false;
	const avg = idolAverageOnJobStats(idol.visible, job.primaryStats);
	return avg >= jobAverageStatRequirement(job.difficulty);
}

/**
 * performance = stat_score × mult_consistencia × mult_wellness × mult_difficulty × random_factor
 * depois Carisma universal (GDD)
 */
export function computeJobPerformance(input: {
	idol: IdolRuntime;
	job: JobPosting;
	rng: () => number;
	/** P3-29 estratégia da agência e outros mods (default 1). */
	strategyMultiplier?: number;
}): number {
	const { idol, job, rng, strategyMultiplier = 1 } = input;
	const statScore = idolAverageOnJobStats(idol.visible, job.primaryStats) / 100;

	const c = idol.hidden.consistency;
	const multConsistency = 1.0 + ((c - 10) / 10) * CONSISTENCY_WEIGHT;

	const { healthFactor, stressFactor } = wellnessPerformanceMultipliers(idol.wellness);
	const multWellness = healthFactor * stressFactor;

	const multDifficulty = 1.0 - job.difficulty / 20;

	let randomMin = 0.8;
	let randomMax = 1.2;
	if (c >= 15) {
		randomMin = 0.9;
		randomMax = 1.1;
	} else if (c < 5) {
		randomMin = 0.6;
		randomMax = 1.4;
	}
	const randomFactor = randomBetween(rng, randomMin, randomMax);

	let perf = statScore * multConsistency * multWellness * multDifficulty * randomFactor;

	const charisma = idol.visible.charisma;
	perf *= 1 + (charisma - 50) / 200;
	perf *= strategyMultiplier;

	return Math.max(0, Math.min(1.5, perf));
}

export function outcomeFromPerformance(performance: number): JobOutcomeKind {
	if (performance >= 0.7) return 'success';
	if (performance >= 0.4) return 'partial';
	return 'failure';
}

export function applyJobOutcome(
	job: JobPosting,
	performance: number,
	outcome: JobOutcomeKind
): Pick<JobResultLog, 'revenueYen' | 'fameDelta'> {
	const payment = job.paymentYen;
	const fameBase = job.fameGain;
	switch (outcome) {
		case 'success':
			return { revenueYen: payment, fameDelta: fameBase };
		case 'partial':
			return { revenueYen: Math.round(payment * 0.6), fameDelta: Math.round(fameBase * 0.3) };
		default:
			return {
				revenueYen: Math.round(payment * 0.2),
				fameDelta: Math.round(-fameBase * 0.5)
			};
	}
}

/** Seed derivada para RNG por job+semana (determinístico) */
export function jobRngSeed(gameSeed: number, absoluteWeek: number, jobId: string): number {
	let h = gameSeed ^ (absoluteWeek * 0x9e3779b9);
	for (let i = 0; i < jobId.length; i++) {
		h = Math.imul(h ^ jobId.charCodeAt(i), 0x01000193);
	}
	return h >>> 0;
}

export function resolveAssignedJob(input: {
	idol: IdolRuntime;
	job: JobPosting;
	gameSeed: number;
	absoluteWeek: number;
	strategyMultiplier?: number;
}): JobResultLog {
	const rng = mulberry32(jobRngSeed(input.gameSeed, input.absoluteWeek, input.job.id));
	const performance = computeJobPerformance({
		idol: input.idol,
		job: input.job,
		rng,
		strategyMultiplier: input.strategyMultiplier
	});
	const outcome = outcomeFromPerformance(performance);
	const { revenueYen, fameDelta } = applyJobOutcome(input.job, performance, outcome);
	return {
		jobId: input.job.id,
		idolId: input.idol.id,
		performance,
		outcome,
		revenueYen,
		fameDelta
	};
}
