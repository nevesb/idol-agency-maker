# Wireframe 85 — Post-Debut Career Tracking

> **Status**: Draft (FM26 UI Standard)
> **Visual Reference**: FM26 Hall of Fame + Player Profile Career History + Scout Network Active Assignments
> **Target Resolution**: 1920×1080 (PC-first)
> **Route**: `/producer/ex-idols`
> **GDDs**: post-debut-career.md, idol-lifecycle.md, player-reputation-affinity.md, fame-rankings.md
> **ADRs**: ADR-018 (Meta-Game & Progression — post-debut careers, ex-idol NPC pool)
> **IA Nav**: Producer > Ex-Idols
> **Distinct from**: WF-67 (History & Archives — static museum view of graduated idols and Hall of Fame)

---

## Concept

In FM26, retired players persist as NPCs and can become coaches, scouts, or pundits.
The closest parallels in FM26 are:
- **Hall of Fame** — worldwide list of legendary retired players
- **Player Profile → Career History** tab — past clubs, trophies, achievements
- **Scout Network** — active assignments showing who is currently doing what
- **Manager Career Achievements** — trophies and milestones earned across the career

In **Star Idol Agency**, this is the **Post-Debut Career Tracking** screen — an active
dashboard listing all ex-idols (graduated/debutadas) who exist as NPCs in the world.
Unlike the static museum view in WF-67, this screen focuses on **what they're doing right
now**: TV programs they host, songs they composed for active idols, current mentees,
guest appearances, and re-engagement opportunities for the producer (hire as composer,
invite as guest, hire as mentor).

The screen distinguishes "your former idols" (high affinity, ⭐ marker) from ex-idols
of other agencies. Each ex-idol has 9 possible career types from the GDD: TV Host,
Producer, Composer, Mentor, Commentator, Entrepreneur, Choreographer, Temporary Return,
or Retired (no active career).

---

## Screen Layout

```text
+--------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Roster | Market | Operations | Agency | PRODUCER (Active)    [Search] [>]  |
|--------------------------------------------------------------------------------------------------|
| Profile | Affinity | History | Proposals | EX-IDOLS (Active)                                     |
|--------------------------------------------------------------------------------------------------|
| Producer > Ex-Idols > Active Careers                       [My Agency ▾] [All Agencies]         |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - FILTERS & SUMMARY (20%) ]    | [ CENTER - EX-IDOLS TABLE (55%) ]   | [ RIGHT - DETAIL (25%)]|
|                                       |                                     |                         |
| FILTERS                               | NAME / AGENCY    | CAREER  | FAME | | SELECTED EX-IDOL        |
| Career: [All ▾]                       |------------------+---------+------| |                         |
| Years since debut: [Any ▾]            | ★ Sakura Yamada  | TV Host |  62 ▼| | [Avatar 160×200]        |
| Affinity: [Any ▾]                     |   Ex-Celestial 9 |         |      | | SAKURA YAMADA           |
|                                       |   Graduated 2024 |         |      | | Ex-Celestial Nine       |
| [⭐ My Agency Only ☑]                 |------------------+---------+------| | Graduated: Dec 2024     |
|                                       | ★ Aiko Sato      | Composer|  78 ●| | (1y 4mo ago)            |
| SUMMARY                               |   Ex-Celestial 9 |         |      | |                         |
| Total Ex-Idols: 8                     |   Graduated 2025 |         |      | | CAREER: TV Host         |
| Currently Active: 6                   |------------------+---------+------| | Fame: 62 (-1%/mo)       |
| Hall of Fame: 2                       | ★ Yumi Tanaka    | Mentor  |  45 ▼| | Affinity: 82 🟢         |
|                                       |   Ex-Celestial 9 |         |      | |                         |
| ACTIVE CAREERS                        |   Graduated 2024 |         |      | | ACTIVE PROJECTS         |
| TV Host:        2                     |------------------+---------+------| | • TV Show "Sakura Live" |
| Composer:       2                     | ★ Haruka Kim     | Producer|  88 ●| |   2 episodes/month      |
| Mentor:         1                     |   Ex-Star Idol   |         |      | |   Audience: 2.1M        |
| Producer:       1                     |   Graduated 2023 |         |      | | • Guest spot offers: 4  |
| Choreographer:  0                     |------------------+---------+------| |                         |
| Commentator:    0                     |   Reina Aoki     | TV Host |  74 ●| | RE-ENGAGEMENT           |
| Entrepreneur:   0                     |   Ex-Crown       |         |      | | Available as:           |
| Temp Return:    0                     |   Graduated 2025 |         |      | | • Guest at your events  |
| Retired:        2                     |------------------+---------+------| |   Cachet: ¥3M           |
|                                       |   Hoshikuzu Lead |Composer |  92 ●| |   Accept odds: 90%      |
| MOVEMENT LEGEND                       |   Ex-Titan Prod  |         |      | |                         |
| ▲ Rising  ▼ Decaying  ● Stable        |   Graduated 2022 |         |      | | • Hire as TV slot       |
|                                       |------------------+---------+------| |   Cost: ¥800k/month     |
|                                       |  ...                                | |   Provides 2 jobs/month |
|                                       |                                     | |                         |
|                                       | Total: 24 ex-idols across all       | |-----------------------|
|                                       | agencies (filter to view subset)    | | LEGACY                  |
|                                       |                                     | | Years active: 12        |
|                                       | ★ = your former idol (high affinity)| | Cumulative fame peak: 92|
|                                       |                                     | | Solo singles: 8         |
|                                       |                                     | | Group singles: 24       |
|                                       |                                     | | Awards won: 6           |
|                                       |                                     | | Total royalties: ¥420M  |
|                                       |                                     | |                         |
|                                       |                                     | |-----------------------|
|                                       |                                     | | ACTIONS                 |
|                                       |                                     | | [💌 Send memory msg]    |
|                                       |                                     | | [🎤 Invite as guest]    |
|                                       |                                     | | [📺 Hire TV program]    |
|                                       |                                     | | [🏆 View Hall of Fame]  |
+--------------------------------------------------------------------------------------------------+
```

