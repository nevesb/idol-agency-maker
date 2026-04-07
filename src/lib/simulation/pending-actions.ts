import type { GameStateV1, PendingAction } from '$lib/types/simulation';

export function buildPendingActions(s: GameStateV1): PendingAction[] {
	const out: PendingAction[] = [];
	if (s.marketIdols.length > 0) {
		out.push({
			id: 'market',
			title: 'Talentos disponíveis no mercado',
			href: '/mercado'
		});
	}
	if (s.jobBoard.length > 0) {
		out.push({
			id: 'jobs',
			title: 'Escalar elenco aos jobs da semana',
			href: '/operacoes'
		});
	}
	out.push({ id: 'agency', title: 'Economia e saves', href: '/agencia' });
	return out.slice(0, 6);
}
