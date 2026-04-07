import { describe, expect, it } from 'vitest';
import type { IdolEnrichmentV1, IdolEnrichmentV2 } from '$lib/types/game';
import {
	getEmbeddedWorldPackIdols,
	mergeIdolsWithEnrichment,
	parseEnrichedSidecarJson,
	parseWorldPackIdolsJson,
	parseWorldPackNpcsJson
} from './loader';

describe('world-pack loader', () => {
	it('embedded sample tem idols válidos', () => {
		const ids = getEmbeddedWorldPackIdols();
		expect(ids.length).toBeGreaterThanOrEqual(2);
		expect(ids[0]!.visible.vocal).toBeGreaterThan(0);
	});

	it('parse JSON remoto', () => {
		const raw = JSON.stringify(getEmbeddedWorldPackIdols());
		expect(parseWorldPackIdolsJson(raw)?.length).toBe(getEmbeddedWorldPackIdols().length);
		expect(parseWorldPackIdolsJson('[]')).toBeNull();
	});

	it('parse sidecar enrichment v1 + merge', () => {
		const en: IdolEnrichmentV1 = {
			schemaVersion: 1,
			idolId: 'wp_demo_01',
			promptVersion: 'test',
			background: { pt: 'a', ja: 'b' },
			physical: {
				hairStyle: 'bob',
				hairColor: 'black',
				eyeShape: 'almond',
				eyeColor: 'brown',
				skinTone: 'fair'
			},
			portraitPromptPositive: 'anime portrait test'
		};
		const sidecar = {
			schemaVersion: 1 as const,
			promptVersion: 'test',
			entries: { wp_demo_01: en }
		};
		const parsed = parseEnrichedSidecarJson(JSON.stringify(sidecar));
		expect(parsed).toEqual(sidecar);
		const idols = getEmbeddedWorldPackIdols();
		const merged = mergeIdolsWithEnrichment(idols, sidecar);
		expect(merged[0]!.enrichment?.portraitPromptPositive).toBe('anime portrait test');
		expect(merged[1]!.enrichment).toBeUndefined();
	});

	it('parse sidecar enrichment v2 sobrescreve nomes', () => {
		const en: IdolEnrichmentV2 = {
			schemaVersion: 2,
			idolId: 'wp_demo_01',
			promptVersion: 'test-v2',
			nameRomaji: 'Takahashi Hina',
			nameJp: '高橋陽菜',
			background: { pt: 'Hina cresceu em Tokyo.', ja: '東京出身の陽菜。' },
			physical: {
				hairStyle: 'long',
				hairColor: 'black',
				eyeShape: 'round',
				eyeColor: 'dark brown',
				skinTone: 'fair'
			},
			portraitPromptPositive: 'anime portrait v2'
		};
		const sidecar = {
			schemaVersion: 2 as const,
			promptVersion: 'test-v2',
			entries: { wp_demo_01: en }
		};
		const parsed = parseEnrichedSidecarJson(JSON.stringify(sidecar));
		expect(parsed).not.toBeNull();
		const idols = getEmbeddedWorldPackIdols();
		const merged = mergeIdolsWithEnrichment(idols, sidecar);
		expect(merged[0]!.nameRomaji).toBe('Takahashi Hina');
		expect(merged[0]!.nameJp).toBe('高橋陽菜');
		expect(merged[0]!.enrichment?.portraitPromptPositive).toBe('anime portrait v2');
	});

	it('parse NPC pack — extrai rivais como RivalAgencyStub', () => {
		const doc = {
			schemaVersion: 1,
			seed: 1,
			rivalAgencies: [
				{
					id: 'rival_01',
					name: 'Test Pro',
					tier: 'small',
					budgetYen: 1_000_000,
					ownerNameRomaji: 'Extra Field'
				}
			]
		};
		const rivals = parseWorldPackNpcsJson(JSON.stringify(doc));
		expect(rivals).toEqual([{ id: 'rival_01', name: 'Test Pro', tier: 'small', budgetYen: 1_000_000 }]);
		expect(parseWorldPackNpcsJson('{}')).toBeNull();
	});
});
