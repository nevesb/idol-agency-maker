# Wireframe 87 — Calendar (Multi-Zoom Real Date View)

> **Status**: Draft (FM26 UI Standard)
> **Visual Reference**: FM26 Calendar Week View + Month View + Portal Calendar Snapshot
> **Target Resolution**: 1920×1080 (PC-first)
> **Route**: `/portal/calendar`
> **GDDs**: ui-calendar-planning.md, time-calendar.md, schedule-agenda.md (week detail), event-scandal-generator.md (event triggers), award-shows.md (fixed industry events)
> **ADRs**: ADR-002 (Simulation Pipeline — weekly tick still canonical), ADR-003 (TimeSlice state)
> **IA Nav**: Portal > Calendar
> **Distinct from**: WF-44 (Weekly Agenda — slot-by-slot work assignment), WF-46 (Calendar Season Planner — strategic season planning board)

> **Note (follow-up)**: This wireframe uses real Gregorian dates (April 22, 2026) instead
> of the week-numbered model. The simulation tick is still weekly per ADR-002 — dates are
> derived from `game_week` + `epoch_date` in the TimeSlice. A small amendment to
> `design/gdd/time-calendar.md` is required to formalize the date-mapping rules
> (week → 7 real dates, year boundary handling, seasonal event anchors).

---

## Concept

In FM26, the calendar has **Week View** (standard weekly schedule) and **Month View**
(day-by-day monthly grid with key events highlighted). FM26 also integrates a **two-week
calendar snapshot** into the Portal home screen for at-a-glance planning. The calendar
uses real dates because football fixtures are tied to actual matchdays.

In **Star Idol Agency**, this is the **Calendar** screen — a standalone multi-zoom view
with 4 zoom levels (Week, Month, Quarter, Year) using real Gregorian dates. The
underlying simulation remains weekly (ADR-002 unchanged), but the UI presents dates
naturally so players can talk about events like "the Tokyo Dome show on April 22"
instead of "week 17". This boosts immersion and makes seasonal events anchor to real
dates (Hanami in late March, Golden Week in early May, Obon in mid-August, Kouhaku on
December 31).

The Calendar is read-mostly: it shows scheduled events (shows, TV slots, awards),
deadlines (contract expirations, submission dates), idol birthdays, World Pack fixed
events, and personal milestones. Click any event for a detail panel with related events
and quick actions. To **edit** the schedule, the player navigates to WF-44 (Weekly
Agenda) for slot-by-slot work assignment.

---

## Screen Layout — Month View (Default Zoom)

