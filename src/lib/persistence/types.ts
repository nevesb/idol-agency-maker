import type { GameStateV1 } from '$lib/types/simulation';

/** Metadados do save (P5-01) */
export interface SaveMetaV1 {
	envelopeVersion: 1;
	savedAt: string;
	slotIndex: number;
}

export interface SaveEnvelopeV1 {
	meta: SaveMetaV1;
	game: GameStateV1;
}

export type SubscriptionTier = 'free' | 'premium';
