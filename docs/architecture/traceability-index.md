# Architecture Traceability Index

> **Last Updated**: 2026-04-11
> **Engine**: SvelteKit 2.50 + Svelte 5 + Tauri 2 + Supabase
> **Review**: docs/architecture/architecture-review-2026-04-11.md

## Coverage Summary

- **Total requirements**: 319
- **✅ Covered**: 319 (100%)
- **⚠️ Partial**: 0 (0%)
- **❌ Gaps**: 0 (0%)

---

## Full Matrix

### Foundation & Core (64 TR-IDs)

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-stats-001 | stats | 16+6 attributes, PT, TA, traits, VocalProfile | ADR-002, 003 |
| TR-stats-002 | stats | Hidden attributes never surfaced as numbers | ADR-002, 012 |
| TR-stats-003 | stats | Tier F-SSS from PT lookup; PT immutable | ADR-002, 003 |
| TR-stats-004 | stats | Weekly growth 6-factor formula | ADR-002 |
| TR-stats-005 | stats | Physical decay by age bracket | ADR-002 |
| TR-stats-006 | stats | Burnout recovery; -5 permanent loss | ADR-002, 003, 004 |
| TR-stats-007 | stats | Scout precision noise injection | ADR-002, 009 |
| TR-stats-008 | stats | Conditional trait activation in show context | ADR-002, 007 |
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

### Gameplay — Jobs, Schedule, Decisions & AI (69 TR-IDs)

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-jobs-001 | jobs | Job-idol match calculation | ADR-002 |
| TR-jobs-002 | jobs | Partial requirement fulfillment | ADR-002, 009 |
| TR-jobs-003 | jobs | Result variance model | ADR-002 |
| TR-jobs-004 | jobs | Job type performance modifiers | ADR-002, 009 |
| TR-jobs-005 | jobs | Job availability by fame tier | ADR-002, 009 |
| TR-jobs-006 | jobs | Job result → fame/happiness deltas | ADR-002, 004 |
| TR-schedule-001 | schedule | Weekly allocation with workload | ADR-002 |
| TR-schedule-002 | schedule | Color-coded workload visualization | ADR-002, 006 |
| TR-schedule-003 | schedule | Overwork threshold enforcement | ADR-002, 009 |
| TR-schedule-004 | schedule | Rest day scheduling rules | ADR-002 |
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

### Show & Music Cluster (60 TR-IDs)

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

### Groups, Roster & Archetypes (14 TR-IDs) — ADR-015

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-groups-001 | groups | Group creation 1-12 members | ADR-015 |
| TR-groups-002 | groups | Top 50% stats aggregation | ADR-015 |
| TR-groups-003 | groups | Duo max complementarity | ADR-015 |
| TR-groups-004 | groups | Pivô detection and patinho feio | ADR-015 |
| TR-groups-005 | groups | Leader mechanics and disputes | ADR-015 |
| TR-groups-006 | groups | Independent group fame | ADR-015 |
| TR-groups-007 | groups | Sinergia from complementaridade × chemistry | ADR-015 |
| TR-roster-001 | roster | Roster health indicators (6 metrics) | ADR-015 |
| TR-roster-002 | roster | Star dependency index | ADR-015 |
| TR-roster-003 | roster | Roster balance score | ADR-015 |
| TR-archetypes-001 | archetypes | 12 auto-derived archetypes | ADR-015 |
| TR-archetypes-002 | archetypes | Primary + optional secondary | ADR-015 |
| TR-archetypes-003 | archetypes | Group composition sinergia bonus | ADR-015 |
| TR-archetypes-004 | archetypes | Dynamic archetype change on stat growth | ADR-015 |

### Dialogue & Medical (12 TR-IDs) — ADR-016

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-dialogue-001 | dialogue | Reaction score formula with 6 personality modifiers | ADR-016 |
| TR-dialogue-002 | dialogue | 4 outcome thresholds (Success/Partial/Fail/Disaster) | ADR-016 |
| TR-dialogue-003 | dialogue | Promise system with deadline and fulfillment | ADR-016 |
| TR-dialogue-004 | dialogue | Wellness Advisor prediction accuracy by level | ADR-016 |
| TR-dialogue-005 | dialogue | Saturation penalty for repeated dialogues | ADR-016 |
| TR-dialogue-006 | dialogue | PR Manager mitigation on negative outcomes | ADR-016 |
| TR-medical-001 | medical | 7 injury types with specific triggers | ADR-016 |
| TR-medical-002 | medical | Recovery formula with facility/staff/stat multipliers | ADR-016 |
| TR-medical-003 | medical | Re-injury chance reduced by PT skill | ADR-016 |
| TR-medical-004 | medical | Permanent damage on forced work during recovery | ADR-016 |
| TR-medical-005 | medical | Training load tracking with 3-level dashboard | ADR-016 |
| TR-medical-006 | medical | Rehab training at 50% efficiency for mental stats | ADR-016 |

