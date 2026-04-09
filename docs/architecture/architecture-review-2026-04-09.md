# Architecture Review Report

> **Date**: 2026-04-09
> **Engine**: SvelteKit 2.50 + Svelte 5 + TypeScript + Tauri 2 + Supabase
> **GDDs Reviewed**: 64 (63 system GDDs + systems-index)
> **ADRs Reviewed**: 12 (all Accepted)
> **Previous Review**: 2026-04-07 (1 ADR, ~7% coverage)

---

## Traceability Summary

| Metric | Count | % | Delta from 2026-04-07 |
|--------|-------|---|----------------------|
| Total requirements | 319 | 100% | -19 (refined extraction) |
| ✅ Covered | 101 | 31.7% | +76 |
| ⚠️ Partial | 23 | 7.2% | +8 |
| ❌ Gaps | 195 | 61.1% | -103 |

**Coverage: 31.7%** — Significant improvement from 7% (previous review). 11 new ADRs
(ADR-002 through ADR-012) added between 2026-04-07 and 2026-04-09 addressed 76
additional requirements. The architecture is internally consistent with no blocking
conflicts.

---

## Coverage by System (Fully Covered)

Systems where >60% of TRs are addressed by ADRs:

| System | Total | ✅ | ⚠️ | ❌ | Primary ADRs |
|--------|-------|-----|-----|-----|-------------|
| week-sim | 7 | 7 | 0 | 0 | ADR-002, 004, 005 |
| time | 10 | 7 | 2 | 1 | ADR-002, 003, 004, 005 |
| save | 8 | 6 | 1 | 1 | ADR-001, 003, 005 |
| shows | 7 | 5 | 1 | 1 | ADR-007 |
| audience | 5 | 4 | 0 | 1 | ADR-007 |
| formations | 5 | 4 | 0 | 1 | ADR-007, 008 |
| briefing | 5 | 4 | 0 | 1 | ADR-007 |
| music-ent | 5 | 4 | 0 | 1 | ADR-007, 008 |
| main-menu | 7 | 5 | 1 | 1 | ADR-006, 010 |
| setlist | 4 | 3 | 0 | 1 | ADR-007 |
| ui-dash | 4 | 3 | 1 | 0 | ADR-006 |

## Coverage by System (Partially Covered)

Systems with some TRs addressed but significant gaps remaining:

| System | Total | ✅ | ⚠️ | ❌ | Primary ADRs |
|--------|-------|-----|-----|-----|-------------|
| music-prod | 10 | 6 | 1 | 3 | ADR-008 |
| ui-ia | 10 | 6 | 2 | 2 | ADR-006 |
| costume | 6 | 3 | 1 | 2 | ADR-007 |
| messages | 5 | 3 | 1 | 1 | ADR-004 |
| ui-jobs | 4 | 2 | 1 | 1 | ADR-006 |
| wellness | 6 | 3 | 0 | 3 | ADR-003, 004 |
| events | 5 | 3 | 0 | 2 | ADR-004 |
| staff | 6 | 3 | 1 | 2 | ADR-002, 009, 012 |
| rival-ai | 6 | 3 | 1 | 2 | ADR-002, 004 |
| news | 6 | 3 | 1 | 2 | ADR-004, 010 |
| contract | 6 | 2 | 0 | 4 | ADR-003, 004 |
| economy | 6 | 1 | 1 | 4 | ADR-003 |
| stats | 8 | 1 | 2 | 5 | ADR-003, 012 |
| idol-db | 7 | 2 | 1 | 4 | ADR-001, 010 |
| chargen | 6 | 2 | 0 | 4 | ADR-001 |
| fame | 5 | 1 | 1 | 3 | ADR-003 |
| settings | 5 | 2 | 0 | 3 | ADR-010 |
| visual-gen | 4 | 1 | 1 | 2 | ADR-001 |
| ui-idol | 5 | 1 | 2 | 2 | ADR-006 |
| ui-news | 4 | 1 | 1 | 2 | ADR-006 |
| ui-results | 4 | 1 | 1 | 2 | ADR-006 |

