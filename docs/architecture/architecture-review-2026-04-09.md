# Architecture Review Report

> **Date**: 2026-04-09 (re-run)
> **Engine**: SvelteKit 2.50 + Svelte 5 + Tauri 2 + Supabase
> **GDDs Reviewed**: 64
> **ADRs Reviewed**: 20 (12 Accepted, 8 Proposed)
> **Previous Review**: 2026-04-09 (12 ADRs, 59.6% coverage, CONCERNS)

---

## Traceability Summary

| Metric | Previous (12 ADRs) | Current (20 ADRs) | Delta |
|--------|--------------------|--------------------|-------|
| Total requirements | 319 | 319 | — |
| ✅ Covered | 190 (59.6%) | **319 (100%)** | +129 |
| ⚠️ Partial | 27 (8.5%) | **0 (0%)** | -27 |
| ❌ Gaps | 102 (32.0%) | **0 (0%)** | -102 |

**Coverage: 100%** — up from 59.6%. Driven by 8 new Proposed ADRs (013–020)
and amendments to ADR-002 (+18 TRs) and ADR-006 (+32 TRs).

---

## ADR Status Summary

| ADR | Title | Status | TR-IDs Covered |
|-----|-------|--------|----------------|
| ADR-001 | Stack Tecnológica | ✅ Accepted | save, chargen, idol-db (~25) |
| ADR-002 | Simulation Pipeline & Threading | ✅ Accepted | week-sim, time, rival-ai, **stats, jobs, schedule** (~42) |
| ADR-003 | Game State Schema & Persistence | ✅ Accepted | save, economy, wellness, contract, fame (~32) |
| ADR-004 | Event System & Integration | ✅ Accepted | events, wellness, contract, time, news, market (~44) |
| ADR-005 | Performance Budget Allocation | ✅ Accepted | week-sim, time (~18) |
| ADR-006 | UI Component Architecture | ✅ Accepted | **all UI systems** (~46) |
| ADR-007 | Show Simulation Pipeline | ✅ Accepted | shows, setlist, formations, costume, briefing, music-ent, awards, audience (~42) |
| ADR-008 | Music Production Architecture | ✅ Accepted | music-prod, music-ent, formations, music-charts (~26) |
| ADR-009 | NPC Decision Catalog | ✅ Accepted | staff, talent, scouting, market, strategy, reputation, fanclub, intel, producer, events (~52) |
| ADR-010 | Internationalization Strategy | ✅ Accepted | news, idol-db, lifecycle (~17) |
| ADR-011 | Multiplayer-Ready Architecture | ✅ Accepted | (future prep — no TR coverage) |
| ADR-012 | Decision Context Providers | ✅ Accepted | staff, idol-attribute (context mapping) |
| ADR-013 | Main Menu & Game Flow | ⚠️ Proposed | main-menu (7) |
| ADR-014 | Message Types & Inbox | ⚠️ Proposed | messages (5) |
| ADR-015 | Groups, Roster & Archetypes | ⚠️ Proposed | groups (7), roster (3), archetypes (4) = 14 |
| ADR-016 | Dialogue & Medical | ⚠️ Proposed | dialogue (6), medical (6) = 12 |
| ADR-017 | Economy Extensions | ⚠️ Proposed | merch (6), idol-finance (5), finance-report (4), media (4) = 19 |
| ADR-018 | Meta-Game & Progression | ⚠️ Proposed | meta-game (3), planning (3), player-events (2), post-debut (3) = 11 |
| ADR-019 | Visual Generator Pipeline | ⚠️ Proposed | visual-gen (4) |
| ADR-020 | Tutorial, Settings & Accessibility | ⚠️ Proposed | tutorial (2), settings (5) = 7 |

**12 Accepted + 8 Proposed = 20 total**

---

## Coverage by System — All 62 Systems Covered

### Foundation & Core (64 TR-IDs)

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| stats | 8 | ADR-002 (amendment), ADR-003, ADR-007, ADR-009, ADR-012 |
| time | 10 | ADR-002, ADR-004, ADR-005 |
| week-sim | 7 | ADR-002, ADR-003, ADR-004, ADR-005 |
| economy | 6 | ADR-003 |
| wellness | 6 | ADR-003, ADR-004, ADR-009 |
| contract | 6 | ADR-003, ADR-004 |
| fame | 5 | ADR-003 |
| save | 8 | ADR-001, ADR-002, ADR-003 |
| chargen | 6 | ADR-001 |
| idol-db | 7 | ADR-001, ADR-010 |
| lifecycle | 4 | ADR-006, ADR-010 |

