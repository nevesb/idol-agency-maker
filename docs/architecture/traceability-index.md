# Architecture Traceability Index

> **Last Updated**: 2026-04-09
> **Engine**: SvelteKit 2.50 + TypeScript + Tauri 2 + Supabase
> **Review**: docs/architecture/architecture-review-2026-04-09.md

## Coverage Summary

- **Total requirements**: 319
- **✅ Covered**: 190 (59.6%)
- **⚠️ Partial**: 27 (8.5%)
- **❌ Gaps**: 102 (32.0%)

---

## Full Matrix

### ✅ Covered Systems

#### Foundation & Core

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-time-001 | time | Canonical unit 1 week; 4w/m, 12m/y, 48w/y | ADR-002, 004, 005 |
| TR-time-002 | time | Three sim modes Live/Pause/Skip state machine | ADR-002, 004, 005 |
| TR-time-003 | time | Skip mode full week <200ms | ADR-002, 005 |
| TR-time-004 | time | Live mode 60fps during daily processing | ADR-001, 002, 005 |
| TR-time-005 | time | Speed multipliers; state persists Pause/Resume | ADR-002 |
| TR-time-006 | time | Priority event queue interrupts Skip/Live | ADR-002, 004 |
| TR-time-007 | time | Pause mode zero CPU cycles | ADR-002 |
| TR-time-008 | time | 960+ weeks (20 years) no overflow | ADR-002 |
| TR-time-009 | time | Seasonal events O(1) lookup by month/week | ADR-002 |
| TR-time-010 | time | End-of-month reports on week 4 | ADR-002 |
| TR-week-sim-001 | week-sim | 4-phase pipeline 50/200/200/50ms | ADR-002, 003, 004, 005 |
| TR-week-sim-002 | week-sim | Parallel idol job computation Phase 2 | ADR-001, 002, 005 |
| TR-week-sim-003 | week-sim | Performance Events → show-system | ADR-002, 004 |
| TR-week-sim-004 | week-sim | 50 rivals within 100ms at 2ms each | ADR-002, 005 |
| TR-week-sim-005 | week-sim | 50 agencies × 3000 idols Skip <500ms | ADR-002, 005 |
| TR-week-sim-006 | week-sim | Mid-Live changes only affect unprocessed days | ADR-002 |
| TR-week-sim-007 | week-sim | Moment Engine ≤5 headlines by ranking | ADR-002 |
| TR-economy-001 | economy | 6 revenue + 11 expense categories as ledger | ADR-003 |
| TR-economy-002 | economy | Monthly processing on week 4 via Time | ADR-003 |
| TR-economy-003 | economy | Cash flow projection formula | ADR-003 |
| TR-economy-004 | economy | Bankruptcy handling at negative cash | ADR-003 |
| TR-economy-005 | economy | Seasonal revenue multipliers | ADR-003 |
| TR-economy-006 | economy | Tax/fee deductions from gross revenue | ADR-003 |
| TR-wellness-001 | wellness | 4 bars: health, happiness, stress, motivation | ADR-003, 004, 009 |
| TR-wellness-002 | wellness | Weekly decay/growth formulas per bar | ADR-003, 004 |
| TR-wellness-003 | wellness | Burnout threshold triggers forced rest | ADR-003, 004 |
| TR-wellness-004 | wellness | Cross-system event triggers (job→stress) | ADR-004, 009 |
| TR-wellness-005 | wellness | Wellness advisor staff role integration | ADR-009 |
| TR-wellness-006 | wellness | Recovery formula with resilience factor | ADR-003 |
| TR-contract-001 | contract | 9 negotiable clauses per contract | ADR-003, 004 |
| TR-contract-002 | contract | Auto-fill defaults by tier | ADR-003 |
| TR-contract-003 | contract | Duration/salary/restrictions ranges | ADR-003 |
| TR-contract-004 | contract | Breach detection and penalty system | ADR-004 |
| TR-contract-005 | contract | Renewal negotiation flow | ADR-003, 004 |
| TR-contract-006 | contract | Buyout clause mechanics | ADR-003, 004 |
| TR-fame-001 | fame | 9 tiers F→SSS with point thresholds | ADR-003 |
| TR-fame-002 | fame | Individual + group + agency rankings | ADR-003 |
| TR-fame-003 | fame | Weekly fame delta from job results | ADR-003 |
| TR-fame-004 | fame | Decay rate by inactivity | ADR-003 |
| TR-fame-005 | fame | Cross-system fame impacts (contract demands) | ADR-003 |

