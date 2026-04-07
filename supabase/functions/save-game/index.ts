/**
 * P5-02 — Edge Function: recebe game state comprimido (base64), valida JWT e persiste em save_games.
 */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

Deno.serve(async (req) => {
	if (req.method !== 'POST') {
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
	const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
	if (!url || !serviceKey) {
		return new Response(JSON.stringify({ error: 'server_misconfigured' }), {
			status: 500,
			headers: JSON_HEADERS
		});
	}

	const supabase = createClient(url, serviceKey, {
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

	let body: { save_data?: string };
	try {
		body = (await req.json()) as { save_data?: string };
	} catch {
		return new Response(JSON.stringify({ error: 'bad_json' }), {
			status: 400,
			headers: JSON_HEADERS
		});
	}

	if (typeof body.save_data !== 'string' || body.save_data.length === 0) {
		return new Response(JSON.stringify({ error: 'invalid_body' }), {
			status: 400,
			headers: JSON_HEADERS
		});
	}

	const now = new Date().toISOString();
	const adminClient = createClient(url, serviceKey);
	const { error: upsertErr } = await adminClient
		.from('save_games')
		.upsert(
			{
				user_id: user.id,
				slot_index: 0,
				name: 'cloud_save',
				payload: { compressed: body.save_data },
				updated_at: now
			},
			{ onConflict: 'user_id,slot_index' }
		);

	if (upsertErr) {
		return new Response(JSON.stringify({ error: upsertErr.message }), {
			status: 500,
			headers: JSON_HEADERS
		});
	}

	return new Response(
		JSON.stringify({ ok: true, user_id: user.id, updated_at: now }),
		{ status: 200, headers: JSON_HEADERS }
	);
});
