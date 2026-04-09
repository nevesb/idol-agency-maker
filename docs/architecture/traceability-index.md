# Architecture Traceability Index

> **Last Updated:** 2026-04-09
> **Engine:** SvelteKit 2.50 + Svelte 5 + TypeScript + Tauri 2 + Supabase
> **Source:** `/architecture-review` run 2026-04-09

## Coverage Summary

- **Total requirements:** 319
- **Covered:** 101 (31.7%)
- **Partial:** 23 (7.2%)
- **Gaps:** 195 (61.1%)

---

## Full Matrix

### ✅ Covered Systems (>60% TRs addressed)

#### week-sim (week-simulation.md) — 7/7 ✅

| TR-ID | Requirement | ADR | Status |
|-------|-------------|-----|--------|
| TR-week-sim-001 | 4-phase pipeline Start/Daily/End/Report with budgets | ADR-002 | ✅ |
| TR-week-sim-002 | Jobs for different idols computed in parallel in Phase 2 | ADR-002 | ✅ |
| TR-week-sim-003 | Performance Events dispatched to show-system | ADR-004, ADR-007 | ✅ |
| TR-week-sim-004 | 50 rival agencies complete within 100ms total | ADR-002, ADR-005 | ✅ |
| TR-week-sim-005 | 50 agencies × 3000 idols in Skip mode within 500ms | ADR-005 | ✅ |
| TR-week-sim-006 | Mid-Live agenda changes only affect unprocessed days | ADR-002 | ✅ |
| TR-week-sim-007 | Moment Engine selects up to 5 headlines post-simulation | ADR-004 | ✅ |

#### time (time-calendar.md) — 7/10 ✅, 2 ⚠️, 1 ❌

| TR-ID | Requirement | ADR | Status |
|-------|-------------|-----|--------|
| TR-time-001 | Canonical unit is 1 week; 4 weeks/month | ADR-002 | ✅ |
| TR-time-002 | Three simulation modes Live/Pause/Skip as state machine | ADR-002 | ✅ |
| TR-time-003 | Skip mode processes full week in <200ms | ADR-002, ADR-005 | ✅ |
| TR-time-004 | Live mode maintains 60fps during daily processing | ADR-002, ADR-005 | ✅ |
| TR-time-005 | Speed multipliers scale wall-clock timer | ADR-002 | ✅ |
| TR-time-006 | Priority event queue interrupts Skip/Live forcing Pause | ADR-004 | ✅ |
| TR-time-007 | Pause mode consumes zero CPU processing cycles | ADR-002, ADR-005 | ✅ |
| TR-time-008 | Support 960+ weeks without integer overflow | ADR-003 | ⚠️ |
| TR-time-009 | Seasonal events from World Pack indexed for O(1) lookup | — | ❌ |
| TR-time-010 | End-of-month reports trigger on week 4 | ADR-002 | ⚠️ |

#### save (save-load.md) — 6/8 ✅, 1 ⚠️, 1 ❌

| TR-ID | Requirement | ADR | Status |
|-------|-------------|-----|--------|
| TR-save-001 | Atomic autosave transaction no partial writes | ADR-003 | ✅ |
| TR-save-002 | Autosave <200ms using delta-save strategy | ADR-003, ADR-005 | ✅ |
| TR-save-003 | Full save <2s and <50MB on disk | ADR-003, ADR-005 | ✅ |
| TR-save-004 | Version migration chain on load | ADR-003 | ✅ |
| TR-save-005 | World pack ID validation on load | ADR-003 | ✅ |
| TR-save-006 | Indexed queries within <1.5s load budget | ADR-003, ADR-005 | ✅ |
| TR-save-007 | Cloud sync post-autosave when online | ADR-001 | ⚠️ |
| TR-save-008 | 2-copy backup rotation with checksum validation | — | ❌ |

#### shows (show-system.md) — 5/7 ✅, 1 ⚠️, 1 ❌

| TR-ID | Requirement | ADR | Status |
|-------|-------------|-----|--------|
| TR-shows-001 | Show entity aggregates setlist/idols/production/audience | ADR-007 | ✅ |
| TR-shows-002 | Per-music performance is 3 multiplicative layers | ADR-007 | ✅ |
| TR-shows-003 | Intra-show fatigue is sequential accumulator | ADR-007 | ✅ |
| TR-shows-004 | Mid-show substitution logic with max 2-3 | ADR-007 | ✅ |
| TR-shows-005 | Show revenue settled atomically into Economy | ADR-007 | ✅ |
| TR-shows-006 | XP gain per idol per music feeds stat-growth | ADR-007 | ⚠️ |
| TR-shows-007 | Show states Planned/Ready/Executing/Completed/Cancelled | — | ❌ |

