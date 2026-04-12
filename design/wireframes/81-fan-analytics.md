# Wireframe 81 — Fan Analytics

> **Status**: Draft (FM26 UI Standard)
> **Visual Reference**: FM26 Supporter Confidence / Supporter Profile
> **Target Resolution**: 1920×1080 (PC-first)
> **Route**: `/agency/fans/analytics` (per idol or per agency aggregate)
> **GDDs**: fan-club-system.md, audience-system.md
> **ADRs**: ADR-003 (fan club state slice), ADR-004 (fan events), ADR-009 (PR Manager mitigation decisions)
> **IA Nav**: Agency > Fans

---

## Concept

In FM26, **Supporter Confidence** (part of Club Vision) shows how the fanbase reacts to
match performance, transfer activity, tactics, and squad management. It's segmented into
6 supporter categories (Hardcore, Core, Family, Fair Weather, Corporate, Casual), each
with different expectations. A key insight: the board and the supporters have different
priorities — the board cares about objectives, supporters care about identity and
performance against rivals.

In **Star Idol Agency**, this is the **Fan Analytics** screen — per-idol (or per-agency
aggregate) fan club intelligence. It shows 4 segments (Casual/Dedicated/Hardcore/Anti-fan),
demographics (domestic/overseas/age), three core meters (mood/loyalty/toxicity), segment
conversion trends, fandom dynamics (shipping, jealousy, anti-fan campaigns), and revenue
attribution per segment. The goal is to help the producer spot problems before they
explode (toxicity rising, anti-fan campaigns forming) and understand which segment is
driving revenue.

---

## Screen Layout (FM26 Standard)

```text
+--------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Roster | Market | Operations | AGENCY (Active) | Producer    [Search] [>]  |
|--------------------------------------------------------------------------------------------------|
| Finances | Strategy | Staff | Intelligence | Media | FANS (Active) | Goals                       |
|--------------------------------------------------------------------------------------------------|
| Agency > Fans > Fan Analytics: Yamada Rei                                   [Idol ▾] [Agency]    |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - FAN CLUB OVERVIEW (25%) ]    | [ CENTER - SEGMENTS & TRENDS (50%)] | [ RIGHT - RISKS (25%)]|
|                                       |                                     |                       |
| [Avatar 160×200] YAMADA REI           | SEGMENT BREAKDOWN                   | TOXICITY ALERT        |
| Fan Club Size: 245,000               | ┌─────────────────────────────┐     | [██████░░░░] 62% 🟡   |
| Tier: A                              | │ Casual:    55% ████████░░   │     |                       |
|                                       | │ Dedicated: 28% █████░░░░░   │     | Active risks:         |
| CORE METERS                           | │ Hardcore:  12% ███░░░░░░░   │     | • Stalking risk (3    |
| Mood     [████████░░] 72 🟢           | │ Anti-fan:   5% █░░░░░░░░░   │     |   hardcore fans       |
| Loyalty  [███████░░░] 68 🟢           | └─────────────────────────────┘     |   flagged)            |
| Toxicity [██████░░░░] 62 🟡           |                                     | • Cyberbully thread   |
|                                       | CONVERSION TRENDS (last 3 months)   |   on social media     |
| DEMOGRAPHICS                          | Casual → Dedicated:  +2%/mo ▲       |                       |
| Domestic: 72% | Overseas: 28%        | Dedicated → Hardcore: +1%/mo ▲      | PR MITIGATION         |
| <20: 45% | 20-35: 40% | 35+: 15%    | Dedicated → Anti:    +0%/mo —       | [💼 PR Active]        |
|                                       | Hardcore → Casual:   -1%/mo ▼       | Impact reduction: 40% |
| REVENUE ATTRIBUTION (monthly)         |                                     |                       |
| Merch:     ¥12M                      | FANDOM DYNAMICS                     |-----------------------|
| Tickets:   ¥8M                       | 💕 Shipping: Rei×Yumi (active)      | RECENT EVENTS         |
| Streaming: ¥2M                       | 😤 Jealousy: none                   | • Praised live show   |
| Total:     ¥22M/mo                   | 📢 Anti campaign: none              |   (+5 mood)           |
|                                       | 🌍 Overseas boom: trending          | • Dating rumor leak   |
| [Compare with Agency Avg]             |                                     |   (-10 mood, +8 tox)  |
|                                       | SEGMENT-SPECIFIC BEHAVIOR           | • Hardcore group met  |
|                                       | • Casual: buys singles, streams     |   at venue gate       |
|                                       | • Dedicated: concerts, full merch   |   (+2 loyalty)        |
|                                       | • Hardcore: every event, buys 3x    |                       |
|                                       | • Anti-fan: 5% write negative posts | [View event log →]    |
+--------------------------------------------------------------------------------------------------+
```

### State: Agency Aggregate View (Toggle)

