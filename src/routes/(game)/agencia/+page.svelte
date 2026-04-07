<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Card from '$lib/components/ui/Card.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { idbGetSave, saveSlotKey } from '$lib/persistence/idb';
	import { parseSaveEnvelopeJson } from '$lib/persistence/serialize';
	import { savesRequireUserChoice } from '$lib/persistence/save-conflict-logic';
	import { parseWorldPackIdolsJson } from '$lib/world-pack/loader';
	import { maxSlotCount } from '$lib/persistence/slots';
	import { cloudLoadSave, fetchSubscriptionTier } from '$lib/persistence/supabase-save';
	import type { SubscriptionTier } from '$lib/persistence/types';
	import { getSupabaseBrowser } from '$lib/supabase/browser-client';
	import { authUser } from '$lib/stores/auth-session';
	import { saveConflict } from '$lib/stores/save-conflict';
	import { staffOffersForWeek } from '$lib/simulation/staff-hiring';
	import {
		gameState,
		hireStaffFromOffer,
		replaceGameState,
		replaceMarketIdols,
		saveGameNow,
		setAgencyStrategy,
		startNewGame
	} from '$lib/stores/game-state';
	import { strategyProfileLabel } from '$lib/simulation/agency-strategy';
	import { currentSaveSlot } from '$lib/stores/save-slot';
	import { get } from 'svelte/store';
	import { _ } from 'svelte-i18n';

	let tier = $state<SubscriptionTier>('free');
	let saveMsg = $state('');
	let newAgencyName = $state('');
	let loadingCloud = $state(false);
	let newGameEmbeddedPack = $state(false);
	let newGameRegion = $state('tokyo');

	const maxSlots = $derived(maxSlotCount(tier));
	const staffOffers = $derived(staffOffersForWeek($gameState.absoluteWeek));

	onMount(() => {
		void refreshTier();
		const unsub = authUser.subscribe(() => void refreshTier());
		return () => unsub();
	});

	async function refreshTier() {
		const client = getSupabaseBrowser();
		const u = get(authUser);
		if (!client || !u) {
			tier = 'free';
			return;
		}
		tier = await fetchSubscriptionTier(client, u.id);
		if (tier === 'free' && get(currentSaveSlot) > 0) currentSaveSlot.set(0);
	}

	async function onSave() {
		saveMsg = '';
		const r = await saveGameNow();
		saveMsg = r.ok ? $_(`save.msg.${r.message}`) : r.message;
	}

	async function onLoadCloud() {
		saveMsg = '';
		const client = getSupabaseBrowser();
		const u = get(authUser);
		if (!client || !u) {
			saveMsg = $_('save.needLogin');
			return;
		}
		const slot = get(currentSaveSlot);
		if (slot < 0 || slot >= maxSlotCount(tier)) {
			saveMsg = $_('save.slotLocked');
			return;
		}
		loadingCloud = true;
		let localEnv = null;
		try {
			const raw = await idbGetSave(saveSlotKey(slot));
			if (raw) localEnv = parseSaveEnvelopeJson(raw);
		} catch {
			/* ignore */
		}
		const { envelope, updatedAt, error } = await cloudLoadSave(client, u.id, slot);
		loadingCloud = false;
		if (error) {
			saveMsg = error.message;
			return;
		}
		if (!envelope) {
			saveMsg = $_('save.cloudEmpty');
			return;
		}
		if (localEnv && updatedAt && savesRequireUserChoice(localEnv, envelope, updatedAt)) {
			saveConflict.set({
				local: localEnv,
				cloud: envelope,
				cloudServerUpdatedAt: updatedAt
			});
			return;
		}
		replaceGameState(envelope.game);
		saveMsg = $_('save.loadedCloud');
	}

	function pickLocalConflict() {
		const c = get(saveConflict);
		if (!c) return;
		replaceGameState(c.local.game);
		saveConflict.set(null);
		saveMsg = $_('save.usedLocal');
	}

	function pickCloudConflict() {
		const c = get(saveConflict);
		if (!c) return;
		replaceGameState(c.cloud.game);
		saveConflict.set(null);
		saveMsg = $_('save.usedCloud');
	}

	async function onWorldPackFile(ev: Event) {
		const input = ev.currentTarget as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		saveMsg = '';
		try {
			const text = await f.text();
			const ids = parseWorldPackIdolsJson(text);
			if (!ids?.length) {
				saveMsg = $_('save.worldPackInvalid');
				return;
			}
			replaceMarketIdols(ids);
			saveMsg = $_('save.worldPackLoaded', { values: { n: String(ids.length) } });
		} catch {
			saveMsg = $_('save.worldPackInvalid');
		} finally {
			input.value = '';
		}
	}

	function onNewGame() {
		const name = newAgencyName.trim() || 'Star Idol Agency';
		startNewGame(name, undefined, {
			worldPack: newGameEmbeddedPack ? 'embedded_sample' : 'default',
			startingRegionId: newGameRegion
		});
		newAgencyName = '';
		saveMsg = $_('save.newGameStarted');
	}