#### audience (audience-system.md) — 4/5 ✅, 1 ❌

| TR-ID | Requirement | ADR | Status |
|-------|-------------|-----|--------|
| TR-audience-001 | AudienceState mutable in-session struct | ADR-007 | ✅ |
| TR-audience-002 | Engagement delta requires all upstream outputs finalized | ADR-007 | ✅ |
| TR-audience-003 | Lightstick distribution normalized to sum 1.0 | ADR-007 | ✅ |
| TR-audience-004 | Encore trigger evaluated once at show end | ADR-007 | ✅ |
| TR-audience-005 | Post-show fan conversion writes to fan club same tick | — | ❌ |

#### formations (stage-formations.md) — 4/5 ✅, 1 ❌

| TR-ID | Requirement | ADR | Status |
|-------|-------------|-----|--------|
| TR-formations-001 | MusicFormation stores RoleAssignment per setlist position | ADR-007 | ✅ |
| TR-formations-002 | role_fit formulas for 6 roles read different stats | ADR-007 | ✅ |
| TR-formations-003 | group_chemistry_score averages pairwise affinity | ADR-007 | ✅ |
| TR-formations-004 | Choreographer recommendation bounded by constraints | ADR-008 | ✅ |
| TR-formations-005 | FormationPreset handles stale idol references | — | ❌ |

#### briefing (pre-show-briefing.md) — 4/5 ✅, 1 ❌

| TR-ID | Requirement | ADR | Status |
|-------|-------------|-----|--------|
| TR-briefing-001 | pressure_base computed from venue/stakes/context | ADR-007 | ✅ |
| TR-briefing-002 | reaction_modifier reads 3 hidden attributes | ADR-007, ADR-012 | ✅ |
| TR-briefing-003 | performance_modifier clamped 0.85-1.15 | ADR-007 | ✅ |
| TR-briefing-004 | Staff skill gating for phrase/prediction unlocks | ADR-007 | ✅ |
| TR-briefing-005 | Skipping briefing produces default 1.0 modifier | — | ❌ |

#### music-ent (music-entities.md) — 4/5 ✅, 1 ❌

| TR-ID | Requirement | ADR | Status |
|-------|-------------|-----|--------|
| TR-music-ent-001 | Music entity has performance + reception facets | ADR-007, ADR-008 | ✅ |
| TR-music-ent-002 | novelty_efetiva decays by 0.95^play_count | ADR-007 | ✅ |
| TR-music-ent-003 | vocal_fit discrete lookup from tessitura | ADR-007 | ✅ |
| TR-music-ent-004 | Music state machine allows simultaneous states | ADR-008 | ✅ |
| TR-music-ent-005 | Composer as persistent entity with tier | — | ❌ |

#### setlist (setlist-system.md) — 3/4 ✅, 1 ❌

| TR-ID | Requirement | ADR | Status |
|-------|-------------|-----|--------|
| TR-setlist-001 | Mastery table idol_id/music_id with logarithmic growth | ADR-007 | ✅ |
| TR-setlist-002 | Pacing score recomputed in real time during editing | ADR-007 | ✅ |
| TR-setlist-003 | Three rehearsal modes produce different distributions | ADR-007 | ✅ |
| TR-setlist-004 | Affinity idol/music cached per pair | — | ❌ |

#### main-menu (main-menu-flow.md) — 5/7 ✅, 1 ⚠️, 1 ❌

| TR-ID | Requirement | ADR | Status |
|-------|-------------|-----|--------|
| TR-main-menu-001 | Main menu full-screen without in-game nav | ADR-006 | ✅ |
| TR-main-menu-002 | Continue only appears if autosave exists | ADR-006 | ✅ |
| TR-main-menu-003 | 1 autosave + 3 manual save slots | ADR-003 | ✅ |
| TR-main-menu-004 | Language selection from main menu | ADR-010 | ✅ |
| TR-main-menu-005 | SvelteKit route groups separate menu from game | ADR-006 | ✅ |
| TR-main-menu-006 | Auth via Supabase Google/Discord/email; optional | ADR-001 | ⚠️ |
| TR-main-menu-007 | Selected agency roster init as player idols | — | ❌ |

---

### ⚠️ Partially Covered Systems (listed in review report tables)

See `architecture-review-2026-04-09.md` for detailed partial coverage breakdown.
Each system is listed with covered/partial/gap counts and primary ADRs.

---

### ❌ Gap Systems (No ADR Coverage)

31 systems with 131 total gap TRs. Full list with TR-IDs:

