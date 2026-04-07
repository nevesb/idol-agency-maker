# Systems Index: Idol Agency

> **Status**: Designed
> **Created**: 2026-03-28
> **Last Updated**: 2026-04-04
> **Source Concept**: design/gdd/game-concept.md

---

## Overview

Idol Agency is a deep management simulation with 64 identified systems spanning
simulation, economy, AI, UI, management, and meta-game. The core loop revolves around
contracting idols, assigning them to jobs, simulating weekly results, and managing
consequences (happiness, fame, finances, scandals). Systems are deeply
interconnected -- contract clauses affect happiness, happiness affects job
performance, job performance affects fame, fame affects contract demands.

The game pillars (Simulation Depth > Rankings > Emergent Drama) drive priority:
Foundation data systems first, then simulation core, then presentation and polish.

---

## Systems Enumeration

| # | System Name | Category | Priority | Status | Design Doc | Depends On |
|---|-------------|----------|----------|--------|------------|------------|
| 1 | Idol Attribute/Stats System | Core | MVP | Designed | design/gdd/idol-attribute-stats.md | (none) |
| 2 | Idol Database & Generator | Core | MVP | Designed | design/gdd/idol-database-generator.md | Stats System |
| 3 | Time/Calendar System | Core | MVP | Designed | design/gdd/time-calendar.md | (none) |
| 4 | Agency Economy | Economy | MVP | Designed | design/gdd/agency-economy.md | Time/Calendar |
| 5 | Contract System | Gameplay | MVP | Designed | design/gdd/contract-system.md | Stats System, Agency Economy |
| 6 | Happiness & Wellness | Gameplay | MVP | Designed | design/gdd/happiness-wellness.md | Stats System |
| 7 | Fame & Rankings | Progression | MVP | Designed | design/gdd/fame-rankings.md | Stats System, Idol Database |
| 8 | Market/Transfer System | Economy | MVP | Designed | design/gdd/market-transfer.md | Idol Database, Agency Economy |
| 9 | Job Assignment & Simulation | Gameplay | MVP | Designed | design/gdd/job-assignment.md | Stats System, Fame, Happiness |
| 10 | Schedule/Agenda Management | Gameplay | MVP | Designed | design/gdd/schedule-agenda.md | Job Assignment, Happiness, Time/Calendar |
| 11 | Week Simulation Engine | Core | MVP | Designed | design/gdd/week-simulation.md | Schedule, Job Assignment, Happiness, Fame, Economy, Time/Calendar |
| 12 | Rival Agency AI (basic) | AI | MVP | Designed | design/gdd/rival-agency-ai.md | Market/Transfer, Job Assignment, Economy, Idol Database |
| 13 | Save/Load System | Persistence | MVP | Designed | design/gdd/save-load.md | All data systems |
| 14 | Agency Dashboard UI | UI | MVP | Designed | design/gdd/ui-dashboard.md | Economy, Schedule, Rankings |
| 15 | Idol Profile UI | UI | MVP | Designed | design/gdd/ui-idol-profile.md | Stats, Happiness, Contract, Fame |
| 16 | Job Board UI | UI | MVP | Designed | design/gdd/ui-job-board.md | Job Assignment, Stats |
| 17 | Week Results UI | UI | MVP | Designed | design/gdd/ui-week-results.md | Week Simulation Engine |
| 18 | Scouting & Recruitment | Gameplay | MVP | Designed | design/gdd/scouting-recruitment.md | Market/Transfer, Economy, Idol Database |
| 19 | Contract System (full clauses) | Gameplay | Vertical Slice | Designed | design/gdd/contract-system.md | Contract System (basic) |
| 20 | Event/Scandal Generator | Gameplay | Vertical Slice | Designed | design/gdd/event-scandal-generator.md | Happiness, Fame, Contract, Time/Calendar |
| 21 | Group Management | Gameplay | Vertical Slice | Designed | design/gdd/group-management.md | Stats System, Contract, Fame |
| 22 | News Feed & Media | Gameplay | MVP | Designed | design/gdd/news-feed.md | Fame, Event/Scandal, Job Assignment |
| 23 | Financial Reporting | Economy | Vertical Slice | Designed | design/gdd/financial-reporting.md | Economy, Time/Calendar |
| 24 | Scouting UI | UI | MVP | Designed | design/gdd/ui-scouting.md | Scouting & Recruitment |
| 25 | Contract Negotiation UI | UI | Vertical Slice | Designed | design/gdd/ui-contract-negotiation.md | Contract System (full) |
| 26 | News Feed UI | UI | Vertical Slice | Designed | design/gdd/ui-news-feed.md | News Feed & Media |
| 27 | Agency Meta-Game | Progression | Alpha | Designed | design/gdd/agency-meta-game.md | Economy, Fame, Financial Reporting |
| 28 | Player-Created Events | Gameplay | Alpha | Designed | design/gdd/player-created-events.md | Economy, Fame, Schedule |
| 29 | Player Reputation & Affinity | Progression | Alpha | Designed | design/gdd/player-reputation-affinity.md | Happiness, Contract |
| 30 | Fan Club System | Gameplay | Alpha | Designed | design/gdd/fan-club-system.md | Fame, Happiness, Event/Scandal |
| 31 | Idol Lifecycle & Ecosystem | Core | Alpha | Designed | design/gdd/idol-lifecycle.md | Time/Calendar, Stats, Fame, Happiness |
| 32 | Procedural Visual Generator | Core | Alpha | Designed | design/gdd/visual-generator.md | Idol Database |
| 33 | Rankings UI | UI | Alpha | Designed | design/gdd/ui-rankings.md | Fame & Rankings |
| 34 | Calendar/Planning UI | UI | Alpha | Designed | design/gdd/ui-calendar-planning.md | Time/Calendar, Schedule |
| 35 | Post-Debut Career System | Gameplay | Full Vision | Designed | design/gdd/post-debut-career.md | Idol Lifecycle, Job Assignment |
| 36 | Tutorial/Onboarding | Meta | Full Vision | Designed | design/gdd/tutorial-onboarding.md | All core systems and UI |
| 37 | Settings & Accessibility | Meta | Full Vision | Designed | design/gdd/settings-accessibility.md | (none gameplay) |
| 38 | Music Charts System | Economy | Vertical Slice | Designed | design/gdd/music-charts.md | Agency Economy, Time/Calendar, Contract, Fame |
| 39 | Media Entities System | Gameplay | Vertical Slice | Designed | design/gdd/media-entities.md | Idol Database, Time/Calendar, Agency Economy |
| 40 | Idol Personal Finance System | Economy | Alpha | Designed | design/gdd/idol-personal-finance.md | Contract, Happiness, Agency Economy |
| 41 | Agency Staff & Operations | Gameplay | MVP | Designed | design/gdd/agency-staff-operations.md | Agency Economy, Week Simulation |
| 42 | Agency Strategy (Direção Estratégica) | Gameplay | MVP | Designed | design/gdd/agency-strategy.md | Agency Economy, Week Simulation |
| 43 | Agency Intelligence & Reports | Gameplay | MVP | Designed | design/gdd/agency-intelligence-reports.md | Agency Economy, Happiness, Week Simulation, Job Assignment |
| 44 | Talent Development Plans | Gameplay | Vertical Slice | Designed | design/gdd/talent-development-plans.md | Stats System, Happiness, Week Simulation |
| 45 | Idol Archetypes & Roles | Core | Vertical Slice | Designed | design/gdd/idol-archetypes-roles.md | Stats System |
| 46 | Agency Planning Board | Gameplay | Alpha | Designed | design/gdd/agency-planning-board.md | Time/Calendar, Agency Meta-Game, Agency Intelligence |
| 47 | Roster Balance & Composition | Gameplay | Alpha | Designed | design/gdd/roster-balance.md | Idol Archetypes, Stats System |
| 48 | UI Information Architecture | UI | MVP | Designed | design/gdd/ui-information-architecture.md | All UI systems |
| 49 | Character Generation (ComfyUI) | Core | Alpha | Designed | design/gdd/character-generation.md | Idol Database, Supabase Storage |
| 50 | Producer Profile | Meta | MVP | Designed | design/gdd/producer-profile.md | Stats System (idol personality) |
| 51 | Main Menu & Game Flow | Meta | MVP | Designed | design/gdd/main-menu-flow.md | Save/Load, Producer Profile, i18n |
| 52 | Show System | Core | MVP | Designed | design/gdd/show-system.md | Setlist, Music Entities, Stats, Audience, Staff Functional |
| 53 | Music Entities | Core | MVP | Designed | design/gdd/music-entities.md | Stats System |
| 54 | Setlist System | Gameplay | MVP | Designed | design/gdd/setlist-system.md | Music Entities, Show System, Stats |
| 55 | Audience System | Gameplay | MVP | Designed | design/gdd/audience-system.md | Show System, Fan Club, Fame |
| 56 | Staff Functional System | Gameplay | MVP | Designed | design/gdd/staff-functional.md | Staff Operations, Producer Profile, Economy |
| 57 | Music Production Pipeline | Economy | Vertical Slice | Designed | design/gdd/music-production.md | Music Charts, Music Entities, Staff Functional, Schedule |
| 58 | Costume & Wardrobe | Gameplay | Alpha | Designed | design/gdd/costume-wardrobe.md | Show System, Staff Functional, Economy |
| 59 | Pre-Show Briefing | Gameplay | Alpha | Designed | design/gdd/pre-show-briefing.md | Show System, Happiness, Stats (hidden) |
| 60 | Dialogue System | Gameplay | Vertical Slice | Designed | design/gdd/dialogue-system.md | Player Reputation, Happiness, Stats (hidden) |
| 61 | Award Shows | Gameplay | Alpha | Designed | design/gdd/award-shows.md | Fame, Music Charts, Economy, Calendar |
| 62 | Merchandising Production | Economy | Alpha | Designed | design/gdd/merchandising-production.md | Fan Club, Economy, Fame |
| 63 | Medical System | Gameplay | Vertical Slice | Designed | design/gdd/medical-system.md | Happiness & Wellness, Stats, Staff Functional |
| 64 | Stage Formations | Gameplay | Alpha | Designed | design/gdd/stage-formations.md | Show System, Group Management |