## Coverage Gaps (No ADR Exists)

31 systems with zero ADR coverage (131 TR-IDs total):

### Core/MVP Gaps (HIGHEST PRIORITY)

| System | TRs | Priority | Key Requirements |
|--------|-----|----------|-----------------|
| schedule | 4 | MVP | 7×2 slot grid, under-16 caps, burnout blocking |
| jobs | 6 | MVP | Job source enum, job board refresh, rival competition, post-job breakdown |
| scouting | 4 | MVP | ~500 fixed scouts, XP progression, shared pool, S+ masking |
| market | 5 | MVP | Atomic pool updates, buyout multi-week state, visibility computation |
| producer | 3 | MVP | Immutable profile, additive modifier stacking ±40%, compatibility matrix |
| strategy | 4 | MVP | 4 lever values, focus/image transition cooldowns, modifier cap |
| intel | 5 | MVP | Prediction accuracy formula, 6-month snapshots, alert deduplication |

### Vertical Slice Gaps

| System | TRs | Priority | Key Requirements |
|--------|-----|----------|-----------------|
| groups | 7 | V.Slice | Pairwise affinity sparse matrix, group fame independent, patinho feio deterministic |
| dialogue | 6 | V.Slice | Reaction score 6 factors, promise persistence, conversation memory |
| talent | 6 | V.Slice | Development plan state machine, training focus multiplier, trait persistence |
| medical | 6 | V.Slice | Injury chance formulas, permanent damage check, re-injury window |
| music-charts | 6 | V.Slice | Top 100 monthly sort, listener pool, 5% weekly decay |
| archetypes | 4 | V.Slice | Computed at read time, Chaos Magnet reads hidden Temperamento |
| finance-report | 4 | V.Slice | Monthly aggregation, ROI per idol 3-month rolling, rival estimates |
| ui-contract | 3 | V.Slice | Real-time acceptance probability, auto-fill >90% |
| media | 4 | V.Slice | 40-60 persistent entities, airplay chart boost |

### Alpha Gaps

| System | TRs | Priority | Key Requirements |
|--------|-----|----------|-----------------|
| fanclub | 4 | Alpha | 11 fields per idol, segment conversion rates, merch revenue formula |
| merch | 6 | Alpha | MerchProduct state machine, warehouse capacity, photocard gacha |
| idol-finance | 5 | Alpha | Hidden entity per idol, debt compound interest, life goal completion |
| reputation | 4 | Alpha | Affinity per idol 0-100, memory persistence, legacy titles |
| meta-game | 3 | Alpha | Agency transfer carries reputation, dismissal counter |
| planning | 3 | Alpha | 9-system aggregation, seasonal event injection |
| roster | 3 | Alpha | Derived from existing data, star dependency index |
| awards | 5 | Alpha | Nomination scores, lobbying cap, Kouhaku eligibility |
| lifecycle | 4 | Alpha | Debut/retirement conditions, active pool ~3000±500 |
| player-events | 2 | Alpha | Event success formula inputs locked at scheduling |
| ui-calendar | 2 | Alpha | 4 zoom levels |
| ui-rankings | 2 | Alpha | 3 parallel tabs |
| ui-scouting | 3 | Alpha | Interactive map, uncertainty marker |

### Full Vision Gaps

| System | TRs | Priority |
|--------|-----|----------|
| post-debut | 3 | Full Vision |
| tutorial | 2 | Full Vision |

---

## Cross-ADR Conflicts

### No blocking conflicts detected.

#### Conflict 1: ADR-007 ↔ ADR-008 Circular Dependency
- **Severity:** LOW
- **Type:** Dependency Cycle
- **ADR-007 claims:** "Depends On ADR-008 (song structure + part demands)"
- **ADR-008 claims:** "Depends On ADR-007 (show consumes songs)"
- **Impact:** Not a true cycle — data flows one direction (music-prod creates
  songs → show-system consumes). Both were co-designed.