#### scouting (scouting-recruitment.md) — 0/4

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-scouting-001 | ~500 fixed scout NPCs in World Pack with XP/level | ❌ |
| TR-scouting-002 | Scout hiring reduces pool; agency_id updated atomically | ❌ |
| TR-scouting-003 | Stat estimates computed as real +/- noise at report time | ❌ |
| TR-scouting-004 | S/SS/SSS masked as S+ until contracted | ❌ |

#### jobs (job-assignment.md) — 0/6

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-jobs-001 | Job source enum for filtering and rival competition | ❌ |
| TR-jobs-002 | Performance Events dispatched to show-system | ❌ |
| TR-jobs-003 | Job board refresh at Phase 1; expired auto-removed | ❌ |
| TR-jobs-004 | Rival AI competes only on premium/special jobs | ❌ |
| TR-jobs-005 | Post-job breakdown records dominant formula factors | ❌ |
| TR-jobs-006 | Emissora favorability per agency_id/source_id | ❌ |

#### schedule (schedule-agenda.md) — 0/4

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-schedule-001 | 7×2 slot grid per idol 14 slots/week with typed slots | ❌ |
| TR-schedule-002 | Under-16 idols capped at 3 job slots | ❌ |
| TR-schedule-003 | Current week + next 4 weeks queryable for planning | ❌ |
| TR-schedule-004 | Burnout/Incapacitated blocks all slots | ❌ |

#### market (market-transfer.md) — 0/5

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-market-001 | Market pool updated atomically at Phase 1 | ❌ |
| TR-market-002 | ~20% visibility without scouting; computed not stored | ❌ |
| TR-market-003 | Buyout negotiation spans multiple weeks | ❌ |
| TR-market-004 | Talent Board responses accumulate per week | ❌ |
| TR-market-005 | Idols abandon market after configurable months | ❌ |

#### groups (group-management.md) — 0/7

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-groups-001 | Group stats computed as avg top 50% cached per week | ❌ |
| TR-groups-002 | Pairwise affinity stored as sparse float matrix | ❌ |
| TR-groups-003 | Group fama independent; only modified by group events | ❌ |
| TR-groups-004 | Patinho feio crisis is deterministic no random | ❌ |
| TR-groups-005 | Leadership dispute follows deterministic triggers | ❌ |
| TR-groups-006 | Idol may belong to multiple groups | ❌ |
| TR-groups-007 | ~200 group logos pre-generated as static assets | ❌ |

#### dialogue (dialogue-system.md) — 0/6

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-dialogue-001 | reaction_score deterministic sum of 6 factors | ❌ |
| TR-dialogue-002 | Conversation cooldown per idol per week | ❌ |
| TR-dialogue-003 | Promise struct persisted and checked weekly | ❌ |
| TR-dialogue-004 | ConversationMemory stored indefinitely | ❌ |
| TR-dialogue-005 | Wellness Advisor accuracy degrades for unknown hidden attrs | ❌ |
| TR-dialogue-006 | Topic trigger generation runs after weekly results | ❌ |

#### music-charts (music-charts.md) — 0/6

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-music-charts-001 | Top 100 sorted monthly; score formula | ❌ |
| TR-music-charts-002 | Listener pool dynamic; revenue share from ratio | ❌ |
| TR-music-charts-003 | 5% weekly score decay | ❌ |
| TR-music-charts-004 | Composer NPC fama derived from chart history | ❌ |
| TR-music-charts-005 | Seasonal marketing multipliers from calendar | ❌ |
| TR-music-charts-006 | Physical media sales tracked per release per week | ❌ |

#### talent (talent-development-plans.md) — 0/6

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-talent-001 | DevelopmentPlan struct with 12-week duration | ❌ |
| TR-talent-002 | Training focus multiplier ×2/×3 applied weekly | ❌ |
| TR-talent-003 | External development creates buyout_risk flag | ❌ |
| TR-talent-004 | Mentoring bonus reads mentor live stats | ❌ |
| TR-talent-005 | Trait structs persisted per idol through agency changes | ❌ |
| TR-talent-006 | Development plan auto-pauses on burnout | ❌ |

#### medical (medical-system.md) — 0/6

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-medical-001 | Injury chance formulas for 7 types | ❌ |
| TR-medical-002 | Injury struct persisted with weekly advancement | ❌ |
| TR-medical-003 | Permanent damage check requires player dialog | ❌ |
| TR-medical-004 | Medical Center facility level modifies chance/recovery | ❌ |
| TR-medical-005 | Rehab blocks physical stats; mental at 50% | ❌ |
| TR-medical-006 | Re-injury probability during 2-week post-recovery | ❌ |

