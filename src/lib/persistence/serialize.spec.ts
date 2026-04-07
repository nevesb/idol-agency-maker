import { describe, expect, it } from 'vitest';
import { createInitialGame } from '$lib/simulation/initial-state';
import {
	buildSaveEnvelope,
	isSaveEnvelopeV1,
	parseSaveEnvelopeJson,
	stringifySaveEnvelope
} from './serialize';

describe('serialize', () => {
	it('roundtrip envelope', () => {
		const game = createInitialGame(123);
		const env = buildSaveEnvelope(game, 0);
		const json = stringifySaveEnvelope(env);
		const back = parseSaveEnvelopeJson(json);
		expect(back).not.toBeNull();
		expect(back!.game.seed).toBe(123);
		expect(back!.meta.slotIndex).toBe(0);
		expect(isSaveEnvelopeV1(JSON.parse(json))).toBe(true);
	});

	it('rejeita JSON inválido', () => {
		expect(parseSaveEnvelopeJson('not json')).toBeNull();
		expect(parseSaveEnvelopeJson('{}')).toBeNull();
	});

	it('migra envelope legado sem campos P3/P4', () => {
		const game = createInitialGame(7);
		const env = buildSaveEnvelope(game, 2);
		const parsed = JSON.parse(stringifySaveEnvelope(env)) as {
			meta: unknown;
			game: Record<string, unknown>;
		};
		const { jobHistory, postMortems, headlines, alerts, pendingActions, ...rest } = parsed.game;
		void jobHistory;
		void postMortems;
		void headlines;
		void alerts;
		void pendingActions;
		delete rest.worldPackId;
		delete rest.startingRegionId;
		delete rest.agencyMood;
		delete rest.agencyStrategy;
		delete rest.staffMembers;
		const legacyJson = JSON.stringify({ meta: parsed.meta, game: rest });
		const back = parseSaveEnvelopeJson(legacyJson);
		expect(back).not.toBeNull();
		expect(back!.game.seed).toBe(7);
		expect(back!.game.jobHistory).toEqual([]);
		expect(back!.game.staffMembers).toEqual([]);
		expect(back!.game.agencyStrategy.focus).toBe('balanced');
		expect(back!.game.worldPackId).toBe('embedded_default');
		expect(back!.meta.slotIndex).toBe(2);
	});
});
