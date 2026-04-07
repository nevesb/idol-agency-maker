# Architecture Review Report

> **Date**: 2026-04-07
> **Engine**: SvelteKit 2.50 + TypeScript + Tauri 2 + Supabase
> **GDDs Reviewed**: 64
> **ADRs Reviewed**: 1 (ADR-001: Stack Tecnológica)

---

## Traceability Summary

| Metric | Count |
|--------|-------|
| Total requirements | ~338 |
| ✅ Covered by ADR-001 | ~25 (stack/platform/persistence decisions) |
| ⚠️ Partial | ~15 (implicitly covered by stack choice) |
| ❌ Gaps | ~298 (no system-specific ADRs exist) |

**Coverage: ~7%** — This is expected for a brownfield project with only 1
foundational ADR. The project has extensive GDDs but has not gone through
the CCGS architecture decision phase.

---

## Coverage Analysis

### What ADR-001 Covers

ADR-001 (Stack Tecnológica) provides architectural coverage for:

- **Platform/Runtime**: SvelteKit + TypeScript for UI, Web Workers for simulation,
  Tauri for desktop, Supabase for backend (covers TR-save-007, TR-main-menu-011,
  TR-chargen-001, TR-idol-db-001)
- **Performance strategy**: Web Worker threading for simulation isolation
  (covers TR-week-sim-002, TR-time-004 partially)
- **Persistence**: Supabase + IndexedDB offline-first pattern
  (covers TR-save-001 through TR-save-008 partially)
- **Asset pipeline**: ComfyUI + RunPod for portrait generation
  (covers TR-chargen-001 through TR-chargen-006)
- **Tooling**: Python for offline generation
  (covers TR-idol-db-001 through TR-idol-db-007)

### Major Uncovered Domains

These domains have **zero ADR coverage** and contain the most critical
technical requirements:

| Domain | TR Count | Priority | Suggested ADR |
|--------|----------|----------|---------------|
| **Simulation Architecture** | ~45 | CRITICAL | ADR-002: Simulation Pipeline & Threading |
| **Data Schema / State** | ~60 | CRITICAL | ADR-003: Game State Schema & Persistence |
| **Cross-System Communication** | ~40 | HIGH | ADR-004: Event System & System Integration |
| **Performance Budgets** | ~25 | HIGH | ADR-005: Performance Budget Allocation |
| **UI Framework Patterns** | ~55 | MEDIUM | ADR-006: UI Component Architecture |
| **Show System Pipeline** | ~20 | MEDIUM | ADR-007: Show Simulation Pipeline |
| **Music Production Pipeline** | ~10 | MEDIUM | ADR-008: Music Production Architecture |
| **AI/NPC Systems** | ~15 | MEDIUM | ADR-009: Rival AI & NPC Architecture |
| **i18n & Localization** | ~5 | LOW | ADR-010: Internationalization Strategy |

---

## Cross-ADR Conflicts

**None** — Only 1 ADR exists. No conflicts possible.

---

## ADR Dependency Order

### Recommended ADR Implementation Order (topologically sorted)

**Foundation (no dependencies):**
1. ADR-001: Stack Tecnológica ✅ (Accepted)

**Core Architecture (depends on ADR-001):**
2. ADR-002: Simulation Pipeline & Threading
3. ADR-003: Game State Schema & Persistence

**Integration (depends on ADR-002, ADR-003):**
4. ADR-004: Event System & System Integration
5. ADR-005: Performance Budget Allocation

**Feature (depends on ADR-002, ADR-003, ADR-004):**
6. ADR-006: UI Component Architecture
7. ADR-007: Show Simulation Pipeline
8. ADR-008: Music Production Architecture
9. ADR-009: Rival AI & NPC Architecture

**Support (depends on ADR-006):**
10. ADR-010: Internationalization Strategy

---

## Engine Compatibility

This project uses a web stack (SvelteKit/Svelte 5), not a traditional game engine.
The Godot/Unity/Unreal engine reference docs are not applicable.

### Framework Version Audit

| Component | Version | Status |
|-----------|---------|--------|
| SvelteKit | 2.50.x | ✅ Stable |
| Svelte | 5.54.x (runes) | ⚠️ Runes API stabilized but still evolving |
| Tauri | 2.x | ⚠️ Desktop wrapper not yet integrated |
| Supabase JS | 2.101.x | ✅ Stable |
| TypeScript | 5.9.x | ✅ Stable |

### Engine Specialist Findings

Not applicable — no traditional game engine. The `lead-programmer` specialist
should review Svelte 5 runes patterns and Web Worker communication protocols
when ADR-002 (Simulation Pipeline) is authored.

---

## GDD Revision Flags

No GDD revision flags — all GDD assumptions are consistent with the accepted
ADR-001 stack decisions. The GDDs were written with the SvelteKit/TS/Supabase
stack in mind.

---

## Architecture Document Coverage

No `docs/architecture/architecture.md` master document exists. This should be
created via `/create-architecture` after the core ADRs (002-005) are written.

---

## Verdict: CONCERNS

The project has **extensive, high-quality game design** (64 GDDs, 338 technical
requirements) but **minimal architectural coverage** (1 ADR covering only the
technology stack).

This is not a failure — it reflects a brownfield project that built code directly
from GDDs without a formal ADR phase. The existing code implements many of these
requirements correctly; the ADRs would document and formalize decisions already
made in code.

### What This Means Practically

- **Stories cannot be generated yet** — `/create-stories` needs TR-IDs linked to
  ADRs, and 298 requirements have no ADR
- **Code review lacks guardrails** — no control manifest exists to define
  required/forbidden patterns per system layer
- **Cross-system contracts are implicit** — the code works, but integration
  contracts between simulation, UI, and persistence are not documented

### Blocking Issues

None — the project is functional. The CONCERNS verdict means the CCGS pipeline
can proceed but with reduced safety guarantees.

---

## Required ADRs (Prioritised)

### Immediate (unblocks story generation for core systems)

1. **ADR-002: Simulation Pipeline & Threading**
   - Covers: TR-week-sim-*, TR-time-*, TR-rival-ai-001, TR-week-sim-005
   - Why first: The simulation engine is the heart of the game; 45+ TRs depend
     on its architecture being documented
   - Run: `/architecture-decision simulation-pipeline`

2. **ADR-003: Game State Schema & Persistence**
   - Covers: TR-save-*, TR-economy-001, TR-wellness-001, TR-contract-001, all
     entity schema TRs
   - Why second: Every system stores and reads state; the schema is the contract
   - Run: `/architecture-decision game-state-schema`

3. **ADR-004: Event System & System Integration**
   - Covers: TR-wellness-004, TR-time-006, TR-events-*, all cross-system TRs
   - Why third: Documents how 48 systems communicate
   - Run: `/architecture-decision event-system`

### Short-term (unblocks full story generation)

4. **ADR-005: Performance Budget Allocation** — frame/tick budgets per system
5. **ADR-006: UI Component Architecture** — data binding, table patterns, routing
6. **ADR-007: Show Simulation Pipeline** — show-specific multi-layer simulation

### Deferred (can be authored as features are implemented)

7-10. ADRs for music production, rival AI, i18n, and remaining feature systems

---

## Next Steps

1. Run `/architecture-decision simulation-pipeline` to create ADR-002
2. After each ADR, re-run `/architecture-review coverage` to track improvement
3. When coverage reaches ~60%+, run `/create-control-manifest` and `/gate-check`