### Economy Extensions (19 TR-IDs) — ADR-017

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-merch-001 | merch | Merch line creation tied to idol/group fame | ADR-017 |
| TR-merch-002 | merch | Fan segment multipliers on merch sales | ADR-017 |
| TR-merch-003 | merch | Sales decay over time post-launch | ADR-017 |
| TR-merch-004 | merch | 6 merch types with different cost/revenue profiles | ADR-017 |
| TR-merch-005 | merch | Graduation merch with 3-month carryover | ADR-017 |
| TR-merch-006 | merch | Collaboration merch with external brands | ADR-017 |
| TR-idol-finance-001 | idol-finance | Life goals queue with stat-based prioritization | ADR-017 |
| TR-idol-finance-002 | idol-finance | Goal completion permanent effects | ADR-017 |
| TR-idol-finance-003 | idol-finance | Debt mechanics with 1%/month interest | ADR-017 |
| TR-idol-finance-004 | idol-finance | 4 living standard levels affecting happiness | ADR-017 |
| TR-idol-finance-005 | idol-finance | Manager fee and negotiation bonus | ADR-017 |
| TR-finance-report-001 | finance-report | ROI per idol formula | ADR-017 |
| TR-finance-report-002 | finance-report | 3-month cash projection | ADR-017 |
| TR-finance-report-003 | finance-report | Rival agency estimation at 0.7 accuracy | ADR-017 |
| TR-finance-report-004 | finance-report | Cash alert when runway < 3 months | ADR-017 |
| TR-media-001 | media | Show-level data model with timeslot/guests/payment | ADR-017 |
| TR-media-002 | media | Cachê formula with tier and audiencia modifiers | ADR-017 |
| TR-media-003 | media | Audiencia monthly fluctuation | ADR-017 |
| TR-media-004 | media | Airplay boost for music chart position | ADR-017 |

### Meta-Game & Progression (11 TR-IDs) — ADR-018

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-meta-game-001 | meta-game | Reputation formula (goals/ranking/years/idols) | ADR-018 |
| TR-meta-game-002 | meta-game | Agency tier progression and demotion | ADR-018 |
| TR-meta-game-003 | meta-game | Season-scoped goals with evaluation | ADR-018 |
| TR-planning-001 | planning | Seasonal planning with budget allocation | ADR-018 |
| TR-planning-002 | planning | Risk register with probability/impact | ADR-018 |
| TR-planning-003 | planning | Milestone tracking with deadlines | ADR-018 |
| TR-player-events-001 | player-events | 5 event types with cost/scale/revenue | ADR-018 |
| TR-player-events-002 | player-events | Guest acceptance based on tier and relations | ADR-018 |
| TR-post-debut-001 | post-debut | 3 graduation ceremony types with fame boosts | ADR-018 |
| TR-post-debut-002 | post-debut | Ex-idols generate job opportunities | ADR-018 |
| TR-post-debut-003 | post-debut | Post-debut fame tracking separate from active | ADR-018 |

### Infrastructure & Visual (23 TR-IDs) — ADR-013, 014, 019, 020

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-main-menu-001 | main-menu | 6-step new game wizard | ADR-013 |
| TR-main-menu-002 | main-menu | Title screen with Continue/New/Load/Settings | ADR-013 |
| TR-main-menu-003 | main-menu | 1 autosave + 3 manual save slots | ADR-013 |
| TR-main-menu-004 | main-menu | Language selection before game data | ADR-013 |
| TR-main-menu-005 | main-menu | SvelteKit route groups for menu/game | ADR-013 |
| TR-main-menu-006 | main-menu | Supabase Auth with Google/Discord/email | ADR-013 |
| TR-main-menu-007 | main-menu | Agency roster init as player idols | ADR-013 |
| TR-messages-001 | messages | 120 message types across 13 categories | ADR-014, ADR-021 |
| TR-messages-002 | messages | 49 action-required messages with CTA | ADR-014 |
| TR-messages-003 | messages | Priority enum drives rendering/notifications | ADR-014 |
| TR-messages-004 | messages | All 13 system sources enqueue asynchronously | ADR-014 |
| TR-messages-005 | messages | 3-month retention with archive | ADR-014, ADR-021 |
| TR-visual-gen-001 | visual-gen | 13+ modular part categories for >10B combinations | ADR-019 |
| TR-visual-gen-002 | visual-gen | Deterministic: PRNG(seed) → same visual every run | ADR-019 |
| TR-visual-gen-003 | visual-gen | 8 age brackets with cross-age consistency | ADR-019 |
| TR-visual-gen-004 | visual-gen | Aging visual scales with stats | ADR-019 |
| TR-tutorial-001 | tutorial | Progressive context-triggered hints | ADR-020 |
| TR-tutorial-002 | tutorial | 3 difficulty levels controlling hint frequency | ADR-020 |
| TR-settings-001 | settings | Theme toggle (light/dark) without restart | ADR-020 |
| TR-settings-002 | settings | Language selection (EN/JA/PT) without restart | ADR-020 |
| TR-settings-003 | settings | Key remapping for all actions | ADR-020 |
| TR-settings-004 | settings | Text scaling for accessibility | ADR-020 |
| TR-settings-005 | settings | High contrast and reduced motion modes | ADR-020 |

