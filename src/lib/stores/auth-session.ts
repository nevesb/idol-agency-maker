import type { SupabaseClient, User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

export const authUser = writable<User | null>(null);

export function initAuthListener(client: SupabaseClient): void {
	void client.auth.getSession().then(({ data }) => {
		authUser.set(data.session?.user ?? null);
	});
	client.auth.onAuthStateChange((_event, session) => {
		authUser.set(session?.user ?? null);
	});
}
