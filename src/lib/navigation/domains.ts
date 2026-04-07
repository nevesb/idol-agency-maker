export type DomainId = 'portal' | 'roster' | 'mercado' | 'operacoes' | 'agencia' | 'produtor' | 'mensagens';

export type DomainPath =
	| '/portal'
	| '/roster'
	| '/mercado'
	| '/operacoes'
	| '/operacoes/resultados'
	| '/agencia'
	| '/produtor'
	| '/ajuda/glossario'
	| '/scouting'
	| '/noticias'
	| '/financas'
	| '/grupos'
	| '/definir'
	| '/mensagens';

export interface DomainDef {
	id: DomainId;
	path: DomainPath;
	i18nKey: string;
	shortcutDigit: 1 | 2 | 3 | 4 | 5 | 6;
}

export const DOMAINS: readonly DomainDef[] = [
	{ id: 'portal', path: '/portal', i18nKey: 'nav.portal', shortcutDigit: 1 },
	{ id: 'roster', path: '/roster', i18nKey: 'nav.roster', shortcutDigit: 2 },
	{ id: 'mercado', path: '/mercado', i18nKey: 'nav.mercado', shortcutDigit: 3 },
	{ id: 'operacoes', path: '/operacoes', i18nKey: 'nav.operacoes', shortcutDigit: 4 },
	{ id: 'agencia', path: '/agencia', i18nKey: 'nav.agencia', shortcutDigit: 5 },
	{ id: 'produtor', path: '/produtor', i18nKey: 'nav.produtor', shortcutDigit: 6 }
] as const satisfies readonly DomainDef[];

export function domainByPath(pathname: string): DomainDef | undefined {
	const normalized =
		pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
	return DOMAINS.find(
		(d) => d.path === normalized || normalized.startsWith(d.path + '/')
	);
}

/** Para breadcrumbs: filhos opcionais por rota (expandir com o GDD) */
export const routeTitles: Record<DomainPath, string> = {
	'/portal': 'breadcrumb.portal',
	'/roster': 'breadcrumb.roster',
	'/mercado': 'breadcrumb.mercado',
	'/operacoes': 'breadcrumb.operacoes',
	'/operacoes/resultados': 'breadcrumb.weekResults',
	'/agencia': 'breadcrumb.agencia',
	'/produtor': 'breadcrumb.produtor',
	'/ajuda/glossario': 'breadcrumb.glossary',
	'/scouting': 'breadcrumb.scouting',
	'/noticias': 'breadcrumb.news',
	'/financas': 'breadcrumb.finance',
	'/grupos': 'breadcrumb.groups',
	'/definir': 'breadcrumb.settings',
	'/mensagens': 'breadcrumb.mensagens'
};