---

## Categories

| Category | Description | Systems |
|----------|-------------|---------|
| **Core** | Foundation systems everything depends on | Stats, Database/Generator, Time/Calendar, Week Simulation, Lifecycle, Visual Generator, Idol Archetypes, **Show System**, **Music Entities** |
| **Gameplay** | Systems that make the game fun | Contract, Job Assignment, Schedule, Scouting, Happiness, Events, Groups, Player Events, Fan Clubs, Post-Debut, Media Entities, Agency Staff, Agency Strategy, Agency Intelligence, Talent Development, Agency Planning Board, Roster Balance, **Setlist System**, **Audience System**, **Staff Functional**, **Costume & Wardrobe**, **Pre-Show Briefing**, **Dialogue System**, **Award Shows**, **Medical System**, **Stage Formations** |
| **Economy** | Resource creation and consumption | Agency Economy, Market/Transfer, Financial Reporting, Music Charts, Idol Personal Finance, **Music Production Pipeline**, **Merchandising Production** |
| **Progression** | How the player grows over time | Fame & Rankings, Agency Meta-Game, Player Reputation |
| **AI** | Non-player decision-making | Rival Agency AI |
| **Persistence** | Save state and continuity | Save/Load System |
| **UI** | Player-facing information displays | Dashboard, Profile, Job Board, Results, Scouting, Contract, News, Rankings, Calendar |
| **Meta** | Systems outside the core game loop | Tutorial, Settings & Accessibility |