```text
+--------------------------------------------------------------------------------------------------+
| [Logo] < >   PORTAL (Active) | Roster | Market | Operations | Agency | Producer    [Search] [>]  |
|--------------------------------------------------------------------------------------------------|
| Overview | Inbox | CALENDAR (Active) | News Site | Reports                                       |
|--------------------------------------------------------------------------------------------------|
| Portal > Calendar > April 2026                  [< Prev] [Today] [Next >]                        |
| Zoom: [Week] [MONTH ●] [Quarter] [Year]                                  [Filters ▾]            |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - SUMMARY (20%) ]              | [ CENTER - CALENDAR GRID (60%) ]    | [ RIGHT - DETAIL (20%)]|
|                                       |                                     |                         |
| THIS MONTH                            | APRIL 2026                          | SELECTED EVENT          |
| 8 events                              |                                     |                         |
| 3 deadlines                           | Sun  Mon  Tue  Wed  Thu  Fri  Sat   | 🏆 Anime Expo Award     |
| 1 contract expiring                   |  29   30   31    1    2    3    4   | Date: Apr 18 (Sat)     |
| 2 birthdays                           |                  🎂   📺           | Type: Industry award    |
|                                       |                  Yumi  Aiko          | Venue: Tokyo Big Sight  |
| BY TYPE                               |                                      |                         |
| 🎤 Shows:        3                    |  5    6    7    8    9   10   11    | DESCRIPTION             |
| 📺 TV Slots:    4                     |             🎂                       | "Major industry award   |
| 🏆 Awards:       1                    |             Sakura                   | for VTuber and idol     |
| 🎂 Birthdays:    2                    |                                      | content. Top 5 finish   |
| ⚠ Deadlines:    3                     | 12   13   14   15   16   17   18    | gives massive fame      |
| 💼 Contracts:    1                    |                  ⚠       🎤  🏆●    | boost."                 |
| 📅 World events: 1                    |                  Sub-    Show Anime  |                         |
|                                       |                  miss    Osaka Expo  | YOUR ELIGIBILITY        |
| FILTERS                               |                  Apr15        Award  | Status: Eligible        |
| Type:    [All ▾]                      |                                      | Best chance: Celestial 9|
| Idol:    [All ▾]                      | 19   20   21   22   23   24   25    | Submission: by Apr 15   |
| Priority:[All ▾]                      |             📅       🎤              |                         |
|                                       |             Earth    Tokyo            | RELATED EVENTS          |
| HIGHLIGHTED                            |             Day      Dome             | • Submission deadline   |
| ⚠ Yamada contract                     |                                      |   Apr 15 ⚠              |
|   expires Apr 28                      | 26   27   28   29   30    1    2    | • Award ceremony Apr 18 |
| 🎂 Sakura's birthday Apr 8            |                  ⚠       📺          | • Results published     |
| 🏆 Anime Expo Apr 18                  |                  Yamada  Reina        |   Apr 19                |
|                                       |                  contract             |                         |
|                                       |                  expires             |-----------------------|
|                                       |                                      | ACTIONS                 |
|                                       | LEGEND                              | [Submit entry]          |
|                                       | 🎤 Show  📺 TV  🏆 Award  ⚠ Deadline | [Set reminder]          |
|                                       | 🎂 Birthday  📅 World event  💼 Cnt  | [View on roster]        |
|                                       | ● = today                            |                         |
+--------------------------------------------------------------------------------------------------+
```

---

## Screen Layout — Week View (Detailed)

The Week view shows 7 days side-by-side with 14 daily slots stacked vertically (matching
the schedule-agenda.md slot model). Read-only — to edit, navigate to WF-44.

```text
+--------------------------------------------------------------------------------------------------+
| Portal > Calendar > Week of April 13-19, 2026                  [< Prev] [Today] [Next >]         |
| Zoom: [WEEK ●] [Month] [Quarter] [Year]                                  [Filters ▾]            |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - WEEK SUMMARY (20%) ]         | [ CENTER - 7-DAY GRID (60%) ]                     | [ DETAIL ]|
|                                       |                                                    |          |
| WEEK OF APR 13-19                     |  Mon 13 │ Tue 14 │ Wed 15 │ Thu 16 │ Fri 17 │ Sat 18 │ Sun 19 │      |
| (Game week 17)                        | ────────┼────────┼────────┼────────┼────────┼────────┼────────|     |
|                                       |  AM     │  AM    │  AM    │  AM    │  AM    │  AM    │  AM    |     |
| Active idols:    8                    | Train   │ Photo  │ ⚠ Sub  │ Recor- │ Re-    │ 🏆     │ Rest   |     |
| Total slots:     14×8 = 112           | (vocal) │ shoot  │   miss │  ding  │ hearse │ Anime  │        |     |
| Allocated:       96                   |         │        │   Apr15│        │        │ Expo   │        |     |
| Free:            16                   | ────────┼────────┼────────┼────────┼────────┼────────┼────────|     |
|                                       |  PM     │  PM    │  PM    │  PM    │  PM    │  PM    │  PM    |     |
| KEY EVENTS                            | Recor-  │ MV     │ Inter- │ Recor- │ Sound  │ Award  │ Rest   |     |
| ⚠ Anime Expo submission Apr 15       | ding    │ shoot  │ view   │  ding  │ check  │ ceremo-│        |     |
| 🏆 Anime Expo award Apr 18            |         │        │        │        │ Tokyo  │ ny     │        |     |
| 📺 Aiko on TV Tue                     |         │        │        │        │ Dome   │        │        |     |
|                                       | ────────┼────────┼────────┼────────┼────────┼────────┼────────|     |
| WELLNESS WARNINGS                     |  Sakura │ Sakura │ Sakura │ Sakura │ Sakura │ Sakura │ Sakura │      |
| 🟡 Aiko stress 72                    |  Yumi   │ Yumi   │ Yumi   │ Yumi   │ Yumi   │ Yumi   │ Yumi   |     |
| 🟡 Yumi fatigue                       |  Aiko 🟡│ Aiko 🟡│ Aiko 🟡│ Aiko 🟡│ Aiko 🟡│ Aiko 🟡│ Rest   |     |
|                                       |  +5     │ +5     │ +5     │ +5     │ +5     │ +5     │        |     |
| [Edit in WF-44 →]                     |                                                    |          |
+--------------------------------------------------------------------------------------------------+
```

