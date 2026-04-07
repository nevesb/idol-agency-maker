<script lang="ts">
	import { ledgerNetByKind } from '$lib/simulation/vertical-slice';
	import { gameState } from '$lib/stores/game-state';
	import { _ } from 'svelte-i18n';

	let byKind = $derived(ledgerNetByKind($gameState.ledger));
	let rows = $derived(Object.entries(byKind).sort(([a], [b]) => a.localeCompare(b)));
</script>

<h1 class="text-xl font-semibold">{$_('breadcrumb.finance')}</h1>
<p class="mt-2 text-sm text-[var(--muted)]">{$_('slice.financeBody')}</p>

<div class="mt-6 overflow-x-auto rounded-lg border border-[var(--border)]">
	<table class="w-full text-left text-sm">
		<thead class="bg-[var(--elevated)] text-xs text-[var(--muted)] uppercase">
			<tr>
				<th class="px-3 py-2">Kind</th>
				<th class="px-3 py-2">¥</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as [k, v] (k)}
				<tr class="border-b border-[var(--border)] odd:bg-[var(--elevated)]/40">
					<td class="px-3 py-2 font-mono text-xs">{k}</td>
					<td class="px-3 py-2 tabular-nums {v < 0 ? 'text-red-400' : 'text-emerald-400'}"
						>{v < 0 ? '' : '+'}{v.toLocaleString()}</td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