---

## Priority Tiers

| Tier | Definition | Systems | Count |
|------|------------|---------|-------|
| **MVP** | Core loop functional: contract → assign → simulate → consequences + staff, strategy, intelligence + scouting, news, producer profile, main menu | #1-17, #18, #22, #24, #41-43, #50-56 | 28 |
| **Vertical Slice** | Complete experience: full contracts, drama, groups, development, archetypes, music production, dialogue, medical | #19-21, #23, #25-26, #38-39, #44-45, #57, #60, #63 | 14 |
| **Alpha** | All features present: meta-game, events, lifecycle, visuals, planning, roster, costumes, briefing, awards, merch, formations | #27-34, #46-47, #58-59, #61-62, #64 | 15 |
| **Full Vision** | Polish: post-debut, tutorial, settings | #35-37 | 3 |

---

## Dependency Map

### Foundation Layer (no dependencies)

1. **Idol Attribute/Stats System** — Defines the 16 visible + 6 hidden attributes, traits, vocal profile, TA/PT system, 9 tier ranges. Everything that evaluates an idol needs this.
2. **Time/Calendar System** — Week/month/season/year progression. Controls when everything happens. Three modes: Live/Pause/Skip.

### Core Layer (depends on foundation)

3. **Idol Database & Generator** — ~5,000+ idols with seed-fixed generation. Depends on Stats System for attribute generation.
4. **Agency Economy** — Budget, revenue, expenses, salary payments. Depends on Time/Calendar for monthly cycles.
5. **Happiness & Wellness** — Health, happiness, stress, motivation bars. Depends on Stats System (resilience attributes).
6. **Fame & Rankings** — Individual/group/agency rankings, 9 tiers (F→SSS). Depends on Stats, Idol Database.
7. **Contract System** — 9 negotiable clauses, auto-fill, duration/salary/restrictions. Depends on Stats, Economy.
8. **Market/Transfer System** — Pool of available idols, proposals, buyouts. Depends on Idol Database, Economy.

