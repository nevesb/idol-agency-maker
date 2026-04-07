#!/usr/bin/env node
/**
 * Para o Pod RunPod (GPU off). O network volume NÃO é apagado — só o estado running.
 *
 * Uso (na raiz do repo, Node 20+):
 *   node --env-file=.env tools/runpod/stop-pod.mjs
 *   node --env-file=.env tools/runpod/stop-pod.mjs <podId>
 *
 * Env:
 *   RUN_POD_API_KEY — obrigatório
 *   RUNPOD_POD_ID — opcional; senão usa argv[2] ou o ID por defeito abaixo
 *
 * API: https://docs.runpod.io/api-reference/pods/POST/pods/podId/stop
 */

const DEFAULT_POD_ID = 'z7iqhn9lq3shkl';

const podId = process.argv[2] || process.env.RUNPOD_POD_ID || DEFAULT_POD_ID;
const apiKey = process.env.RUN_POD_API_KEY;

if (!apiKey?.trim()) {
	console.error('Missing RUN_POD_API_KEY (use: node --env-file=.env tools/runpod/stop-pod.mjs)');
	process.exit(1);
}

const stopUrl = `https://rest.runpod.io/v1/pods/${podId}/stop`;

const res = await fetch(stopUrl, {
	method: 'POST',
	headers: {
		Authorization: `Bearer ${apiKey.trim()}`,
		'Content-Type': 'application/json'
	}
});

const text = await res.text();
console.log(`POST ${stopUrl} → ${res.status}`);
if (text) console.log(text);

if (!res.ok) process.exit(1);
