/** P5-03 stub — devolver payload descomprimido; MVP usa select direto no cliente. */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

Deno.serve(async (req) => {
	if (req.method !== 'POST') {
		return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	try {
		const body = (await req.json()) as { slotIndex?: number };
		if (typeof body.slotIndex !== 'number') {
			return new Response(JSON.stringify({ error: 'invalid_body' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		return new Response(JSON.stringify({ ok: true, slotIndex: body.slotIndex, envelope: null }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'bad_json' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
});
