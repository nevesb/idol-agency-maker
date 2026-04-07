import type { AgencyEconomyTier, JobCategory, JobPosting } from '$lib/types/simulation';
import { mulberry32, randomBetween } from '$lib/simulation/rng';

type Template = Omit<JobPosting, 'id'>;

const TEMPLATES: Template[] = [
	{
		category: 'radio',
		name: 'Morning Radio Corner',
		difficulty: 2,
		visibility: 3,
		paymentYen: 120_000,
		fameGain: 80,
		primaryStats: ['vocal', 'communication'],
		durationDays: 1,
		competitive: false,
		scheduledDay: 0
	},
	{
		category: 'streaming',
		name: 'Idol Stream Collab',
		difficulty: 3,
		visibility: 5,
		paymentYen: 95_000,
		fameGain: 130,
		primaryStats: ['charisma', 'variety'],
		durationDays: 1,
		competitive: false,
		scheduledDay: 1
	},
	{
		category: 'tv',
		name: 'Variety Guest Slot',
		difficulty: 6,
		visibility: 8,
		paymentYen: 420_000,
		fameGain: 380,
		primaryStats: ['variety', 'acting', 'charisma'],
		minFameTier: 'D',
		durationDays: 2,
		competitive: true,
		scheduledDay: 2
	},
	{
		category: 'photo',
		name: 'Magazine Spread',
		difficulty: 4,
		visibility: 6,
		paymentYen: 260_000,
		fameGain: 210,
		primaryStats: ['visual', 'aura'],
		durationDays: 1,
		competitive: false,
		scheduledDay: 3
	},
	{
		category: 'show',
		name: 'Live Stage Opening Act',
		difficulty: 5,
		visibility: 7,
		paymentYen: 310_000,
		fameGain: 280,
		primaryStats: ['dance', 'stamina', 'charisma'],
		durationDays: 2,
		competitive: false,
		scheduledDay: 4
	},
	{
		category: 'recording',
		name: 'B-side Recording Session',
		difficulty: 4,
		visibility: 5,
		paymentYen: 200_000,
		fameGain: 160,
		primaryStats: ['vocal', 'discipline'],
		durationDays: 2,
		competitive: false,
		scheduledDay: 5
	},
	{
		category: 'dubbing',
		name: 'Anime Dub Audition',
		difficulty: 5,
		visibility: 4,
		paymentYen: 180_000,
		fameGain: 140,
		primaryStats: ['acting', 'adaptability'],
		durationDays: 1,
		competitive: false,
		scheduledDay: 6
	},
	{
		category: 'meet_greet',
		name: 'Fan Meet & Greet',
		difficulty: 2,
		visibility: 4,
		paymentYen: 85_000,
		fameGain: 100,
		primaryStats: ['communication', 'charisma'],
		durationDays: 1,
		competitive: false,
		scheduledDay: 0
	},
	{
		category: 'event',
		name: 'Mall Promotion Event',
		difficulty: 3,
		visibility: 5,
		paymentYen: 110_000,
		fameGain: 95,
		primaryStats: ['variety', 'visual'],
		durationDays: 1,
		competitive: false,
		scheduledDay: 1
	},
	{
		category: 'endorsement',
		name: 'Regional Brand Shoot',
		difficulty: 5,
		visibility: 7,
		paymentYen: 350_000,
		fameGain: 240,
		primaryStats: ['visual', 'communication', 'discipline'],
		minFameTier: 'C',
		durationDays: 2,
		competitive: true,
		scheduledDay: 2
	},
	{
		category: 'composition',
		name: 'Songwriting Camp',
		difficulty: 6,
		visibility: 6,
		paymentYen: 220_000,
		fameGain: 190,
		primaryStats: ['vocal', 'aura', 'mentality'],
		durationDays: 3,
		competitive: false,
		scheduledDay: 3
	}
];

function tierDifficultyCap(tier: AgencyEconomyTier): number {
	const m: Record<AgencyEconomyTier, number> = {
		garage: 4,
		small: 6,
		medium: 8,
		large: 10,
		elite: 12
	};
	return m[tier];
}

function pickTemplate(rng: () => number, tier: AgencyEconomyTier): Template {
	const cap = tierDifficultyCap(tier);
	const pool = TEMPLATES.filter((t) => t.difficulty <= cap);
	const t = pool[Math.floor(rng() * pool.length)] ?? TEMPLATES[0]!;
	const jitter = Math.round((rng() - 0.5) * 40_000);
	const pay = Math.max(50_000, t.paymentYen + jitter);
	const diff = Math.min(cap, Math.max(1, t.difficulty + Math.round((rng() - 0.5) * 2)));
	const comp = tier >= 'medium' && rng() > 0.82 ? true : t.competitive && rng() > 0.55;
	return {
		...t,
		difficulty: diff,
		paymentYen: pay,
		fameGain: Math.max(40, Math.round(t.fameGain * (0.9 + rng() * 0.25))),
		competitive: comp,
		minFameTier: tier === 'garage' ? undefined : t.minFameTier
	};
}

/** P3-02 — gera 14–18 jobs para a semana `absoluteWeek`. */
export function generateJobBoard(
	agencyTier: AgencyEconomyTier,
	absoluteWeek: number,
	gameSeed: number
): JobPosting[] {
	const rng = mulberry32(gameSeed ^ absoluteWeek * 0xdeadbeef);
	const count = 14 + Math.floor(randomBetween(rng, 0, 5));
	const jobs: JobPosting[] = [];
	const usedNames = new Set<string>();
	for (let i = 0; i < count; i++) {
		const base = pickTemplate(rng, agencyTier);
		let name = base.name;
		let n = 0;
		while (usedNames.has(name)) {
			n++;
			name = `${base.name} (${n})`;
		}
		usedNames.add(name);
		const id = `job_${absoluteWeek}_${i}_${Math.floor(rng() * 1e6)}`;
		jobs.push({
			id,
			...base,
			name,
			category: base.category as JobCategory,
			scheduledDay: i % 7
		});
	}
	return jobs;
}
