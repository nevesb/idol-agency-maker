import type { GameStateV1, MonthlyReport, IdolROI } from '$lib/types/simulation';

/** P6-18: Compute ROI for a single idol over last 4 weeks. */
export function computeIdolROI(state: GameStateV1, idolId: string): IdolROI {
	const cutoff = state.absoluteWeek - 4;

	const revenue = state.ledger
		.filter((e) => e.week > cutoff && e.amountYen > 0 && e.note.includes(idolId))
		.reduce((sum, e) => sum + e.amountYen, 0);

	const contract = state.contracts.find(
		(c) => c.idolId === idolId && c.status === 'active'
	);
	const weeklySalary = contract ? Math.round(contract.clauses.salaryYenPerMonth / 4) : 0;
	const cost = weeklySalary * 4;

	const roi = cost > 0 ? (revenue - cost) / cost : revenue > 0 ? Infinity : 0;

	return { idolId, revenue, cost, roi: Math.round(roi * 100) / 100 };
}

/** P6-19: Simple linear projection of balance over N weeks. */
export function projectFinances(
	state: GameStateV1,
	weeks: number
): { week: number; projectedBalance: number }[] {
	const recentWeeks = 4;
	const cutoff = state.absoluteWeek - recentWeeks;
	const recent = state.ledger.filter((e) => e.week > cutoff);

	const totalIncome = recent
		.filter((e) => e.amountYen > 0)
		.reduce((s, e) => s + e.amountYen, 0);
	const totalExpense = recent
		.filter((e) => e.amountYen < 0)
		.reduce((s, e) => s + e.amountYen, 0);

	const avgWeeklyNet = (totalIncome + totalExpense) / Math.max(1, recentWeeks);
	const projections: { week: number; projectedBalance: number }[] = [];

	for (let w = 1; w <= weeks; w++) {
		projections.push({
			week: state.absoluteWeek + w,
			projectedBalance: Math.round(state.balanceYen + avgWeeklyNet * w)
		});
	}
	return projections;
}

/** P6-17: Generate a monthly financial report aggregating the last 4 weeks. */
export function generateMonthlyReport(state: GameStateV1): MonthlyReport {
	const cutoff = state.absoluteWeek - 4;
	const recent = state.ledger.filter((e) => e.week > cutoff);

	const totalRevenue = recent
		.filter((e) => e.amountYen > 0)
		.reduce((s, e) => s + e.amountYen, 0);
	const totalExpenses = Math.abs(
		recent.filter((e) => e.amountYen < 0).reduce((s, e) => s + e.amountYen, 0)
	);

	const roiByIdol = state.idols.map((idol) => computeIdolROI(state, idol.id));
	const projections = projectFinances(state, 4);
	const month = Math.ceil(state.absoluteWeek / 4);

	return {
		month,
		totalRevenue,
		totalExpenses,
		netIncome: totalRevenue - totalExpenses,
		roiByIdol,
		projections
	};
}
