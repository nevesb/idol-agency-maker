# Technical Preferences

<!-- Populated manually (brownfield adoption). All agents reference this file. -->

## Engine & Language

- **Engine**: SvelteKit 2.50 + Svelte 5 (web-based management sim, no traditional game engine)
- **Language**: TypeScript (strict mode), Python (offline tooling)
- **Rendering**: HTML/CSS/Tailwind (DOM-based UI, no canvas/WebGL)
- **Physics**: N/A (management sim — no physics simulation)

## Input & Platform

- **Target Platforms**: PC (web + Tauri desktop), Web, Mobile (future PWA)
- **Input Methods**: Keyboard/Mouse
- **Primary Input**: Keyboard/Mouse (dense FM26-style UI)
- **Gamepad Support**: None
- **Touch Support**: None (future consideration for mobile PWA)
- **Platform Notes**: PC-first, 1920×1080 dense UI. Desktop via Tauri 2. Web as secondary platform.

## Naming Conventions

- **Classes**: PascalCase (`IdolProfile`, `ContractNegotiation`)
- **Variables**: camelCase (`currentIdol`, `weekResult`)
- **Signals/Events**: camelCase with on-prefix in handlers (`onWeekComplete`, `handleSave`)
- **Files**: kebab-case (`week-pipeline.ts`, `idol-profile.svelte`)
- **Scenes/Prefabs**: N/A (SvelteKit routes in `src/routes/`)
- **Constants**: UPPER_SNAKE_CASE (`BASE_SALARY_BY_TIER`, `MAX_ROSTER_SIZE`)

## Performance Budgets

- **Target Framerate**: 60fps UI interactions
- **Frame Budget**: 16ms (DOM rendering)
- **Draw Calls**: N/A (DOM-based)
- **Memory Ceiling**: 512MB (Web Worker simulation for 3,000+ idols)
- **Simulation Budget**: <500ms per week tick for 3,000 idols in Web Worker

## Testing

- **Framework**: Vitest (unit/integration), Playwright (E2E)
- **Minimum Coverage**: Not yet established
- **Required Tests**: Simulation systems (stats, economy, contracts, jobs, wellness, rival AI), week pipeline integration, deterministic RNG

## Forbidden Patterns

- `any` type in public API boundaries
- Direct DOM mutation in simulation code (must be pure TS, no DOM deps)
- Mutable shared state between UI and Worker without explicit contract
- Swallowing exceptions without logging or propagation
- Hardcoded gameplay values (must use tuning knobs from GDD)

## Allowed Libraries / Addons

- `@supabase/supabase-js` — backend client
- `svelte-i18n` — localization
- `tailwindcss` — utility CSS
- `@tauri-apps/api` + `@tauri-apps/cli` — desktop wrapper
- `@playwright/test` — E2E testing
- `vitest` — unit testing

## Architecture Decisions Log

- [ADR-001: Stack Tecnológica](../../docs/architecture/adr-001-stack-tecnologica.md) — SvelteKit + TS + Tauri + Supabase (Accepted)

## Engine Specialists

- **Primary**: `lead-programmer` (TypeScript architecture, SvelteKit patterns)
- **Language/Code Specialist**: `gameplay-programmer` (simulation TS, Web Workers)
- **Shader Specialist**: N/A (no shaders — DOM-based rendering)
- **UI Specialist**: `ui-programmer` (Svelte components, Tailwind, responsive layout)
- **Additional Specialists**: `network-programmer` (Supabase integration, edge functions)
- **Routing Notes**: All game logic routes to `gameplay-programmer`. UI work routes to `ui-programmer`. Backend/auth routes to `network-programmer`.

### File Extension Routing

| File Extension / Type | Specialist to Spawn |
|-----------------------|---------------------|
| `.ts` (simulation/) | `gameplay-programmer` |
| `.ts` (stores/, types/, persistence/) | `lead-programmer` |
| `.svelte` (components/, routes/) | `ui-programmer` |
| `.ts` (server/, supabase/) | `network-programmer` |
| `.py` (tools/) | `lead-programmer` |
| General architecture review | `lead-programmer` |
