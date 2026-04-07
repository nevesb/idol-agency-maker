import type { IdolRuntime, JobPosting, JobResultLog } from '$lib/types/simulation';
import { idolAverageOnJobStats, applyJobOutcome, outcomeFromPerformance, jobRngSeed } from './jobs';
import { mulberry32, randomBetween } from './rng';
import { wellnessPerformanceMultipliers } from './wellness';

/** P3-05: Resolve a group job — average performance with synergy bonus */
export function resolveGroupJob(input: {
	idols: IdolRuntime[];
	job: JobPosting;
	gameSeed: number;
	absoluteWeek: number;
	synergyBonus: number;
	strategyMultiplier?: number;
}): { results: JobResultLog[]; groupPerformance: number } {
	const { idols, job, gameSeed, absoluteWeek, synergyBonus, strategyMultiplier = 1 } = input;
	const rng = mulberry32(jobRngSeed(gameSeed, absoluteWeek, job.id));

	let sumPerf = 0;
	const results: JobResultLog[] = [];

	for (const idol of idols) {
		const statScore = idolAverageOnJobStats(idol.visible, job.primaryStats) / 100;
		const { healthFactor, stressFactor } = wellnessPerformanceMultipliers(idol.wellness);
		const randomFactor = randomBetween(rng, 0.85, 1.15);
		let perf = statScore * healthFactor * stressFactor * randomFactor * strategyMultiplier;
		perf *= 1 + (idol.visible.charisma - 50) / 200;
		perf = Math.max(0, Math.min(1.5, perf));
		sumPerf += perf;
	}

	const avgPerf = sumPerf / idols.length;
	const groupPerformance = Math.min(1.5, avgPerf * (1 + synergyBonus));
	const outcome = outcomeFromPerformance(groupPerformance);
	const { revenueYen, fameDelta } = applyJobOutcome(job, groupPerformance, outcome);

	const perIdolRevenue = Math.round(revenueYen / idols.length);
	const perIdolFame = Math.round(fameDelta / idols.length);

	for (const idol of idols) {
		results.push({
			jobId: job.id,
			idolId: idol.id,
			performance: groupPerformance,
			outcome,
			revenueYen: perIdolRevenue,
			fameDelta: perIdolFame
		});
	}

	return { results, groupPerformance };
}

/** P3-04: XP growth bonus from job performance */
export function xpGrowthBonus(performance: number, outcome: 'success' | 'partial' | 'failure'): number {
	const base = outcome === 'success' ? 2 : outcome === 'partial' ? 1 : 0;
	return base + Math.round(performance * 3);
}

/** P3-07: Cross-agency collab — split revenue between agencies */
export function collabRevenueSplit(
	totalRevenue: number,
	playerShare: number
): { playerCut: number; rivalCut: number } {
	const playerCut = Math.round(totalRevenue * playerShare);
	return { playerCut, rivalCut: totalRevenue - playerCut };
}
