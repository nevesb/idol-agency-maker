-- P0-06 / P5-08 — RLS em profiles + buckets Storage (P0-07).
-- Gravação de saves continua via supabase-js + RLS em save_games (direct client; Edge opcional).

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id)
with
	check (auth.uid() = id);

-- Buckets (idol-images público leitura para URLs diretas; world-packs/templates privados)
insert into
	storage.buckets (id, public, file_size_limit, allowed_mime_types)
values
	('world-packs', false, 52428800, array['application/json']::text[]),
	('idol-images', true, 10485760, array['image/webp', 'image/png', 'image/jpeg']::text[]),
	('templates', false, 20971520, null)
on conflict (id) do update
set
	public = excluded.public,
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

-- idol-images: leitura pública
drop policy if exists "idol_images_public_read" on storage.objects;
create policy "idol_images_public_read" on storage.objects for select using (bucket_id = 'idol-images');

drop policy if exists "idol_images_auth_upload" on storage.objects;
create policy "idol_images_auth_upload" on storage.objects for insert to authenticated
with
	check (bucket_id = 'idol-images');

drop policy if exists "idol_images_auth_update" on storage.objects;
create policy "idol_images_auth_update" on storage.objects for update to authenticated using (bucket_id = 'idol-images')
with
	check (bucket_id = 'idol-images');

drop policy if exists "idol_images_auth_delete" on storage.objects;
create policy "idol_images_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'idol-images');

-- world-packs: utilizador autenticado gere apenas objetos sob prefixo {uid}/
drop policy if exists "world_packs_select_own" on storage.objects;
create policy "world_packs_select_own" on storage.objects for select to authenticated using (
	bucket_id = 'world-packs'
	and (storage.foldername (name))[1] = auth.uid()::text
);

drop policy if exists "world_packs_insert_own" on storage.objects;
create policy "world_packs_insert_own" on storage.objects for insert to authenticated
with
	check (
		bucket_id = 'world-packs'
		and (storage.foldername (name))[1] = auth.uid()::text
	);

drop policy if exists "world_packs_update_own" on storage.objects;
create policy "world_packs_update_own" on storage.objects for update to authenticated using (
	bucket_id = 'world-packs'
	and (storage.foldername (name))[1] = auth.uid()::text
)
with
	check (
		bucket_id = 'world-packs'
		and (storage.foldername (name))[1] = auth.uid()::text
	);

drop policy if exists "world_packs_delete_own" on storage.objects;
create policy "world_packs_delete_own" on storage.objects for delete to authenticated using (
	bucket_id = 'world-packs'
	and (storage.foldername (name))[1] = auth.uid()::text
);

-- templates: leitura autenticada (MVP); escrita pode ser service_role no dashboard
drop policy if exists "templates_select_auth" on storage.objects;
create policy "templates_select_auth" on storage.objects for select to authenticated using (bucket_id = 'templates');
