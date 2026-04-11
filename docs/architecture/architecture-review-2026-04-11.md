# Architecture Review Report

> **Date**: 2026-04-11
> **Engine**: SvelteKit 2.50 + Svelte 5 + Tauri 2 + Supabase
> **GDDs Reviewed**: 64
> **ADRs Reviewed**: 21 (all Accepted)
> **Previous Review**: 2026-04-09 (20 ADRs, 12 Accepted + 8 Proposed, 319/319, PASS)

---

## Traceability Summary

| Metric | Previous (2026-04-09) | Current (2026-04-11) | Delta |
|--------|----------------------|----------------------|-------|
| Total requirements | 319 | 319 | — |
| ✅ Covered | 319 (100%) | **319 (100%)** | — |
| ⚠️ Partial | 0 | 0 | — |
| ❌ Gaps | 0 | **0** | — |
| ADRs | 20 (12 Accepted, 8 Proposed) | **21 (all Accepted)** | +1 ADR, +8 accepted |

**Coverage: 100%** — maintained from previous review. ADR-021 (String Generator) added;
all 8 previously Proposed ADRs now Accepted.

---

## ADR Status Summary

| ADR | Title | Status | TR-IDs Covered |
|-----|-------|--------|----------------|
| ADR-001 | Stack Tecnológica | ✅ Accepted | save, chargen, idol-db (~25) |
| ADR-002 | Simulation Pipeline & Threading | ✅ Accepted | week-sim, time, rival-ai, stats, jobs, schedule (~42) |
| ADR-003 | Game State Schema & Persistence | ✅ Accepted | save, economy, wellness, contract, fame (~32) |
| ADR-004 | Event System & Integration | ✅ Accepted | events, wellness, contract, time, news, market (~44) |
| ADR-005 | Performance Budget Allocation | ✅ Accepted | week-sim, time (~18) |
| ADR-006 | UI Component Architecture | ✅ Accepted | all UI systems (~46) |
| ADR-007 | Show Simulation Pipeline | ✅ Accepted | shows, setlist, formations, costume, briefing, music-ent, awards, audience (~42) |
| ADR-008 | Music Production Architecture | ✅ Accepted | music-prod, music-ent, formations, music-charts (~26) |
| ADR-009 | NPC Decision Catalog | ✅ Accepted | staff, talent, scouting, market, strategy, reputation, fanclub, intel, producer, events (~52) |
| ADR-010 | Internationalization Strategy | ✅ Accepted | news, idol-db, lifecycle (~17) |
| ADR-011 | Multiplayer-Ready Architecture | ✅ Accepted | (future prep — no TR coverage) |
| ADR-012 | Decision Context Providers | ✅ Accepted | staff, idol-attribute (context mapping) |
| ADR-013 | Main Menu & Game Flow | ✅ Accepted | main-menu (7) |
| ADR-014 | Message Types & Inbox | ✅ Accepted | messages (5) |
| ADR-015 | Groups, Roster & Archetypes | ✅ Accepted | groups (7), roster (3), archetypes (4) = 14 |
| ADR-016 | Dialogue & Medical | ✅ Accepted | dialogue (6), medical (6) = 12 |
| ADR-017 | Economy Extensions | ✅ Accepted | merch (6), idol-finance (5), finance-report (4), media (4) = 19 |
| ADR-018 | Meta-Game & Progression | ✅ Accepted | meta-game (3), planning (3), player-events (2), post-debut (3) = 11 |
| ADR-019 | Visual Generator Pipeline | ✅ Accepted | visual-gen (4) |
| ADR-020 | Tutorial, Settings & Accessibility | ✅ Accepted | tutorial (2), settings (5) = 7 |
| ADR-021 | String Generator Pipeline | ✅ Accepted | **NEW** — extends ADR-014; no new TR-IDs |

