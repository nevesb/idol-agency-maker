# Wireframe 83 — Music Charts (Oricon-style Top 100)

> **Status**: Draft (FM26 UI Standard)
> **Visual Reference**: FM26 League Table + Oricon Weekly Singles Chart + Billboard Hot 100 grid design
> **Target Resolution**: 1920×1080 (PC-first)
> **Route**: `/agency/charts` (default Top 100) | `/agency/charts/idol/:id` | `/agency/charts/group/:id`
> **GDDs**: music-charts.md, music-entities.md, fame-rankings.md
> **ADRs**: ADR-008 (Music Production — chart score, decay, royalties), ADR-003 (MusicSlice state)
> **IA Nav**: Agency > Music Charts

---

## Concept

In FM26, the **League Table** is a sortable, pinnable screen showing team standings with
movement indicators, points, and quick drill-down to club detail. Players pin frequently
visited tables to their Portal bookmarks for instant access.

Real-world music references:
- **Oricon Weekly Singles Chart** publishes every Tuesday with rank, peak position, weeks
  on chart, and movement arrows. Free tiers show Top 20/Top 50; full Top 100 is subscription.
- **Billboard Hot 100** uses a grid design with movement arrows (▲▼──), peak position
  columns, weeks-on-chart indicators, and "greatest gainer" badges for rising tracks.

In **Star Idol Agency**, this is the **Music Charts** screen — a monthly Top 100 ranking
of all music entities in the game world. It supports three view modes:

1. **Top 100 (default)** — full chart, all agencies, sortable
2. **By Idol** — single-idol aggregate (all her songs + career chart stats)
3. **By Group** — single-group aggregate (all group songs + career chart stats)

Player-owned entries are highlighted with ⭐ and a subtle background tint. Movement arrows
show week-over-week position changes. The right detail panel shows composition credits,
royalty attribution, chart score trend, and action buttons for re-promotion or airplay.

---

## Screen Layout — Top 100 (Default View)

```text
+--------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Roster | Market | Operations | AGENCY (Active) | Producer    [Search] [>]  |
|--------------------------------------------------------------------------------------------------|
| Finances | Strategy | Staff | Intelligence | Media | Fans | Goals | Merch | CHARTS (Active)      |
|--------------------------------------------------------------------------------------------------|
| Agency > Music Charts > Top 100 Singles              Week of April 13, 2026 [< Prev] [Next >]   |
| View: [TOP 100 ▾] [By Idol] [By Group]                                             [📌 Pin Chart]|
+--------------------------------------------------------------------------------------------------+
| [ LEFT - FILTERS & SUMMARY (20%) ]    | [ CENTER - TOP 100 TABLE (55%) ]    | [ RIGHT - DETAIL (25%)]|
|                                       |                                     |                         |
| CHART FILTERS                         | # | MOV | TITLE / ARTIST   | SCORE | | SELECTED ENTRY          |
| Genre:    [All ▾]                     |---+-----+------------------+-------| |                         |
| Agency:   [All ▾]                     | 1 | ▲+2 | Neon Dreams      | 9,820 | | ★ "Neon Dreams"         |
| Period:   [This Month ▾]              |⭐ |     | Celestial Nine   |       | | Celestial Nine          |
|                                       |---+-----+------------------+-------| | (Your agency)           |
| [⭐ My Agency Only]                   | 2 | ▼-1 | Starlight Dance  | 9,650 | |                         |
|                                       |   |     | Titan Productions|       | | PEAK POSITION #1        |
| SUMMARY                               |---+-----+------------------+-------| | Weeks on chart: 8       |
| Your Top 10 Entries: 3                | 3 | ▲+3 | Rainy Days       | 9,200 | | Debut: Week of Feb 23   |
| Best Position: #1                     |   |     | Crown Agency     |       | | Previous week: #3       |
| Total Royalties: ¥42M/mo              |---+-----+------------------+-------| |                         |
|                                       | 4 | ── | Gold Memories    | 8,950 | | CHART SCORE TREND       |
| MOVEMENT LEGEND                       |   |     | Nebula Group     |       | |   9,820 ▲               |
| ▲ Up  ▼ Down  ── Same  ★ New          |---+-----+------------------+-------| |   9,100                 |
|                                       | 5 | ▲+5 | Yume no Hate     | 8,720 | |   8,400                 |
| CATEGORIES                            |⭐ |     | Celestial Nine   |       | |   7,950                 |
| [Top 100]                             |---+-----+------------------+-------| |   7,200                 |
| [By Genre: Pop]                       | 6 | ▼-2 | Tokyo Nights     | 8,500 | |                         |
| [By Genre: Rock]                      |   |     | Stellar Agency   |       | | COMPOSITION CREDITS     |
| [By Genre: Ballad]                    |---+-----+------------------+-------| | Composer: Sakura ⭐     |
| [By Era]                              | 7 | ── | Last Summer      | 8,300 | | (Your idol)             |
| [All-Time Hits]                       |   |     | Polaris Agency   |       | | Lyrics: NPC — Hikaru    |
|                                       |---+-----+------------------+-------| | Arranger: NPC — Takeda  |
|                                       | ... more rows ...                   | |                         |
|                                       |                                     | | ROYALTIES (monthly)     |
|                                       | 47| ▲+8 | Celestial Echo   | 5,200 | | Composer (idol): ¥4.2M  |
|                                       |⭐ |     | Celestial Nine   |       | | Artist share:    ¥8.4M  |
|                                       |---+-----+------------------+-------| | Agency share:    ¥6.8M  |
|                                       | 48| ▼-5 | Dream Sequence   | 5,100 | |                         |
|                                       |   |     | Polaris Agency   |       | | STATE                   |
|                                       |---+-----+------------------+-------| | Current: 📈 Trending    |
|                                       | ...                                 | | Next tick: Peak         |
|                                       |                                     | |                         |
|                                       | [Showing 1-20 of 100] [Next page →] | |-----------------------|
|                                       |                                     | | ACTIONS                 |
|                                       |                                     | | [🔁 Repromote (+hype)]  |
|                                       |                                     | | [📻 Radio airplay]      |
|                                       |                                     | | [🎬 View music video]   |
+--------------------------------------------------------------------------------------------------+
```

