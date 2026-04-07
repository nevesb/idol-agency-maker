import { env } from '$env/dynamic/private';

/** Chave RunPod (apenas servidor — nunca `PUBLIC_`). */
export function runpodApiKey(): string | undefined {
	const k = env.RUN_POD_API_KEY;
	return typeof k === 'string' && k.trim().length > 0 ? k.trim() : undefined;
}

export function isRunpodConfigured(): boolean {
	return runpodApiKey() !== undefined;
}
