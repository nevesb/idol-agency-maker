import type { IdolRuntime, IdolGroup } from '$lib/types/simulation';

const DEFAULT_COLOR = '#7c3aed';

/** P6-09: Create a new idol group with synergy 0. */
export function createGroup(name: string, memberIds: string[], leaderId: string): IdolGroup {
	return {
		id: `grp_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
		name,
		concept: '',
		members: [...memberIds],
		leaderId,
		synergy: 0,
		colorHex: DEFAULT_COLOR,
		disbanded: false
	};
}

/**
 * P6-10/P6-11: Compute group synergy (0–0.3) based on member compatibility.
 * Factors: shared region bonus, personality diversity bonus, leader charisma.
 */
export function computeGroupSynergy(group: IdolGroup, idols: IdolRuntime[]): number {
	const members = idols.filter((i) => group.members.includes(i.id));
	if (members.length < 2) return 0;

	const regionCounts = new Map<string, number>();
	const personalitySet = new Set<string>();

	for (const m of members) {
		regionCounts.set(m.regionId, (regionCounts.get(m.regionId) ?? 0) + 1);
		personalitySet.add(m.personalityLabelKey);
	}

	const maxRegionShare =
		Math.max(...regionCounts.values()) / members.length;
	const regionBonus = maxRegionShare >= 0.5 ? 0.08 : 0.03;

	const diversityRatio = personalitySet.size / members.length;
	const diversityBonus = diversityRatio >= 0.6 ? 0.08 : 0.04;

	const leader = members.find((m) => m.id === group.leaderId);
	const leaderBonus = leader ? (leader.visible.charisma / 100) * 0.1 : 0;

	const sizeBonus = members.length >= 3 && members.length <= 7 ? 0.04 : 0;

	return Math.min(0.3, regionBonus + diversityBonus + leaderBonus + sizeBonus);
}

/** P6-12: Mark a group as disbanded. */
export function disbandGroup(group: IdolGroup): IdolGroup {
	return { ...group, disbanded: true, synergy: 0 };
}
