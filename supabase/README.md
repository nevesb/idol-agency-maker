# Supabase

1. Crie um projeto em [Supabase](https://supabase.com) e copie `URL` + `anon key` para `.env` (ver `.env.example`).
2. Aplique as migrações em ordem no **SQL Editor** (ou `supabase db push` após `supabase link`): `20260402170000_base_schema.sql`, depois `20260402210000_profiles_rls_storage.sql` (profiles RLS + buckets Storage).
3. Em **Authentication → Providers**, ative **Email** (magic link). Em **URL Configuration**, adicione `http://localhost:5173/auth/callback` (e o URL de produção + `/auth/callback`) a **Redirect URLs**.
4. Em **Storage**, crie buckets públicos ou privados: `world-packs`, `idol-images`, `templates` (P0-07).

## Phase 5 — Saves (cliente + Postgres)

O cliente grava em `save_games` (JSONB) com RLS (`user_id = auth.uid()`). **Free**: 1 slot (índice 0). **Premium**: slots 0–4 — atualize `public.subscriptions.tier` para `premium` no SQL Editor para testar.

- Auto-save na nuvem: após cada semana simulada (se houver sessão).
- Cache local: **IndexedDB** com debounce ao alterar o estado.
- Edge Functions opcionais (compressão, validação extra) podem ser acrescentadas depois.

## CI (P0-08)

No repositório: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) corre `check`, testes unitários e `build` em push/PR para `main`/`master`.
