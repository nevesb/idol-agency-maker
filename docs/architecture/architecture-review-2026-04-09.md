# Architecture Review Report

> **Date**: 2026-04-09
> **Engine**: SvelteKit 2.50 + TypeScript + Tauri 2 + Supabase
> **GDDs Reviewed**: 64
> **ADRs Reviewed**: 12
> **Previous Review**: 2026-04-07 (1 ADR, 7% coverage)

---

## Traceability Summary

| Metric | Count | % | Δ vs Previous |
|--------|-------|---|---------------|
| Total requirements | 319 | 100% | -19 (recount) |
| ✅ Covered | 190 | 59.6% | +165 |
| ⚠️ Partial | 27 | 8.5% | +12 |
| ❌ Gaps | 102 | 32.0% | -196 |

**Coverage: 59.6%** — up from 7% at previous review. Driven by 11 new ADRs
(ADR-002 through ADR-012) authored between 2026-04-07 and 2026-04-09.

---

## ADR Status Summary

| ADR | Title | Status | TR-IDs Covered |
|-----|-------|--------|----------------|
| ADR-001 | Stack Tecnológica | ✅ Accepted | save, chargen, idol-db (~25) |
| ADR-002 | Simulation Pipeline & Threading | ✅ Accepted | week-sim, time, rival-ai (~24) |
| ADR-003 | Game State Schema & Persistence | ✅ Accepted | save, economy, wellness, contract, fame (~32) |
| ADR-004 | Event System & Integration | ✅ Accepted | events, wellness, contract, time, week-sim, news, market (~44) |
| ADR-005 | Performance Budget Allocation | ✅ Accepted | week-sim, time (~18) |
| ADR-006 | UI Component Architecture | ✅ Accepted | ui-dash, ui-ia, ui-jobs, lifecycle (~14) |
| ADR-007 | Show Simulation Pipeline | ✅ Accepted | shows, setlist, formations, costume, briefing, music-ent, awards, audience (~42) |
| ADR-008 | Music Production Architecture | ✅ Accepted | music-prod, music-ent, formations, music-charts (~26) |
| ADR-009 | NPC Decision Catalog | ✅ Accepted | staff, talent, scouting, market, strategy, reputation, fanclub, wellness, intel, producer, events (~52 cross-cutting) |
| ADR-010 | Internationalization Strategy | ✅ Accepted | news, idol-db, lifecycle (~17) |
| ADR-011 | Multiplayer-Ready Architecture | ✅ Accepted | (none — future prep) |
| ADR-012 | Decision Context Providers | ✅ Accepted | (all ADR-009 decisions — context mapping) |

**12 Accepted, 0 Proposed**

---

## Coverage by System

### ✅ Fully Covered (32 systems, 190 TR-IDs)

| System | TRs | ADR Coverage |
|--------|-----|-------------|
| time | 10 | ADR-002, 004, 005 |
| week-sim | 7 | ADR-002, 003, 004, 005 |
| economy | 6 | ADR-003 |
| wellness | 6 | ADR-003, 004, 009 |
| contract | 6 | ADR-003, 004 |
| fame | 5 | ADR-003 |
| scouting | 4 | ADR-009 |
| rival-ai | 6 | ADR-002 |
| market | 5 | ADR-004, 009 |
| save | 8 | ADR-001, 003 |
| lifecycle | 4 | ADR-006, 010 |
| chargen | 6 | ADR-001 |
| idol-db | 7 | ADR-001, 010 |
| news | 6 | ADR-004, 010 |
| music-charts | 6 | ADR-008 |
| music-prod | 10 | ADR-008, 009 |
| events | 5 | ADR-004, 009 |
| fanclub | 4 | ADR-009 |
| staff | 6 | ADR-009 |
| strategy | 4 | ADR-009 |
| intel | 5 | ADR-009 |
| producer | 3 | ADR-009 |
| reputation | 4 | ADR-009 |
| talent | 6 | ADR-009 |
| shows | 7 | ADR-007, 009 |
| setlist | 4 | ADR-007 |
| music-ent | 5 | ADR-007, 008 |
| costume | 6 | ADR-007 |
| briefing | 5 | ADR-007 |
| formations | 5 | ADR-007, 008 |
| awards | 5 | ADR-007 |
| audience | 5 | ADR-007 |

### ⚠️ Partially Covered (6 systems, 27 TR-IDs)

