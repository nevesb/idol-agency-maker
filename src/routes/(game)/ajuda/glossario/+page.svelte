<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { _ } from 'svelte-i18n';

	const cats = [
		'core',
		'economy',
		'wellness',
		'jobs',
		'fame',
		'contracts',
		'saves',
		'ui'
	] as const;
</script>

<h1 class="text-xl font-semibold">{$_('glossary.title')}</h1>
<p class="mt-2 text-sm text-[var(--muted)]">{$_('glossary.subtitle')}</p>

<div class="mt-6 space-y-4">
	{#each cats as c}
		<Card title={$_(`glossary.cat.${c}`)}>
			<p class="text-sm whitespace-pre-line">{$_(`glossary.body.${c}`)}</p>
		</Card>
	{/each}
</div>
