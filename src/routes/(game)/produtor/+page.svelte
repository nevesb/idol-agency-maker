<script lang="ts">
	import { resolve } from '$app/paths';
	import { _ } from 'svelte-i18n';

	const links = [
		['/scouting', 'breadcrumb.scouting'],
		['/noticias', 'breadcrumb.news'],
		['/financas', 'breadcrumb.finance'],
		['/grupos', 'breadcrumb.groups'],
		['/definir', 'breadcrumb.settings']
	] as const;
</script>

<h1 class="text-xl font-semibold">{$_('nav.produtor')}</h1>
<p class="mt-2 text-[var(--muted)]">{$_('domain.produtor')}</p>

<ul class="mt-6 flex flex-col gap-2 text-sm">
	{#each links as [path, key] (path)}
		<li>
			<a href={resolve(path)} class="text-[var(--accent)] underline" data-sveltekit-preload-data="hover"
				>{$_(key)}</a
			>
			<span class="ml-2 text-xs text-[var(--muted)]">{path}</span>
		</li>
	{/each}
</ul>