### Feature Layer (depends on core)

9. **Job Assignment & Simulation** — Match idol to job requirements, simulate with variance. Depends on Stats, Fame, Happiness.
10. **Schedule/Agenda Management** — Weekly allocation with color-coded workload. Depends on Job Assignment, Happiness, Time/Calendar.
11. **Rival Agency AI** — 50 AI agencies competing for idols and jobs. Depends on Market, Job Assignment, Economy, Idol Database.
12. **Week Simulation Engine** — **BOTTLENECK**: Orchestrates everything per week. Depends on Schedule, Jobs, Happiness, Fame, Economy, Time/Calendar.
13. **Event/Scandal Generator** — Random events based on idol state. Depends on Happiness, Fame, Contract, Time/Calendar.
14. **Scouting & Recruitment** — 5 pipelines (street, audition, festival, online, transfer). Depends on Market, Economy, Idol Database.
15. **Group Management** — Form/dissolve groups, group rankings. Depends on Stats, Contract, Fame.
16. **News Feed & Media** — Tiered news feed (TV → blogs). Depends on Fame, Events, Jobs.
17. **Financial Reporting** — Monthly reports, projections. Depends on Economy, Time/Calendar.
18. **Agency Meta-Game** — Owner goals, agency switching. Depends on Economy, Fame, Financial Reporting.
19. **Player-Created Events** — Festivals, tours. Depends on Economy, Fame, Schedule.
20. **Player Reputation & Affinity** — Bond with idols, rehiring bonus. Depends on Happiness, Contract.
21. **Fan Club System** — Fans react to decisions, grow/shrink. Depends on Fame, Happiness, Events.
22. **Idol Lifecycle & Ecosystem** — Aging, debut, post-debut. Depends on Time/Calendar, Stats, Fame, Happiness.

### Show/Performance Layer (v2 — central system cluster)

30. **Show System** — The "match engine". Processes shows song by song with performance, audience, production. Depends on Setlist, Music Entities, Stats, Audience, Staff Functional.
31. **Music Entities** — Songs as mechanical entities with performance requirements + reception potential. Depends on Stats.
32. **Setlist System** — Buildable setlists with pacing, mastery, 3 rehearsal types. Depends on Music Entities, Show System, Stats.
33. **Audience System** — Dynamic audience engagement per song, lightstick distribution, encore. Depends on Show System, Fan Club, Fame.
34. **Staff Functional System** — Functions as real operations, producer substitution, stage staff hybrid (NPCs + production packages). Depends on Staff Operations, Producer Profile, Economy.

### Management Layer (new — FM gap analysis)

