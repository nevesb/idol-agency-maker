<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	const K_GOALS = 'sia_owner_goals_draft';
	const K_CLOUD = 'sia_prefer_cloud_save';

	let goals = $state('');
	let preferCloud = $state(true);

	onMount(() => {
		if (!browser) return;
		goals = localStorage.getItem(K_GOALS) ?? '';
		preferCloud = localStorage.getItem(K_CLOUD) !== '0';
	});

	function persist() {
		if (!browser) return;
		localStorage.setItem(K_GOALS, goals);
		localStorage.setItem(K_CLOUD, preferCloud ? '1' : '0');
	}
</script>

<h1 class="text-xl font-semibold">{$_('breadcrumb.settings')}</h1>
<p class="mt-2 text-sm text-[var(--muted)]">{$_('slice.settingsHint')}</p>

<div class="mt-6 max-w-lg space-y-4">
	<label class="block text-sm">
		<span class="text-[var(--muted)]">{$_('slice.ownerGoals')}</span>
		<textarea
			class="mt-1 min-h-[8rem] w-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 text-sm"
			bind:value={goals}
		></textarea>
	</label>
	<label class="flex items-center gap-2 text-sm">
		<input type="checkbox" bind:checked={preferCloud} />
		{$_('slice.preferCloud')}
	</label>
	<button
		type="button"
		class="rounded-md border border-[var(--accent)] px-3 py-1.5 text-sm"
		onclick={persist}
	>
		{$_('slice.saveLocal')}
	</button>
</div>
