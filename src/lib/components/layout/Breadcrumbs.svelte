<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { routeTitles } from '$lib/navigation/domains';
	import { _ } from 'svelte-i18n';

	const path = $derived(page.url.pathname.replace(/\/$/, '') || '/');
	const titleKey = $derived(
		path === '/auth/callback'
			? 'breadcrumb.authCallback'
			: path.startsWith('/auth')
				? 'breadcrumb.auth'
				: /^\/roster\/.+/.test(path)
					? 'breadcrumb.idolProfile'
					: (routeTitles[path as keyof typeof routeTitles] ?? 'breadcrumb.portal')
	);
</script>

<nav class="mb-3 text-sm text-[var(--muted)]" aria-label="Breadcrumb">
	<ol class="flex flex-wrap items-center gap-2">
		<li>
			<a href={resolve('/')} class="hover:text-[var(--text)]">{$_('nav.portal')}</a>
		</li>
		{#if path !== '/'}
			<li aria-hidden="true">/</li>
			<li class="font-medium text-[var(--text)]">{$_(titleKey)}</li>
		{/if}
	</ol>
</nav>