---

## Screen Layout — Career Type View (Drill-Down)

When the producer clicks a career category in the left summary panel (e.g. "Composer: 2"),
the center table filters to show only ex-idols of that career type with career-specific
columns (commissions in progress, songs released, fame trajectory).

```text
+--------------------------------------------------------------------------------------------------+
| Producer > Ex-Idols > Active Careers > Composer (2)                  [← Back to all]            |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - FILTERS & SUMMARY (20%) ]    | [ CENTER - COMPOSER LIST (55%) ]    | [ RIGHT - DETAIL (25%)]|
|                                       |                                     |                         |
| CAREER FILTER: Composer ●             | NAME / AGENCY    | TIER | ACTIVE   | | SELECTED COMPOSER       |
| Switch career: [Composer ▾]           |                  |      | PROJECTS | |                         |
|                                       |------------------+------+----------| | [Avatar 160×200]        |
| COMPOSER MARKET                       | ★ Aiko Sato      |  A   | 3        | | AIKO SATO               |
| Active composers: 24                  |   Ex-Celestial 9 |      |          | | Ex-Celestial Nine       |
| Available now: 8                      |   Royalty: 8%    |      |          | | Composer • Tier A       |
| Hired by you: 1                       |------------------+------+----------| |                         |
|                                       |   Hoshikuzu Lead |  S   | 5        | | ACTIVE COMMISSIONS      |
| YOUR COMPOSER ROYALTIES               |   Ex-Titan Prod  |      |          | | • "Spring Memory"       |
| Currently paying: ¥4.2M/mo            |   Royalty: 12%   |      |          | |   Client: Polaris Stars |
| To Aiko Sato: ¥2.5M/mo                |------------------+------+----------| |   Stage: Composing      |
| To Hoshikuzu Lead: ¥1.7M/mo           |   Yuki Tanaka    |  B   | 2        | |   ETA: 3 weeks          |
|                                       |   Ex-Stellar     |      |          | |                         |
| BOOKED PROJECTS WITH EX-IDOLS         |   Royalty: 6%    |      |          | | • "Yume no Kakera"      |
| 2 active commissions                  |------------------+------+----------| |   Client: Crown Agency  |
|                                       |   Hikari Mei     |  C   | 1        | |   Stage: Composing      |
|                                       |   Ex-Polaris     |      |          | |   ETA: 5 weeks          |
|                                       |   Royalty: 5%    |      |          | |                         |
|                                       |------------------+------+----------| | • "Aurora Dreams"       |
|                                       |   Aki Sora       |  C   | 0        | |   Client: YOUR AGENCY ★ |
|                                       |   (available)    |      |          | |   Stage: Recording      |
|                                       |   Royalty: 4%    |      |          | |   Royalty: 8%           |
|                                       |------------------+------+----------| |                         |
|                                       |   ...                                | |-----------------------|
|                                       |                                     | | HIRE FOR NEW COMMISSION |
|                                       | ★ = your former idol                | | Estimated cost: ¥3.5M   |
|                                       |                                     | | Estimated quality: 85   |
|                                       |                                     | | Lead time: 4-6 weeks    |
|                                       |                                     | |                         |
|                                       |                                     | | [🎵 Commission new song]|
|                                       |                                     | | [📊 View past works]    |
+--------------------------------------------------------------------------------------------------+
```

---

## FM26 Components Applied

### 1. Hall of Fame → ⭐ My Former Idols Marker
FM26's Hall of Fame is a worldwide list of legendary retired players. Idol Agency uses
the same persistent NPC concept but with a stronger ownership signal: ex-idols who were
in your roster (high affinity) get a ⭐ prefix and subtle background tint. This reflects
the producer's emotional investment in their former roster.

### 2. Player Profile → Career History → Legacy Panel
FM26's Player Profile has a Career History tab showing past clubs, trophies, and stats.
Idol Agency's right detail panel includes a "Legacy" section with cumulative career
stats: years active, peak fame, singles released, awards won, total royalties paid out.
This is the post-debut equivalent of the player history view.

