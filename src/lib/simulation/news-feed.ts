import type { GameStateV1, JobResultLog, NewsItem, NewsCategoryKey } from '$lib/types/simulation';
import { mulberry32, randomBetween } from '$lib/simulation/rng';

const ECONOMY_TEMPLATES: string[] = [
	'Mercado de entretenimento aquece — contratos mais lucrativos.',
	'Índice de audiência caiu esta semana — anunciantes reavaliam.',
	'Nova lei de copyright promete afetar royalties.',
	'Festival de verão movimenta a economia do showbiz.'
];

const RIVAL_TEMPLATES: string[] = [
	'Agência rival lança campanha agressiva de scouting.',
	'Rival anuncia grupo surpresa e surpreende o mercado.',
	'Fusão de agências menores ameaça equilíbrio do ranking.',
	'Agência concorrente perde patrocínio — oportunidade?'
];

const SYSTEM_TEMPLATES: string[] = [
	'Novo mês começa — relatórios financeiros disponíveis.',
	'Temporada de audições se aproxima.'
];

function pickTemplate(rng: () => number, templates: string[]): string {
	return templates[Math.floor(rng() * templates.length)]!;
}

function newsFromJobResults(state: GameStateV1, week: number, rng: () => number): NewsItem[] {
	const items: NewsItem[] = [];
	const log = state.lastWeekLog;
	if (!log) return items;

	for (const r of log.jobResults) {
		const idol = state.idols.find((i) => i.id === r.idolId);
		const name = idol?.nameRomaji ?? r.idolId;

		if (r.outcome === 'success' && r.performance >= 0.8) {
			items.push({
				id: `news_${week}_job_${r.jobId}`,
				week,
				text: `${name} entrega performance excelente — fãs celebram.`,
				category: 'job_result',
				relatedIdolId: r.idolId,
				importance: Math.round(r.performance * 10)
			});
		} else if (r.outcome === 'failure') {
			items.push({
				id: `news_${week}_fail_${r.jobId}`,
				week,
				text: `${name} não atinge expectativas — críticas surgem.`,
				category: 'job_result',
				relatedIdolId: r.idolId,
				importance: 7
			});
		}
	}
	return items;
}

function newsFromEconomy(week: number, rng: () => number): NewsItem | null {
	if (rng() > 0.4) return null;
	return {
		id: `news_${week}_econ`,
		week,
		text: pickTemplate(rng, ECONOMY_TEMPLATES),
		category: 'economy',
		importance: Math.round(randomBetween(rng, 3, 6))
	};
}

function newsFromRivals(state: GameStateV1, week: number, rng: () => number): NewsItem | null {
	if (state.rivals.length === 0 || rng() > 0.35) return null;
	const rival = state.rivals[Math.floor(rng() * state.rivals.length)]!;
	return {
		id: `news_${week}_rival_${rival.id}`,
		week,
		text: `${rival.name}: ${pickTemplate(rng, RIVAL_TEMPLATES)}`,
		category: 'rival',
		importance: Math.round(randomBetween(rng, 4, 7))
	};
}

/** P6-13: Generate 2-5 news items for the current week. */
export function generateNewsForWeek(
	state: GameStateV1,
	week: number,
	seed: number
): NewsItem[] {
	const rng = mulberry32((seed ^ (week * 0x45d9f3b)) >>> 0);
	const items: NewsItem[] = [];

	items.push(...newsFromJobResults(state, week, rng));

	const econNews = newsFromEconomy(week, rng);
	if (econNews) items.push(econNews);

	const rivalNews = newsFromRivals(state, week, rng);
	if (rivalNews) items.push(rivalNews);

	if (week % 4 === 0) {
		items.push({
			id: `news_${week}_sys`,
			week,
			text: pickTemplate(rng, SYSTEM_TEMPLATES),
			category: 'system',
			importance: 2
		});
	}

	const targetCount = Math.round(randomBetween(rng, 2, 5));
	while (items.length < targetCount) {
		const cats: NewsCategoryKey[] = ['economy', 'rival', 'milestone'];
		const cat = cats[Math.floor(rng() * cats.length)]!;
		items.push({
			id: `news_${week}_fill_${items.length}`,
			week,
			text: cat === 'economy'
				? pickTemplate(rng, ECONOMY_TEMPLATES)
				: cat === 'rival'
					? pickTemplate(rng, RIVAL_TEMPLATES)
					: 'Semana segue dentro do esperado.',
			category: cat,
			importance: Math.round(randomBetween(rng, 1, 4))
		});
	}

	return items.slice(0, 5).sort((a, b) => b.importance - a.importance);
}

const DAY_NAMES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

/** Generate 0-2 news items for a specific day within a week. */
export function generateDailyNews(
	state: GameStateV1,
	week: number,
	dayIndex: number,
	dayJobResults: JobResultLog[],
	seed: number
): NewsItem[] {
	const rng = mulberry32((seed ^ (week * 7 + dayIndex * 0x9e3779b9)) >>> 0);
	const items: NewsItem[] = [];

	for (const r of dayJobResults) {
		const idol = state.idols.find((i) => i.id === r.idolId);
		const name = idol?.nameRomaji ?? r.idolId;

		if (r.outcome === 'success' && r.performance >= 0.8) {
			if (rng() < 0.6) {
				items.push({
					id: `news_d${dayIndex}_${r.jobId}`,
					week,
					text: `${name} brilhou em ${DAY_NAMES[dayIndex] ?? `dia ${dayIndex}`} — fãs celebram.`,
					category: 'job_result',
					relatedIdolId: r.idolId,
					importance: Math.round(r.performance * 10)
				});
			}
		} else if (r.outcome === 'failure') {
			items.push({
				id: `news_d${dayIndex}_fail_${r.jobId}`,
				week,
				text: `${name} não atinge expectativas — críticas surgem.`,
				category: 'job_result',
				relatedIdolId: r.idolId,
				importance: 7
			});
		}
	}

	if (rng() < 0.12) {
		const econNews = newsFromEconomy(week, rng);
		if (econNews) {
			econNews.id = `news_d${dayIndex}_econ_${week}`;
			items.push(econNews);
		}
	}

	if (rng() < 0.10 && state.rivals.length > 0) {
		const rivalNews = newsFromRivals(state, week, rng);
		if (rivalNews) {
			rivalNews.id = `news_d${dayIndex}_rival_${week}`;
			items.push(rivalNews);
		}
	}

	return items.slice(0, 2);
}

/** P6-16: Format news items into a readable digest string. */
export function formatNewsDigest(items: NewsItem[]): string {
	if (items.length === 0) return 'Sem notícias esta semana.';
	return items
		.map((n) => `[${n.category.toUpperCase()}] ${n.text}`)
		.join('\n');
}