---

## FM26 Components Applied

### 1. League Table Pattern → Top 100 Chart
FM26's League Table is a sortable, pinnable ranked list with movement indicators and
quick drill-down to club detail. Music Charts uses the same pattern: click any column
header to re-sort, use the "📌 Pin Chart" button to bookmark it to the Portal. Each row
is a tile; clicking populates the right detail panel card.

### 2. Billboard Movement Arrows → ▲▼── Indicators
Adapted from Billboard Hot 100's visual grammar: ▲ green for rising, ▼ red for falling,
── grey for stable, ★ gold for new entries. Delta number next to the arrow (▲+2 = rose 2
positions). Color-coded but always paired with icon + number for colorblind compliance.

### 3. Oricon Weekly Tuesday Publishing → Monthly Chart Tick
Oricon publishes new charts every Tuesday. Idol Agency publishes monthly on week 4 of
each in-game month. Player can navigate back/forward through historical charts with
`[< Prev] [Next >]` buttons.

### 4. Tile-and-Card System → Row → Detail Panel
FM26's unified pattern: every row is a compact tile, clicking it opens an expanded card.
Chart rows show minimal info (#, movement, title, artist, score). The right detail panel
shows the full card: peak history, chart score trend mini-chart, composition credits,
royalty breakdown, state, and actions.

### 5. FM26 Discography / Player Record Parallel → By Idol / By Group
In FM26, clicking a player opens their full record including career stats. Idol Agency's
"By Idol" and "By Group" views are the same pattern applied to music career. The left
column becomes the subject overview (avatar, career stats) and the center becomes the
full discography table with peak position and weeks on chart per song.

### 6. Player Highlight ⭐
FM26 visually distinguishes "your team" rows in league tables. Idol Agency uses ⭐ prefix
+ subtle background tint on every player-owned entry. In By Idol / By Group views, every
row is player-owned (filtered by subject), so the ⭐ is just a brand consistency marker.

---

## Interactions and Flows

### View Mode Switching
- View toggle in the top action bar: `[Top 100] [By Idol ▾] [By Group ▾]`
- Switching to By Idol/Group opens a roster picker if no subject is selected
- URL reflects the state: `/agency/charts`, `/agency/charts/idol/:id`, `/agency/charts/group/:id`

### Navigation Between Entries
- In By Idol/Group views, `[< Prev] [Next >]` buttons cycle through all idols/groups
- Prev/Next respects active filters (e.g., "Top 10 idols by fame only")
- Breadcrumb updates to reflect current subject

### Sorting and Filtering (Top 100 view)
- Click column headers to sort: `# | MOV | TITLE | SCORE | PEAK | WEEKS`
- Filters: genre, agency, period
- `⭐ My Agency Only` toggle filters to only player-owned entries
- Default sort: current chart rank ascending

### Historical Navigation
- `[< Prev] [Next >]` at the top switches between month snapshots
- Charts are frozen per month (no retroactive edits)
- Hovering a row in historical view shows "Position on [this week]: #X"

### Action Buttons (right panel)
- **Repromote**: adds pre-release hype multiplier retroactively (costs ¥ from marketing budget)
- **Radio airplay**: purchases radio promotion, boosts chart score over next 2 weeks
- **View music video**: navigates to the music entity's production page (wireframe 73)

---

## Acceptance Criteria

1. Three view modes: Top 100 (default), By Idol, By Group
2. View toggle visible in top action bar with dropdowns for idol/group selection
3. Top 100 view shows sortable columns (#, MOV, TITLE, ARTIST, SCORE, PEAK, WEEKS)
4. Movement arrows (▲▼──★) with color + number for colorblind compliance
5. Player-owned entries highlighted with ⭐ prefix and subtle background tint
6. Right detail panel shows peak history, chart score trend, credits, royalties, state
7. By Idol view shows career stats and full discography for the selected idol
8. By Idol view distinguishes "as performer" vs "as composer" royalty attribution
9. By Group view shows member roster, group career stats, and discography
10. By Group view shows subgroup/duo/solo projects as a separate sub-section
11. Historical chart navigation with [< Prev] [Next >] buttons (monthly snapshots)
12. Filters: genre, agency, period, "My Agency Only" toggle
13. Pin button saves chart/idol/group to Portal bookmarks
14. Action buttons: Repromote, Radio airplay, View music video
15. Screen accessible from top nav, idol profile, group profile, and news feed music entries

---

## Screen Layout — By Group View

```text
+--------------------------------------------------------------------------------------------------+
| Agency > Music Charts > Group Discography: Celestial Nine          [< Prev Group] [Next Group >]|
| View: [Top 100] [By Idol] [BY GROUP ▾: Celestial Nine]                                          |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - GROUP OVERVIEW (25%) ]       | [ CENTER - DISCOGRAPHY (50%) ]      | [ RIGHT - DETAIL (25%)]|
|                                       |                                     |                         |
| [Group Logo 120×120]                  | GROUP DISCOGRAPHY                   | SELECTED ENTRY          |
| CELESTIAL NINE                        |                                     |                         |
| Formed: March 2025 (9 members)        | # | TITLE         | CUR | PEAK | WKS| | ★ "Yume no Hate"        |
|                                       |---+---------------+-----+------+----| | Celestial Nine          |
| MEMBERS                               | 1 | Neon Dreams   |  #1 | #1   | 8  | | Released: Jan 2026      |
| [Avatar] Sakura (Center)              |⭐ |               |     |      |    | | Status: Declining 📉    |
| [Avatar] Aiko (Main Vocal)            |---+---------------+-----+------+----| |                         |
| [Avatar] Yumi (Main Dancer)           | 2 | Yume no Hate  |  #5 | #2   | 12 | | CHART HISTORY           |
| [Avatar] Miku (Support)               |⭐ |               |     |      |    | |                         |
| [+5 more ▾]                           |---+---------------+-----+------+----| |   Peak #2               |
|                                       | 3 | Celestial Echo| #47 | #4   | 22 | |   Current #5 ◄━━━       |
| CAREER STATS                          |⭐ |               |     |      |    | |                         |
| Total Releases:      18               |---+---------------+-----+------+----| |   Week 1: #15           |
| Weeks in Top 100:    102              | 4 | Gold Horizon  | OFF | #12  | 18 | |   Week 4: #8            |
| Best Peak Position:  #1               |⭐ |               |     |      |    | |   Week 8: #2            |
| Songs in Top 10:     4                |---+---------------+-----+------+----| |   Week 10: #3           |
| Cumulative Royalties:¥420M           | 5 | Rainbow Sigh  | OFF | #18  | 9  | |   Week 12: #5 ◄━━━      |
|                                       |⭐ |               |     |      |    | |                         |
| ACTIVE CHART POSITIONS                |---+---------------+-----+------+----| | ROYALTIES (this song)   |
| [████████] 3 songs in Top 100         | ...                                 | | Cumulative: ¥62M        |
|                                       |                                     | | This month: ¥4.1M       |
| GROUP FAMA TREND                      | SUBGROUP PROJECTS                   | |                         |
|    ▲▲▲ (rising)                      |                                     | | GROUP SPLIT             |
| Current: 8,750                        | • Sakura × Aiko duo — "Twin Stars"  | | 9 members × equal %     |
| Peak:    9,100                        |   Peak #6, 2 months ago             | | per-member: ¥0.45M      |
|                                       | • Yumi solo — "Dance of Stars"      | |                         |
| [📌 Pin Group to Bookmarks]          |   Peak #9, 4 months ago             | | GROUP BONUS             |
|                                       |                                     | | Applied ×1.15 (core 5)  |
|                                       |                                     | |                         |
|                                       |                                     | |-----------------------|
|                                       |                                     | | ACTIONS                 |
|                                       |                                     | | [🔁 Repromote]          |
|                                       |                                     | | [📻 Radio airplay]      |
|                                       |                                     | | [🎬 View music video]   |
+--------------------------------------------------------------------------------------------------+
```

---

## Screen Layout — By Idol View

```text
+--------------------------------------------------------------------------------------------------+
| Agency > Music Charts > Idol Discography: Sakura Yamada            [< Prev Idol] [Next Idol >]  |
| View: [Top 100] [BY IDOL ▾: Sakura Yamada] [By Group]                                            |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - IDOL OVERVIEW (25%) ]        | [ CENTER - DISCOGRAPHY (50%) ]      | [ RIGHT - DETAIL (25%)]|
|                                       |                                     |                         |
| [Avatar 160×200] SAKURA YAMADA        | DISCOGRAPHY (all releases)          | SELECTED ENTRY          |
| Celestial Nine • Age 18               |                                     |                         |
|                                       | # | TITLE         | CUR | PEAK | WKS| | ★ "Neon Dreams"         |
| CAREER STATS                          |---+---------------+-----+------+----| | Released: Feb 2026      |
| Total Releases:      12               | 1 | Neon Dreams   |  #1 | #1   | 8  | | Status: Trending 📈     |
| Weeks in Top 100:    47               |⭐ |               |     |      |    | |                         |
| Best Peak Position:  #1               |---+---------------+-----+------+----| | CHART HISTORY           |
| Cumulative Royalties:¥180M           | 2 | Yume no Hate  |  #5 | #2   | 12 | |                         |
|                                       |⭐ |               |     |      |    | |   Peak #1 ◄━━━ current  |
| CURRENT CHART ENTRIES                 |---+---------------+-----+------+----| |   Week 1: #8            |
| [████████████] 3 songs active         | 3 | Celestial Echo| #47 | #4   | 22 | |   Week 2: #5            |
|                                       |⭐ |               |     |      |    | |   Week 3: #3            |
| AS COMPOSER                           |---+---------------+-----+------+----| |   Week 4: #2            |
| Songs composed: 5                     | 4 | Gold Horizon  | OFF | #12  | 18 | |   Week 5: #1            |
| Active as composer for:               |⭐ |               |     |      |    | |   Week 6: #1            |
|  • Celestial Nine (3)                 |---+---------------+-----+------+----| |   Week 7: #1            |
|  • Solo releases (2)                  | 5 | Rainbow Sigh  | OFF | #18  | 9  | |   Week 8: #1 ◄━━━       |
| Composer royalties: ¥12M/mo          |⭐ |               |     |      |    | |                         |
|                                       |---+---------------+-----+------+----| | ROYALTIES (this song)   |
| [⭐ Pin Idol to Bookmarks]           | 6 | Starfall      | OFF | #24  | 11 | | Cumulative: ¥28M        |
|                                       |⭐ |               |     |      |    | | This month: ¥8.2M       |
|                                       |---+---------------+-----+------+----| |                         |
|                                       | ...                                 | | CREDITS                 |
|                                       |                                     | | Composer: Sakura ⭐     |
|                                       | CUR = Current Position              | | Lyrics: NPC — Hikaru    |
|                                       | PEAK = Highest ever reached         | | Arranger: NPC — Takeda  |
|                                       | WKS = Weeks on chart (lifetime)     | |                         |
|                                       |                                     | |-----------------------|
|                                       | [Filter: All | Active | Retired]    | | ACTIONS                 |
|                                       |                                     | | [🔁 Repromote]          |
|                                       |                                     | | [📻 Radio airplay]      |
|                                       |                                     | | [🎬 View music video]   |
+--------------------------------------------------------------------------------------------------+
```