#### fanclub (fan-club-system.md) — 0/4

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-fanclub-001 | FanClubDetailed entity with 11 numeric fields | ❌ |
| TR-fanclub-002 | Segment conversion rates as monthly deltas | ❌ |
| TR-fanclub-003 | Merch revenue formula depends on fan club state | ❌ |
| TR-fanclub-004 | Ticket revenue requires fan club state before settlement | ❌ |

#### merch (merchandising-production.md) — 0/6

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-merch-001 | MerchProduct state machine with weekly tick | ❌ |
| TR-merch-002 | Print-run scale factor and production time | ❌ |
| TR-merch-003 | Warehouse inventory enforces capacity limits | ❌ |
| TR-merch-004 | Photocard pack gacha with rarity distribution | ❌ |
| TR-merch-005 | Special editions with hype_factor accumulator | ❌ |
| TR-merch-006 | Sales formula reads fan club state | ❌ |

#### awards (award-shows.md) — 0/5

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-awards-001 | Nomination scores computed annually | ❌ |
| TR-awards-002 | AwardCategory stores fixed weights with normalization | ❌ |
| TR-awards-003 | Lobbying influence capped at 0.80 | ❌ |
| TR-awards-004 | Kouhaku eligibility check at week 52 | ❌ |
| TR-awards-005 | Award attendance is pre-ceremony flag gating boost | ❌ |

#### idol-finance (idol-personal-finance.md) — 0/5

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-idol-finance-001 | IdolFinance hidden entity per idol updated monthly | ❌ |
| TR-idol-finance-002 | Debt 1%/month compound interest capped at 30% | ❌ |
| TR-idol-finance-003 | Personal manager blocks buyout below 90% market | ❌ |
| TR-idol-finance-004 | Life goal completion triggers permanent stat changes | ❌ |
| TR-idol-finance-005 | Financial crisis detection feeds scandal/news | ❌ |

#### reputation (player-reputation-affinity.md) — 0/4

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-reputation-001 | Affinity per idol as float 0-100 across agency switches | ❌ |
| TR-reputation-002 | Memory struct generated on significant events | ❌ |
| TR-reputation-003 | Legacy titles evaluated cumulatively | ❌ |
| TR-reputation-004 | Global reputation score reads across history sources | ❌ |

#### lifecycle (idol-lifecycle.md) — 0/4

| TR-ID | Requirement | Status |
|-------|-------------|--------|
| TR-lifecycle-001 | Debut/retirement conditions evaluated per idol weekly | ❌ |
| TR-lifecycle-002 | Active idol pool maintained ~3000 ±500 | ❌ |
| TR-lifecycle-003 | Debutada idols stay in database with decaying fame | ❌ |
| TR-lifecycle-004 | Graduation ceremony 3 types with costs/boosts | ❌ |

#### Remaining gap systems (smaller)

| System | TRs | Key Gap |
|--------|-----|---------|
| strategy | 4 | 4 lever values as persistent struct, transition cooldowns |
| intel | 5 | Prediction accuracy, 6-month snapshots, alert dedup |
| media | 4 | 40-60 persistent entities, airplay chart boost |
| finance-report | 4 | Monthly aggregation, ROI per idol |
| producer | 3 | Immutable profile, modifier stacking |
| planning | 3 | 9-system aggregation, seasonal injection |
| meta-game | 3 | Agency transfer, dismissal counter |
| roster | 3 | Derived analytics, star dependency |
| archetypes | 4 | Computed at read time, cached weekly |
| post-debut | 3 | Ex-idol career type, composer pool |
| player-events | 2 | Event success formula, external artist invitation |
| tutorial | 2 | Tutorial state persistence, contextual tips |
| ui-contract | 3 | Real-time acceptance probability |
| ui-calendar | 2 | 4 zoom levels |
| ui-rankings | 2 | 3 parallel ranking tabs |
| ui-scouting | 3 | Interactive map, uncertainty markers |

---

## Known Gaps (Suggested ADRs)

| Priority | Suggested ADR | Gap Systems | Est. TRs |
|----------|---------------|-------------|----------|
| 1 | ADR-013: Schedule & Constraint Engine | schedule, jobs | ~10 |
| 2 | ADR-014: Scouting & Market Architecture | scouting, market | ~9 |
| 3 | ADR-015: Group & Relationship Architecture | groups | ~7 |
| 4 | ADR-016: Player Interaction Systems | dialogue, reputation | ~10 |
| 5 | ADR-017: Fan Economy & Revenue Settlement | fanclub, merch, idol-finance | ~15 |

---

## History

| Date | Coverage | ADRs | Verdict |
|------|----------|------|---------|
| 2026-04-07 | 7% (25/338) | 1 | CONCERNS |
| 2026-04-09 | 31.7% (101/319) | 12 | CONCERNS |
