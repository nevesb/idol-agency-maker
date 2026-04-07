import { weeklyUpkeepYen } from '$lib/simulation/economy';
import type { ActiveContract, GameAlert, GameStateV1, IdolRuntime } from '$lib/types/simulation';
import { fameTierFromPoints } from '$lib/simulation/fame';

/**
 * P3-32: 10 named alert types, prioritized.
 * Returns up to 3 most urgent alerts for the dashboard.
 */
export function computeWeeklyAlerts(
	state: GameStateV1,
	afterBalance: number,
	calendarWeek: number
): GameAlert[] {
	const alerts: GameAlert[] = [];
	const upkeep = weeklyUpkeepYen(state.agencyTier);
	const ctrById = new Map(state.contracts.map((c) => [c.id, c]));

	// 1. BURNOUT_IMMINENT — stress >= 90
	for (const idol of state.idols) {
		if (idol.wellness.stress >= 90) {
			alerts.push({
				id: `burnout_imminent_${idol.id}`,
				severity: 'critical',
				message: `${idol.nameRomaji}: burnout imminent (stress ${idol.wellness.stress}).`,
				href: '/roster'
			});
			break;
		}
	}

	// 2. HEALTH_CRISIS — physical < 25
	for (const idol of state.idols) {
		if (idol.wellness.physical < 25) {
			alerts.push({
				id: `health_crisis_${idol.id}`,
				severity: 'critical',
				message: `${idol.nameRomaji}: health crisis — cancel activities immediately.`,
				href: '/roster'
			});
			break;
		}
	}

	// 3. BANKRUPTCY_RISK — balance < 2 weeks upkeep
	if (afterBalance < upkeep * 2) {
		alerts.push({
			id: 'bankruptcy_risk',
			severity: 'critical',
			message: `Balance covers less than 2 weeks of upkeep. Risk of bankruptcy.`,
			href: '/agencia'
		});
	}

	// 4. CASH_LOW — balance < 4 weeks upkeep
	if (afterBalance >= upkeep * 2 && afterBalance < upkeep * 4) {
		alerts.push({
			id: 'cash_low',
			severity: 'warn',
			message: `Low cash: balance covers ~${Math.floor(afterBalance / upkeep)} weeks.`,
			href: '/agencia'
		});
	}

	// 5. STRESS_ELEVATED — stress 65-90
	for (const idol of state.idols) {
		if (idol.wellness.stress >= 65 && idol.wellness.stress < 90) {
			alerts.push({
				id: `stress_elevated_${idol.id}`,
				severity: 'warn',
				message: `${idol.nameRomaji}: elevated stress (${idol.wellness.stress}) — reduce workload.`,
				href: '/operacoes'
			});
			break;
		}
	}

	// 6. CONTRACT_EXPIRING — within 4 weeks
	for (const idol of state.idols) {
		if (!idol.contractId) continue;
		const c = ctrById.get(idol.contractId) as ActiveContract | undefined;
		if (!c || c.status !== 'active') continue;
		const left = c.expiresWeek - calendarWeek;
		if (left <= 4 && left > 0) {
			alerts.push({
				id: `contract_expiring_${c.id}`,
				severity: 'warn',
				message: `${idol.nameRomaji}'s contract expires in ${left} week(s).`,
				href: `/roster/${idol.id}`
			});
			break;
		}
	}

	// 7. MOTIVATION_LOW — motivation < 30
	for (const idol of state.idols) {
		if (idol.wellness.motivation < 30) {
			alerts.push({
				id: `motivation_low_${idol.id}`,
				severity: 'warn',
				message: `${idol.nameRomaji}: very low motivation (${idol.wellness.motivation}).`,
				href: '/roster'
			});
			break;
		}
	}

	// 8. NO_CONTRACTS — idols without contract
	const uncontracted = state.idols.filter((i) => !i.contractId);
	if (uncontracted.length > 0) {
		alerts.push({
			id: 'no_contracts',
			severity: 'info',
			message: `${uncontracted.length} idol(s) without active contract.`,
			href: '/roster'
		});
	}

	// 9. FAME_DECLINING — any idol lost fame tier this cycle
	for (const idol of state.idols) {
		if (idol.famePoints > 0 && idol.famePoints < 200 && idol.weeksInactive > 4) {
			alerts.push({
				id: `fame_declining_${idol.id}`,
				severity: 'info',
				message: `${idol.nameRomaji}: fame declining due to inactivity.`,
				href: '/operacoes'
			});
			break;
		}
	}

	// 10. ROSTER_EMPTY — no idols at all
	if (state.idols.length === 0) {
		alerts.push({
			id: 'roster_empty',
			severity: 'critical',
			message: `No idols in roster. Visit market to sign talent.`,
			href: '/mercado'
		});
	}

	const rank = { critical: 0, warn: 1, info: 2 };
	alerts.sort((a, b) => rank[a.severity] - rank[b.severity]);
	return alerts.slice(0, 3);
}

export function computeAgencyMood(
	idols: IdolRuntime[],
	jobSuccessRatio: number
): GameStateV1['agencyMood'] {
	if (idols.length === 0) return 'neutral';
	const avgHappy =
		idols.reduce((a, i) => a + i.wellness.happiness + (100 - i.wellness.stress), 0) /
		(2 * idols.length);
	if (avgHappy >= 72 && jobSuccessRatio >= 0.6) return 'great';
	if (avgHappy >= 60 && jobSuccessRatio >= 0.45) return 'good';
	if (avgHappy >= 45) return 'neutral';
	if (avgHappy >= 32) return 'poor';
	return 'crisis';
}
