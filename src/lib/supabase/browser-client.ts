import { browser } from '$app/environment';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

/** Cliente browser (chave anon pública); null se env não estiver definida (dev sem .env). */
export function getSupabaseBrowser(): SupabaseClient | null {
	if (!browser) return null;
	const url = env.PUBLIC_SUPABASE_URL;
	const key = env.PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) return null;
	return createClient(url, key, {
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true
		}
	});
}
