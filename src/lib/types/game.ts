/** Tier derivado do PT (potencial), GDD idol-attribute-stats */
export type IdolTier = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

/** Estados de atividade que afetam crescimento/decaimento (GDD) */
export type IdolActivityState =
	| 'aspirant'
	| 'training'
	| 'active'
	| 'overwork'
	| 'burnout'
	| 'crisis'
	| 'veteran'
	| 'debuted';

/** Modo do relógio do jogo (GDD time-calendar) */
export type TimeMode = 'live' | 'pause' | 'skip';

/** 12 atributos visíveis 1–100 */
export interface IdolVisibleStats {
	vocal: number;
	dance: number;
	acting: number;
	variety: number;
	visual: number;
	charisma: number;
	communication: number;
	aura: number;
	stamina: number;
	discipline: number;
	mentality: number;
	adaptability: number;
}

/** 5 ocultos 1–20 (valores internos; jogador não vê números) */
export interface IdolHiddenStats {
	consistency: number;
	ambition: number;
	loyalty: number;
	temperament: number;
	personalLife: number;
}

/** Traços físicos e prompts de retrato (fonte de verdade = pipeline LLM). */
export interface IdolPhysicalEnrichment {
	hairStyle: string;
	hairColor: string;
	eyeShape: string;
	eyeColor: string;
	skinTone: string;
	accessories?: string;
	outfitNotes?: string;
}

export interface IdolEnrichmentV1 {
	schemaVersion: 1;
	idolId: string;
	promptVersion: string;
	background: { pt: string; ja: string };
	physical: IdolPhysicalEnrichment;
	portraitPromptPositive: string;
	portraitPromptNegative?: string;
}

export interface IdolEnrichmentV2 extends Omit<IdolEnrichmentV1, 'schemaVersion'> {
	schemaVersion: 2;
	nameRomaji: string;
	nameJp: string;
}

export type IdolEnrichment = IdolEnrichmentV1 | IdolEnrichmentV2;

export interface IdolCore {
	id: string;
	nameRomaji: string;
	nameJp: string;
	age: number;
	gender: 'female' | 'male' | 'other';
	potential: number;
	visible: IdolVisibleStats;
	hidden: IdolHiddenStats;
	activityState: IdolActivityState;
	personalityLabelKey: string;
	visualSeed: number;
	regionId: string;
	/** Mês de entrada no mercado (0 = início); GDD time / gerador estratificado */
	entryMonth?: number;
	/** Derivado de potential; opcional no pack para QA */
	tier?: IdolTier;
	/** Enriquecimento LLM (sidecar fundido no merge) */
	enrichment?: IdolEnrichment;
}

export interface AgencyStub {
	id: string;
	name: string;
	budgetYen: bigint;
	tier: 'garage' | 'indie' | 'regional' | 'national' | 'elite';
}
