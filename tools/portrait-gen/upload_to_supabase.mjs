#!/usr/bin/env node
/**
 * CG-12 — Upload de retratos WebP para Supabase Storage (bucket idol-images).
 * Requer: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY no ambiente.
 *
 * Uso: node tools/portrait-gen/upload_to_supabase.mjs --manifest tools/portrait-gen/manifest.example.json --base .
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function arg(name, def = '') {
	const i = process.argv.indexOf(name);
	return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const manifestPath = resolve(arg('--manifest', ''));
const baseDir = resolve(arg('--base', process.cwd()));

const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
	console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
	process.exit(1);
}
if (!manifestPath || !existsSync(manifestPath)) {
	console.error('Indique --manifest válido');
	process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const entries = manifest.entries ?? [];

async function uploadOne(storagePath, filePath) {
	const uploadUrl = `${url}/storage/v1/object/idol-images/${storagePath}`;
	const body = readFileSync(filePath);
	const res = await fetch(uploadUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${key}`,
			apikey: key,
			'Content-Type': 'image/webp',
			'x-upsert': 'true'
		},
		body
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`${res.status} ${t}`);
	}
}

for (const e of entries) {
	const local = resolve(baseDir, e.localPath);
	if (!existsSync(local)) {
		console.warn('skip missing', local);
		continue;
	}
	await uploadOne(e.storagePath, local);
	console.log('ok', e.storagePath);
}
console.log('done', entries.length);