### 3. Scout Network Active Assignments → Active Projects
FM26's Scout Network shows scouts on assignments with progress and ETAs. Idol Agency's
"Active Projects" panel does the same for ex-idols: TV shows they host, commissions in
progress (for composers), mentees being trained, etc. Each project has status, ETA, and
audience/quality metrics.

### 4. Loan Out / Re-sign Old Player → Re-Engagement
FM26 lets the manager loan out players or re-sign retired squad members. Idol Agency
adapts this with the "Re-Engagement" panel — every ex-idol shows what services they're
available for (guest appearance at events, hiring as TV slot for the agency, commissioning
new compositions, hiring as mentor). Each option shows cost and acceptance odds.

### 5. Career Type Filter Drill-Down (FM26 League Filter)
FM26's Squad/Player views support drill-down filtering by position, age, contract status.
Idol Agency adapts this with the career-type drill-down: clicking "Composer: 2" in the
left summary opens a dedicated view showing only composers with composer-specific columns
(active commissions, royalty rate, tier).

### 6. 3-Column Layout (FM26 Standard)
- **Left (20%)**: Filters, summary counts by career type, agency-wide stats
- **Center (55%)**: Sortable ex-idol table with name, agency, career, fame
- **Right (25%)**: Selected ex-idol detail with career projects, re-engagement, legacy

### 7. Scope Toggle (My Agency vs All Agencies)
Like FM26's "All Players" vs "My Players" toggles, the breadcrumb area has a scope
toggle: "My Agency" (only ex-idols who were in your roster) vs "All Agencies" (all
ex-idols globally). The ⭐ marker is always present to identify former-roster idols
even in the All view.

---

## Interactions and Flows

### Screen Entry
1. Via top nav: `Producer > Ex-Idols`
2. Via WF-67 (Hall of Fame) → "View Active Career" link on a graduated idol
3. Via inbox message: "Sakura Yamada accepted your guest invitation"
4. Via right-click context menu on any ex-idol mention in news/messages

### Filter and Drill-Down
- Click a career category in the left summary → switches center table to filtered view
- Career-specific columns appear in the filtered view (e.g. composers show royalty rate)
- "Back to all" button returns to the main career-agnostic table
- Filters: career type, years since debut, affinity threshold, scope toggle

### Re-Engagement Actions
- **Send memory message**: triggers a positive memory event (affinity +5, dialogue-system.md)
- **Invite as guest**: opens the create-event-wizard (WF-84) with this ex-idol pre-selected
- **Hire TV program**: commits to monthly cost in exchange for 2 recurring job slots/month
- **Commission new song**: opens music-production-pipeline (WF-73) with this composer pre-selected
- **Hire as mentor**: opens roster-development-hub (WF-24) for mentor assignment

### Fame Decay
- Per the GDD: post-debut fame decays at -1%/month
- ▼ arrow appears next to fame for ex-idols who are decaying
- ● appears for stable (active TV/composer careers slow decay)
- ▲ appears rarely for ex-idols experiencing a comeback (Temporary Return career)

### Hall of Fame Crossover
- Ex-idols with cumulative peak fame > 90 are eligible for Hall of Fame status
- "View Hall of Fame" action navigates to WF-67 with this idol's entry highlighted
- Hall of Fame ex-idols are preserved indefinitely even after death/permanent retirement

### Cross-Agency Visibility
- "All Agencies" view shows ex-idols from all 50 rival agencies
- Useful for: spotting collaboration opportunities, scouting mentors, commissioning composers
- Some ex-idols are exclusive to their original agency (won't accept your offers)

---

## Acceptance Criteria

1. Three-column layout: filters/summary (20%) | ex-idols table (55%) | detail panel (25%)
2. Center table sortable by name, career, fame, graduation date, affinity
3. ⭐ prefix and background tint for player's former idols (high affinity)
4. Scope toggle in breadcrumb: "My Agency" vs "All Agencies"
5. Fame trajectory indicators: ▲ rising, ▼ decaying (-1%/mo default), ● stable
6. 9 career types from GDD: TV Host, Producer, Composer, Mentor, Commentator, Entrepreneur, Choreographer, Temporary Return, Retired
7. Left summary shows count per career type — clicking switches to filtered view
8. Career-filtered drill-down view shows career-specific columns (e.g. composer royalty rate)
9. Detail panel shows active projects with status, ETA, audience/quality metrics
10. Re-engagement section shows available services with cost and acceptance odds
11. Legacy panel shows cumulative career stats (years, peak fame, singles, awards, royalties)
12. Action buttons: Send memory msg, Invite as guest, Hire TV slot, Commission song, Hire mentor
13. Action buttons link to other wireframes (WF-84 wizard, WF-73 pipeline, WF-24 dev hub)
14. Hall of Fame eligibility (cumulative peak > 90) shows "View Hall of Fame" link to WF-67
15. Screen accessible from top nav, WF-67, inbox messages, and ex-idol context menus


