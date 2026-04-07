import type { IdolVisibleStats } from '$lib/types/game';
import type { IdolRuntime } from '$lib/types/simulation';
import {
	personalityLabelKey,
	weeklyAttributeGrowth,
	weeklyPhysicalDecay
} from '$lib/simulation/stats';

const VISIBLE_KEYS: (keyof IdolVisibleStats)[] = [
	'vocal',
	'dance',
	'acting',
	'variety',
	'visual',
	'charisma',
	'communication',
	'aura',
	'stamina',
	'discipline',
	'mentality',
	'adaptability'
];

/**
 * P1-03 / P1-04 — crescimento natural vs pós-job + decaimento físico semanal (fim do tick).
 */
export function applyWeeklyIdolStatTick(idol: IdolRuntime, hadJobThisWeek: boolean): IdolRuntime {
	const source = hadJobThisWeek ? 'jobRelated' : 'natural';
	let visible: IdolVisibleStats = { ...idol.visible };

	for (const key of VISIBLE_KEYS) {
		const delta = weeklyAttributeGrowth({
			pt: idol.potential,
			attributeValue: visible[key],
			attributeCap: 100,
			age: idol.age,
			visible,
			hidden: idol.hidden,
			activity: idol.activityState,
			source,
			basePerWeek: 0.28
		});
		visible[key] = Math.min(100, Math.round(visible[key] + delta));
	}

	const decay = weeklyPhysicalDecay({
		age: idol.age,
		activity: idol.activityState,
		visible
	});
	for (const k of ['stamina', 'dance', 'visual'] as const) {
		const loss = decay[k];
		if (loss !== undefined && loss > 0) {
			visible[k] = Math.max(1, Math.round(visible[k] - loss));
		}
	}

	return {
		...idol,
		visible,
		personalityLabelKey: personalityLabelKey(idol.hidden)
	};
}