23. **Agency Staff & Operations** — Staff with attributes, delegation system. Depends on Economy, Week Simulation.
24. **Agency Strategy** — Strategic direction (focus, stance, image, growth). Depends on Economy, Week Simulation.
25. **Agency Intelligence & Reports** — Analytics, comparisons, predictions. Depends on Economy, Happiness, Week Simulation, Job Assignment, all data systems.
26. **Talent Development Plans** — Development stages, quarterly plans, mentoring. Depends on Stats, Happiness, Week Simulation.
27. **Idol Archetypes & Roles** — 12 formal archetypes derived from stats. Depends on Stats.
28. **Agency Planning Board** — Long-term planning, seasonal calendar, risk tracking. Depends on Time/Calendar, Meta-Game, Intelligence.
29. **Roster Balance & Composition** — Squad depth analysis, coverage gaps. Depends on Archetypes, Stats.

### Presentation Layer (UI)

23. **Agency Dashboard UI** — Main screen. Depends on Economy, Schedule, Rankings.
24. **Idol Profile UI** — Stats, contract, history. Depends on Stats, Happiness, Contract, Fame.
25. **Job Board UI** — Available jobs with requirements. Depends on Job Assignment, Stats.
26. **Week Results UI** — Weekly report. Depends on Week Simulation Engine.
27. **Scouting UI** — Scout interface. Depends on Scouting & Recruitment.
28. **Contract Negotiation UI** — Clause-by-clause negotiation. Depends on Contract System.
29. **News Feed UI** — Scrollable feed with filters. Depends on News Feed & Media.
30. **Rankings UI** — 3 parallel rankings visualization. Depends on Fame & Rankings.
31. **Calendar/Planning UI** — Temporal horizon view. Depends on Time/Calendar, Schedule.

### Polish Layer

32. **Procedural Visual Generator** — Otome/VTuber style modular generation. Depends on Idol Database.
33. **Post-Debut Career System** — Ex-idols generating jobs. Depends on Lifecycle, Job Assignment.
34. **Save/Load System** — Full state serialization. Depends on all data systems.
35. **Tutorial/Onboarding** — Guide casual players. Depends on all core + UI.
36. **Settings & Accessibility** — Game options. No gameplay dependencies.

---

## Recommended Design Order

| Order | System | Priority | Layer | Est. Effort |
|-------|--------|----------|-------|-------------|
| 1 | Idol Attribute/Stats System | MVP | Foundation | M |
| 2 | Idol Database & Generator | MVP | Foundation | L |
| 3 | Time/Calendar System | MVP | Foundation | S |
| 4 | Agency Economy | MVP | Core | M |
| 5 | Contract System | MVP | Core | M |
| 6 | Happiness & Wellness | MVP | Core | M |
| 7 | Fame & Rankings | MVP | Core | M |
| 8 | Market/Transfer System | MVP | Core | M |
| 9 | Job Assignment & Simulation | MVP | Feature | L |
| 10 | Schedule/Agenda Management | MVP | Feature | M |
| 11 | Week Simulation Engine | MVP | Feature | L |
| 12 | Rival Agency AI (basic) | MVP | Feature | L |
| 13 | Save/Load System | MVP | Persistence | M |
| 14 | Agency Dashboard UI | MVP | Presentation | M |
| 15 | Idol Profile UI | MVP | Presentation | M |
| 16 | Job Board UI | MVP | Presentation | M |
| 17 | Week Results UI | MVP | Presentation | M |
| 17.1 | Agency Staff & Operations | MVP | Management | L |
| 17.2 | Agency Strategy | MVP | Management | M |
| 17.3 | Agency Intelligence & Reports | MVP | Management | L |
| 18 | Scouting & Recruitment | V. Slice | Feature | M |
| 19 | Contract System (full clauses) | V. Slice | Feature | M |
| 20 | Event/Scandal Generator | V. Slice | Feature | L |
| 21 | Group Management | V. Slice | Feature | M |
| 22 | News Feed & Media | V. Slice | Feature | M |
| 23 | Financial Reporting | V. Slice | Feature | S |
| 24 | Scouting UI | V. Slice | Presentation | M |
| 25 | Contract Negotiation UI | V. Slice | Presentation | M |
| 26 | News Feed UI | V. Slice | Presentation | S |
| 26.1 | Talent Development Plans | V. Slice | Management | M |
| 26.2 | Idol Archetypes & Roles | V. Slice | Core | M |
| 27 | Agency Meta-Game | Alpha | Feature | M |
| 28 | Player-Created Events | Alpha | Feature | M |
| 29 | Player Reputation & Affinity | Alpha | Feature | S |
| 30 | Fan Club System | Alpha | Feature | M |
| 31 | Idol Lifecycle & Ecosystem | Alpha | Feature | L |
| 32 | Procedural Visual Generator | Alpha | Core | L |
| 33 | Rankings UI | Alpha | Presentation | S |
| 34 | Calendar/Planning UI | Alpha | Presentation | M |
| 34.1 | Agency Planning Board | Alpha | Management | M |
| 34.2 | Roster Balance & Composition | Alpha | Management | M |
| 35 | Post-Debut Career System | Full Vision | Feature | M |
| 36 | Tutorial/Onboarding | Full Vision | Polish | M |
| 37 | Settings & Accessibility | Full Vision | Polish | S |