**21 Accepted, 0 Proposed** — previous advisory (#1: "8 Proposed ADRs need acceptance") fully resolved.

---

## Coverage Gaps

**None.** All 319 TR-IDs have ADR coverage.

---

## Stale TR-ID Texts (GDD Updated, Registry Stale)

The message-types-catalog.md GDD was expanded from 57 to 120 types across 13 categories
(up from 11), with 49 action-required messages (up from 27). Three TR texts need revision:

| TR-ID | Current Text (Stale) | Revised Text | Change |
|-------|---------------------|--------------|--------|
| TR-messages-001 | "57 message types across 11 categories as discriminated union type model" | "120 message types across 13 categories as discriminated union type model" | Count: 57→120, 11→13 |
| TR-messages-002 | "27 action-required messages persist until resolved or dismissed" | "49 action-required messages persist until resolved or dismissed" | Count: 27→49 |
| TR-messages-004 | "All 11 system sources enqueue messages asynchronously during weekly tick" | "All 13 system sources enqueue messages asynchronously during weekly tick" | Count: 11→13 |

**Note**: ADR-014 and ADR-021 already reference the correct "120 message types" count.
These are registry text updates only — the architectural coverage is correct.

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

### Groups, Dialogue & Medical (26 TR-IDs)

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| groups | 7 | ADR-015 |
| archetypes | 4 | ADR-015 |
| roster | 3 | ADR-015 |
| dialogue | 6 | ADR-016 |
| medical | 6 | ADR-016 |

### Economy Extensions (19 TR-IDs)

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| merch | 6 | ADR-017 |
| idol-finance | 5 | ADR-017 |
| finance-report | 4 | ADR-017 |
| media | 4 | ADR-017 |

### Meta-Game & Progression (11 TR-IDs)

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| meta-game | 3 | ADR-018 |
| planning | 3 | ADR-018 |
| player-events | 2 | ADR-018 |
| post-debut | 3 | ADR-018 |

### Infrastructure & Visual (23 TR-IDs)

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| main-menu | 7 | ADR-013 |
| messages | 5 | ADR-014, ADR-021 |
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
across all 21 ADRs.

### ADR-014 Internal Inconsistency (Minor)

ADR-014 references both "11 categories" (Decision section line 67, code comment line 102,
GDD Requirements table line 343) and "13 categories" (Summary line 16, Revision note
line 263). The GDD definitively defines **13 categories**. The ADR should be corrected
internally to use "13 categories" consistently.

### Advisory: Performance Budget Pressure in Phase 3 (Unchanged)

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

---

## ADR Dependency Order (Topologically Sorted)

All dependencies point to Accepted ADRs. No unresolved dependencies.

**Layer 0 — Foundation:**
1. ADR-001: Stack Tecnológica ✅

**Layer 1 — Core:**
2. ADR-002: Simulation Pipeline ✅ (requires ADR-001)

**Layer 2 — State:**
3. ADR-003: Game State Schema ✅ (requires ADR-001, ADR-002)

**Layer 3 — Integration:**
4. ADR-004: Event System ✅ (requires ADR-002, ADR-003)
5. ADR-006: UI Architecture ✅ (requires ADR-001, ADR-003)
6. ADR-013: Main Menu & Game Flow ✅ (requires ADR-001, ADR-003)
7. ADR-019: Visual Generator ✅ (requires ADR-001, ADR-003)

**Layer 4 — System:**
8. ADR-005: Performance Budgets ✅ (requires ADR-002, ADR-003, ADR-004)
9. ADR-009: Decision Catalog ✅ (requires ADR-002, ADR-003, ADR-004)
10. ADR-010: i18n Strategy ✅ (requires ADR-001, ADR-006)
11. ADR-011: Multiplayer-Ready ✅ (requires ADR-002, ADR-003, ADR-004)
12. ADR-014: Message Types ✅ (requires ADR-003, ADR-004)
13. ADR-015: Groups/Roster/Archetypes ✅ (requires ADR-002, ADR-003, ADR-004)

**Layer 5 — Feature:**
14. ADR-012: Decision Context Providers ✅ (requires ADR-003, ADR-009)
15. ADR-016: Dialogue & Medical ✅ (requires ADR-002, ADR-003, ADR-004, ADR-009)
16. ADR-020: Tutorial/Settings ✅ (requires ADR-001, ADR-006, ADR-013)
17. ADR-007 + ADR-008: Show + Music cluster ✅ (co-dependent)

**Layer 6 — Extension:**
18. ADR-017: Economy Extensions ✅ (requires ADR-002, ADR-003, ADR-004, ADR-008)
19. ADR-018: Meta-Game & Progression ✅ (requires ADR-002, ADR-003, ADR-004, ADR-008)

**Layer 7 — Tooling:**
20. ADR-021: String Generator ✅ (requires ADR-010, ADR-014)

**Known Cycle**: ADR-007 ↔ ADR-008 — co-designed cluster, non-blocking.

---

## GDD Revision Flags

No GDD revision flags — all GDD assumptions are consistent with verified
framework behaviour and all 21 ADRs.

---

## Engine Compatibility

### Framework Version Audit

| Component | Version | Status |
|-----------|---------|--------|
| SvelteKit | 2.50.x | ✅ Stable |
| Svelte | 5.54.x (runes) | ✅ Post-cutoff — runes API stable |
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

## Architecture Document Coverage

No `docs/architecture/architecture.md` master document exists. The project uses
the systems index (`design/gdd/systems-index.md`) and individual ADRs as the
architecture specification. Ready for `/create-architecture` if desired.

---

## Verdict: PASS ✅

| | Previous (2026-04-09) | Current (2026-04-11) |
|---|---|---|
| ADRs | 20 (12 Accepted, 8 Proposed) | **21 (all Accepted)** |
| Coverage | 100% | **100%** |
| Conflicts | 0 | **0** |
| Verdict | PASS | **PASS** |

### Why PASS

1. **All 319 TR-IDs have ADR coverage** — 0 gaps, 0 partials
2. **All 21 ADRs are Accepted** — the previous advisory about 8 Proposed ADRs is resolved
3. **ADR-021 added** — closes the string generation implementation gap for 120 message types
4. **No blocking conflicts** — data ownership clean, integration contracts consistent
5. **Engine version consistent** across all 21 ADRs

### Advisory Notes (non-blocking)

1. **3 stale TR texts**: TR-messages-001, 002, 004 need text updates to reflect the
   expanded message catalog (57→120 types, 11→13 categories, 27→49 action-required).
   Same intent, updated counts. Fixed in this review's TR registry update.

2. **ADR-014 internal inconsistency**: Decision section and code comments still reference
   "11 categories" but Summary and revision note correctly say "13 categories". Minor fix
   needed — not blocking.

3. **Performance budget pressure**: Phase 3 projected at 82ms (regular) / 89ms (week 4)
   vs 45ms budget. Headroom: ~4ms / ~-3ms. Same as previous review — consider amending
   ADR-005 or parallelizing medical processing before Production phase.

### Blocking Issues

None.

### Required ADRs

None — all 319 requirements have ADR coverage.

---

## GDD Health Check

All 64 GDDs have the 8 required sections. No GDD quality issues detected.
Message-types-catalog.md expanded from 57→120 types with proper categorization.

---

## Next Steps

1. Fix ADR-014 internal inconsistency (11→13 categories in Decision section)
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
| 2026-04-09 | 20 | 100% (319/319) | PASS | +8 Proposed ADRs + 2 amendments close all gaps |
| **2026-04-11** | **21** | **100% (319/319)** | **PASS** | ADR-021 added; all 21 Accepted; 3 stale TR texts fixed |
