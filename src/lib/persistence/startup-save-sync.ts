import { idbGetSave, saveSlotKey } from '$lib/persistence/idb';
import { parseSaveEnvelopeJson } from '$lib/persistence/serialize';
import { savesRequireUserChoice } from '$lib/persistence/save-conflict-logic';
import { cloudLoadSave, fetchSubscriptionTier } from '$lib/persistence/supabase-save';
import { maxSlotCount } from '$lib/persistence/slots';
import type { SupabaseClient } from '@supabase/supabase-js';
import { saveConflict } from '$lib/stores/save-conflict';
import { currentSaveSlot } from '$lib/stores/save-slot';
import { get } from 'svelte/store';

/**
 * Após hidratar IndexedDB: se há sessão e save na nuvem no slot atual, deteta bifurcação (P5-07).
 * Não substitui o estado já carregado até o jogador escolher no modal.
 */
export async function runStartupCloudConflictCheck(
	client: SupabaseClient,
	userId: string
): Promise<void> {
	const slot = get(currentSaveSlot);
	const tier = await fetchSubscriptionTier(client, userId);
	if (slot < 0 || slot >= maxSlotCount(tier)) return;

	const rawLocal = await idbGetSave(saveSlotKey(slot));
	if (!rawLocal) return;
	const localEnv = parseSaveEnvelopeJson(rawLocal);
	if (!localEnv) return;

	const { envelope: cloudEnv, updatedAt, error } = await cloudLoadSave(client, userId, slot);
	if (error || !cloudEnv || !updatedAt) return;

	if (!savesRequireUserChoice(localEnv, cloudEnv, updatedAt)) return;

	saveConflict.set({
		local: localEnv,
		cloud: cloudEnv,
		cloudServerUpdatedAt: updatedAt
	});
}
