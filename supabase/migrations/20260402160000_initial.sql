-- Star Idol Agency — schema base (P0-06, P5-08)
-- Executar no SQL Editor do Supabase ou via CLI após `supabase link`.

create extension if not exists "pgcrypto";

-- Perfis (1:1 com auth.users)
create table if not exists public.profiles (
	id uuid primary key references auth.users (id) on delete cascade,
	display_name text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
	on public.profiles for select
	using (auth.uid() = id);

create policy "profiles_insert_own"
	on public.profiles for insert
	with check (auth.uid() = id);

create policy "profiles_update_own"
	on public.profiles for update
	using (auth.uid() = id);

-- Saves (JSONB comprimido no edge; aqui armazenamos metadados + payload)
create table if not exists public.save_games (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users (id) on delete cascade,
	slot_index int not null check (slot_index >= 0 and slot_index < 10),
	name text not null default 'Save',
	payload jsonb not null default '{}'::jsonb,
	updated_at timestamptz not null default now(),
	created_at timestamptz not null default now(),
	unique (user_id, slot_index)
);

create index if not exists save_games_user_updated_idx on public.save_games (user_id, updated_at desc);

alter table public.save_games enable row level security;

create policy "save_games_select_own"
	on public.save_games for select
	using (auth.uid() = user_id);

create policy "save_games_insert_own"
	on public.save_games for insert
	with check (auth.uid() = user_id);

create policy "save_games_update_own"
	on public.save_games for update
	using (auth.uid() = user_id);

create policy "save_games_delete_own"
	on public.save_games for delete
	using (auth.uid() = user_id);

-- Assinatura / tier (validação complementar no Edge Function)
create table if not exists public.subscriptions (
	user_id uuid primary key references auth.users (id) on delete cascade,
	tier text not null default 'free' check (tier in ('free', 'premium')),
	valid_until timestamptz,
	updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own"
	on public.subscriptions for select
	using (auth.uid() = user_id);

-- Trigger: criar profile ao registar (opcional; pode mover para Edge)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	insert into public.profiles (id, display_name)
	values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
	on conflict (id) do nothing;
	insert into public.subscriptions (user_id)
	values (new.id)
	on conflict (user_id) do nothing;
	return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
	after insert on auth.users
	for each row execute function public.handle_new_user();