| System | TRs | Covered | Gap | Notes |
|--------|-----|---------|-----|-------|
| stats | 8 | 0 explicit | 8 | Implicitly in ADR-003 (state schema) and ADR-002 (pipeline reads stats) |
| jobs | 6 | 0 explicit | 6 | Implicitly in ADR-002 (pipeline processes jobs) and ADR-009 (job decisions) |
| schedule | 4 | 0 explicit | 4 | Implicitly in ADR-002 (pipeline uses schedule) |
| ui-dash | 4 | 1 | 3 | ADR-006 covers TR-ui-dash-001 only |
| ui-ia | 10 | 7 | 3 | ADR-006 covers TR-ui-ia-003 through 007, 009, 010 |
| ui-jobs | 4 | 1 | 3 | ADR-006 covers TR-ui-jobs-001 only |

### ❌ Gaps — No ADR Coverage (21 systems, 102 TR-IDs)

#### Gameplay Systems (42 TR-IDs)

| System | TRs | Priority | Suggested ADR |
|--------|-----|----------|---------------|
| groups | 7 | Vertical Slice | Groups & Roster Architecture |
| dialogue | 6 | Vertical Slice | Dialogue & Interaction System |
| medical | 6 | Vertical Slice | Medical & Injury System |
| idol-finance | 5 | Alpha | Personal Finance (fold into ADR-003 amendment) |
| archetypes | 4 | Vertical Slice | Archetypes (fold into stats/ADR-003) |
| roster | 3 | Alpha | Groups & Roster Architecture |
| player-events | 2 | Alpha | Player Events (fold into ADR-007 amendment) |
| post-debut | 3 | Full Vision | Post-Debut Careers |
| meta-game | 3 | Alpha | Meta-Game Progression |
| planning | 3 | Alpha | Planning Board (fold into meta-game) |

#### Economy Systems (14 TR-IDs)

| System | TRs | Priority | Suggested ADR |
|--------|-----|----------|---------------|
| merch | 6 | Alpha | Merchandising (fold into ADR-008 amendment) |
| finance-report | 4 | Vertical Slice | Financial Reporting (fold into ADR-003) |
| media | 4 | Vertical Slice | Media Entities (fold into ADR-007/008) |

#### Infrastructure Systems (14 TR-IDs)

| System | TRs | Priority | Suggested ADR |
|--------|-----|----------|---------------|
| main-menu | 7 | MVP | Main Menu & Game Flow |
| settings | 5 | Full Vision | Settings & Accessibility |
| tutorial | 2 | Full Vision | Tutorial/Onboarding |

#### Messaging (5 TR-IDs)

| System | TRs | Priority | Suggested ADR |
|--------|-----|----------|---------------|
| messages | 5 | MVP | Message Types (fold into ADR-004 amendment) |

#### Visual (4 TR-IDs)

| System | TRs | Priority | Suggested ADR |
|--------|-----|----------|---------------|
| visual-gen | 4 | Alpha | Visual Generator Pipeline |

#### UI Systems (23 TR-IDs)

| System | TRs | Priority | Suggested ADR |
|--------|-----|----------|---------------|
| ui-idol | 5 | MVP | Fold into ADR-006 when accepted |
| ui-results | 4 | MVP | Fold into ADR-006 |
| ui-news | 4 | Vertical Slice | Fold into ADR-006 |
| ui-scouting | 3 | MVP | Fold into ADR-006 |
| ui-contract | 3 | Vertical Slice | Fold into ADR-006 |
| ui-calendar | 2 | Alpha | Fold into ADR-006 |
| ui-rankings | 2 | Alpha | Fold into ADR-006 |

---

## Cross-ADR Conflict Detection

### Conflicts Found: 0

No data ownership, performance budget, integration contract, or state management
conflicts detected across the 12 ADRs. The layered architecture (Stack → Pipeline
→ State → Events → Budgets → Features) prevents contradictions.

### Dependency Issues

#### 🔴 Dependency Cycle: ADR-007 ↔ ADR-008

- ADR-007 (Show Pipeline) depends on ADR-008 (Music Production)
- ADR-008 depends on ADR-007
- **Impact**: Non-blocking — both are Accepted and share the Song/PartDemands
  interface. Songs are produced (ADR-008) then performed in shows (ADR-007).
- **Resolution**: The cycle reflects co-designed interfaces. Document the shared
  Song type contract as the boundary.

#### ✅ Resolved: ADR-010 → ADR-006

- ADR-010 (i18n) depends on ADR-006 (UI Architecture)
- **Status**: Both now Accepted. Dependency chain is solid.

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
5. ADR-005: Performance Budgets ✅
6. ADR-006: UI Architecture ✅

**Feature (depends on Integration):**
7. ADR-009: Decision Catalog ✅
8. ADR-012: Context Providers ✅
9. ADR-007 + ADR-008: Show + Music ✅ (co-dependent, implement together)

**Support:**
10. ADR-010: i18n ✅
11. ADR-011: Multiplayer-Ready ✅

---

## Engine Compatibility

