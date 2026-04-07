import type { Headline, JobResultLog } from '$lib/types/simulation';

/** P3-17 — manchetes a partir dos resultados da semana (MVP). */
export function headlinesFromJobResults(
	week: number,
	results: JobResultLog[],
	idolNames: Map<string, string>,
	jobNames: Map<string, string>
): Headline[] {
	const out: Headline[] = [];
	for (const r of results) {
		const idol = idolNames.get(r.idolId) ?? r.idolId;
		const job = jobNames.get(r.jobId) ?? r.jobId;
		if (r.outcome === 'success') {
			const drama = r.performance >= 0.85 ? 0.38 : r.performance >= 0.72 ? 0.32 : 0.48;
			out.push({
				week,
				kind: 'job',
				text: `${idol} brilhou em “${job}” — resultado forte.`,
				drama
			});
		} else if (r.outcome === 'partial') {
			out.push({
				week,
				kind: 'job',
				text: `“${job}” com ${idol} dividiu opiniões — desempenho irregular.`,
				drama: 0.52
			});
		} else if (r.outcome === 'failure') {
			out.push({
				week,
				kind: 'job',
				text: `“${job}” com ${idol} abaixo das expetativas — críticas mistas.`,
				drama: 0.82
			});
		}
	}
	return out;
}
