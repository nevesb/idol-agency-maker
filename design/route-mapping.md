# Route Mapping: PT → EN

All SvelteKit route paths must be written in English.

## Current Routes (PT) → Target Routes (EN)

| Current Path (PT) | Target Path (EN) | Domain | Description |
|---|---|---|---|
| `(game)/portal` | `(game)/portal` | Portal | Command Center (already EN) |
| `(game)/roster` | `(game)/roster` | Roster | Idol list (already EN) |
| `(game)/roster/[id]` | `(game)/roster/[id]` | Roster | Idol profile (already EN) |
| `(game)/scouting` | `(game)/scouting` | Market | Scout interface (already EN) |
| `(game)/mercado` | `(game)/market` | Market | Transfer market |
| `(game)/operacoes` | `(game)/operations` | Operations | Operations hub |
| `(game)/operacoes/resultados` | `(game)/operations/results` | Operations | Week results |
| `(game)/mensagens` | `(game)/messages` | Portal | Inbox |
| `(game)/noticias` | `(game)/news` | Portal | News feed |
| `(game)/definir` | `(game)/settings` | Meta | Game settings |
| `(game)/produtor` | `(game)/producer` | Producer | Producer profile |
| `(game)/grupos` | `(game)/groups` | Roster | Group management |
| `(game)/financas` | `(game)/finances` | Agency | Financial dashboard |
| `(game)/agencia` | `(game)/agency` | Agency | Agency overview |
| `(game)/ajuda/glossario` | `(game)/help/glossary` | Meta | IdolPedia glossary |
| `new-game` | `new-game` | Menu | New game wizard (already EN) |
| `auth` | `auth` | Meta | Authentication (already EN) |
| `auth/callback` | `auth/callback` | Meta | OAuth callback (already EN) |
| `(game)/demo` | `(game)/demo` | Dev | Demo pages (already EN) |
| `(game)/demo/playwright` | `(game)/demo/playwright` | Dev | Playwright demo (already EN) |

## Routes Already in English (No Change)
- `/portal`, `/roster`, `/roster/[id]`, `/scouting`, `/new-game`, `/auth`, `/auth/callback`, `/demo`, `/demo/playwright`

## Routes Requiring Rename (9 total)
1. `mercado` → `market`
2. `operacoes` → `operations`
3. `operacoes/resultados` → `operations/results`
4. `mensagens` → `messages`
5. `noticias` → `news`
6. `definir` → `settings`
7. `produtor` → `producer`
8. `grupos` → `groups`
9. `financas` → `finances`
10. `agencia` → `agency`
11. `ajuda/glossario` → `help/glossary`

## Full Navigation Structure (EN)

```
(menu)/
  +page.svelte              → /         (Main Menu / Title Screen)
  new-game/+page.svelte     → /new-game (New Game Wizard)
  auth/+page.svelte         → /auth     (Authentication)

(game)/
  portal/+page.svelte       → /portal       (Command Center)
  roster/+page.svelte       → /roster       (Roster Overview)
  roster/[id]/+page.svelte  → /roster/:id   (Idol Profile)
  market/+page.svelte       → /market       (Transfer Market)
  scouting/+page.svelte     → /scouting     (Scout Interface)
  operations/+page.svelte   → /operations   (Operations Hub)
  operations/results/       → /operations/results (Week Results)
  messages/+page.svelte     → /messages     (Inbox)
  news/+page.svelte         → /news         (News Feed)
  groups/+page.svelte       → /groups       (Group Management)
  finances/+page.svelte     → /finances     (Financial Dashboard)
  agency/+page.svelte       → /agency       (Agency Overview)
  producer/+page.svelte     → /producer     (Producer Profile)
  settings/+page.svelte     → /settings     (Game Settings)
  help/glossary/            → /help/glossary (IdolPedia)
```

## Domain → Route Mapping (matches GDD ui-information-architecture.md)

| Domain (Hotkey) | Routes |
|---|---|
| **Portal** (1) | `/portal`, `/messages`, `/news` |
| **Roster** (2) | `/roster`, `/roster/[id]`, `/groups` |
| **Market** (3) | `/market`, `/scouting` |
| **Operations** (4) | `/operations`, `/operations/results` |
| **Agency** (5) | `/agency`, `/finances` |
| **Producer** (6) | `/producer` |
