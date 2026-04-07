import type { GameStateV1 } from '$lib/types/simulation';

/** P7-01: Meta-objetivo do jogador/proprietário. */
export interface OwnerGoal {
	id: string;
	description: string;
	targetMetric: 'fame' | 'revenue' | 'rosterSize';
	targetValue: number;
	currentValue: number;
	completed: boolean;
}

/** P7-02: Gera 3 metas-padrão de alto nível para o proprietário. */
export function generateOwnerGoals(state: GameStateV1): OwnerGoal[] {
	const totalFame = state.idols.reduce((sum, i) => sum + i.famePoints, 0);
	const trailingRevenue = state.ledger
		.filter((e) => e.week > state.absoluteWeek - 12 && e.amountYen > 0)
		.reduce((sum, e) => sum + e.amountYen, 0);

	return [
		{
			id: 'goal_fame',
			description: 'Alcançar fama total de 10 000 pontos',
			targetMetric: 'fame',
			targetValue: 10_000,
			currentValue: totalFame,
			completed: totalFame >= 10_000
		},
		{
			id: 'goal_revenue',
			description: 'Gerar ¥5 000 000 de receita em 12 semanas',
			targetMetric: 'revenue',
			targetValue: 5_000_000,
			currentValue: trailingRevenue,
			completed: trailingRevenue >= 5_000_000
		},
		{
			id: 'goal_roster',
			description: 'Ter pelo menos 5 idols contratadas',
			targetMetric: 'rosterSize',
			targetValue: 5,
			currentValue: state.idols.length,
			completed: state.idols.length >= 5
		}
	];
}

/** P7-03: Verifica e marca metas concluídas. */
export function checkGoalCompletion(goals: OwnerGoal[], state: GameStateV1): OwnerGoal[] {
	const totalFame = state.idols.reduce((sum, i) => sum + i.famePoints, 0);
	const trailingRevenue = state.ledger
		.filter((e) => e.week > state.absoluteWeek - 12 && e.amountYen > 0)
		.reduce((sum, e) => sum + e.amountYen, 0);

	const metricValue: Record<OwnerGoal['targetMetric'], number> = {
		fame: totalFame,
		revenue: trailingRevenue,
		rosterSize: state.idols.length
	};

	return goals.map((g) => {
		const current = metricValue[g.targetMetric];
		return { ...g, currentValue: current, completed: current >= g.targetValue };
	});
}