---

## Screen Layout — Quarter View

The Quarter view shows 13 weeks (3 months) side-by-side with weekly bars. Each week is
a horizontal strip showing event count and key highlights. Used for medium-term planning.

```text
+--------------------------------------------------------------------------------------------------+
| Portal > Calendar > Q2 2026 (Apr-Jun)                            [< Prev] [Today] [Next >]      |
| Zoom: [Week] [Month] [QUARTER ●] [Year]                                  [Filters ▾]            |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - QUARTER SUMMARY (20%) ]      | [ CENTER - 13-WEEK STRIP (60%) ]            | [ DETAIL ]  |
|                                       |                                              |             |
| Q2 2026 (Apr-Jun)                     | APRIL                                         |             |
| 24 events                             |                                              |             |
| 8 deadlines                           | Apr 1-5    │ ─────────────  ▌▌  3 events    |             |
| 4 contracts expiring                  | Apr 6-12   │ ────  ▌  2 events  🎂 Sakura    |             |
| 3 birthdays                           | Apr 13-19  │ ──────────────  ▌▌▌▌▌ 5 events 🏆|             |
|                                       | Apr 20-26  │ ──────────  ▌▌▌  3 events       |             |
| KEY MILESTONES                        | Apr 27-30  │ ───  ▌  1 event  ⚠ Yamada exp  |             |
| 🌸 Hanami Festival (Apr 5)            |                                              |             |
| 🏆 Anime Expo (Apr 18)                | MAY                                           |             |
| ⚠ Yamada contract (Apr 28)           |                                              |             |
| 🎌 Golden Week (May 1-5)              | May 1-5    │ ───────  ▌▌▌▌  4 events 🎌      |             |
| 🌧 Rainy season starts (Jun 5)        | May 6-12   │ ──────  ▌▌  2 events            |             |
|                                       | May 13-19  │ ─────────  ▌▌▌  3 events        |             |
| BUDGET WINDOW                         | May 20-26  │ ───────  ▌▌  2 events           |             |
| Q2 marketing: ¥45M                    | May 27-31  │ ───  ▌  1 event                 |             |
| Spent: ¥18M / Avail: ¥27M             |                                              |             |
|                                       | JUNE                                          |             |
|                                       |                                              |             |
|                                       | Jun 1-7    │ ─────  ▌  1 event              |             |
|                                       | Jun 8-14   │ ────────  ▌▌  2 events          |             |
|                                       | Jun 15-21  │ ─────────  ▌▌▌  3 events        |             |
|                                       | Jun 22-30  │ ──────────  ▌▌▌  3 events ⚠ Aiko|             |
|                                       |                                              |             |
|                                       | ▌ = event marker (color by type)            |             |
+--------------------------------------------------------------------------------------------------+
```

---

## Screen Layout — Year View (Seasonal Cycle)

The Year view shows all 12 months as wide horizontal strips with seasonal cycle
annotations. Used for long-term planning and identifying recurring industry patterns.

