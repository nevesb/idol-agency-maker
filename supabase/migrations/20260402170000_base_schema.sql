-- P0-06 / P5-08 — schema base e RLS para saves (aplicar no projeto Supabase).
-- O cliente atual usa upsert direto em save_games; Edge Functions podem reutilizar as mesmas tabelas.

create table if not exists public.profiles (
	id uuid primary key references auth.users (id) on delete cascade,
	display_name text,
	created_at timestamptz default now()
);

create table if not exists public.subscriptions (
	user_id uuid primary key references auth.users (id) on delete cascade,
	tier text not null default 'free' check (tier in ('free', 'premium')),
	updated_at timestamptz default now()
);

create table if not exists public.save_games (
	user_id uuid not null references auth.users (id) on delete cascade,
	slot_index int not null check (slot_index >= 0 and slot_index < 8),
	name text not null,
	payload jsonb not null,
	updated_at timestamptz not null default now(),
	primary key (user_id, slot_index)
);

alter table public.save_games enable row level security;

drop policy if exists "save_games_is_owner" on public.save_games;
create policy "save_games_is_owner" on public.save_games for all using (auth.uid() = user_id)
with
	check (auth.uid() = user_id);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_is_owner" on public.subscriptions;
create policy "subscriptions_is_owner" on public.subscriptions for all using (auth.uid() = user_id)
with
	check (auth.uid() = user_id);