#### Persistence & Generation

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-save-001 | save | Autosave <200ms delta | ADR-001, 002, 003 |
| TR-save-002 | save | Full state serialization | ADR-001, 003 |
| TR-save-003 | save | IndexedDB offline-first | ADR-001, 003 |
| TR-save-004 | save | Supabase cloud sync optional | ADR-001, 003 |
| TR-save-005 | save | Save migration between versions | ADR-001, 003 |
| TR-save-006 | save | Compression for large saves | ADR-001, 003 |
| TR-save-007 | save | Slot management (auto + manual) | ADR-001, 003 |
| TR-save-008 | save | Integrity validation on load | ADR-001, 003 |
| TR-chargen-001 | chargen | ComfyUI portrait pipeline | ADR-001 |
| TR-chargen-002 | chargen | IP-Adapter face consistency | ADR-001 |
| TR-chargen-003 | chargen | Age bracket progression (8 ages) | ADR-001 |
| TR-chargen-004 | chargen | 24 images per idol (8 ages × 3 expressions) | ADR-001 |
| TR-chargen-005 | chargen | RunPod serverless generation | ADR-001 |
| TR-chargen-006 | chargen | Supabase Storage CDN delivery | ADR-001 |
| TR-idol-db-001 | idol-db | 5000+ deterministic idols from seed | ADR-001, 010 |
| TR-idol-db-002 | idol-db | Seed-fixed generation reproducible | ADR-001, 010 |
| TR-idol-db-003 | idol-db | Name generation (romaji + JP) | ADR-001, 010 |
| TR-idol-db-004 | idol-db | Stat distribution across tiers | ADR-001 |
| TR-idol-db-005 | idol-db | Background/region diversity | ADR-001 |
| TR-idol-db-006 | idol-db | Python offline tooling | ADR-001 |
| TR-idol-db-007 | idol-db | Batch generation pipeline | ADR-001 |

