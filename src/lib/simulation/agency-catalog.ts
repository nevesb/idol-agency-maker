import type { AgencyEconomyTier } from '$lib/types/simulation';

export interface PlayableAgency {
	id: string;
	name: string;
	nameJp: string;
	tier: AgencyEconomyTier;
	regionId: string;
	regionLabel: string;
	startingBudget: number;
	rosterSize: number;
	focus: string;
	description: string;
}

/** 5 pre-selected agencies for MVP */
export function getMvpPlayableAgencies(): PlayableAgency[] {
	return [
		{
			id: 'agency_nova_star',
			name: 'Nova Star',
			nameJp: 'ノヴァスター',
			tier: 'garage',
			regionId: 'tokyo',
			regionLabel: 'Tokyo',
			startingBudget: 500_000,
			rosterSize: 2,
			focus: 'Generalista',
			description: 'Uma agência recém-fundada em Tokyo. Orçamento apertado, mas tudo é possível.'
		},
		{
			id: 'agency_sakura_talent',
			name: 'Sakura Talent',
			nameJp: 'サクラタレント',
			tier: 'small',
			regionId: 'osaka',
			regionLabel: 'Osaka',
			startingBudget: 1_500_000,
			rosterSize: 4,
			focus: 'Mainstream Comercial',
			description:
				'Agência comercial consolidada em Osaka. Bom mix de talentos e conexões de TV.'
		},
		{
			id: 'agency_hikari',
			name: 'Hikari Agency',
			nameJp: 'ヒカリエージェンシー',
			tier: 'small',
			regionId: 'tokyo',
			regionLabel: 'Tokyo',
			startingBudget: 1_200_000,
			rosterSize: 3,
			focus: 'Vocal Prestige',
			description:
				'Foco em excelência musical. Poucos idols, mas com potencial vocal acima da média.'
		},
		{
			id: 'agency_crescent',
			name: 'Crescent Moon',
			nameJp: 'クレセントムーン',
			tier: 'medium',
			regionId: 'fukuoka',
			regionLabel: 'Fukuoka',
			startingBudget: 3_000_000,
			rosterSize: 5,
			focus: 'Variety-Heavy',
			description:
				'Agência média com forte presença em variety shows. Roster diversificado e staff experiente.'
		},
		{
			id: 'agency_echo',
			name: 'Echo Studio',
			nameJp: 'エコースタジオ',
			tier: 'small',
			regionId: 'sapporo',
			regionLabel: 'Sapporo',
			startingBudget: 1_000_000,
			rosterSize: 3,
			focus: 'Digital-First',
			description:
				'Agência focada em streaming e redes sociais. Custos baixos, crescimento rápido online.'
		}
	];
}
