import { writable } from 'svelte/store';
import type { SaveEnvelopeV1 } from '$lib/persistence/types';

/** P5-07: escolha entre save local e nuvem. */
export const saveConflict = writable<{
	local: SaveEnvelopeV1;
	cloud: SaveEnvelopeV1;
	cloudServerUpdatedAt: string;
} | null>(null);
