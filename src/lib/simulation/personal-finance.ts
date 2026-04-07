/** P7-18: Finanças pessoais de uma idol. */
export interface IdolFinance {
	idolId: string;
	/** Poupança acumulada em ¥ */
	savings: number;
	/** Total investido (valor abstrato) */
	investments: number;
	/** Renda mensal corrente */
	monthlyIncome: number;
	/** Despesas fixas mensais */
	expenses: number;
}

/** Despesas base por faixa de renda (MVP simplificado). */
function baseExpenses(income: number): number {
	if (income <= 80_000) return 50_000;
	if (income <= 200_000) return Math.round(income * 0.55);
	return Math.round(income * 0.45);
}

/** P7-19: Tick mensal de finanças pessoais — atualiza savings e expenses. */
export function tickIdolFinance(finance: IdolFinance, salary: number): IdolFinance {
	const income = salary;
	const expenses = baseExpenses(income);
	const net = income - expenses;

	const investmentRate = net > 0 ? 0.1 : 0;
	const investmentDelta = Math.round(net * investmentRate);
	const savingsDelta = net - investmentDelta;

	return {
		...finance,
		monthlyIncome: income,
		expenses,
		savings: Math.max(0, finance.savings + savingsDelta),
		investments: Math.max(0, finance.investments + investmentDelta)
	};
}
