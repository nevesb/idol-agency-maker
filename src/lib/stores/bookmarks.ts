import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

const SLOTS = 12;
const STORAGE_KEY = 'sia-bookmarks';

function load(): (string | null)[] {
	if (!browser) return Array(SLOTS).fill(null);
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed: unknown = raw ? JSON.parse(raw) : [];
		const arr: (string | null)[] = Array(SLOTS).fill(null);
		if (Array.isArray(parsed)) {
			for (let i = 0; i < Math.min(SLOTS, parsed.length); i++) {
				const p = parsed[i];
				arr[i] = typeof p === 'string' ? p : null;
			}
		}
		return arr;
	} catch {
		return Array(SLOTS).fill(null);
	}
}

export const bookmarks = writable<(string | null)[]>(load());

if (browser) {
	bookmarks.subscribe((b) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
	});
}

export function setBookmarkSlot(slot: number, path: string): void {
	if (slot < 0 || slot >= SLOTS) return;
	bookmarks.update((b) => {
		const n = [...b];
		n[slot] = path;
		return n;
	});
}

export function getBookmarkPath(slot: number): string | null {
	const b = get(bookmarks);
	return b[slot] ?? null;
}
