/** Bucket público definido na migração Storage (P0-07 / CG-12). */
export const IDOL_PORTRAITS_BUCKET = 'idol-images';

/** CG-05: Age brackets for portrait variants */
export type AgeBracket = 'teen' | 'young_adult' | 'adult' | 'mature';

export function ageBracketFromAge(age: number): AgeBracket {
	if (age < 18) return 'teen';
	if (age < 25) return 'young_adult';
	if (age < 35) return 'adult';
	return 'mature';
}

/** CG-06: Expression variants based on wellness */
export type ExpressionVariant = 'neutral' | 'happy' | 'sad' | 'determined' | 'tired';

export function expressionFromWellness(wellness: {
	happiness: number;
	stress: number;
	motivation: number;
}): ExpressionVariant {
	if (wellness.stress > 80) return 'tired';
	if (wellness.happiness > 70 && wellness.motivation > 60) return 'happy';
	if (wellness.happiness < 30) return 'sad';
	if (wellness.motivation > 75) return 'determined';
	return 'neutral';
}

/**
 * CG-13 — URL pública do retrato servido pelo Supabase Storage.
 * Convenção: `{idolId}/{ageBracket}_{expression}.webp`
 * Fallback: `{idolId}/base.webp`
 */
export function getIdolImageUrl(
	supabaseProjectUrl: string,
	idolId: string,
	options?: { ageBracket?: AgeBracket; expression?: ExpressionVariant }
): string {
	const base = supabaseProjectUrl.replace(/\/$/, '');
	const safeId = idolId.replace(/[^a-zA-Z0-9_-]/g, '_');
	const variant = options?.ageBracket && options?.expression
		? `${options.ageBracket}_${options.expression}`
		: 'base';
	return `${base}/storage/v1/object/public/${IDOL_PORTRAITS_BUCKET}/${encodeURIComponent(safeId)}/${encodeURIComponent(variant)}.webp`;
}

/** @deprecated Use getIdolImageUrl */
export function getIdolPortraitPublicUrl(
	supabaseProjectUrl: string,
	idolId: string,
	variant = 'base'
): string {
	const base = supabaseProjectUrl.replace(/\/$/, '');
	const safeId = idolId.replace(/[^a-zA-Z0-9_-]/g, '_');
	const v = variant.replace(/[^a-zA-Z0-9_-]/g, '_');
	return `${base}/storage/v1/object/public/${IDOL_PORTRAITS_BUCKET}/${encodeURIComponent(safeId)}/${encodeURIComponent(v)}.webp`;
}

/** CG-11: Thumbnail sizes */
export const PORTRAIT_SIZES = {
	full: 768,
	medium: 512,
	thumbnail: 128
} as const;

export type PortraitSize = keyof typeof PORTRAIT_SIZES;