### Gameplay — Decisions & AI (69 TR-IDs)

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| jobs | 6 | ADR-002 (amendment), ADR-004, ADR-009 |
| schedule | 4 | ADR-002 (amendment), ADR-009 |
| scouting | 4 | ADR-009 |
| rival-ai | 6 | ADR-002 |
| market | 5 | ADR-004, ADR-009 |
| staff | 6 | ADR-009 |
| strategy | 4 | ADR-009 |
| intel | 5 | ADR-009 |
| producer | 3 | ADR-009 |
| reputation | 4 | ADR-009 |
| talent | 6 | ADR-009 |
| events | 5 | ADR-004, ADR-009 |
| fanclub | 4 | ADR-009 |
| news | 6 | ADR-004, ADR-010 |

### Show & Music Cluster (60 TR-IDs)

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| shows | 7 | ADR-007, ADR-009 |
| setlist | 4 | ADR-007 |
| music-ent | 5 | ADR-007, ADR-008 |
| formations | 5 | ADR-007, ADR-008 |
| costume | 6 | ADR-007 |
| briefing | 5 | ADR-007 |
| awards | 5 | ADR-007 |
| audience | 5 | ADR-007 |
| music-prod | 10 | ADR-008, ADR-009 |
| music-charts | 6 | ADR-008 |

### Groups, Dialogue & Medical (26 TR-IDs) — NEW

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| groups | 7 | ADR-015 |
| archetypes | 4 | ADR-015 |
| roster | 3 | ADR-015 |
| dialogue | 6 | ADR-016 |
| medical | 6 | ADR-016 |

### Economy Extensions (19 TR-IDs) — NEW

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| merch | 6 | ADR-017 |
| idol-finance | 5 | ADR-017 |
| finance-report | 4 | ADR-017 |
| media | 4 | ADR-017 |

### Meta-Game & Progression (11 TR-IDs) — NEW

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| meta-game | 3 | ADR-018 |
| planning | 3 | ADR-018 |
| player-events | 2 | ADR-018 |
| post-debut | 3 | ADR-018 |

### Infrastructure & Visual (23 TR-IDs) — NEW

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| main-menu | 7 | ADR-013 |
| messages | 5 | ADR-014 |
| visual-gen | 4 | ADR-019 |
| tutorial | 2 | ADR-020 |
| settings | 5 | ADR-020 |

### UI Systems (46 TR-IDs)

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| ui-ia | 10 | ADR-006 (amendment) |
| ui-dash | 4 | ADR-006 (amendment) |
| ui-idol | 5 | ADR-006 (amendment) |
| ui-jobs | 4 | ADR-006 (amendment) |
| ui-results | 4 | ADR-006 (amendment) |
| ui-news | 4 | ADR-006 (amendment) |
| ui-scouting | 3 | ADR-006 (amendment) |
| ui-contract | 3 | ADR-006 (amendment) |
| ui-calendar | 2 | ADR-006 (amendment) |
| ui-rankings | 2 | ADR-006 (amendment) |

---

## Cross-ADR Conflict Detection

### Conflicts Found: 0

No data ownership, integration contract, or state management conflicts detected
across all 20 ADRs.

### Advisory: Performance Budget Pressure in Phase 3

| Source | Phase 3 Addition | Frequency |
|--------|-----------------|-----------|
| ADR-005 (original) | 45ms (stat updates) | Every week |
| ADR-015 (groups) | +5ms | Every week |
| ADR-016 (medical) | +30ms | Every week |
| ADR-017 (merch) | +2ms | Every week |
| ADR-017 (personal finance) | +5ms | Monthly (week 4) |
| ADR-017 (reports) | +1ms | Monthly (week 4) |
| ADR-018 (meta-game) | +1ms | Monthly (week 4) |
| **Projected total** | **82ms** (regular) / **89ms** (week 4) | |

Original sequential budget (ADR-005): 155ms with 45ms headroom to 200ms target.
Projected sequential total: **~196ms** (regular) / **~203ms** (week 4).

**Impact**: Headroom shrinks from 45ms to ~4ms. Week 4 may exceed 200ms target by ~3ms.

**Resolution options**:
1. Amend ADR-005 to expand Phase 3 budget to 90ms and total target to 220ms
2. Parallelize medical processing (30ms) with rival AI (already in separate worker)
3. Accept <5% overshoot on week 4 as negligible (once per month)

### Dependency Issues

#### Known Cycle: ADR-007 ↔ ADR-008

- ADR-007 (Show Pipeline) depends on ADR-008 (Music Production) for song structure
- ADR-008 depends on ADR-007 for show pipeline consumption
- **Status**: Both Accepted, co-designed cluster. Non-blocking.

#### Proposed Chain: ADR-020 → ADR-013

- ADR-020 (Tutorial/Settings) depends on ADR-013 (Main Menu) for settings route access
- **Status**: Both Proposed. Accept ADR-013 before ADR-020.

---

## ADR Dependency Order (Topologically Sorted)

### Recommended Implementation Order

**Foundation (no dependencies):**
1. ADR-001: Stack Tecnológica ✅

**Core (depends on Foundation):**
2. ADR-002: Simulation Pipeline ✅
3. ADR-003: Game State Schema ✅