```text
+--------------------------------------------------------------------------------------------------+
| Agency > Fans > Fan Analytics: Agency Total                                  [Idol] [Agency ▾]   |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - AGENCY OVERVIEW ]            | [ CENTER - ROSTER FAN BREAKDOWN ]   | [ RIGHT - TOP FLAGS ] |
|                                       |                                     |                       |
| Star Idol Agency                      | IDOL         | SIZE  | MOOD | TOX  | | TOP TOXICITY RISKS    |
| Roster Fans: 1.8M total               |--------------+-------+------+------| | 1. Yamada Rei   62%   |
|                                       | Yamada Rei   | 245k  | 72 🟢 | 62 🟡 | | 2. Aiko Sato    58%   |
| Aggregate Mood:    [████████░░] 68   | Aiko Sato    | 180k  | 61 🟡 | 58 🟡 | | 3. Yumi Tanaka  42%   |
| Aggregate Loyalty: [███████░░░] 65   | Yumi Tanaka  | 120k  | 79 🟢 | 42 🟡 | |                       |
| Aggregate Toxicity:[█████░░░░░] 48   | Haruka Kim   | 85k   | 55 🟡 | 30 🟢 | | TOP FANDOMS (size)    |
|                                       | Miku Hoshi   | 45k   | 82 🟢 | 15 🟢 | | 1. Yamada Rei         |
| SEGMENT ROLLUP (all idols)            | ...                                   | | 2. Aiko Sato          |
| Casual:    58%                       |                                     | | 3. Yumi Tanaka        |
| Dedicated: 26%                       | OVERALL REVENUE BY SEGMENT          | |                       |
| Hardcore:  11%                       | Casual (58%):    ¥18M/mo (bg music) | | ACTIVE CAMPAIGNS      |
| Anti-fan:   5%                       | Dedicated (26%): ¥42M/mo (tickets)  | | • Rei's birthday fund |
|                                       | Hardcore (11%):  ¥68M/mo (merch)    | | • Yumi×Miku pairing   |
|                                       | Anti-fan (5%):   -¥3M/mo (losses)   | |                       |
|                                       | Total:           ¥125M/mo           | | [PR Strategy →]       |
+--------------------------------------------------------------------------------------------------+
```

---

## FM26 Components Applied

### 1. Supporter Profile → Segment Breakdown
FM26 shows fan segments as a categorized breakdown with percentages. Idol Agency uses
the same visual pattern — 4 horizontal bars with percentage labels and visual fill —
but adapted to the 4 idol-specific segments (Casual/Dedicated/Hardcore/Anti-fan).

### 2. Confidence Meters → Mood/Loyalty/Toxicity
FM26's Supporter Confidence is split into performance areas (Match/Transfers/Tactics/
Squad). Idol Agency uses 3 core meters that capture the full state: Mood (how they feel),
Loyalty (how committed), Toxicity (how dangerous). Color coding follows FM26 standard
(green/yellow/red with icons for colorblind compliance).

### 3. Board vs Supporters → Producer vs Fans
FM26 distinguishes board opinion from supporter opinion. Idol Agency doesn't have a
"board" layer for fan analytics, but the analogous pattern appears in the Recent Events
panel — showing what events changed fan metrics, so the producer can see why fans feel
what they feel.

### 4. 3-Column Layout (FM26 Standard)
- **Left (25%)**: Idol overview with core meters, demographics, revenue attribution
- **Center (50%)**: Segment breakdown, conversion trends, fandom dynamics
- **Right (25%)**: Risks, PR mitigation status, recent events

### 5. View Toggle: Per-Idol vs Agency Aggregate
Like FM26's Club Vision → Player-specific views, Idol Agency supports two modes via a
toggle in the breadcrumb area: individual idol analytics or agency-wide aggregate roll-up.
The agency view shows a roster table with fan metrics per idol plus segment revenue totals.

### 6. Fandom Dynamics Panel
Unique to Idol Agency — a panel showing emergent fan behaviors that FM doesn't have:
shipping (fans pairing idols), jealousy (inter-fan-base tension), anti-fan campaigns,
and overseas booms. These are deterministic triggers from fan-club-system.md.

---

## Interactions and Flows

### Screen Entry
1. Via `Agency > Fans` in top nav — defaults to Agency Aggregate view
2. Via idol profile "Fans" tab — opens per-idol view for that idol
3. Via context menu on any idol avatar → "View fan analytics"

### Drill-Down Interactions
1. Click a segment bar → opens detailed segment view (demographics, conversion history)
2. Click a fandom dynamic → opens modal with trigger conditions and current state
3. Click a recent event → navigates to event source (News Feed, Inbox, Show Results)
4. Click "PR Strategy" → opens Agency > Strategy with PR posture highlighted

### Alerts and Warnings
- Toxicity > 60: yellow border + ⚠ badge in top-right
- Anti-fan campaign active: red border + persistent inbox message
- Overseas boom: blue highlight + opportunity notification

### PR Manager Integration
The PR Mitigation panel shows whether a PR Manager is assigned (from staff-functional.md).
Active PR reduces negative event impact by 40% (configurable tuning knob). Without PR:
no reduction, toxicity grows faster.

---

## Acceptance Criteria

1. Three-column layout: idol overview (25%) | segments & trends (50%) | risks (25%)
2. Core meters (mood, loyalty, toxicity) shown as bars with color + numeric value
3. Four-segment breakdown (Casual/Dedicated/Hardcore/Anti-fan) with percentages
4. Conversion trends over last 3 months with directional arrows (▲▼—)
5. Demographics panel (domestic/overseas, age brackets)
6. Revenue attribution breakdown (merch/tickets/streaming) with monthly totals
7. Fandom dynamics panel showing active emergent behaviors
8. Toxicity alerts visible when > 60, with specific risk descriptions
9. PR Mitigation status visible with impact reduction percentage
10. Recent events log with mood/toxicity deltas linked to source
11. View toggle between per-idol and agency aggregate
12. Agency view shows roster table with per-idol fan metrics sortable
13. Agency view shows segment-based revenue totals for all idols
14. All color states have icon + text redundancy for colorblind compliance
15. Screen accessible from top nav, idol profile, and avatar context menu
