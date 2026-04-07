import type { IdolRuntime } from '$lib/types/simulation';

/** P8-01: Possible post-debut career roles */
export type PostDebutRole =
	| 'active_idol'
	| 'mentor'
	| 'producer'
	| 'solo_artist'
	| 'retired'
	| 'comeback';

/** P8-01: Milestone reached during post-debut career */
export interface CareerMilestone {
	week: number;
	label: string;
}

/** P8-01: Tracks an idol's career after debut */
export interface PostDebutCareer {
	idolId: string;
	role: PostDebutRole;
	startWeek: number;
	milestones: CareerMilestone[];
}

const MILESTONE_WEEK_INTERVALS = [4, 12, 24, 52];
const ROLE_MILESTONE_LABELS: Record<PostDebutRole, string[]> = {
	active_idol: ['first_single', 'first_concert', 'fan_club_10k', 'anniversary'],
	mentor: ['first_trainee', 'trainee_debut', 'reputation_up', 'legacy'],
	producer: ['first_production', 'hit_single', 'label_deal', 'industry_award'],
	solo_artist: ['solo_debut', 'solo_hit', 'arena_tour', 'platinum'],
	retired: ['farewell', 'memoir', 'guest_appearance', 'hall_of_fame'],
	comeback: ['announcement', 'training_arc', 'comeback_single', 'chart_return']
};

/** P8-02: Create a new post-debut career for an idol */
export function initPostDebutCareer(
	idolId: string,
	role: PostDebutRole,
	week: number
): PostDebutCareer {
	return { idolId, role, startWeek: week, milestones: [] };
}

/** P8-02: Advance career milestones based on weeks elapsed */
export function tickPostDebutCareer(
	career: PostDebutCareer,
	idol: IdolRuntime
): PostDebutCareer {
	const weeksActive = idol.famePoints >= 0 ? career.milestones.length : 0;
	const nextIdx = weeksActive;
	if (nextIdx >= MILESTONE_WEEK_INTERVALS.length) return career;

	const labels = ROLE_MILESTONE_LABELS[career.role];
	const threshold = MILESTONE_WEEK_INTERVALS[nextIdx]!;
	const elapsed = (idol.weeksInactive === 0 ? 1 : 0) + career.milestones.length;

	if (elapsed >= threshold) {
		return {
			...career,
			milestones: [
				...career.milestones,
				{ week: career.startWeek + threshold, label: labels[nextIdx]! }
			]
		};
	}
	return career;
}

/** P8-03: Attempt a comeback — returns a fresh career in comeback state */
export function attemptComeback(idolId: string, week: number): PostDebutCareer {
	return initPostDebutCareer(idolId, 'comeback', week);
}