```text
+--------------------------------------------------------------------------------------------------+
| Portal > Calendar > 2026                                          [< Prev] [Today] [Next >]      |
| Zoom: [Week] [Month] [Quarter] [YEAR ●]                                  [Filters ▾]            |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - YEAR SUMMARY (15%) ]   | [ CENTER - 12-MONTH STRIP (65%) ]                | [ DETAIL ]  |
|                                 |                                                   |             |
| 2026 OVERVIEW                   | 🌸 SPRING (Mar-May) — New start, recruitment      |             |
| 124 events                      |                                                   |             |
| 32 deadlines                    | Jan │ ──────────  4 events  🎍 New Year           |             |
|                                 | Feb │ ─────────  3 events  💝 Valentine's        |             |
| 4 SEASONAL ANCHORS              | Mar │ ────────────  6 events  🌸 Hanami           |             |
| 🌸 Hanami (Mar-Apr)             | Apr │ ────────────────  8 events  🏆 Anime Expo  |             |
| 🎌 Golden Week (May)            | May │ ──────────────  6 events  🎌 Golden Week  |             |
| 🎆 Obon (Aug)                  |                                                   |             |
| 🎄 Christmas/Year-end (Dec)     | ☀ SUMMER (Jun-Aug) — Festival season               |             |
|                                 |                                                   |             |
| KEY INDUSTRY EVENTS             | Jun │ ─────────  3 events  🌧 Rainy season       |             |
| 📅 Anime Expo (Apr)             | Jul │ ────────────────  8 events  🌊 Beach idol  |             |
| 📅 TIF Tokyo (Aug)              | Aug │ ────────────────────  10 events  🎆 Obon  |             |
| 📅 Comiket (Aug, Dec)           |                                                   |             |
| 📅 Year-End Awards (Nov)        | 🍂 AUTUMN (Sep-Nov) — Awards season                |             |
| 📅 Kouhaku (Dec 31)             |                                                   |             |
|                                 | Sep │ ────────────  6 events  🍁 Tsukimi          |             |
| YOUR MILESTONES                 | Oct │ ──────────  4 events  🎃 Halloween        |             |
| 🎂 5 idol birthdays             | Nov │ ──────────────  6 events  🏆 Year-End Aw  |             |
| 💼 6 contract renewals          |                                                   |             |
| 🎓 1 graduation (Yumi, Nov)     | ❄ WINTER (Dec-Feb) — Year-end specials            |             |
|                                 |                                                   |             |
|                                 | Dec │ ──────────────────  9 events  🎄 Kouhaku  |             |
|                                 |                                                   |             |
|                                 | Strip width = event density                       |             |
|                                 | Hover any month → quick preview                   |             |
+--------------------------------------------------------------------------------------------------+
```

---

## FM26 Components Applied

### 1. Calendar Week View → Week Zoom (Detailed)
FM26 Week View shows the standard weekly schedule. Idol Agency adapts this with a 7-day
column grid showing 14 daily slots stacked vertically per day. Read-only — editing
happens in WF-44 (Weekly Agenda).

### 2. Calendar Month View → Month Zoom (Default)
FM26 Month View shows day-by-day with events highlighted. Idol Agency uses the same
standard 7-column day grid (Sun-Sat) with event icons in each cell. Real Gregorian
dates throughout — no abstract week numbers in the main grid.

### 3. Portal Calendar Snapshot → Calendar Tab in Portal
FM26 integrates a 2-week snapshot into the Portal home. Idol Agency makes the full
calendar a Portal sub-tab, accessible via `Portal > Calendar`. The Portal Overview
(WF-04) keeps a smaller calendar tile that links here for the full view.

### 4. Tile-and-Card → Event Tiles in Each Day Cell
FM26's tile-and-card system: each event in a day cell is a compact tile with an icon.
Clicking the tile opens the right-column detail card with full info, related events,
and quick actions.

### 5. Read-Only Calendar with Edit Link to Schedule
Like FM26's Calendar (read-only) vs Training Schedule (editable), Idol Agency
separates concerns: WF-87 Calendar is read-mostly, WF-44 Weekly Agenda is the editor.
"Edit in WF-44" link visible in week view summary.

### 6. Real Dates (Gregorian) — Project-Specific Enhancement
FM26 uses real dates because football matches are tied to actual matchdays. Idol Agency
adopts the same approach: events are anchored to real dates. The simulation tick is
still weekly per ADR-002 — dates derive from `game_week` + `epoch_date` in TimeSlice.
Players can now refer to events naturally: "the Tokyo Dome show on April 22".

### 7. 4-Zoom Toggle (FM26 Calendar Modes Extended)
FM26 has Week and Month modes. Idol Agency extends to 4: Week (detailed), Month
(default), Quarter (medium-term), Year (seasonal cycle). The toggle persists across
sessions per user preference.

