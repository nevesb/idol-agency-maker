import type { IdolCore, IdolEnrichment, IdolEnrichmentV1 } from '$lib/types/game';
import type { AgencyEconomyTier, RivalAgencyStub } from '$lib/types/simulation';
import { getSupabaseBrowser } from '$lib/supabase/browser-client';
import embeddedSample from './embedded-sample.json';

const AGENCY_TIERS: AgencyEconomyTier[] = ['garage', 'small', 'medium', 'large', 'elite'];

function isAgencyTier(x: unknown): x is AgencyEconomyTier {
	return typeof x === 'string' && (AGENCY_TIERS as string[]).includes(x);
}

function rivalRowToStub(row: Record<string, unknown>): RivalAgencyStub | null {
	const id = row.id;
	const name = row.name;
	const tier = row.tier;
	const budgetYen = row.budgetYen;
	if (typeof id !== 'string' || typeof name !== 'string' || !isAgencyTier(tier)) return null;
	if (typeof budgetYen !== 'number' || !Number.isFinite(budgetYen)) return null;
	return { id, name, tier, budgetYen: Math.round(budgetYen) };
}

/** P1-14 stub: pack embutido para dev/offline sem Storage. */
export function getEmbeddedWorldPackIdols(): IdolCore[] {
	return embeddedSample as IdolCore[];
}

/** Parse JSON remoto (P1-14): validação mínima. */
export function parseWorldPackIdolsJson(text: string): IdolCore[] | null {
	try {
		const raw: unknown = JSON.parse(text);
		if (!Array.isArray(raw) || raw.length === 0) return null;
		const first = raw[0];
		if (!first || typeof first !== 'object' || !('id' in first) || !('visible' in first))
			return null;
		return raw as IdolCore[];
	} catch {
		return null;
	}
}

export interface EnrichedSidecar {
	schemaVersion: 1 | 2;
	promptVersion: string;
	entries: Record<string, IdolEnrichment>;
}

function isEnrichment(x: unknown): x is IdolEnrichment {
	if (!x || typeof x !== 'object' || Array.isArray(x)) return false;
	const o = x as Record<string, unknown>;
	if (o.schemaVersion !== 1 && o.schemaVersion !== 2) return false;
	if (typeof o.idolId !== 'string' || typeof o.portraitPromptPositive !== 'string') return false;
	if (!o.background || typeof o.background !== 'object') return false;
	const bg = o.background as Record<string, unknown>;
	if (typeof bg.pt !== 'string' || typeof bg.ja !== 'string') return false;
	if (!o.physical || typeof o.physical !== 'object') return false;
	const ph = o.physical as Record<string, unknown>;
	for (const k of ['hairStyle', 'hairColor', 'eyeShape', 'eyeColor', 'skinTone'] as const) {
		if (typeof ph[k] !== 'string') return false;
	}
	return true;
}

/** Sidecar gerado por `tools/idol-pipeline/llm_enrich.py` (v1 ou v2). */
export function parseEnrichedSidecarJson(text: string): EnrichedSidecar | null {
	try {
		const raw: unknown = JSON.parse(text);
		if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
		const doc = raw as Record<string, unknown>;
		const sv = doc.schemaVersion;
		if (sv !== 1 && sv !== 2) return null;
		if (typeof doc.promptVersion !== 'string') return null;
		const ent = doc.entries;
		if (!ent || typeof ent !== 'object' || Array.isArray(ent)) return null;
		const entries: Record<string, IdolEnrichment> = {};
		for (const [id, val] of Object.entries(ent)) {
			if (!isEnrichment(val)) return null;
			if (val.idolId !== id) return null;
			entries[id] = val;
		}
		return { schemaVersion: sv as 1 | 2, promptVersion: doc.promptVersion, entries };
	} catch {
		return null;
	}
}

/** Funde enrichment no array de idols. Se v2, também sobrescreve nomes. */
export function mergeIdolsWithEnrichment(idols: IdolCore[], sidecar: EnrichedSidecar): IdolCore[] {
	return idols.map((idol) => {
		const en = sidecar.entries[idol.id];
		if (!en) return idol;
		const merged = { ...idol, enrichment: en };
		if (en.schemaVersion === 2) {
			merged.nameRomaji = en.nameRomaji;
			merged.nameJp = en.nameJp;
		}
		return merged;
	});
}

/**
 * P1-14: Fetch world pack JSON from Supabase Storage bucket.
 * Returns null on failure (network error, missing file, etc.)
 */
export async function fetchWorldPackFromStorage(
	bucket: string,
	path: string
): Promise<string | null> {
	const client = getSupabaseBrowser();
	if (!client) return null;
	try {
		const { data, error } = await client.storage.from(bucket).download(path);
		if (error || !data) return null;
		return await data.text();
	} catch {
		return null;
	}
}

/**
 * P1-14: Load idols from Supabase Storage, falling back to embedded sample.
 */
export async function loadWorldPackIdols(): Promise<IdolCore[]> {
	const text = await fetchWorldPackFromStorage('world-packs', 'current/idols.json');
	if (text) {
		const parsed = parseWorldPackIdolsJson(text);
		if (parsed && parsed.length > 0) return parsed;
	}
	return getEmbeddedWorldPackIdols();
}

/**
 * P1-14: Load enrichment sidecar from Storage and merge with idols.
 */
export async function loadAndMergeEnrichment(idols: IdolCore[]): Promise<IdolCore[]> {
	const text = await fetchWorldPackFromStorage('world-packs', 'current/enriched_sidecar.json');
	if (!text) return idols;
	const sidecar = parseEnrichedSidecarJson(text);
	if (!sidecar) return idols;
	return mergeIdolsWithEnrichment(idols, sidecar);
}

/**
 * P1-12 / P3-18 — JSON gerado por `tools/world_pack/generate_world_npcs.py`.
 * Campos extra (dono, arquétipo, …) são ignorados até a UI de rivais consumir.
 */
export function parseWorldPackNpcsJson(text: string): RivalAgencyStub[] | null {
	try {
		const raw: unknown = JSON.parse(text);
		if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
		const doc = raw as Record<string, unknown>;
		if (doc.schemaVersion !== 1) return null;
		const list = doc.rivalAgencies;
		if (!Array.isArray(list) || list.length === 0) return null;
		const rivals: RivalAgencyStub[] = [];
		for (const item of list) {
			if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
			const stub = rivalRowToStub(item as Record<string, unknown>);
			if (!stub) return null;
			rivals.push(stub);
		}
		return rivals;
	} catch {
		return null;
	}
}
