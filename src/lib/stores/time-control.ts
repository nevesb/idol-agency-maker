import { writable } from 'svelte/store';
import type { TimeMode } from '$lib/types/game';

export const timeMode = writable<TimeMode>('pause');
export const absoluteWeek = writable(1);
