import type { GameStateV1 } from '$lib/types/simulation';

/** P7-20: Meta trimestral do planejamento da agência. */
export interface QuarterlyGoal {
	id: string;
	description: string;
	metric: 'revenue' | 'fame' | 'rosterSize' | 'jobsCompleted' | 'tierPromotion';
	target: number;
	progress: number;
}

/** P7-21: Gera 3–5 metas trimestrais com base no estado atual. */
export function generateQuarterlyGoals(state: GameStateV1): QuarterlyGoal[] {
	const totalFame = state.idols.reduce((sum, i) => sum + i.famePoints, 0);
	const rosterSize = state.idols.length;

	const goals: QuarterlyGoal[] = [
		{
			id: `qg_rev_${state.absoluteWeek}`,
			description: 'Receita trimestral ≥ ¥2 000 000',
			metric: 'revenue',
			target: 2_000_000,
			progress: 0
		},
		{
			id: `qg_fame_${state.absoluteWeek}`,
			description: `Aumentar fama total em 3 000 pontos`,
			metric: 'fame',
			target: totalFame + 3_000,
			progress: totalFame
		},
		{
			id: `qg_jobs_${state.absoluteWeek}`,
			description: 'Completar 12 jobs no trimestre',
			metric: 'jobsCompleted',
			target: 12,
			progress: 0
		}
	];

	if (rosterSize < 5) {
		goals.push({
			id: `qg_roster_${state.absoluteWeek}`,
			description: 'Recrutar pelo menos 2 idols novas',
			metric: 'rosterSize',
			target: rosterSize + 2,
			progress: rosterSize
		});
	}

	if (state.agencyTier !== 'elite') {
		goals.push({
			id: `qg_tier_${state.absoluteWeek}`,
			description: 'Promover a agência ao próximo tier',
			metric: 'tierPromotion',
			target: 1,
			progress: 0
		});
	}

	return goals;
}

/** P7-22: Avalia progresso do trimestre — retorna porcentagem média de conclusão. */
export function evaluateQuarterProgress(
	goals: QuarterlyGoal[],
	state: GameStateV1
): number {
	if (goals.length === 0) return 0;

	const totalFame = state.idols.reduce((sum, i) => sum + i.famePoints, 0);
	const quarterWeeks = 12;
	const trailingRevenue = state.ledger
		.filter((e) => e.week > state.absoluteWeek - quarterWeeks && e.amountYen > 0)
		.reduce((sum, e) => sum + e.amountYen, 0);
	const jobsDone = state.jobHistory.filter(
		(j) => j.week > state.absoluteWeek - quarterWeeks
	).length;

	const metricValue: Record<QuarterlyGoal['metric'], number> = {
		revenue: trailingRevenue,
		fame: totalFame,
		rosterSize: state.idols.length,
		jobsCompleted: jobsDone,
		tierPromotion: 0
	};

	let totalPct = 0;
	for (const g of goals) {
		const current = metricValue[g.metric];
		const pct = g.target > 0 ? Math.min(1, current / g.target) : 0;
		totalPct += pct;
	}

	return Math.round((totalPct / goals.length) * 100);
}