---

## Interactions and Flows

### Zoom Navigation
- 4 zoom levels via toggle: Week / Month / Quarter / Year
- Default zoom: Month (matches FM26 default)
- Zoom level persisted per user in localStorage
- `[< Prev]` `[Today]` `[Next >]` buttons step through the current zoom unit

### Date Display
- All dates shown in real Gregorian format: "April 22, 2026" or "Apr 22 (Sat)"
- Year-overview tooltip shows the corresponding game week ("Week 17 of Year 3")
- Hover any date → tooltip with day-of-week and game week

### Event Click Behavior
1. Click any event tile → right detail panel populates
2. Detail shows: type, date, venue, description, eligibility, related events, actions
3. Action buttons navigate to relevant screens (event creation, roster, contracts)
4. ESC or click outside → closes detail panel

### Filters
- Type filter: shows/hides specific event types (shows, TV, awards, deadlines, birthdays, world events, contracts)
- Idol filter: shows only events involving a specific idol
- Priority filter: urgent / important / normal / info
- Filters persist per user across sessions

### Highlighted Events (Left Panel)
- Auto-highlights upcoming critical events (deadlines, contract expirations, birthdays in next 14 days)
- Click highlighted item → jumps the calendar to that date and selects the event

### Cross-Zoom Navigation
- Click a day in Month view → switches to Week view for that week
- Click a week strip in Quarter view → switches to Week view for that week
- Click a month in Year view → switches to Month view for that month

### World Pack Events
- Fixed seasonal events (Hanami, Golden Week, Obon, Kouhaku) load from the World Pack
- Marked with 📅 icon and special background tint
- Some are submission deadlines for industry events (Anime Expo, TIF, Year-End Awards)

### Birthday Events
- Auto-generated for every active idol on their birth date
- Show 🎂 icon
- Click → opens idol profile with birthday options (gift, special message, party event)

---

## Acceptance Criteria

1. Three-column layout: summary (15-20%) | calendar grid (60-65%) | detail (20%)
2. 4 zoom levels: Week, Month, Quarter, Year — switchable via toggle
3. Default zoom: Month
4. All dates displayed in real Gregorian format (e.g. "April 22, 2026")
5. Today indicator (●) visible at every zoom level
6. Month view: standard 7-column day grid (Sun-Sat) with event icons per day
7. Week view: 7-day columns with 14 daily slot rows (matching schedule-agenda.md)
8. Quarter view: 13-week horizontal strips with event count and key highlights
9. Year view: 12 months grouped by season with seasonal anchor events visible
10. Click any event → right detail panel with full info and quick actions
11. Filters: type, idol, priority, persisted per user
12. Cross-zoom navigation: clicking a day/week/month drills into the next zoom level
13. World Pack fixed events visible at every zoom (Hanami, Golden Week, Obon, Kouhaku)
14. Idol birthdays auto-generated and visible at every zoom
15. Highlighted upcoming critical events listed in left panel with click-to-jump
16. "Edit in WF-44" link visible in week view summary (read-mostly principle)
17. Wellness warnings visible inline in week view (yellow if <60, red if <40)
18. Screen accessible from top nav (Portal > Calendar) and Portal Overview calendar tile

---

## Open Question — GDD Amendment Required

The `time-calendar.md` GDD currently uses week-numbered dates only. To support real
Gregorian dates in the UI, the GDD needs a small amendment:

- Add an `epoch_date` field (e.g. "2024-01-01") that maps `game_week=1` to a real date
- Define week → 7 dates mapping (Mon-Sun or Sun-Sat — recommend Sun-Sat for Japan)
- Define year boundary handling (52 weeks × 7 days = 364 days; 1-day buffer per year)
- Define seasonal event anchors: Hanami (Mar 25-Apr 10), Golden Week (May 1-5),
  Obon (Aug 13-15), Kouhaku (Dec 31)

The simulation pipeline (ADR-002) does NOT change — the tick is still weekly. Only the
display layer derives dates from `game_week` + `epoch_date`. Recommend creating a
follow-up issue or running `/quick-design` for the time-calendar.md amendment.


