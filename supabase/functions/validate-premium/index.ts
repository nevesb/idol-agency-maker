/**
 * P5-09 — Verifica status premium do utilizador via JWT.
 * Placeholder: retorna sempre { premium: false } até a lógica de subscriptions estar ativa.
 */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

Deno.serve(async (req) => {
	if (req.method !== 'GET') {
		return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
			status: 405,
			headers: JSON_HEADERS
		});
	}

	const authHeader = req.headers.get('Authorization');
	if (!authHeader?.startsWith('Bearer ')) {
		return new Response(JSON.stringify({ error: 'unauthorized' }), {
			status: 401,
			headers: JSON_HEADERS
		});
	}

	const url = Deno.env.get('SUPABASE_URL');
	const anon = Deno.env.get('SUPABASE_ANON_KEY');
	if (!url || !anon) {
		return new Response(JSON.stringify({ error: 'server_misconfigured' }), {
			status: 500,
			headers: JSON_HEADERS
		});
	}

	const supabase = createClient(url, anon, {
		global: { headers: { Authorization: authHeader } }
	});

	const {
		data: { user },
		error: userErr
	} = await supabase.auth.getUser();
	if (userErr || !user) {
		return new Response(JSON.stringify({ error: 'unauthorized' }), {
			status: 401,
			headers: JSON_HEADERS
		});
	}

	return new Response(JSON.stringify({ premium: false }), {
		status: 200,
		headers: JSON_HEADERS
	});
});
