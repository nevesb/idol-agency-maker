# Claude Code Game Studios -- Game Studio Agent Architecture

Indie game development managed through 48 coordinated Claude Code subagents.
Each agent owns a specific domain, enforcing separation of concerns and quality.

## Technology Stack

- **Engine**: SvelteKit + TypeScript (web-based management sim, not traditional game engine)
- **Language**: TypeScript (strict), Python (tooling)
- **Desktop**: Tauri 2
- **Backend**: Supabase (Auth, Postgres, Storage, Edge Functions)
- **Simulation**: Pure TS in Web Workers (deterministic, seeded RNG)
- **Asset Generation**: ComfyUI + RunPod (portraits), LLM enrichment (backstories)
- **Testing**: Vitest + Playwright
- **CI/CD**: GitHub Actions
- **Version Control**: Git with trunk-based development
- **ADR**: `docs/architecture/adr-001-stack-tecnologica.md` — do not reopen stack choices without new ADR

> **Note**: This is a web-based management simulation, not a traditional game engine project.
> Engine-specialist agents (Godot, Unity, Unreal) are not used. Use `lead-programmer`,
> `gameplay-programmer`, `ui-programmer`, and `network-programmer` for implementation work.

## Project Structure

@.claude/docs/directory-structure.md

## Project-Specific Directives

### GDDs as Source of Truth

The **64 GDDs** in `design/gdd/` are the normative spec. Implement according to
them. Use `design/gdd/systems-index.md` for navigation and dependencies.
`design/gdd/game-concept.md` fixes vision and pillars.

If code and GDD diverge, **the GDD wins** until there is an explicit decision to
update the document.

### Architecture

```
src/
├── routes/           # SvelteKit routes, layouts, pages
├── lib/
│   ├── stores/       # Reactive app/game state (Svelte 5 runes)
│   ├── workers/      # Web Worker entrypoints (simulation)
│   ├── simulation/   # Deterministic sim core (pure TS, no DOM)
│   ├── server/       # Supabase typed clients, edge function calls
│   ├── components/   # Reusable UI components
│   ├── types/        # Game and simulation type definitions
│   ├── persistence/  # Save/load (IndexedDB + Supabase cloud)
│   ├── i18n/         # Localization (EN/JA/PT)
│   └── ...           # Utils, constants, navigation
├── app.html / app.css
└── src-tauri/        # Tauri 2 desktop wrapper (Rust)
```

Rule: **heavy deterministic simulation** lives in `lib/simulation/` and runs on
the **worker**; the **UI** only orchestrates and presents; **persistence and auth**
follow the ADR (Supabase).

### Code Patterns (TypeScript / Svelte)

- **TypeScript:** `strict` — explicit types at public boundaries; avoid `any`;
  prefer discriminated unions for states and events.
- **Svelte 5:** small composed components; reusable logic in `.ts` in `lib/`;
  extract heavy logic from `+page.svelte` into pure functions or stores.
- **Immutability:** update state with copies (spread, structuredClone); do not
  mutate shared objects between UI, stores, and worker.
- **Error handling:** expected errors as values (Result-style) in simulation and
  worker↔UI boundary; always handle rejections in async; never swallow exceptions.

## Technical Preferences

@.claude/docs/technical-preferences.md

## Coordination Rules

@.claude/docs/coordination-rules.md

## Collaboration Protocol

**User-driven collaboration, not autonomous execution.**
Every task follows: **Question -> Options -> Decision -> Draft -> Approval**

- Agents MUST ask "May I write this to [filepath]?" before using Write/Edit tools
- Agents MUST show drafts or summaries before requesting approval
- Multi-file changes require explicit approval for the full changeset
- No commits without user instruction

See `docs/COLLABORATIVE-DESIGN-PRINCIPLE.md` for full protocol and examples.

> **First session?** Run `/start` for guided onboarding. This project has an
> active game concept at `design/gdd/game-concept.md` and 64 system GDDs.

## Coding Standards

@.claude/docs/coding-standards.md

## Context Management

@.claude/docs/context-management.md
