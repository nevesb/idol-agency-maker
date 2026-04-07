<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import Card from '$lib/components/ui/Card.svelte';
	import { getSupabaseBrowser } from '$lib/supabase/browser-client';
	import { authUser } from '$lib/stores/auth-session';
	import { _ } from 'svelte-i18n';
	import type { Provider } from '@supabase/supabase-js';

	let email = $state('');
	let status = $state('');
	let loading = $state(false);

	function redirectUrl(): string | undefined {
		return browser && typeof window !== 'undefined'
			? `${window.location.origin}${resolve('/auth/callback')}`
			: undefined;
	}

	async function sendMagicLink() {
		const client = getSupabaseBrowser();
		if (!client) {
			status = $_('save.noSupabase');
			return;
		}
		loading = true;
		status = '';
		const { error } = await client.auth.signInWithOtp({
			email: email.trim(),
			options: { emailRedirectTo: redirectUrl() }
		});
		loading = false;
		if (error) status = error.message;
		else status = $_('auth.checkEmail');
	}

	async function signInOAuth(provider: Provider) {
		const client = getSupabaseBrowser();
		if (!client) {
			status = $_('save.noSupabase');
			return;
		}
		status = '';
		const { error } = await client.auth.signInWithOAuth({
			provider,
			options: { redirectTo: redirectUrl() }
		});
		if (error) status = $_('auth.oauthError');
	}

	async function signOut() {
		const client = getSupabaseBrowser();
		await client?.auth.signOut();
	}
</script>

<h1 class="text-xl font-semibold">{$_('auth.title')}</h1>
<p class="mt-2 text-sm text-[var(--muted)]">{$_('auth.subtitle')}</p>

<div class="mt-6 max-w-md space-y-4">
	{#if $authUser}
		<Card title={$_('auth.signedIn')}>
			<p class="text-sm">{$authUser.email}</p>
			<button
				type="button"
				class="mt-3 rounded-md border border-[var(--border)] bg-[var(--elevated)] px-3 py-1.5 text-sm"
				onclick={() => signOut()}
			>
				{$_('auth.signOut')}
			</button>
		</Card>
	{:else}
		<Card title={$_('auth.magicLink')}>
			<label class="block text-xs text-[var(--muted)]" for="email">Email</label>
			<input
				id="email"
				type="email"
				class="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm"
				bind:value={email}
				autocomplete="email"
			/>
			<button
				type="button"
				class="mt-3 w-full rounded-md border border-[var(--border)] bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
				disabled={loading || !email.trim()}
				onclick={() => sendMagicLink()}
			>
				{loading ? '…' : $_('auth.sendLink')}
			</button>
			{#if status}
				<p class="mt-2 text-sm text-[var(--muted)]">{status}</p>
			{/if}
		</Card>

		<div class="flex items-center gap-3">
			<hr class="flex-1 border-[var(--border)]" />
			<span class="text-xs text-[var(--muted)]">{$_('auth.orSocial')}</span>
			<hr class="flex-1 border-[var(--border)]" />
		</div>

		<div class="flex gap-3">
			<button
				type="button"
				class="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--elevated)] px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface)]"
				onclick={() => signInOAuth('google')}
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
						fill="#FBBC05"
					/>
					<path
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						fill="#EA4335"
					/>
				</svg>
				{$_('auth.google')}
			</button>

			<button
				type="button"
				class="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--elevated)] px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface)]"
				onclick={() => signInOAuth('discord')}
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="#5865F2">
					<path
						d="M20.32 4.37A19.8 19.8 0 0 0 15.39 3c-.21.38-.46.89-.63 1.29a18.42 18.42 0 0 0-5.52 0A13.5 13.5 0 0 0 8.6 3a19.74 19.74 0 0 0-4.93 1.37C.53 9.05-.33 13.6.1 18.08a19.9 19.9 0 0 0 6.07 3.07 14.7 14.7 0 0 0 1.3-2.1 12.9 12.9 0 0 1-2.04-.98l.5-.38a14.18 14.18 0 0 0 12.14 0l.5.38c-.65.39-1.33.72-2.05.99.38.73.81 1.43 1.3 2.09a19.84 19.84 0 0 0 6.08-3.07c.52-5.38-.87-10.05-3.58-14.71zM8.01 15.33c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.95 2.42-2.15 2.42zm7.98 0c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.95 2.42-2.15 2.42z"
					/>
				</svg>
				{$_('auth.discord')}
			</button>
		</div>
	{/if}
</div>
