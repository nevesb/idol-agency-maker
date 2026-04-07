# Control Manifest

> **Engine**: SvelteKit 2.50 + Svelte 5 (web-based management sim)
> **Last Updated**: 2026-04-07
> **Manifest Version**: 2026-04-07
> **ADRs Covered**: ADR-001
> **Status**: Active — regenerate with `/create-control-manifest` when ADRs change

This manifest is a programmer's quick-reference extracted from all Accepted ADRs,
technical preferences, and engine reference docs. For the reasoning behind each
rule, see the referenced ADR.

---

## Foundation Layer Rules

*Applies to: state management, event architecture, save/load, app initialisation*

### Required Patterns
- **All game state flows through Svelte 5 runes (`$state`, `$derived`, `$effect`)** — source: ADR-001
- **Persistence uses IndexedDB (primary, offline) + Supabase (cloud backup)** — saves must work fully offline — source: ADR-001
- **Cloud sync uploads compressed save post-autosave when online (opt-in)** — local is always source of truth — source: ADR-001
- **Authentication via Supabase Auth (email, Google, Discord)** — login is optional, only required for cloud save — source: ADR-001

### Forbidden Approaches
- **Never use React, Vue, or any virtual DOM framework** — rejected for performance with dense tables — source: ADR-001
- **Never use Electron for desktop** — rejected for size (300MB+ vs ~10MB Tauri) — source: ADR-001
- **Never use Firebase** — rejected for vendor lock-in and Firestore flexibility limitations — source: ADR-001

### Performance Guardrails
- **Save/load**: Autosave <200ms (delta), full save <2s, load <1.5s — source: ADR-001
- **Memory**: Max 512MB total (including Web Worker simulation for 3,000+ idols) — source: technical-preferences

---

## Core Layer Rules

*Applies to: simulation engine, week pipeline, game systems, economy*

### Required Patterns
- **Simulation code lives in `src/lib/simulation/` — pure TypeScript, zero DOM dependencies** — source: ADR-001
- **Simulation runs in a Web Worker (`src/lib/workers/`)** — never on the main thread — source: ADR-001
- **All gameplay values must be data-driven (tuning knobs from GDD), never hardcoded** — source: technical-preferences

### Forbidden Approaches
- **Never mutate shared objects between UI and Worker** — use structured clone or explicit message contracts — source: ADR-001, technical-preferences
- **Never use `any` type at public API boundaries** — discriminated unions for states and events — source: technical-preferences

### Performance Guardrails
- **Week tick**: <500ms for 3,000 idols in Web Worker (Skip mode) — source: ADR-001
- **Rival AI**: 50 agencies within 100ms total (2ms each, simplified heuristics) — source: GDD week-simulation

---

## Feature Layer Rules

*Applies to: secondary systems, AI, scouting, music, shows*

### Required Patterns
- **Cross-system communication via typed message passing** — Worker↔UI boundary uses explicit typed contracts — source: ADR-001
- **Expected errors as values (Result-style)** — in simulation and worker↔UI boundary; never swallow exceptions — source: technical-preferences

### Forbidden Approaches
- **Never access DOM from simulation code** — all feature systems must be testable without DOM — source: ADR-001, technical-preferences

---

## Presentation Layer Rules

*Applies to: UI components, routing, styling, animations*

### Required Patterns
- **Svelte 5 components** — small, composed; reusable logic extracted to `.ts` in `lib/` — source: ADR-001
- **Tailwind CSS for styling** — utility-first, no custom CSS frameworks — source: ADR-001
- **SvelteKit routing conventions** — use `+page.svelte`, `+layout.svelte`, `load` functions for server data — source: ADR-001
- **Extract heavy logic from `+page.svelte`** — into pure functions or stores — source: ADR-001

### Forbidden Approaches
- **Never use direct DOM manipulation** in component code — use Svelte reactivity — source: technical-preferences
- **Never put simulation logic in UI components** — UI only orchestrates and presents — source: ADR-001

### Performance Guardrails
- **60fps UI interactions** — 16ms frame budget for DOM rendering — source: technical-preferences

---

## Global Rules (All Layers)

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Classes | PascalCase | `IdolProfile`, `ContractNegotiation` |
| Variables | camelCase | `currentIdol`, `weekResult` |
| Signals/Events | camelCase with on-prefix | `onWeekComplete`, `handleSave` |
| Files | kebab-case | `week-pipeline.ts`, `idol-profile.svelte` |
| Constants | UPPER_SNAKE_CASE | `BASE_SALARY_BY_TIER`, `MAX_ROSTER_SIZE` |

### Performance Budgets

| Target | Value |
|--------|-------|
| UI Framerate | 60fps |
| Frame budget | 16ms (DOM rendering) |
| Simulation tick | <500ms (3,000 idols, Web Worker) |
| Memory ceiling | 512MB |
| Save (autosave) | <200ms (delta strategy) |
| Save (full) | <2s, <50MB on disk |
| Load | <1.5s |

### Approved Libraries / Addons

| Library | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Backend client (auth, DB, storage) |
| `svelte-i18n` | Localization (EN/JA/PT) |
| `tailwindcss` | Utility CSS |
| `@tauri-apps/api` + `@tauri-apps/cli` | Desktop wrapper |
| `vitest` | Unit/integration testing |
| `@playwright/test` | E2E testing |

### Forbidden Patterns (All Layers)

- **`any` type in public API boundaries** — use explicit types, discriminated unions — source: technical-preferences
- **Direct DOM mutation in simulation code** — must be pure TS, no DOM deps — source: technical-preferences
- **Mutable shared state between UI and Worker** — without explicit typed contract — source: technical-preferences
- **Swallowing exceptions** — without logging or propagation — source: technical-preferences
- **Hardcoded gameplay values** — must use tuning knobs from GDD — source: technical-preferences

### Cross-Cutting Constraints

- **TypeScript strict mode** — explicit types at public boundaries; avoid `any` — source: ADR-001
- **Immutability by default** — update state with copies (spread, structuredClone); do not mutate shared objects — source: ADR-001
- **Offline-first** — all game logic works without network; cloud features are optional enhancements — source: ADR-001
- **GDD is source of truth** — if code and GDD diverge, the GDD wins until explicitly updated — source: CLAUDE.md
- **Deterministic simulation** — seeded RNG (platform-independent PRNG); same seed = same result on PC and web — source: ADR-001
- **Stack decisions are locked** — do not reopen without a new ADR — source: ADR-001