- **Resolution:** Document the dependency as unidirectional: ADR-008 defines
  song data, ADR-007 consumes it.

#### Conflict 2: ADR-003 vs ADR-006 Code Sample Style
- **Severity:** MINOR
- **Type:** Pattern inconsistency
- **ADR-003** section 6 shows Svelte 4 `writable`/`derived` store patterns
- **ADR-006** mandates Svelte 5 runes (`$state`, `$derived`, `$effect`)
- **Resolution:** Update ADR-003's store code samples to use Svelte 5 runes,
  or add a note that legacy APIs remain valid but runes are preferred per ADR-006.

#### Conflict 3: ADR-009 Traceability Hole
- **Severity:** MEDIUM
- **Type:** Missing coverage declaration
- **ADR-009** defines 52 NPC decisions across all gameplay systems but has no
  explicit "GDD Requirements Addressed" section with TR-IDs.
- **Resolution:** Add a TR-ID mapping appendix to ADR-009 linking each of the
  52 decisions to the TR-IDs they implement. This would increase covered TRs
  by an estimated 30-50.

---

## ADR Dependency Order (Topologically Sorted)

### Recommended ADR Implementation Order

**Foundation (no dependencies):**
1. ADR-001: Stack Tecnologica

**Infrastructure (depends on Foundation):**
2. ADR-002: Simulation Pipeline & Threading (requires ADR-001)
3. ADR-003: Game State Schema & Persistence (requires ADR-001, ADR-002)
4. ADR-004: Event System & Cross-System Integration (requires ADR-002, ADR-003)
5. ADR-005: Performance Budget Allocation (requires ADR-002, ADR-003, ADR-004)

**Presentation (depends on Infrastructure):**
6. ADR-006: UI Component Architecture (requires ADR-001, ADR-003)
7. ADR-010: Internationalization Strategy (requires ADR-001, ADR-006)

**Gameplay Systems (depends on Infrastructure):**
8. ADR-009: NPC Decision Catalog (requires ADR-002, ADR-003, ADR-004)
9. ADR-012: Decision Context Providers (requires ADR-003, ADR-009)
10. ADR-008: Music Production Architecture (requires ADR-002, ADR-003, ADR-004, ADR-009, ADR-012)
11. ADR-007: Show Simulation Pipeline (requires ADR-002, ADR-003, ADR-004, ADR-008, ADR-009)

**Future Preparation:**
12. ADR-011: Multiplayer-Ready Architecture (requires ADR-002, ADR-003, ADR-004)

**Dependency Issues:**
- ⚠️ ADR-007 ↔ ADR-008 circular reference — resolved as unidirectional (see Conflict 1)
- No unresolved dependencies
- No ADRs depend on Proposed-status records (all are Accepted)

---

## GDD Revision Flags

None — all GDD assumptions are consistent with verified engine behaviour and
accepted ADRs. This project uses a web stack (SvelteKit) where engine-level
API conflicts are rare.

---

## Engine Compatibility Issues

### Engine Audit Results
- **Engine:** SvelteKit 2.50 + Svelte 5.54.x + Tauri 2.x + TypeScript 5.9.x
- **ADRs with Engine Compatibility section:** 7 / 12

| Check | Finding | Severity |
|-------|---------|----------|
| Version consistency | All ADRs agree on SvelteKit 2.50, Svelte 5.54.x, Tauri 2.x | ✅ PASS |
| Post-cutoff API declarations | ADR-006 correctly declares Svelte 5 runes; all others None | ✅ PASS |
| **Engine reference docs** | **No `sveltekit/` or `svelte/` reference docs exist.** `docs/CLAUDE.md` points to `godot/VERSION.md` (wrong engine) | 🔴 HIGH GAP |
| Missing Engine Compat sections | ADR-008, ADR-009, ADR-010, ADR-011, ADR-012 (5/12 ADRs) | 🟡 MEDIUM |
| Svelte 5 runes stability | Flagged in ADR-006; unmitigated without reference docs | 🟡 MEDIUM |
| Tauri 2 plugin maturity | Flagged in ADR-001; mitigated by optional-dependency design | 🟡 MEDIUM |
| structuredClone perf | Documented in ADR-003/005; Verification Required — benchmark pending | 🟡 MEDIUM |
| IndexedDB autosave perf | Documented and budgeted; Verification Required — benchmark pending | 🟢 LOW |

