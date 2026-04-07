#!/usr/bin/env node
/**
 * Inicia / resume o Pod RunPod.
 *
 *   node --env-file=.env tools/runpod/start-pod.mjs
 *   node --env-file=.env tools/runpod/start-pod.mjs <podId>
 *
 * https://docs.runpod.io/api-reference/pods/POST/pods/podId/start
 */

const DEFAULT_POD_ID = 'z7iqhn9lq3shkl';

const podId = process.argv[2] || process.env.RUNPOD_POD_ID || DEFAULT_POD_ID;
const apiKey = process.env.RUN_POD_API_KEY;

if (!apiKey?.trim()) {
	console.error('Missing RUN_POD_API_KEY');
	process.exit(1);
}

const startUrl = `https://rest.runpod.io/v1/pods/${podId}/start`;
const res = await fetch(startUrl, {
	method: 'POST',
	headers: {
		Authorization: `Bearer ${apiKey.trim()}`,
		'Content-Type': 'application/json'
	}
});

const text = await res.text();
console.log(`POST ${startUrl} → ${res.status}`);
if (text) console.log(text);

if (!res.ok) process.exit(1);
