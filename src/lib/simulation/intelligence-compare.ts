import type { IdolRuntime, RivalAgencyStub } from '$lib/types/simulation';
import { fameTierFromPoints } from '$lib/simulation/fame';
import { computeTalentAverage } from '$lib/simulation/stats';
import { wellnessOverallScore } from '$lib/simulation/economy';

/** P3-34: Idol vs Idol comparison */
export interface IdolComparison {
	idolA: string;
	idolB: string;
	statsDelta: number;
	fameDelta: number;
	wellnessDelta: number;
	verdict: 'A' | 'B' | 'tie';
}

export function compareIdols(a: IdolRuntime, b: IdolRuntime): IdolComparison {
	const statsA = computeTalentAverage(a.visible);
	const statsB = computeTalentAverage(b.visible);
	const wellA = wellnessOverallScore(a);
	const wellB = wellnessOverallScore(b);
	const scoreA = statsA + a.famePoints * 0.01 + wellA * 0.1;
	const scoreB = statsB + b.famePoints * 0.01 + wellB * 0.1;

	return {
		idolA: a.id,
		idolB: b.id,
		statsDelta: statsA - statsB,
		fameDelta: a.famePoints - b.famePoints,
		wellnessDelta: wellA - wellB,
		verdict: Math.abs(scoreA - scoreB) < 2 ? 'tie' : scoreA > scoreB ? 'A' : 'B'
	};
}

/** P3-34: Agency vs Rival comparison */
export interface AgencyComparison {
	playerFame: number;
	rivalBudget: number;
	playerIdolCount: number;
	rivalTier: string;
	advantage: 'player' | 'rival' | 'even';
}

export function compareAgencyVsRival(
	idols: IdolRuntime[],
	playerBalance: number,
	rival: RivalAgencyStub
): AgencyComparison {
	const playerFame = idols.reduce((s, i) => s + i.famePoints, 0);
	const playerScore = playerFame * 0.01 + playerBalance * 0.001 + idols.length * 10;
	const rivalScore = rival.budgetYen * 0.001 + (rival.tier === 'elite' ? 50 : rival.tier === 'large' ? 30 : 15);

	return {
		playerFame,
		rivalBudget: rival.budgetYen,
		playerIdolCount: idols.length,
		rivalTier: rival.tier,
		advantage: Math.abs(playerScore - rivalScore) < 10 ? 'even' : playerScore > rivalScore ? 'player' : 'rival'
	};
}

/** P3-35: Burnout risk prediction (0-1) */
export function burnoutRisk(idol: IdolRuntime): number {
	const w = idol.wellness;
	const stressRisk = w.stress / 100;
	const healthRisk = (100 - w.physical) / 200;
	const motivationRisk = (100 - w.motivation) / 200;
	return Math.min(1, stressRisk + healthRisk + motivationRisk);
}

/** P3-35: Financial projection — estimated weeks until bankruptcy at current burn rate */
export function weeksUntilBankruptcy(
	balance: number,
	weeklyBurn: number
): number | null {
	if (weeklyBurn <= 0) return null;
	if (balance <= 0) return 0;
	return Math.floor(balance / weeklyBurn);
}

/** P3-35: Contract renewal window — weeks left before expire */
export function contractRenewalWindow(
	expiresWeek: number,
	currentWeek: number
): { weeksLeft: number; urgency: 'safe' | 'soon' | 'urgent' | 'expired' } {
	const left = expiresWeek - currentWeek;
	if (left <= 0) return { weeksLeft: 0, urgency: 'expired' };
	if (left <= 2) return { weeksLeft: left, urgency: 'urgent' };
	if (left <= 6) return { weeksLeft: left, urgency: 'soon' };
	return { weeksLeft: left, urgency: 'safe' };
}