### Recommended Engine Actions
1. Create `docs/engine-reference/svelte/` with VERSION.md, breaking-changes.md, current-best-practices.md
2. Fix `docs/CLAUDE.md` — update engine reference pointer from `godot/` to `svelte/`
3. Add Engine Compatibility section to ADR-008, 009, 010, 011, 012
4. Align ADR-003 store code samples to Svelte 5 runes per ADR-006

---

## Architecture Document Coverage

No `docs/architecture/architecture.md` exists. The 12 ADRs serve as the
architecture documentation. The `design/gdd/systems-index.md` dependency map
fills the role of a system-layer mapping. Consider creating a master architecture
document after the remaining ADRs are written.

---

## Verdict: CONCERNS

**PASS criteria not met:**
- 195 gap requirements (61% uncovered)
- Engine reference docs missing for actual stack
- 5/12 ADRs missing Engine Compatibility section
- ADR-009 lacks explicit TR-ID coverage mapping

**No blocking issues:**
- All 12 existing ADRs are Accepted and internally consistent
- No cross-ADR conflicts prevent implementation
- Foundational architecture (pipeline, state, events, performance, UI) is solid
- The covered systems (simulation core, show pipeline, music production, UI framework)
  represent the highest-risk technical areas and are well-addressed

### Required ADRs (Priority Order)

| # | Suggested ADR | Systems Covered | Est. Gap TRs Addressed |
|---|---------------|-----------------|------------------------|
| 1 | ADR-013: Schedule & Constraint Engine | schedule, jobs | ~10 |
| 2 | ADR-014: Scouting & Market Architecture | scouting, market | ~9 |
| 3 | ADR-015: Group & Relationship Architecture | groups, pairwise dynamics | ~7 |
| 4 | ADR-016: Player Interaction Systems | dialogue, reputation, promises | ~10 |
| 5 | ADR-017: Fan Economy & Revenue Settlement | fanclub, merch, idol-finance | ~15 |

These 5 ADRs would address ~51 gap TRs, bringing coverage to ~48%. Many remaining
gaps can be resolved by:
- Adding TR-ID mapping to ADR-009 (~30-50 additional TRs)
- Systems that follow existing ADR patterns without needing dedicated ADRs (archetypes,
  roster, finance-report, planning — all derived/read-only views)

### Systems That Don't Need Dedicated ADRs

These systems are adequately covered by foundational ADR patterns:

| System | Rationale |
|--------|-----------|
| archetypes | Computed at read time — follows ADR-003 derived state pattern |
| roster | Derived analytics view — follows ADR-003 + ADR-012 context pattern |
| finance-report | Derived reporting view — follows ADR-003 pattern |
| planning | Read-only aggregator — follows ADR-012 context provider pattern |
| strategy | Config struct — follows ADR-003 state slice pattern |
| producer | Immutable config — follows ADR-003 state slice pattern |
| meta-game | Meta state — follows ADR-003 state slice pattern |
| tutorial | Read-only observer — follows ADR-006 UI pattern |
| settings | Player-level config — follows ADR-003 persistence pattern |
| All UI gap systems | Follow ADR-006 component architecture patterns |

---

## History

| Date | Review | ADRs | Coverage | Verdict |
|------|--------|------|----------|---------|
| 2026-04-07 | Initial | 1 | ~7% (25/338) | CONCERNS |
| 2026-04-09 | Second | 12 | 31.7% (101/319) | CONCERNS |
