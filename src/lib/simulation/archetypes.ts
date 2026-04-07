import type { IdolArchetype, ArchetypeKey } from '$lib/types/simulation';
import type { IdolVisibleStats } from '$lib/types/game';
import type { IdolRuntime } from '$lib/types/simulation';

const ARCHETYPE_DEFS: IdolArchetype[] = [
	{ key: 'center', diegeticName: 'Center', statWeights: { charisma: 0.3, aura: 0.3, visual: 0.2, dance: 0.2 }, groupSynergyBonus: 0.08 },
	{ key: 'ace', diegeticName: 'Ace', statWeights: { vocal: 0.35, dance: 0.35, stamina: 0.15, mentality: 0.15 }, groupSynergyBonus: 0.06 },
	{ key: 'visual', diegeticName: 'Visual', statWeights: { visual: 0.5, charisma: 0.25, aura: 0.25 }, groupSynergyBonus: 0.04 },
	{ key: 'leader', diegeticName: 'Leader', statWeights: { charisma: 0.3, discipline: 0.25, communication: 0.25, mentality: 0.2 }, groupSynergyBonus: 0.07 },
	{ key: 'mood_maker', diegeticName: 'Mood Maker', statWeights: { variety: 0.35, communication: 0.3, charisma: 0.2, adaptability: 0.15 }, groupSynergyBonus: 0.06 },
	{ key: 'rapper', diegeticName: 'Rapper', statWeights: { vocal: 0.2, communication: 0.3, aura: 0.25, adaptability: 0.25 }, groupSynergyBonus: 0.05 },
	{ key: 'dancer', diegeticName: 'Main Dancer', statWeights: { dance: 0.5, stamina: 0.25, visual: 0.15, aura: 0.1 }, groupSynergyBonus: 0.05 },
	{ key: 'vocalist', diegeticName: 'Main Vocalist', statWeights: { vocal: 0.55, mentality: 0.2, stamina: 0.15, discipline: 0.1 }, groupSynergyBonus: 0.05 },
	{ key: 'variety', diegeticName: 'Variety Star', statWeights: { variety: 0.4, communication: 0.3, adaptability: 0.2, charisma: 0.1 }, groupSynergyBonus: 0.04 },
	{ key: 'mysterious', diegeticName: 'Mysterious', statWeights: { aura: 0.4, visual: 0.25, mentality: 0.2, discipline: 0.15 }, groupSynergyBonus: 0.04 },
	{ key: 'cute', diegeticName: 'Cute', statWeights: { visual: 0.3, charisma: 0.3, communication: 0.2, variety: 0.2 }, groupSynergyBonus: 0.04 },
	{ key: 'cool', diegeticName: 'Cool', statWeights: { aura: 0.3, dance: 0.25, visual: 0.25, discipline: 0.2 }, groupSynergyBonus: 0.04 }
];

const ARCHETYPE_MAP = new Map<ArchetypeKey, IdolArchetype>(
	ARCHETYPE_DEFS.map((a) => [a.key, a])
);

function archetypeScore(stats: IdolVisibleStats, archetype: IdolArchetype): number {
	let score = 0;
	for (const [stat, weight] of Object.entries(archetype.statWeights) as [keyof IdolVisibleStats, number][]) {
		score += stats[stat] * weight;
	}
	return score;
}

/** P6-32: Determine best-fit archetype for an idol based on stat profile. */
export function determineArchetype(idol: IdolRuntime): ArchetypeKey {
	let best: ArchetypeKey = 'center';
	let bestScore = -1;

	for (const arch of ARCHETYPE_DEFS) {
		const score = archetypeScore(idol.visible, arch);
		if (score > bestScore) {
			bestScore = score;
			best = arch.key;
		}
	}
	return best;
}

/** P6-34: Diversity bonus for a group with mixed archetypes (0–0.2). */
export function archetypeGroupSynergy(archetypes: ArchetypeKey[]): number {
	if (archetypes.length < 2) return 0;

	const unique = new Set(archetypes);
	const diversityRatio = unique.size / archetypes.length;

	let roleBonus = 0;
	if (unique.has('leader')) roleBonus += 0.03;
	if (unique.has('center')) roleBonus += 0.02;
	if (unique.has('mood_maker')) roleBonus += 0.02;

	const baseSynergy = diversityRatio * 0.12;
	return Math.min(0.2, Math.round((baseSynergy + roleBonus) * 100) / 100);
}

/** Lookup archetype definition by key. */
export function getArchetype(key: ArchetypeKey): IdolArchetype | undefined {
	return ARCHETYPE_MAP.get(key);
}

export { ARCHETYPE_DEFS };