---

## Circular Dependencies

- **Fame ↔ Job Assignment**: Jobs affect fame; fame determines which jobs appear.
  **Resolution**: Fame is calculated after job resolution. Jobs read the ranking
  from the previous tick.

- **Happiness ↔ Schedule**: Schedule affects happiness; happiness limits schedule
  (idol refuses overwork). **Resolution**: Schedule checks happiness at allocation
  time; happiness updates after week simulation.

- **Rival AI ↔ Market**: AI acts on the market; market feeds AI decisions.
  **Resolution**: Market is the data layer; Rival AI is a consumer. Market updates
  first, AI decides second.

---

## High-Risk Systems

| System | Risk Type | Risk Description | Mitigation |
|--------|-----------|-----------------|------------|
| Idol Database & Generator | Technical + Scope | 5,000+ deterministic idols with balanced stats across 9 tiers. Seed-fixed generation must produce consistent, believable results | Prototype generator early. Validate stat distributions with spreadsheet simulation |
| Week Simulation Engine | Technical | Orchestrates all systems simultaneously. Bottleneck — 8+ systems depend on it. Performance with 3,000 active idols | Design as event pipeline. Profile early on PC target hardware (Web Workers) |
| Rival Agency AI | Design + Technical | 50 AI agencies must feel convincing without being computationally expensive. Bad AI breaks immersion | Start with simple heuristic AI (MVP). Layer sophistication in later tiers |
| Procedural Visual Generator | Technical | Otome/VTuber quality from modular parts. Must produce 5,000+ unique, appealing visuals | Prototype the part-composition system early. Define minimum part count for variety |
| Idol Attribute/Stats System | Design | 16+6 attributes + traits + vocal profile with TA/PT and 9 tiers. Balance between tiers, growth rates, and age curves is foundational — errors cascade everywhere | Design formulas in spreadsheet first. Simulate 100+ idol careers before coding |
| Show System | Design + Technical | Central system equivalent to FM26 match engine. Processes setlist song by song with audience dynamics. Must feel engaging | Prototype with 3-song setlist first. Validate pacing formula. Test audience engagement curve |

---

## Progress Tracker

| Metric | Count |
|--------|-------|
| Total systems identified | 56 |
| Design docs started | 56 |
| Design docs reviewed | 0 |
| Design docs approved | 0 |
| MVP systems designed | 25/25 ✅ |
| Vertical Slice systems designed | 8/8 ✅ |
| Alpha systems designed | 13/13 ✅ |
| Full Vision systems designed | 3/3 ✅ |

---

## Next Steps

- [ ] Design MVP-tier systems first (use `/design-system [system-name]`)
- [ ] Start with #1: Idol Attribute/Stats System (defines everything downstream)
- [ ] Run `/design-review` on each completed GDD
- [ ] Prototype high-risk systems early (#2 Idol Generator, #32 Visual Generator)
- [ ] Run `/gate-check pre-production` when MVP systems are designed
