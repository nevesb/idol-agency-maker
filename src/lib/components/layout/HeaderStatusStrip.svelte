<script lang="ts">
	import { deriveCalendar } from '$lib/simulation/calendar';
	import { gameState } from '$lib/stores/game-state';
	import { absoluteWeek } from '$lib/stores/time-control';
	import { _ } from 'svelte-i18n';
</script>

<div
	class="fm26-statusbar flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-[var(--fm-header-border)] bg-[var(--fm-status-bg)] px-4 py-2 text-[12px] leading-tight text-[var(--muted)]"
	aria-label="Status"
>
	<span class="font-semibold text-[var(--text)]">{$gameState.agencyName}</span>
	<span class="tabular-nums">
		{$_('game.balance')}: <span class="text-[var(--text)]">¥{$gameState.balanceYen.toLocaleString()}</span>
	</span>
	<span class="tabular-nums">
		{$_('game.tier')}: <span class="text-[var(--text)]">{$_(`game.agencyTier.${$gameState.agencyTier}`)}</span>
	</span>
	<span class="tabular-nums">
		{$_('time.week', { values: { n: $absoluteWeek } })}
		{#key $absoluteWeek}
			{@const cal = deriveCalendar($absoluteWeek)}
			<span class="text-[var(--text)]">
				· Y{cal.year} M{cal.month} W{cal.weekInMonth} · {$_(`time.season.${cal.season}`)}
			</span>
		{/key}
	</span>
</div>
