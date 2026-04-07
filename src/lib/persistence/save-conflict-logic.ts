import type { SaveEnvelopeV1 } from './types';

/** Dois saves existem e divergem (P5-07) — mostrar modal de escolha. */
export function savesRequireUserChoice(
	local: SaveEnvelopeV1,
	cloud: SaveEnvelopeV1,
	cloudRowUpdatedAt: string
): boolean {
	if (local.game.absoluteWeek !== cloud.game.absoluteWeek) return true;
	if (local.game.seed !== cloud.game.seed) return true;
	if (local.game.agencyName !== cloud.game.agencyName) return true;
	const tl = Date.parse(local.meta.savedAt);
	const tc = Date.parse(cloudRowUpdatedAt);
	if (Number.isNaN(tl) || Number.isNaN(tc)) return true;
	return Math.abs(tl - tc) > 1500;
}