#### Gameplay — Decisions & AI

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-rival-ai-001 | rival-ai | 50 AI agencies with personality | ADR-002 |
| TR-rival-ai-002 | rival-ai | Scouting/hiring heuristics | ADR-002 |
| TR-rival-ai-003 | rival-ai | Buyout aggression scoring | ADR-002 |
| TR-rival-ai-004 | rival-ai | Budget-aware decisions | ADR-002 |
| TR-rival-ai-005 | rival-ai | Rescission rules (3+ months loss) | ADR-002 |
| TR-rival-ai-006 | rival-ai | Parallel processing within budget | ADR-002 |
| TR-scouting-001 | scouting | 5 pipeline types | ADR-009 |
| TR-scouting-002 | scouting | Scout attribute evaluation | ADR-009 |
| TR-scouting-003 | scouting | Pipeline-specific noise | ADR-009 |
| TR-scouting-004 | scouting | Mission planning decisions | ADR-009 |
| TR-market-001 | market | Available idol pool management | ADR-004, 009 |
| TR-market-002 | market | Transfer proposal system | ADR-004, 009 |
| TR-market-003 | market | Buyout mechanics | ADR-004, 009 |
| TR-market-004 | market | Market value calculation | ADR-009 |
| TR-market-005 | market | Pool refresh timing | ADR-004 |
| TR-staff-001 | staff | Staff hiring/firing decisions | ADR-009 |
| TR-staff-002 | staff | Role assignment optimization | ADR-009 |
| TR-staff-003 | staff | Efficacy formula | ADR-009 |
| TR-staff-004 | staff | Multi-role penalty matrix | ADR-009 |
| TR-staff-005 | staff | Morale state machine | ADR-009 |
| TR-staff-006 | staff | Delegation quality scaling | ADR-009 |
| TR-talent-001 | talent | Development stage system | ADR-009 |
| TR-talent-002 | talent | Readiness check validation | ADR-009 |
| TR-talent-003 | talent | Training focus multipliers | ADR-009 |
| TR-talent-004 | talent | Quarterly plan generation | ADR-009 |
| TR-talent-005 | talent | Mentoring mechanics | ADR-009 |
| TR-talent-006 | talent | Emergent trait triggers | ADR-009 |
| TR-strategy-001 | strategy | Strategic direction setting | ADR-009 |
| TR-strategy-002 | strategy | Focus/stance/image decisions | ADR-009 |
| TR-strategy-003 | strategy | Growth strategy evaluation | ADR-009 |
| TR-strategy-004 | strategy | Budget allocation decisions | ADR-009 |
| TR-intel-001 | intel | Analytics/comparison reports | ADR-009 |
| TR-intel-002 | intel | Prediction models | ADR-009 |
| TR-intel-003 | intel | Rival intelligence gathering | ADR-009 |
| TR-intel-004 | intel | Market trend analysis | ADR-009 |
| TR-intel-005 | intel | Risk assessment | ADR-009 |
| TR-producer-001 | producer | Head producer decisions | ADR-009 |
| TR-producer-002 | producer | Vice producer delegation | ADR-009 |
| TR-producer-003 | producer | Producer budget allocation | ADR-009 |
| TR-reputation-001 | reputation | PR crisis response | ADR-009 |
| TR-reputation-002 | reputation | Media relations management | ADR-009 |
| TR-reputation-003 | reputation | Community engagement | ADR-009 |
| TR-reputation-004 | reputation | Brand positioning | ADR-009 |
| TR-fanclub-001 | fanclub | Fan segment management | ADR-009 |
| TR-fanclub-002 | fanclub | Engagement campaign decisions | ADR-009 |
| TR-fanclub-003 | fanclub | Toxicity mitigation | ADR-009 |
| TR-fanclub-004 | fanclub | Conversion rate optimization | ADR-009 |
| TR-events-001 | events | Deterministic trigger system | ADR-004, 009 |
| TR-events-002 | events | Cooldown mechanics per type | ADR-004 |
| TR-events-003 | events | Cascading effect chains | ADR-004 |
| TR-events-004 | events | PR mitigation integration | ADR-004, 009 |
| TR-events-005 | events | Event priority ranking | ADR-004 |
| TR-news-001 | news | Template-based generation | ADR-004, 010 |
| TR-news-002 | news | Tiered media visibility | ADR-004, 010 |
| TR-news-003 | news | Multi-language templates | ADR-010 |
| TR-news-004 | news | News priority scoring | ADR-004 |
| TR-news-005 | news | Veículo-based distribution | ADR-004 |
| TR-news-006 | news | Template catalog management | ADR-010 |
| TR-lifecycle-001 | lifecycle | Pool equilibrium ~3000 active | ADR-006, 010 |
| TR-lifecycle-002 | lifecycle | Debut/graduation conditions | ADR-006, 010 |
| TR-lifecycle-003 | lifecycle | Graduation ceremony types | ADR-006 |
| TR-lifecycle-004 | lifecycle | Age progression effects | ADR-006 |

