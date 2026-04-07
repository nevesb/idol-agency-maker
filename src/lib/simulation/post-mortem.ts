import type { IdolRuntime, JobOutcomeKind, JobPosting, PostMortemEntry } from '$lib/types/simulation';

export function gradeLetterFromPerformance(performance: number): string {
	if (performance >= 0.95) return 'S';
	if (performance >= 0.85) return 'A';
	if (performance >= 0.75) return 'B';
	if (performance >= 0.65) return 'C';
	if (performance >= 0.45) return 'D';
	return 'F';
}

/** P3-06 — fatores explicativos curtos (MVP, PT). */
export function buildPostMortem(input: {
	week: number;
	job: JobPosting;
	idol: IdolRuntime;
	performance: number;
	outcome: JobOutcomeKind;
}): PostMortemEntry {
	const { week, job, idol, performance, outcome } = input;
	const grade = gradeLetterFromPerformance(performance);
	const positives: string[] = [];
	const negatives: string[] = [];

	if (idol.visible.charisma >= 60) positives.push('Carisma ajudou a conectar com o público.');
	if (idol.hidden.consistency >= 14) positives.push('Entrega consistente — pouca variação negativa.');
	if (job.primaryStats.some((k) => idol.visible[k] >= 65)) {
		positives.push('Stats-chave do job estavam acima da média.');
	}
	if (idol.wellness.stress <= 45) positives.push('Stress controlado favoreceu a performance.');

	if (idol.wellness.stress > 70) negatives.push('Stress elevado atrapalhou concentração.');
	if (idol.wellness.physical < 45) negatives.push('Condição física abaixo do ideal.');
	if (idol.hidden.consistency < 8) negatives.push('Inconsistência — resultado imprevisível.');
	if (job.difficulty >= 8 && outcome !== 'success') {
		negatives.push('Dificuldade alta expôs lacunas técnicas.');
	}
	while (positives.length < 2) positives.push('Rotina de ensaio manteve o mínimo de qualidade.');
	while (negatives.length < 2) negatives.push('Há margem clara para evolução nas próximas semanas.');

	let fanReaction = 'Fãs neutros.';
	let mediaReaction = 'Imprensa fez cobertura padrão.';
	if (outcome === 'success') {
		fanReaction = 'Fãs entusiasmados nas redes.';
		mediaReaction = 'Destaque positivo em resumos da semana.';
	} else if (outcome === 'failure') {
		fanReaction = 'Comentários mistos a negativos.';
		mediaReaction = 'Alguns veículos notaram falhas de execução.';
	}

	const id = `pm_${week}_${job.id}_${idol.id}`;
	return {
		id,
		week,
		jobId: job.id,
		idolId: idol.id,
		positives: positives.slice(0, 4),
		negatives: negatives.slice(0, 4),
		fanReaction,
		mediaReaction,
		gradeLetter: grade
	};
}