</script>

<h1 class="text-xl font-semibold">{$_('nav.agencia')}</h1>
<p class="mt-2 text-[var(--muted)]">{$_('domain.agencia')}</p>

<Modal
	open={$saveConflict !== null}
	title={$_('save.conflictTitle')}
	onclose={() => saveConflict.set(null)}
>
	{#if $saveConflict}
		<p class="mb-3 text-sm text-[var(--muted)]">{$_('save.conflictBody')}</p>
		<div class="flex flex-col gap-2 sm:flex-row">
			<button
				type="button"
				class="flex-1 rounded-md border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-sm"
				onclick={pickLocalConflict}
			>
				{$_('save.useLocal')}
				<span class="block text-xs text-[var(--muted)]"
					>{$saveConflict.local.meta.savedAt}</span
				>
			</button>
			<button
				type="button"
				class="flex-1 rounded-md border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-sm"
				onclick={pickCloudConflict}
			>
				{$_('save.useCloud')}
				<span class="block text-xs text-[var(--muted)]"
					>{$saveConflict.cloudServerUpdatedAt}</span
				>
			</button>
		</div>
	{/if}
</Modal>

<div class="mt-6 grid gap-4 lg:grid-cols-2">
	<Card title={$_('game.balance')}>
		<p class="text-2xl font-semibold tracking-tight">
			¥{$gameState.balanceYen.toLocaleString()}
		</p>
		<p class="mt-2 text-sm text-[var(--muted)]">
			{$_('game.tier')}: {$_(`game.agencyTier.${$gameState.agencyTier}`)}
		</p>
		<p class="mt-1 text-sm text-[var(--muted)]">{$gameState.agencyName}</p>
	</Card>

	<Card title={$_('save.title')}>
		<p class="text-xs text-[var(--muted)]">
			{$_('save.tierLabel')}: {tier} · {$_('save.slots')}: {maxSlots}
		</p>
		{#if !$authUser}
			<p class="mt-2 text-sm">
				<a href={resolve('/auth')} class="text-[var(--accent)] underline">{$_('save.goAuth')}</a>
			</p>
		{/if}
		<label class="mt-3 block text-xs text-[var(--muted)]" for="slot">{$_('save.slot')}</label>
		<select
			id="slot"
			class="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm"
			value={$currentSaveSlot}
			onchange={(e) => currentSaveSlot.set(parseInt(e.currentTarget.value, 10) || 0)}
		>
			{#each [...Array(maxSlots).keys()] as slot (slot)}
				<option value={slot}>{slot}</option>
			{/each}
		</select>
		<div class="mt-3 flex flex-wrap gap-2">
			<button
				type="button"
				class="rounded-md border border-[var(--border)] bg-[var(--elevated)] px-3 py-1.5 text-sm"
				onclick={() => onSave()}
			>
				{$_('save.manual')}
			</button>
			<button
				type="button"
				class="rounded-md border border-[var(--border)] bg-[var(--elevated)] px-3 py-1.5 text-sm disabled:opacity-40"
				disabled={loadingCloud || !$authUser}
				onclick={() => onLoadCloud()}
			>
				{loadingCloud ? '…' : $_('save.loadCloud')}
			</button>
		</div>
		{#if saveMsg}
			<p class="mt-2 text-sm text-[var(--muted)]">{saveMsg}</p>
		{/if}
		<p class="mt-3 text-xs text-[var(--muted)]">{$_('save.autoWeek')}</p>
	</Card>

	<Card title={$_('save.worldPackImportTitle')}>
		<p class="text-xs text-[var(--muted)]">{$_('save.worldPackImportHint')}</p>
		<input
			type="file"
			accept="application/json,.json"
			class="mt-2 block w-full text-sm"
			onchange={onWorldPackFile}
		/>
	</Card>

	<Card title={$_('save.newGameTitle')}>
		<label class="block text-xs text-[var(--muted)]" for="agency">{$_('save.agencyName')}</label>
		<input
			id="agency"
			class="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm"
			bind:value={newAgencyName}
			placeholder="Star Idol Agency"
		/>
		<label class="mt-3 block text-xs text-[var(--muted)]" for="new-region">{$_('save.startRegion')}</label>
		<select
			id="new-region"
			class="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm"
			bind:value={newGameRegion}
		>
			<option value="tokyo">{$_('save.region.tokyo')}</option>
			<option value="osaka">{$_('save.region.osaka')}</option>
			<option value="nagoya">{$_('save.region.nagoya')}</option>
			<option value="fukuoka">{$_('save.region.fukuoka')}</option>
			<option value="sapporo">{$_('save.region.sapporo')}</option>
		</select>
		<label class="mt-3 flex cursor-pointer items-center gap-2 text-sm">
			<input type="checkbox" bind:checked={newGameEmbeddedPack} />
			<span>{$_('save.embeddedWorldPack')}</span>
		</label>
		<button
			type="button"
			class="mt-3 rounded-md border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-sm text-red-200"
			onclick={() => onNewGame()}
		>
			{$_('save.newGameConfirm')}
		</button>
	</Card>

	<Card title={$_('staff.hireTitle')}>
		<p class="text-xs text-[var(--muted)]">{$_('staff.hireHint')}</p>
		<ul class="mt-2 space-y-2 text-sm">
			{#each staffOffers as o (o.id)}
				<li class="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[var(--border)] p-2">
					<div>
						<span class="font-medium">{o.displayName}</span>
						<span class="text-[var(--muted)]"> · {$_('staff.' + o.roleKey.replace('staff.', ''))}</span>
						<span class="block text-xs text-[var(--muted)]"
							>¥{o.hireCostYen.toLocaleString()} · skill {o.skill}</span
						>
					</div>
					<button
						type="button"
						class="rounded-md border border-[var(--accent)] px-2 py-1 text-xs"
						disabled={$gameState.balanceYen < o.hireCostYen}
						onclick={() => {
							if ($gameState.balanceYen < o.hireCostYen) {
								saveMsg = $_('staff.hireNoFunds');
								return;
							}
							hireStaffFromOffer(o.id);
							saveMsg = '';
						}}
					>
						{$_('staff.hireBtn')}
					</button>
				</li>
			{/each}
		</ul>
	</Card>

	<Card title={$_('strategy.cardTitle')}>
		<p class="text-xs text-[var(--muted)]">
			{$_('strategy.profile')}: <span class="text-[var(--text)]">{strategyProfileLabel($gameState.agencyStrategy)}</span>
		</p>
		<div class="mt-3 grid gap-2 text-sm sm:grid-cols-2">
			<label class="block text-xs text-[var(--muted)]">
				{$_('strategy.focus')}
				<select
					class="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5"
					value={$gameState.agencyStrategy.focus}
					onchange={(e) =>
						setAgencyStrategy({
							focus: e.currentTarget.value as typeof $gameState.agencyStrategy.focus
						})}
				>
					<option value="balanced">{$_('strategy.focusBalanced')}</option>
					<option value="commercial">{$_('strategy.focusCommercial')}</option>
					<option value="artistic">{$_('strategy.focusArtistic')}</option>
					<option value="scouting">{$_('strategy.focusScouting')}</option>
				</select>
			</label>
			<label class="block text-xs text-[var(--muted)]">
				{$_('strategy.agenda')}
				<select
					class="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5"
					value={$gameState.agencyStrategy.agendaPosture}
					onchange={(e) =>
						setAgencyStrategy({
							agendaPosture: e.currentTarget.value as typeof $gameState.agencyStrategy.agendaPosture
						})}
				>
					<option value="light">{$_('strategy.agendaLight')}</option>
					<option value="normal">{$_('strategy.agendaNormal')}</option>
					<option value="packed">{$_('strategy.agendaPacked')}</option>
				</select>
			</label>
			<label class="block text-xs text-[var(--muted)]">
				{$_('strategy.image')}
				<select
					class="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5"
					value={$gameState.agencyStrategy.imagePosture}
					onchange={(e) =>
						setAgencyStrategy({
							imagePosture: e.currentTarget.value as typeof $gameState.agencyStrategy.imagePosture
						})}
				>
					<option value="safe">{$_('strategy.imageSafe')}</option>
					<option value="edgy">{$_('strategy.imageEdgy')}</option>
					<option value="viral">{$_('strategy.imageViral')}</option>
				</select>
			</label>
			<label class="block text-xs text-[var(--muted)]">
				{$_('strategy.growth')}
				<select
					class="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5"
					value={$gameState.agencyStrategy.growthPosture}
					onchange={(e) =>
						setAgencyStrategy({
							growthPosture: e.currentTarget.value as typeof $gameState.agencyStrategy.growthPosture
						})}
				>
					<option value="organic">{$_('strategy.growthOrganic')}</option>
					<option value="aggressive">{$_('strategy.growthAggressive')}</option>
				</select>
			</label>
		</div>
	</Card>

	<Card title={$_('game.ledger')}>
		<ul class="max-h-64 space-y-1 overflow-y-auto text-xs">
			{#each [...$gameState.ledger].reverse().slice(0, 24) as row (row.week + row.kind + row.note)}
				<li class="flex justify-between gap-2 border-b border-[var(--border)]/60 py-1">
					<span class="truncate text-[var(--muted)]">W{row.week} · {row.note}</span>
					<span class={row.amountYen < 0 ? 'text-red-400' : 'text-emerald-400'}>
						{row.amountYen < 0 ? '' : '+'}¥{row.amountYen.toLocaleString()}
					</span>
				</li>
			{/each}
		</ul>
		{#if $gameState.ledger.length === 0}
			<p class="text-sm text-[var(--muted)]">{$_('game.ledgerEmpty')}</p>
		{/if}
	</Card>
</div>
