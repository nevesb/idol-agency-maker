import type {
	GameStateV1,
	GameEvent,
	GameEventType,
	GameEventSeverity
} from '$lib/types/simulation';
import { mulberry32, randomBetween } from '$lib/simulation/rng';

const EVENT_TYPES: GameEventType[] = [
	'scandal_personal',
	'scandal_dating',
	'injury',
	'viral_moment',
	'fan_conflict',
	'group_tension',
	'media_praise',
	'award_nomination',
	'collab_opportunity',
	'charity_event'
];

const POSITIVE_EVENTS: Set<GameEventType> = new Set([
	'viral_moment',
	'media_praise',
	'award_nomination',
	'collab_opportunity',
	'charity_event'
]);

const SEVERITY_WEIGHTS: Record<GameEventSeverity, number> = {
	minor: 0.5,
	moderate: 0.35,
	major: 0.15
};

const DESCRIPTIONS: Record<GameEventType, string> = {
	scandal_personal: 'A personal scandal surfaces in tabloids.',
	scandal_dating: 'Dating rumors spread across social media.',
	injury: 'An idol sustains an injury during rehearsal.',
	viral_moment: 'A performance clip goes viral online!',
	fan_conflict: 'Fan communities clash over controversial statements.',
	group_tension: 'Internal group tension reported backstage.',
	media_praise: 'Major outlet publishes a glowing profile piece.',
	award_nomination: 'Nominated for a prestigious industry award!',
	collab_opportunity: 'A high-profile collaboration offer arrives.',
	charity_event: 'A charity event invitation brings positive press.'
};

function rollSeverity(rng: () => number): GameEventSeverity {
	const roll = rng();
	if (roll < SEVERITY_WEIGHTS.minor) return 'minor';
	if (roll < SEVERITY_WEIGHTS.minor + SEVERITY_WEIGHTS.moderate) return 'moderate';
	return 'major';
}

function severityMultiplier(severity: GameEventSeverity): number {
	switch (severity) {
		case 'minor':
			return 1;
		case 'moderate':
			return 2;
		case 'major':
			return 3;
	}
}

function buildConsequences(
	type: GameEventType,
	severity: GameEventSeverity
): GameEvent['consequences'] {
	const mult = severityMultiplier(severity);
	const isPositive = POSITIVE_EVENTS.has(type);

	switch (type) {
		case 'scandal_personal':
		case 'scandal_dating':
			return {
				wellnessDelta: { stress: 8 * mult, happiness: -5 * mult },
				fameDelta: -30 * mult
			};
		case 'injury':
			return {
				wellnessDelta: { physical: -15 * mult, stress: 5 * mult }
			};
		case 'viral_moment':
			return {
				fameDelta: 50 * mult,
				wellnessDelta: { happiness: 5 * mult, motivation: 5 * mult }
			};
		case 'fan_conflict':
			return {
				wellnessDelta: { stress: 6 * mult, happiness: -3 * mult },
				fameDelta: -10 * mult
			};
		case 'group_tension':
			return {
				wellnessDelta: { happiness: -8 * mult, motivation: -5 * mult, stress: 4 * mult }
			};
		case 'media_praise':
			return {
				fameDelta: 40 * mult,
				wellnessDelta: { happiness: 6 * mult, motivation: 4 * mult }
			};
		case 'award_nomination':
			return {
				fameDelta: 60 * mult,
				wellnessDelta: { happiness: 10 * mult, motivation: 8 * mult }
			};
		case 'collab_opportunity':
			return {
				fameDelta: 25 * mult,
				balanceDelta: isPositive ? 50_000 * mult : 0
			};
		case 'charity_event':
			return {
				fameDelta: 20 * mult,
				wellnessDelta: { happiness: 4 * mult },
				balanceDelta: -20_000 * mult
			};
	}
}

/** P6-05: Generate 0-2 random events per week based on state. */
export function generateWeeklyEvents(
	state: GameStateV1,
	seed: number,
	week: number
): GameEvent[] {
	if (state.idols.length === 0) return [];

	const rng = mulberry32((seed ^ (week * 0x9e3779b9)) >>> 0);
	const eventCountRoll = rng();
	const eventCount = eventCountRoll < 0.3 ? 0 : eventCountRoll < 0.75 ? 1 : 2;

	const events: GameEvent[] = [];
	for (let i = 0; i < eventCount; i++) {
		const typeIdx = Math.floor(rng() * EVENT_TYPES.length);
		const type = EVENT_TYPES[typeIdx]!;
		const severity = rollSeverity(rng);
		const targetIdx = Math.floor(rng() * state.idols.length);
		const targetId = state.idols[targetIdx]!.id;

		events.push({
			id: `evt_${week}_${i}`,
			week,
			type,
			severity,
			targetId,
			description: DESCRIPTIONS[type],
			consequences: buildConsequences(type, severity)
		});
	}

	return events;
}

function clamp(n: number, lo = 0, hi = 100): number {
	return Math.min(hi, Math.max(lo, n));
}

/** P6-07: Apply event consequences to game state (wellness, fame, balance). */
export function applyEventConsequences(state: GameStateV1, event: GameEvent): GameStateV1 {
	const { consequences, targetId } = event;
	let { balanceYen } = state;

	if (consequences.balanceDelta) {
		balanceYen += consequences.balanceDelta;
	}

	const idols = state.idols.map((idol) => {
		if (idol.id !== targetId) return idol;

		let { famePoints } = idol;
		if (consequences.fameDelta) {
			famePoints = Math.max(0, Math.min(10_000, famePoints + consequences.fameDelta));
		}

		let wellness = { ...idol.wellness };
		if (consequences.wellnessDelta) {
			const d = consequences.wellnessDelta;
			if (d.physical !== undefined) wellness.physical = clamp(wellness.physical + d.physical);
			if (d.happiness !== undefined) wellness.happiness = clamp(wellness.happiness + d.happiness);
			if (d.stress !== undefined) wellness.stress = clamp(wellness.stress + d.stress);
			if (d.motivation !== undefined)
				wellness.motivation = clamp(wellness.motivation + d.motivation);
		}

		return { ...idol, famePoints, wellness };
	});

	const ledgerEntry = consequences.balanceDelta
		? [
				{
					week: event.week,
					kind: 'event',
					amountYen: consequences.balanceDelta,
					note: `${event.type}: ${event.description}`
				}
			]
		: [];

	return {
		...state,
		balanceYen,
		idols,
		ledger: [...state.ledger, ...ledgerEntry]
	};
}