### UI Systems (46 TR-IDs) — ADR-006

| TR-ID | System | Requirement (abbreviated) | ADR |
|-------|--------|--------------------------|-----|
| TR-ui-ia-001 | ui-ia | 6 macrodominios with numeric hotkeys | ADR-006 |
| TR-ui-ia-002 | ui-ia | Universal search Ctrl+K | ADR-006 |
| TR-ui-ia-003 | ui-ia | DataTable dense UI component | ADR-006 |
| TR-ui-ia-004 | ui-ia | Sort/filter/keyboard navigation | ADR-006 |
| TR-ui-ia-005 | ui-ia | Avatar visibility rule | ADR-006 |
| TR-ui-ia-006 | ui-ia | Tier badge system | ADR-006 |
| TR-ui-ia-007 | ui-ia | Screen template breadcrumb pattern | ADR-006 |
| TR-ui-ia-008 | ui-ia | Bookmark system Shift+1-12 | ADR-006 |
| TR-ui-ia-009 | ui-ia | Responsive PC-first 1920×1080 | ADR-006 |
| TR-ui-ia-010 | ui-ia | Power user keyboard traversal | ADR-006 |
| TR-ui-dash-001 | ui-dash | Portal load <1s | ADR-006 |
| TR-ui-dash-002 | ui-dash | 3-column Portal layout | ADR-006 |
| TR-ui-dash-003 | ui-dash | Real-time data refresh | ADR-006 |
| TR-ui-dash-004 | ui-dash | Quick navigation hotkeys | ADR-006 |
| TR-ui-idol-001 | ui-idol | Stats radar chart with comparison | ADR-006 |
| TR-ui-idol-002 | ui-idol | Contract/history tab layout | ADR-006 |
| TR-ui-idol-003 | ui-idol | Wellness bar visualization | ADR-006 |
| TR-ui-idol-004 | ui-idol | Development plan integration | ADR-006 |
| TR-ui-idol-005 | ui-idol | Quick actions toolbar | ADR-006 |
| TR-ui-jobs-001 | ui-jobs | 20+ row table <500ms | ADR-006 |
| TR-ui-jobs-002 | ui-jobs | Job requirement matching display | ADR-006 |
| TR-ui-jobs-003 | ui-jobs | Quick assign interaction | ADR-006 |
| TR-ui-jobs-004 | ui-jobs | Filter by type/tier/requirements | ADR-006 |
| TR-ui-results-001 | ui-results | Weekly report summary layout | ADR-006 |
| TR-ui-results-002 | ui-results | Per-idol result cards | ADR-006 |
| TR-ui-results-003 | ui-results | Economy delta visualization | ADR-006 |
| TR-ui-results-004 | ui-results | Event/scandal highlights | ADR-006 |
| TR-ui-news-001 | ui-news | Scrollable feed with filters | ADR-006 |
| TR-ui-news-002 | ui-news | Category color coding | ADR-006 |
| TR-ui-news-003 | ui-news | Importance-based sorting | ADR-006 |
| TR-ui-news-004 | ui-news | Read/unread state tracking | ADR-006 |
| TR-ui-scouting-001 | ui-scouting | Pipeline selection interface | ADR-006 |
| TR-ui-scouting-002 | ui-scouting | Scout report cards with noise | ADR-006 |
| TR-ui-scouting-003 | ui-scouting | Comparison tool for candidates | ADR-006 |
| TR-ui-contract-001 | ui-contract | Clause-by-clause negotiation | ADR-006 |
| TR-ui-contract-002 | ui-contract | Counter-offer visualization | ADR-006 |
| TR-ui-contract-003 | ui-contract | Risk/impact indicators per clause | ADR-006 |
| TR-ui-calendar-001 | ui-calendar | Temporal horizon view | ADR-006 |
| TR-ui-calendar-002 | ui-calendar | Drag-and-drop scheduling | ADR-006 |
| TR-ui-rankings-001 | ui-rankings | 3 parallel rankings visualization | ADR-006 |
| TR-ui-rankings-002 | ui-rankings | Historical trend charts | ADR-006 |

---

## Known Gaps — Suggested ADRs

**None.** All 319 TR-IDs have ADR coverage.

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
| 2026-04-09 | **100% (319/319)** | 20 | +8 Proposed ADRs + 2 amendments. Verdict: PASS |
| **2026-04-11** | **100% (319/319)** | **21** | ADR-021 added; all 21 Accepted; 3 TR texts revised. Verdict: PASS |