### Framework Version Audit

| Component | Version | Status |
|-----------|---------|--------|
| SvelteKit | 2.50.x | ✅ Stable |
| Svelte | 5.54.x (runes) | ⚠️ Post-cutoff — runes API now stable |
| Tauri | 2.x | ✅ Stable since late 2024 |
| Supabase JS | 2.101.x | ✅ Stable |
| TypeScript | 5.9.x | ✅ Stable |

### Post-Cutoff API Usage

- **ADR-006**: Uses Svelte 5 runes (`$state`, `$derived`, `$effect`) and snippets.
  Both are now stable in Svelte 5.54.x. LOW risk.

### Deprecated API References: None

### Engine Specialist Findings

Not applicable — web stack, no traditional game engine. The `lead-programmer`
specialist should review Svelte 5 runes patterns when ADR-006 is accepted and
UI implementation begins.

---

## GDD Revision Flags

No GDD revision flags — all GDD assumptions are consistent with verified
framework behaviour and accepted ADRs. The 10 GDDs updated to v2 since
2026-04-04 were already incorporated into the ADRs authored 2026-04-07 through
2026-04-09.

---

## Architecture Document Coverage

No `docs/architecture/architecture.md` master document exists. All 12 ADRs
are now Accepted — ready for `/create-architecture`.

---

## Verdict: CONCERNS (improved)

| | Previous (2026-04-07) | Current (2026-04-09) |
|---|---|---|
| ADRs | 1 | 12 |
| Coverage | 7% | 59.6% |
| Conflicts | N/A | 0 |
| Verdict | CONCERNS | CONCERNS |

### Why still CONCERNS (not PASS)

1. **102 TR-IDs (32%) have no ADR coverage** — includes gameplay (groups,
   dialogue, medical), economy (merch, finance-report), and most UI systems
2. **Stats system has no explicit ADR** — foundation system only implicitly
   covered via state schema (ADR-003) and pipeline (ADR-002)
3. **No `architecture.md` master document** exists
4. **UI system-specific TR-IDs** (23) not covered beyond ADR-006's framework-level
   decisions

### What improved

- Core simulation fully documented (ADR-002 pipeline, ADR-003 state, ADR-004
  events, ADR-005 budgets)
- Show/Music cluster fully documented (ADR-007, ADR-008)
- NPC decision architecture complete with 52 decisions (ADR-009, ADR-012)
- i18n strategy documented (ADR-010)
- Multiplayer-ready infrastructure planned (ADR-011)
- No cross-ADR conflicts — architecture is coherent

### Blocking Issues

None — all 12 ADRs are now Accepted. ADR-006 was accepted via PR #1
(merged to main 2026-04-09). The CONCERNS verdict reflects coverage
gaps, not process blockers.

---

## Required ADRs (Prioritised)

### Immediate (closes MVP gaps)

1. **Main Menu & Game Flow ADR** — 7 TR-IDs, MVP priority. Covers route
   structure, save slot selection, auth flow, campaign creation.
   Run: `/architecture-decision main-menu-flow`

2. **Message Types ADR** (or ADR-004 amendment) — 5 TR-IDs, MVP priority.
   Message catalog, delivery rules, priority system.

### Medium-term (closes Vertical Slice gaps)

3. **Groups & Roster Architecture** — 10 TR-IDs (groups-7 + roster-3).
   Group stat aggregation, chemistry, independent group fame.
   Run: `/architecture-decision groups-roster`

4. **Dialogue & Interaction System** — 6 TR-IDs. Reaction scoring, affinity
   deltas, promise system, saturation penalties.
   Run: `/architecture-decision dialogue-system`

5. **Medical & Injury System** — 6 TR-IDs. Injury types, recovery formulas,
   re-injury mechanics, training load tracking.
   Run: `/architecture-decision medical-system`

### Deferred (Alpha/Full Vision — author as implemented)

6. Stats system explicit coverage (amend ADR-003 or create ADR-013)
7. Merchandising, Financial Reporting, Media Entities (fold into existing ADRs)
8. Meta-Game, Planning Board, Player Events
9. Visual Generator Pipeline
10. Post-Debut Careers, Tutorial, Settings

---

## GDD Health Check

All 64 GDDs have the 8 required sections. 10 GDDs received v2 updates between
2026-04-04 and 2026-04-06 with expanded cross-system references. No GDD quality
issues detected.

---

## Next Steps

1. Write missing MVP ADRs (main-menu, messages) to close MVP coverage gaps
2. Re-run `/architecture-review coverage` after each new ADR to track improvement
3. When coverage reaches ~75%+, run `/create-architecture` for master document
4. When coverage reaches ~80%+, run `/create-control-manifest` and `/gate-check`
