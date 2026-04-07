import type { SupabaseClient } from '@supabase/supabase-js';
import type { SaveEnvelopeV1 } from './types';
import { parseSaveEnvelopeJson } from './serialize';
import type { SubscriptionTier } from './types';

type SaveRow = {
	slot_index: number;
	name: string;
	payload: unknown;
	updated_at: string;
};

export async function fetchSubscriptionTier(
	client: SupabaseClient,
	userId: string
): Promise<SubscriptionTier> {
	const { data, error } = await client
		.from('subscriptions')
		.select('tier')
		.eq('user_id', userId)
		.maybeSingle();
	if (error || !data) return 'free';
	return data.tier === 'premium' ? 'premium' : 'free';
}

export async function cloudUpsertSave(
	client: SupabaseClient,
	userId: string,
	slotIndex: number,
	displayName: string,
	envelope: SaveEnvelopeV1
): Promise<{ error: Error | null; updatedAt: string | null }> {
	const { data, error } = await client
		.from('save_games')
		.upsert(
			{
				user_id: userId,
				slot_index: slotIndex,
				name: displayName,
				payload: envelope as unknown as Record<string, unknown>,
				updated_at: new Date().toISOString()
			},
			{ onConflict: 'user_id,slot_index' }
		)
		.select('updated_at')
		.single();

	if (error) return { error: new Error(error.message), updatedAt: null };
	return { error: null, updatedAt: data?.updated_at ?? null };
}

export async function cloudLoadSave(
	client: SupabaseClient,
	userId: string,
	slotIndex: number
): Promise<{
	envelope: SaveEnvelopeV1 | null;
	updatedAt: string | null;
	error: Error | null;
}> {
	const { data, error } = await client
		.from('save_games')
		.select('payload, updated_at')
		.eq('user_id', userId)
		.eq('slot_index', slotIndex)
		.maybeSingle();

	if (error) return { envelope: null, updatedAt: null, error: new Error(error.message) };
	if (!data?.payload) return { envelope: null, updatedAt: null, error: null };

	const raw = JSON.stringify(data.payload);
	const envelope = parseSaveEnvelopeJson(raw);
	if (!envelope) {
		return { envelope: null, updatedAt: data.updated_at ?? null, error: new Error('Invalid save payload') };
	}
	return { envelope, updatedAt: data.updated_at ?? null, error: null };
}

export async function cloudListSaves(
	client: SupabaseClient,
	userId: string
): Promise<{ rows: SaveRow[]; error: Error | null }> {
	const { data, error } = await client
		.from('save_games')
		.select('slot_index, name, payload, updated_at')
		.eq('user_id', userId)
		.order('slot_index', { ascending: true });

	if (error) return { rows: [], error: new Error(error.message) };
	return { rows: (data ?? []) as SaveRow[], error: null };
}

export async function cloudDeleteSave(
	client: SupabaseClient,
	userId: string,
	slotIndex: number
): Promise<{ error: Error | null }> {
	const { error } = await client
		.from('save_games')
		.delete()
		.eq('user_id', userId)
		.eq('slot_index', slotIndex);

	if (error) return { error: new Error(error.message) };
	return { error: null };
}