**Integration (depends on Core):**
4. ADR-004: Event System ✅
5. ADR-006: UI Architecture ✅
6. ADR-013: Main Menu & Game Flow ⚠️ Proposed
7. ADR-019: Visual Generator ⚠️ Proposed

**System (depends on Integration):**
8. ADR-005: Performance Budgets ✅
9. ADR-009: Decision Catalog ✅
10. ADR-010: i18n Strategy ✅
11. ADR-011: Multiplayer-Ready ✅
12. ADR-014: Message Types ⚠️ Proposed
13. ADR-015: Groups/Roster/Archetypes ⚠️ Proposed

**Feature (depends on System):**
14. ADR-012: Decision Context Providers ✅
15. ADR-016: Dialogue & Medical ⚠️ Proposed
16. ADR-020: Tutorial/Settings ⚠️ Proposed (requires ADR-013)
17. ADR-007 + ADR-008: Show + Music ✅ (co-dependent cluster)

**Extension (depends on Feature):**
18. ADR-017: Economy Extensions ⚠️ Proposed
19. ADR-018: Meta-Game & Progression ⚠️ Proposed

---

## Engine Compatibility

### Framework Version Audit

| Component | Version | Status |
|-----------|---------|--------|
| SvelteKit | 2.50.x | ✅ Stable |
| Svelte | 5.54.x (runes) | ✅ Post-cutoff — runes API now stable |
| Tauri | 2.x | ✅ Stable |
| Supabase JS | 2.101.x | ✅ Stable |
| TypeScript | 5.9.x | ✅ Stable |

### Post-Cutoff API Usage

Svelte 5 runes (`$state`, `$derived`, `$effect`) used in ADR-001, 006, 013, 014, 020.
All consistent. LOW risk — runes are now stable in Svelte 5.54.x.

### Deprecated API References: None

### Missing Engine Compatibility Sections

ADR-009, ADR-010, ADR-011 lack formal engine compatibility tables.
Acceptable — these are domain-agnostic ADRs with no engine-specific decisions.

### Engine Specialist Findings

Not applicable — web stack (SvelteKit + TypeScript), no traditional game engine.
No engine-specific anti-patterns detected.

---

## GDD Revision Flags

No GDD revision flags — all GDD assumptions are consistent with verified
framework behaviour and all 20 ADRs.

---

## Architecture Document Coverage

No `docs/architecture/architecture.md` master document exists. The project uses
the systems index (`design/gdd/systems-index.md`) and individual ADRs as the
architecture specification. Ready for `/create-architecture` if desired.

---

## Verdict: PASS ✅

| | Previous (12 ADRs) | Current (20 ADRs) |
|---|---|---|
| ADRs | 12 | 20 |
| Coverage | 59.6% | **100%** |
| Conflicts | 0 | 0 |
| Verdict | CONCERNS | **PASS** |

### Why PASS

1. **All 319 TR-IDs have ADR coverage** — 0 gaps, 0 partials
2. **No blocking cross-ADR conflicts** — data ownership is clean, integration
   contracts are consistent, no dependency cycles beyond the known ADR-007/008 cluster
3. **Engine version is consistent** across all 20 ADRs
4. **No GDD revision flags** — all design assumptions align with architecture

### Advisory Notes (non-blocking)

1. **8 Proposed ADRs need acceptance**: ADR-013 through ADR-020 are `Proposed`.
   Stories referencing these ADRs are auto-blocked until acceptance. Accept them
   (ideally via review) to unblock implementation.

2. **Performance budget pressure**: New systems add ~37ms to Phase 3, shrinking
   headroom from 45ms to ~4ms. Consider amending ADR-005 or parallelizing
   medical processing before Production phase.

3. **Acceptance order**: Accept ADR-013 before ADR-020 (dependency chain).

### Blocking Issues

None.

### Required ADRs

None — all 319 requirements have ADR coverage.

---

## GDD Health Check

All 64 GDDs have the 8 required sections. No GDD quality issues detected.

---

## Next Steps

1. Accept ADR-013 through ADR-020 (batch review or individual acceptance)
2. Consider amending ADR-005 for expanded Phase 3 performance budget
3. Run `/create-architecture` for master architecture document
4. Run `/create-control-manifest` to generate programmer rules sheet
5. Run `/gate-check pre-production` to advance to next phase

---

## History

| Date | ADRs | Coverage | Verdict | Notes |
|------|------|----------|---------|-------|
| 2026-04-07 | 1 | 7% (~25/338) | CONCERNS | Initial review — only ADR-001 existed |
| 2026-04-09 | 12 | 59.6% (190/319) | CONCERNS | 11 new ADRs. TR count corrected to 319 |
| 2026-04-09 | 20 | **100% (319/319)** | **PASS** | +8 Proposed ADRs + 2 amendments close all gaps |
