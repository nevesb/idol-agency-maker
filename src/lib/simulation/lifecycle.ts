import type { IdolActivityState } from '$lib/types/game';
import type { IdolRuntime } from '$lib/types/simulation';

/** P7-14: Progressão etária — cada 48 semanas = +1 ano. */
export function tickIdolAging(idol: IdolRuntime, currentWeek: number): IdolRuntime {
	const weeksPerYear = 48;
	const newAge = idol.age + (currentWeek % weeksPerYear === 0 ? 1 : 0);
	if (newAge === idol.age) return idol;
	return { ...idol, age: newAge };
}

/** P7-15: Condições para debut — training completo + stats mínimos. */
export function checkDebut(idol: IdolRuntime): boolean {
	if (idol.activityState !== 'training') return false;
	const v = idol.visible;
	const coreAvg = (v.vocal + v.dance + v.charisma) / 3;
	return coreAvg >= 35 && v.mentality >= 25;
}

export type PostDebutRole = 'performer' | 'mentor' | 'producer' | 'media_personality' | 'retired';

/** P7-16: Pós-debut — determina papel com base em idade e stats. */
export function assignPostDebutRole(idol: IdolRuntime): PostDebutRole {
	if (idol.age >= 35) {
		if (idol.visible.charisma >= 60 && idol.visible.communication >= 55) return 'media_personality';
		if (idol.visible.vocal >= 50 || idol.visible.dance >= 50) return 'producer';
		return 'retired';
	}

	if (idol.age >= 28) {
		if (idol.visible.mentality >= 60 && idol.visible.discipline >= 55) return 'mentor';
		if (idol.visible.charisma >= 60) return 'media_personality';
		return 'producer';
	}

	return 'performer';
}

/** P7-17: Transição de estado para veterana (se idade/tempo suficientes). */
export function resolveVeteranTransition(idol: IdolRuntime): IdolRuntime {
	if (idol.activityState !== 'active' && idol.activityState !== 'debuted') return idol;
	if (idol.age < 30) return idol;
	return { ...idol, activityState: 'veteran' as IdolActivityState };
}
