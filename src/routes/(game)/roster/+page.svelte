<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import IdolAvatar from '$lib/components/ui/IdolAvatar.svelte';
	import TutorialHint from '$lib/components/ui/TutorialHint.svelte';
	import { fameTierFromPoints } from '$lib/simulation/fame';
	import { getActiveTutorialHints } from '$lib/simulation/tutorial';
	import { gameState } from '$lib/stores/game-state';
	import { dismissTutorialHint, dismissedTutorialIds } from '$lib/stores/tutorial';
	import { _ } from 'svelte-i18n';

	let hints = $derived(
		getActiveTutorialHints($gameState.absoluteWeek, '/roster', $dismissedTutorialIds)
	);
</script>

{#each hints as hint (hint.id)}
	<TutorialHint messageKey={hint.message} ondismiss={() => dismissTutorialHint(hint.id)} />
{/each}

<h1 class="text-xl font-semibold">{$_('nav.roster')}</h1>
<p class="mt-2 text-[var(--muted)]">{$_('domain.roster')}</p>

<div class="mt-6">
	<Card title={$_('game.rosterTitle')}>
		<ul class="space-y-4 text-sm">
			{#each $gameState.idols as idol (idol.id)}
				<li class="rounded-lg border border-[var(--border)] bg-[var(--elevated)]/40 p-3">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div class="flex items-center gap-3">
							<IdolAvatar {idol} size="sm" />
							<a
								class="font-medium text-[var(--accent)] underline decoration-dotted hover:opacity-90"
								href={`/roster/${idol.id}`}
								data-sveltekit-preload-data="hover"
							>
								{idol.nameRomaji}
							</a>
						</div>
						<span class="text-xs text-[var(--muted)]">
							{$_('game.fame')}: {fameTierFromPoints(idol.famePoints)} ({idol.famePoints})
						</span>
					</div>
					<div class="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
						<span>{$_('game.wellness.physical')}: {Math.round(idol.wellness.physical)}</span>
						<span>{$_('game.wellness.happiness')}: {Math.round(idol.wellness.happiness)}</span>
						<span>{$_('game.wellness.stress')}: {Math.round(idol.wellness.stress)}</span>
						<span>{$_('game.wellness.motivation')}: {Math.round(idol.wellness.motivation)}</span>
					</div>
				</li>
			{/each}
		</ul>
	</Card>
</div>