#### Show & Music Cluster

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-shows-001 | shows | Pre-show → per-song → post-show pipeline | ADR-007, 009 |
| TR-shows-002 | shows | 3D lineup matrix (Song × Part × Idol) | ADR-007 |
| TR-shows-003 | shows | Fatigue from song demands | ADR-007 |
| TR-shows-004 | shows | Audience state mutable within show | ADR-007 |
| TR-shows-005 | shows | Performance scoring formula | ADR-007 |
| TR-shows-006 | shows | Show result settlement | ADR-007 |
| TR-shows-007 | shows | Total show <3ms processing | ADR-007 |
| TR-setlist-001 | setlist | Buildable setlists with pacing | ADR-007 |
| TR-setlist-002 | setlist | Mastery system 0-5 stars | ADR-007 |
| TR-setlist-003 | setlist | 3 rehearsal types | ADR-007 |
| TR-setlist-004 | setlist | Pacing section sequencing | ADR-007 |
| TR-formations-001 | formations | 6 roles per music | ADR-007, 008 |
| TR-formations-002 | formations | Role-fit calculation | ADR-007, 008 |
| TR-formations-003 | formations | Chemistry modifier | ADR-007, 008 |
| TR-formations-004 | formations | Auto-assign with choreographer | ADR-007, 008 |
| TR-formations-005 | formations | Role familiarity bonus | ADR-007 |
| TR-costume-001 | costume | 10 costume themes with buffs | ADR-007 |
| TR-costume-002 | costume | 3 acquisition channels | ADR-007 |
| TR-costume-003 | costume | Tier quality multipliers | ADR-007 |
| TR-costume-004 | costume | Durability degradation | ADR-007 |
| TR-costume-005 | costume | Mid-show change mechanics | ADR-007 |
| TR-costume-006 | costume | Designer staff role integration | ADR-007 |
| TR-briefing-001 | briefing | Pressure base calculation | ADR-007 |
| TR-briefing-002 | briefing | 5 tones with phrase sets | ADR-007 |
| TR-briefing-003 | briefing | Reaction modifier by hidden stats | ADR-007 |
| TR-briefing-004 | briefing | Performance modifier clamp 0.85-1.15 | ADR-007 |
| TR-briefing-005 | briefing | Side talk limit mechanics | ADR-007 |
| TR-music-ent-001 | music-ent | Songs as mechanical entities | ADR-007, 008 |
| TR-music-ent-002 | music-ent | Part demands per song | ADR-007, 008 |
| TR-music-ent-003 | music-ent | Genre/mood classification | ADR-008 |
| TR-music-ent-004 | music-ent | Reception potential scoring | ADR-008 |
| TR-music-ent-005 | music-ent | Performance requirements | ADR-007, 008 |
| TR-awards-001 | awards | 6 annual award shows | ADR-007 |
| TR-awards-002 | awards | Nomination scoring formula | ADR-007 |
| TR-awards-003 | awards | Final voting mechanics | ADR-007 |
| TR-awards-004 | awards | Lobby influence system | ADR-007 |
| TR-awards-005 | awards | Victory boost effects | ADR-007 |
| TR-audience-001 | audience | Dynamic audience composition | ADR-007 |
| TR-audience-002 | audience | Per-song engagement delta | ADR-007 |
| TR-audience-003 | audience | Lightstick distribution tracking | ADR-007 |
| TR-audience-004 | audience | Encore probability mechanics | ADR-007 |
| TR-audience-005 | audience | Post-show fan conversion | ADR-007 |
| TR-music-prod-001 | music-prod | 3-part creative pipeline | ADR-008, 009 |
| TR-music-prod-002 | music-prod | Composer NPC 19-attribute model | ADR-008, 009 |
| TR-music-prod-003 | music-prod | Idol-as-composer opportunity cost | ADR-008 |
| TR-music-prod-004 | music-prod | Choreography per-part system | ADR-008 |
| TR-music-prod-005 | music-prod | Mastery 0-5 exponential curve | ADR-008 |
| TR-music-prod-006 | music-prod | Release types & campaigns | ADR-008 |
| TR-music-prod-007 | music-prod | Quality from creator attributes | ADR-008, 009 |
| TR-music-prod-008 | music-prod | Production budget allocation | ADR-008 |
| TR-music-prod-009 | music-prod | MV/teaser hype multipliers | ADR-008 |
| TR-music-prod-010 | music-prod | Song quality formula | ADR-008 |
| TR-music-charts-001 | music-charts | Chart entry score formula | ADR-008 |
| TR-music-charts-002 | music-charts | Pool revenue model | ADR-008 |
| TR-music-charts-003 | music-charts | Composer fama calculation | ADR-008 |
| TR-music-charts-004 | music-charts | Seasonality bonuses | ADR-008 |
| TR-music-charts-005 | music-charts | Physical media chart weight | ADR-008 |
| TR-music-charts-006 | music-charts | Weekly chart recalculation | ADR-008 |

