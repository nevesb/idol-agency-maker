import type { Headline, RivalAgencyStub, IdolRuntime } from '$lib/types/simulation';
import { mulberry32, randomBetween } from '$lib/simulation/rng';

function aggressionFromId(rivalId: string, gameSeed: number): number {
	let h = (gameSeed ^ 0x51ed) >>> 0;
	for (let i = 0; i < rivalId.length; i++) {
		h = Math.imul(h ^ rivalId.charCodeAt(i), 0x01000193) >>> 0;
	}
	return (h % 100) / 100;
}

/** P3-19: Weekly decision types for rival AI */
export type RivalDecision =
	| { type: 'scout'; spend: number }
	| { type: 'invest_facilities'; spend: number }
	| { type: 'hire_idol'; spend: number; targetTier: string }
	| { type: 'idle' };

function pickRivalDecision(
	rival: RivalAgencyStub,
	agg: number,
	rng: () => number
): RivalDecision {
	const roll = rng();
	if (roll < 0.2 + agg * 0.15) {
		const spend = Math.min(180_000, Math.round(rival.budgetYen * (0.04 + rng() * 0.05)));
		return { type: 'scout', spend };
	}
	if (roll < 0.35 + agg * 0.1) {
		const spend = Math.round(rival.budgetYen * 0.02);
		return { type: 'invest_facilities', spend };
	}
	if (roll < 0.5 + agg * 0.2) {
		const spend = Math.round(rival.budgetYen * (0.05 + rng() * 0.08));
		const targetTier = rng() < 0.3 ? 'B' : rng() < 0.6 ? 'C' : 'D';
		return { type: 'hire_idol', spend, targetTier };
	}
	return { type: 'idle' };
}

/**
 * P3-18–P3-21: Rich rival weekly tick with decisions, budget drift, and buyout attempts.
 */
export function tickRivalWeek(
	rivals: RivalAgencyStub[],
	gameSeed: number,
	absoluteWeek: number
): {
	rivals: RivalAgencyStub[];
	rivalNotes: string[];
	rivalHeadlines: Headline[];
	buyoutAttempts: { rivalId: string; targetIdolId?: string }[];
} {
	const rng = mulberry32((gameSeed ^ (absoluteWeek * 0x9e3779b1)) >>> 0);
	const rivalNotes: string[] = [];
	const rivalHeadlines: Headline[] = [];
	const buyoutAttempts: { rivalId: string; targetIdolId?: string }[] = [];

	const next = rivals.map((r) => {
		const agg = aggressionFromId(r.id, gameSeed);
		const tierMult =
			r.tier === 'elite' ? 1.25 : r.tier === 'large' ? 1.1 : r.tier === 'medium' ? 1 : 0.85;

		const drift = (rng() - 0.46) * (350_000 + agg * 400_000) * tierMult;
		let budget = Math.round(r.budgetYen + drift);
		budget = Math.max(200_000, budget);

		const decision = pickRivalDecision({ ...r, budgetYen: budget }, agg, rng);

		switch (decision.type) {
			case 'scout':
				budget -= decision.spend;
				rivalNotes.push(`${r.name} spent ${decision.spend.toLocaleString()} on scouting.`);
				if (rng() < 0.35) {
					rivalHeadlines.push({
						week: absoluteWeek,
						kind: 'rival',
						text: `${r.name} intensifies scouting operations.`,
						drama: 0.35 + agg * 0.2
					});
				}
				break;
			case 'invest_facilities':
				budget -= decision.spend;
				rivalNotes.push(`${r.name} invested in facilities.`);
				break;
			case 'hire_idol':
				budget -= decision.spend;
				rivalNotes.push(`${r.name} signed a tier-${decision.targetTier} idol.`);
				break;
			case 'idle':
				break;
		}

		if (absoluteWeek % 4 === 0 && rng() < 0.08 + agg * 0.12) {
			buyoutAttempts.push({ rivalId: r.id });
			rivalHeadlines.push({
				week: absoluteWeek,
				kind: 'rival',
				text: `Buyout rumors involving ${r.name} — agencies on alert.`,
				drama: 0.65 + rng() * 0.2
			});
			rivalNotes.push(`${r.name}: buyout rumors in the press.`);
		}

		return { ...r, budgetYen: Math.max(200_000, budget) };
	});

	return { rivals: next, rivalNotes, rivalHeadlines, buyoutAttempts };
}

/** P3-20: Process buyout attempt on player's idol */
export function processBuyoutAttempt(
	idol: IdolRuntime,
	offerYen: number,
	rivalName: string
): { accepted: boolean; reason: string } {
	const loyalty = idol.hidden.loyalty;
	const happiness = idol.wellness.happiness;

	if (loyalty >= 15 && happiness >= 60) {
		return { accepted: false, reason: `${idol.nameRomaji} is loyal and happy.` };
	}
	if (happiness < 30) {
		return { accepted: true, reason: `${idol.nameRomaji} was unhappy and accepted ${rivalName}'s offer.` };
	}
	const threshold = 500_000 + loyalty * 50_000;
	if (offerYen >= threshold) {
		return { accepted: true, reason: `${rivalName} offered enough to tempt ${idol.nameRomaji}.` };
	}
	return { accepted: false, reason: `${idol.nameRomaji} rejected ${rivalName}'s offer.` };
}

/** @deprecated usar tickRivalWeek */
export function tickRivalBudgets(
	rivals: RivalAgencyStub[],
	gameSeed: number,
	absoluteWeek: number
): RivalAgencyStub[] {
	return tickRivalWeek(rivals, gameSeed, absoluteWeek).rivals;
}
