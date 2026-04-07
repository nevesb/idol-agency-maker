<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getSupabaseBrowser } from '$lib/supabase/browser-client';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	onMount(async () => {
		const c = getSupabaseBrowser();
		if (c) await c.auth.getSession();
		await goto(resolve('/'));
	});
</script>

<p class="text-sm text-[var(--muted)]">{$_('auth.redirecting')}</p>