### ⚠️ Partially Covered Systems

| TR-ID | System | Requirement (abbreviated) | Implicit Coverage | Explicit ADR |
|-------|--------|--------------------------|-------------------|-------------|
| TR-stats-001 | stats | 16+6 attributes, PT, TA, traits, VocalProfile | ADR-003 schema | — |
| TR-stats-002 | stats | Hidden attributes never surfaced as numbers | ADR-012 reveal | — |
| TR-stats-003 | stats | Tier F-SSS from PT lookup; PT immutable | ADR-003 schema | — |
| TR-stats-004 | stats | Weekly growth 6-factor formula | ADR-002 pipeline | — |
| TR-stats-005 | stats | Physical decay by age bracket | ADR-002 pipeline | — |
| TR-stats-006 | stats | Burnout recovery; -5 permanent loss | ADR-003, 004 | — |
| TR-stats-007 | stats | Scout precision noise injection | ADR-009 decisions | — |
| TR-stats-008 | stats | Conditional trait activation in show context | ADR-007 shows | — |
| TR-jobs-001 | jobs | Job-idol match calculation | ADR-002 pipeline | — |
| TR-jobs-002 | jobs | Partial requirement fulfillment | ADR-009 decisions | — |
| TR-jobs-003 | jobs | Result variance model | ADR-002 pipeline | — |
| TR-jobs-004 | jobs | Job type performance modifiers | ADR-002, 009 | — |
| TR-jobs-005 | jobs | Job availability by fame tier | ADR-009 | — |
| TR-jobs-006 | jobs | Job result → fame/happiness deltas | ADR-004 events | — |
| TR-schedule-001 | schedule | Weekly allocation with workload | ADR-002 pipeline | — |
| TR-schedule-002 | schedule | Color-coded workload visualization | — | — |
| TR-schedule-003 | schedule | Overwork threshold enforcement | ADR-002, 009 | — |
| TR-schedule-004 | schedule | Rest day scheduling rules | ADR-002 | — |
| TR-ui-dash-001 | ui-dash | Portal load <1s | — | ADR-006 |
| TR-ui-dash-002 | ui-dash | 3-column Portal layout | — | — |
| TR-ui-dash-003 | ui-dash | Real-time data refresh | — | — |
| TR-ui-dash-004 | ui-dash | Quick navigation hotkeys | — | — |
| TR-ui-ia-001 | ui-ia | 6 macrodominios with numeric hotkeys | — | — |
| TR-ui-ia-002 | ui-ia | Universal search Ctrl+K | — | — |
| TR-ui-ia-003 | ui-ia | DataTable dense UI component | — | ADR-006 |
| TR-ui-ia-004 | ui-ia | Sort/filter/keyboard navigation | — | ADR-006 |
| TR-ui-ia-005 | ui-ia | Avatar visibility rule | — | ADR-006 |
| TR-ui-ia-006 | ui-ia | Tier badge system | — | ADR-006 |
| TR-ui-ia-007 | ui-ia | Screen template breadcrumb pattern | — | ADR-006 |
| TR-ui-ia-008 | ui-ia | Bookmark system Shift+1-12 | — | — |
| TR-ui-ia-009 | ui-ia | Responsive PC-first 1920×1080 | — | ADR-006 |
| TR-ui-ia-010 | ui-ia | Power user keyboard traversal | — | ADR-006 |
| TR-ui-jobs-001 | ui-jobs | 20+ row table <500ms | — | ADR-006 |
| TR-ui-jobs-002 | ui-jobs | Job requirement matching display | — | — |
| TR-ui-jobs-003 | ui-jobs | Quick assign interaction | — | — |
| TR-ui-jobs-004 | ui-jobs | Filter by type/tier/requirements | — | — |

### ❌ Gap Systems (no ADR coverage)

#### Gameplay Gaps

| TR-ID Range | System | Count | Priority |
|-------------|--------|-------|----------|
| TR-groups-001..007 | groups | 7 | Vertical Slice |
| TR-dialogue-001..006 | dialogue | 6 | Vertical Slice |
| TR-medical-001..006 | medical | 6 | Vertical Slice |
| TR-idol-finance-001..005 | idol-finance | 5 | Alpha |
| TR-archetypes-001..004 | archetypes | 4 | Vertical Slice |
| TR-roster-001..003 | roster | 3 | Alpha |
| TR-player-events-001..002 | player-events | 2 | Alpha |
| TR-post-debut-001..003 | post-debut | 3 | Full Vision |
| TR-meta-game-001..003 | meta-game | 3 | Alpha |
| TR-planning-001..003 | planning | 3 | Alpha |

#### Economy Gaps

| TR-ID Range | System | Count | Priority |
|-------------|--------|-------|----------|
| TR-merch-001..006 | merch | 6 | Alpha |
| TR-finance-report-001..004 | finance-report | 4 | Vertical Slice |
| TR-media-001..004 | media | 4 | Vertical Slice |

#### Infrastructure Gaps

| TR-ID Range | System | Count | Priority |
|-------------|--------|-------|----------|
| TR-main-menu-001..007 | main-menu | 7 | MVP |
| TR-messages-001..005 | messages | 5 | MVP |
| TR-settings-001..005 | settings | 5 | Full Vision |
| TR-tutorial-001..002 | tutorial | 2 | Full Vision |
| TR-visual-gen-001..004 | visual-gen | 4 | Alpha |

#### UI Gaps

| TR-ID Range | System | Count | Priority |
|-------------|--------|-------|----------|
| TR-ui-idol-001..005 | ui-idol | 5 | MVP |
| TR-ui-results-001..004 | ui-results | 4 | MVP |
| TR-ui-news-001..004 | ui-news | 4 | Vertical Slice |
| TR-ui-scouting-001..003 | ui-scouting | 3 | MVP |
| TR-ui-contract-001..003 | ui-contract | 3 | Vertical Slice |
| TR-ui-calendar-001..002 | ui-calendar | 2 | Alpha |
| TR-ui-rankings-001..002 | ui-rankings | 2 | Alpha |

---

## Known Gaps — Suggested ADRs

| Gap Domain | TR Count | Suggested Resolution |
|------------|----------|---------------------|
| Main Menu & Messages | 12 | New ADR or amend ADR-004 (events/messages) |
| Groups & Roster | 10 | New ADR: Groups & Roster Architecture |
| Dialogue | 6 | New ADR: Dialogue & Interaction System |
| Medical | 6 | New ADR: Medical & Injury System |
| Stats (explicit) | 8 | Amend ADR-003 with explicit stats coverage |
| Jobs & Schedule | 10 | Amend ADR-002 with explicit job/schedule coverage |
| UI Systems | 23 | ADR-006 acceptance covers framework; individual screen ADRs not required |
| Merch & Finance | 10 | Amend ADR-008 (music/merch) and ADR-003 (finance) |
| Meta/Planning | 6 | Defer to Alpha — low architectural risk |
| Visual Gen | 4 | Defer to Alpha — standalone pipeline |
| Tutorial/Settings | 7 | Defer to Full Vision |

---

## Superseded Requirements

None — no GDD requirements have been removed or superseded since the TR registry
was created (2026-04-07). All 319 entries remain `status: active`.

---

## History

| Date | Coverage | ADRs | Notes |
|------|----------|------|-------|
| 2026-04-07 | 7% (~25/338) | 1 | Initial review — only ADR-001 existed |
| 2026-04-09 | 59.6% (190/319) | 12 | 11 new ADRs. TR count corrected from ~338 to 319 |
