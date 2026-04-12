# Wireframe 84 — Create Event Wizard

> **Status**: Draft (FM26 UI Standard)
> **Visual Reference**: FM26 Arrange Friendly + FM26 Pre-Season Tour Selection + existing WF-02 (New Game Wizard)
> **Target Resolution**: 1920×1080 (PC-first)
> **Route**: `/agency/operations/events/create`
> **GDDs**: player-created-events.md, agency-economy.md (cost), schedule-agenda.md (lineup availability), market-transfer.md (rival artist invites)
> **ADRs**: ADR-018 (Meta-Game & Progression — player events), ADR-009 (NPC artist accept/refuse decisions)
> **IA Nav**: Operations > Events > Create

---

## Concept

In FM26, the **Arrange Friendly** screen is a lightweight dropdown showing potential
opponents organized by reputation, with cost (fee) and income preview. Pre-season tours
are partly board-driven — the board offers the manager a choice of 3 destination options.

In **Star Idol Agency**, this is the **Create Event Wizard** — a multi-step flow where
the producer designs a custom event from scratch. Unlike FM, the producer has full
creative control: event type, venue, lineup, guest artist invitations, production
investment, marketing, ticket pricing. The wizard pattern matches the existing **WF-02
(New Game Wizard)** for project consistency. A persistent summary tile in the top-right
shows running cost / expected revenue / hype as the producer builds the event.

The 5 event types from player-created-events.md drive the wizard's downstream options
(venue size, lineup capacity, guest invite probability, marketing scale).

---

## Wizard Layout — Step 1 of 6: Event Type

```text
+--------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Roster | Market | OPERATIONS (Active) | Agency | Producer    [Search] [>]  |
|--------------------------------------------------------------------------------------------------|
| Job Board | Weekly Agenda | Planning | Results | EVENTS (Active)                                |
|--------------------------------------------------------------------------------------------------|
| Operations > Events > Create Event                                                                |
+--------------------------------------------------------------------------------------------------+
| [ WIZARD PROGRESS ]  [1. Type ●] → [2. Venue] → [3. Lineup] → [4. Guests] → [5. Budget] → [6. Confirm]
+--------------------------------------------------------------------------------------------------+
| STEP 1 OF 6 — EVENT TYPE                                                                          |
|                                                                                                   |
|  Select the type of event you want to create. Each type has different scale, cost and risk.     |
|                                                                                                   |
|  ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐                               |
|  │ 🎤 MINI-LIVE       │ │ 🎸 CONCERT         │ │ 🎪 FESTIVAL        │                               |
|  │ Intimate show      │ │ Standalone concert │ │ Multi-artist event │                               |
|  │                    │ │                    │ │                    │                               |
|  │ Cost:   ¥500K      │ │ Cost:   ¥2M-¥10M   │ │ Cost:   ¥20M-¥100M │                               |
|  │ People: 50-200     │ │ People: 200-2,000  │ │ People: 2k-50k     │                               |
|  │ Risk:   Low ⭐     │ │ Risk:   Medium ⭐⭐ │ │ Risk:   High ⭐⭐⭐  │                               |
|  │ Best for: Rookies  │ │ Best for: Mid-tier │ │ Best for: Elite    │                               |
|  │ [ Select ]         │ │ [ Select ]         │ │ [ Select ]         │                               |
|  └───────────────────┘ └───────────────────┘ └───────────────────┘                               |
|                                                                                                   |
|  ┌───────────────────┐ ┌───────────────────┐                                                      |
|  │ 💬 FAN-MEETING     │ │ 🚌 TOUR            │                                                      |
|  │ Meet & greet       │ │ Multi-city tour    │                                                      |
|  │                    │ │                    │                                                      |
|  │ Cost:   ¥300K      │ │ Cost:   ¥50M+      │                                                      |
|  │ People: 20-100     │ │ People: 10k+/city  │                                                      |
|  │ Risk:   Low ⭐     │ │ Risk:   Very high  │                                                      |
|  │ Best for: Fan base │ │ Best for: Elite    │                                                      |
|  │ [ Select ]         │ │ [ Select ]         │                                                      |
|  └───────────────────┘ └───────────────────┘                                                      |
|                                                                                                   |
|                                                              [Cancel]  [Continue →]              |
+--------------------------------------------------------------------------------------------------+
```

---

## Wizard Layout — Step 2 of 6: Venue Selection

```text
+--------------------------------------------------------------------------------------------------+
| [ WIZARD PROGRESS ]  [1. Type ✓] → [2. Venue ●] → [3. Lineup] → [4. Guests] → [5. Budget] → [6. Confirm]
+--------------------------------------------------------------------------------------------------+
| STEP 2 OF 6 — VENUE                                              [ SUMMARY TILE — top right ]    |
|                                                                  ┌────────────────────────┐     |
| Select a city and venue. Capacity is gated by event type.        │ Type:    Concert       │     |
| Region affects baseline hype and audience reach.                 │ Venue:   (not set)     │     |
|                                                                  │ Total:   ¥2M (rental)  │     |
| ┌─ FILTERS ────────────────────┐                                 │ Revenue: ¥0            │     |
| │ Region:    [All Japan ▾]     │                                 │ Net:     -¥2M          │     |
| │ Capacity:  [200-2000 ▾]      │                                 │ Hype:    ⭐⭐ baseline   │     |
| │ Budget:    [Any ▾]           │                                 └────────────────────────┘     |
| └──────────────────────────────┘                                                                 |
|                                                                                                   |
| AVAILABLE VENUES (matching event type)                                                            |
|                                                                                                   |
| VENUE NAME            | CITY      | CAPACITY | RENTAL FEE | REGION HYPE | AVAILABILITY            |
|-----------------------+-----------+----------+------------+-------------+-------------------------|
| ● Shibuya O-East      | Tokyo     |     1,300| ¥1.8M      | ⭐⭐⭐ Tokyo  | Apr 22-30, May 5-12     |
|   "Indie standard, great acoustics"                                                              |
|-----------------------+-----------+----------+------------+-------------+-------------------------|
|   Akasaka Blitz       | Tokyo     |     1,500| ¥2.2M      | ⭐⭐⭐ Tokyo  | Apr 28, May 8-15        |
|-----------------------+-----------+----------+------------+-------------+-------------------------|
|   Zepp Osaka Bayside  | Osaka     |     2,000| ¥2.0M      | ⭐⭐ Kansai  | Available (most dates)  |
|-----------------------+-----------+----------+------------+-------------+-------------------------|
|   Kobe Chicken George | Kobe      |       400| ¥600K      | ⭐ Kansai   | Available               |
|-----------------------+-----------+----------+------------+-------------+-------------------------|
|   Fukuoka Drum Logos  | Fukuoka   |       500| ¥700K      | ⭐⭐ Kyushu  | Apr 25, May 2-12        |
|                                                                                                   |
| ● = currently selected                                                                            |
|                                                                                                   |
|                                                              [← Back]  [Continue →]              |
+--------------------------------------------------------------------------------------------------+
```

---

## Wizard Layout — Step 3 of 6: Lineup

```text
+--------------------------------------------------------------------------------------------------+
| [ WIZARD PROGRESS ]  [1. Type ✓] → [2. Venue ✓] → [3. Lineup ●] → [4. Guests] → [5. Budget] → [6. Confirm]
+--------------------------------------------------------------------------------------------------+
| STEP 3 OF 6 — LINEUP                                             [ SUMMARY TILE — top right ]    |
|                                                                  ┌────────────────────────┐     |
| Select your idols / groups to perform. Schedule is checked       │ Type:    Concert       │     |
| automatically. Wellness warnings shown inline.                   │ Venue:   Shibuya O-East│     |
|                                                                  │ Lineup:  3 acts        │     |
|                                                                  │ Total:   ¥1.8M         │     |
| ROSTER (drag to slots or click to add)         │ EVENT LINEUP    │ Hype:    ⭐⭐⭐         │     |
|                                                │                  └────────────────────────┘     |
| ┌─────────────────────────────────────────┐    │ ┌──────────────────────────────────────────┐  |
| │ Filter: [All ▾] [Available only ☑]      │    │ │ HEADLINER                                 │  |
| └─────────────────────────────────────────┘    │ │ ● Celestial Nine (group)                  │  |
|                                                │ │   Ready ✓ | Wellness 🟢 | Hype +30%       │  |
| [Avatar] Celestial Nine (group, 9 idols)      │ ├──────────────────────────────────────────┤  |
|   Status: Ready ✓ | Wellness avg 78 🟢       │ │ SUPPORT ACT 1                             │  |
|   Schedule: Free Apr 22                       │ │ ● Sakura Yamada (solo)                    │  |
|                                                │ │   Ready ✓ | Wellness 🟢                  │  |
| [Avatar] Sakura Yamada (solo)                 │ ├──────────────────────────────────────────┤  |
|   Status: Ready ✓ | Wellness 82 🟢            │ │ SUPPORT ACT 2                             │  |
|   Schedule: Free Apr 22                       │ │ ● Aiko Sato (solo)                        │  |
|                                                │ │   ⚠ Wellness 58 🟡 — fatigue risk         │  |
| [Avatar] Aiko Sato (solo)                     │ ├──────────────────────────────────────────┤  |
|   Status: Ready ✓ | Wellness 58 🟡 — fatigue  │ │ + Add another act (max 5)                 │  |
|                                                │ └──────────────────────────────────────────┘  |
| [Avatar] Yumi Tanaka (solo)                   │                                                  |
|   ✗ BLOCKED — Recording session Apr 22         │ COMBINED HYPE: +45%                              |
|                                                │ AUDIENCE PROJECTION: 1,200-1,300                 |
| [+5 more idols ▾]                              │                                                  |
|                                                │                                                  |
|                                                              [← Back]  [Continue →]              |
+--------------------------------------------------------------------------------------------------+
```

---

## Wizard Layout — Step 4 of 6: Guest Artists

```text
+--------------------------------------------------------------------------------------------------+
| [ WIZARD PROGRESS ]  [1 ✓] → [2 ✓] → [3 ✓] → [4. Guests ●] → [5. Budget] → [6. Confirm]          |
+--------------------------------------------------------------------------------------------------+
| STEP 4 OF 6 — GUEST ARTISTS (optional)                           [ SUMMARY TILE — top right ]    |
|                                                                  ┌────────────────────────┐     |
| Invite NPC or rival-agency artists. Famous artists draw          │ Type:    Concert       │     |
| crowds but charge cachet and may refuse if event is too small.  │ Venue:   Shibuya O-East│     |
| Acceptance probability shown per artist.                         │ Lineup:  3 acts        │     |
|                                                                  │ Guests:  1 invited     │     |
| AVAILABLE ARTISTS                                                │ Cachet:  ¥3M           │     |
|                                                                  │ Total:   ¥4.8M         │     |
| ┌──────────────────────────────────────────────────────────┐    │ Hype:    ⭐⭐⭐⭐       │     |
| │ Filters:                                                  │    └────────────────────────┘     |
| │ Tier: [Any ▾]  Region: [Tokyo ▾]  Type: [Solo / Group ▾] │                                    |
| └──────────────────────────────────────────────────────────┘                                    |
|                                                                                                   |
| ARTIST                  | TIER | AGENCY        | CACHET | ACCEPT % | HYPE BONUS                  |
|-------------------------+------+---------------+--------+----------+-----------------------------|
| ● Reina Aoki (solo)     | A    | Crown Agency  | ¥3M    | 85% 🟢   | +20%                        |
|   Pop-rock, mainstream                                                                            |
|-------------------------+------+---------------+--------+----------+-----------------------------|
|   Polaris Stars (group) | A    | Polaris       | ¥6M    | 60% 🟡   | +35%                        |
|   "Rivals — fresh from Oricon top 10"                                                            |
|-------------------------+------+---------------+--------+----------+-----------------------------|
|   Yuuki Tendo (solo)    | B    | Stellar       | ¥1.5M  | 95% 🟢   | +10%                        |
|-------------------------+------+---------------+--------+----------+-----------------------------|
|   Hoshikuzu (group)     | S    | Titan Prod.   | ¥25M   | 15% 🔴   | +60%                        |
|   ⚠ Probably too small for them                                                                   |
|                                                                                                   |
| INVITED                                                                                           |
| ● Reina Aoki — invitation sent | response in 1-2 days                                            |
| [+ Invite another artist (max 3)]                                                                 |
|                                                                                                   |
|                                                              [← Back]  [Continue →]              |
+--------------------------------------------------------------------------------------------------+
```

---

## Wizard Layout — Step 5 of 6: Budget & Marketing

```text
+--------------------------------------------------------------------------------------------------+
| [ WIZARD PROGRESS ]  [1 ✓] → [2 ✓] → [3 ✓] → [4 ✓] → [5. Budget ●] → [6. Confirm]               |
+--------------------------------------------------------------------------------------------------+
| STEP 5 OF 6 — BUDGET & MARKETING                                 [ SUMMARY TILE — top right ]    |
|                                                                  ┌────────────────────────┐     |
| Configure production investment, marketing spend, and ticket     │ Type:    Concert       │     |
| pricing. Each slider adjusts the projected revenue and hype.    │ Venue:   Shibuya O-East│     |
|                                                                  │ Lineup:  3 acts + 1 gst│     |
|                                                                  │ Costs:   ¥9.6M         │     |
| PRODUCTION INVESTMENT                                            │ Revenue: ¥18M-¥22M     │     |
|                                                                  │ Net:     +¥8M-¥12M     │     |
| Stage / Sound        ├─────●──────────┤  ¥1.5M  (Standard)      │ Hype:    ⭐⭐⭐⭐       │     |
| Lighting / Visuals   ├──────●─────────┤  ¥1.2M  (Standard)      │ Success: ~75%          │     |
| Costumes & Props     ├────●───────────┤  ¥800K  (Basic)         └────────────────────────┘     |
|                                                                                                   |
| MARKETING                                                                                         |
|                                                                                                   |
| Pre-event Campaign   ├──────●─────────┤  ¥1.5M  (Mid-tier)                                       |
| Social Media Push    ├────●───────────┤  ¥600K  (Targeted)                                       |
| Press Coverage       ├──●─────────────┤  ¥300K  (Local outlets)                                  |
|                                                                                                   |
| TICKET PRICING                                                                                    |
|                                                                                                   |
| Base Price           ├──────●─────────┤  ¥6,500   (Mid-range)                                    |
| VIP Tier Price       ├──────●─────────┤  ¥18,000  (Premium)                                      |
| VIP Allocation       ├───●─────────────┤ 10%      (130 of 1,300)                                 |
|                                                                                                   |
| FINANCIAL PROJECTION                                                                              |
|                                                                                                   |
| Total Cost:    Venue ¥1.8M + Lineup ¥0 + Cachet ¥3M + Production ¥3.5M + Marketing ¥2.4M = ¥10.7M
| Capacity:      1,300 (Shibuya O-East)                                                            |
| Sell-out odds: 78% based on hype + marketing + lineup                                            |
| Revenue range: ¥15.2M (60% sold) to ¥22.0M (100% sold)                                          |
| Net range:     +¥4.5M to +¥11.3M                                                                 |
|                                                                                                   |
|                                                              [← Back]  [Continue →]              |
+--------------------------------------------------------------------------------------------------+
```

---

## Wizard Layout — Step 6 of 6: Confirm

```text
+--------------------------------------------------------------------------------------------------+
| [ WIZARD PROGRESS ]  [1 ✓] → [2 ✓] → [3 ✓] → [4 ✓] → [5 ✓] → [6. Confirm ●]                     |
+--------------------------------------------------------------------------------------------------+
| STEP 6 OF 6 — CONFIRM EVENT                                                                       |
|                                                                                                   |
|  Final review. Click "Schedule Event" to commit. The event will be added to the calendar and    |
|  marketing will begin immediately.                                                                |
|                                                                                                   |
| ┌─ EVENT SUMMARY ─────────────────────────────────────────────────────────────────────────────┐ |
| │                                                                                              │ |
| │ NAME (auto-generated, click to edit)                                                         │ |
| │ ► Celestial Nine: Spring Live at Shibuya O-East                                              │ |
| │                                                                                              │ |
| │ TYPE: Concert                          DATE: April 22, 2026  (Saturday, week 17)             │ |
| │ VENUE: Shibuya O-East — Tokyo          CAPACITY: 1,300                                       │ |
| │                                                                                              │ |
| │ LINEUP                                                                                       │ |
| │ Headliner:    ● Celestial Nine                                                              │ |
| │ Support 1:    ● Sakura Yamada                                                               │ |
| │ Support 2:    ● Aiko Sato        ⚠ wellness 58 — fatigue risk                               │ |
| │                                                                                              │ |
| │ GUEST ARTISTS                                                                                │ |
| │ ● Reina Aoki (Crown Agency, A-tier) — invitation pending response                            │ |
| │                                                                                              │ |
| │ FINANCIAL PROJECTION                                                                         │ |
| │ Total Cost:       ¥10.7M                                                                     │ |
| │ Expected Revenue: ¥15.2M - ¥22.0M                                                           │ |
| │ Expected Net:     +¥4.5M to +¥11.3M                                                          │ |
| │ Sell-out odds:    78%                                                                         │ |
| │                                                                                              │ |
| │ NON-FINANCIAL IMPACT                                                                         │ |
| │ Fame gain (success):  +180 to +260 per performer                                            │ |
| │ Fan club mood:        +10 to +25                                                            │ |
| │ Producer reputation:  +5 to +15                                                              │ |
| │                                                                                              │ |
| │ RISKS                                                                                        │ |
| │ ⚠ Aiko Sato wellness at 58 — yellow zone                                                    │ |
| │ ⚠ Guest artist response pending — event may need backup if Reina refuses                    │ |
| │                                                                                              │ |
| └──────────────────────────────────────────────────────────────────────────────────────────────┘ |
|                                                                                                   |
|                              [← Back]  [Save as Draft]  [Schedule Event ✓]                       |
+--------------------------------------------------------------------------------------------------+
```

---

## FM26 Components Applied

### 1. Arrange Friendly Pattern → Type Selection (Step 1)
FM26's Arrange Friendly opens with a list of opponents organized by reputation, each
showing fee and projected income. Idol Agency Step 1 uses the same pattern but for
event types — 5 cards each showing cost range, audience scale, risk level, and ideal
use case. Click the card to select.

### 2. Pre-Season Tour Selection → Venue Browser (Step 2)
FM26 boards offer 3 destination options for pre-season tours. Idol Agency Step 2 lets
the producer browse all available venues filtered by event-type capacity, with rental
fee, region hype bonus, and date availability shown inline. Selection is hands-on
rather than board-driven.

### 3. Squad Registration / Match Day Lineup → Lineup Builder (Step 3)
FM26's Squad Registration screen for matches uses a drag-and-drop pattern between
roster and lineup slots with availability checks. Idol Agency Step 3 mirrors this:
roster on left (with wellness + schedule status), event lineup on right (with slot
roles: Headliner / Support 1-N), drag or click to assign.

### 4. Transfer Negotiation Acceptance % → Guest Invitation (Step 4)
FM26 shows acceptance probability on transfer/contract offers. Idol Agency Step 4 uses
the same probability indicator (color-coded green/yellow/red) when inviting NPC or
rival-agency artists. Cachet, hype bonus, and refusal risk shown per artist.

### 5. Contract Slider Cluster → Budget Sliders (Step 5)
FM26's contract negotiation uses sliders for wage, signing-on fee, etc. Idol Agency
Step 5 uses sliders for production investment (Stage/Sound, Lighting, Costumes),
marketing (Campaign, Social, Press), and ticket pricing. The financial projection at
the bottom updates in real time as sliders move.

### 6. Match Preview Card → Confirmation (Step 6)
FM26's Match Preview shows a complete pre-match summary card with squad, opposition,
venue, weather, and predictions. Idol Agency Step 6 uses the same all-in-one card
pattern: name, date, venue, lineup, guests, financial projection, non-financial
impact, and risks. The producer can save as draft or commit.

### 7. Persistent Summary Tile (Top-Right Across Steps 2-5)
A small summary tile in the top-right of every step (after Step 1) tracks the running
state: type, venue, lineup count, total cost, projected revenue, net, hype. This is
the FM26 "card peek" pattern — always-visible context without leaving the current step.

---

## Interactions and Flows

### Wizard Navigation
- Step indicators at the top show current step (●), completed steps (✓), and pending
- Steps must be completed in order; back navigation preserves all previous selections
- Cancel at any step prompts: "Discard event draft?" with confirm/cancel
- "Save as Draft" at Step 6 stores the event as a draft (accessible from Events overview)

### Real-Time Updates
- Step 2 venue selection updates the summary tile cost
- Step 3 lineup additions update audience projection and hype
- Step 4 guest acceptance % updates on artist selection
- Step 5 sliders update revenue range, net, and success odds in real time
- Step 6 final summary card consolidates everything

### Guest Artist Response Flow
- Invitations sent in Step 4 are pending until the next weekly tick
- If accepted: idol joins the event lineup automatically and the event is locked in
- If refused: producer is notified via inbox and can either replace the guest or proceed without
- If a high-tier guest accepts a small event: rare hype boost (×1.5)

### Schedule Conflict Handling
- Step 3 blocks any idol with a scheduling conflict on the event date
- Step 3 shows wellness warnings inline (yellow if <60, red if <40)
- Forcing an unwell idol to perform applies the medical-system.md injury risk modifiers

### Event Persistence
- "Schedule Event ✓" creates the event in the calendar
- Marketing campaign begins immediately (weekly tick deducts costs)
- Inbox notification when guest artists respond
- Event cancellation possible up to 1 week before with cancellation fee

---

## Acceptance Criteria

1. 6-step wizard with persistent progress indicator at top of every step
2. Step 1 shows 5 event type cards (mini-live, concert, festival, fan-meeting, tour)
3. Each event type card shows cost range, audience scale, risk level, and ideal use case
4. Step 2 filters venues by event-type capacity and shows rental fee, region hype, availability
5. Step 3 shows roster on left and lineup slots on right with drag-or-click assignment
6. Step 3 inline wellness warnings (yellow <60, red <40) with schedule conflict blocking
7. Step 4 shows guest artist acceptance probability with cachet and hype bonus
8. Step 4 supports up to 3 guest invitations
9. Step 5 has separate slider clusters for production, marketing, and ticket pricing
10. Step 5 financial projection updates in real time as sliders change
11. Persistent summary tile in top-right of every step (after Step 1) shows running state
12. Step 6 final summary card shows all selections, financial projection, and risks
13. Save as Draft preserves wizard state for later completion
14. Schedule Event commits the event to the calendar and starts marketing immediately
15. Wizard accessible from Operations > Events > Create
16. Guest invitation flow integrates with weekly tick (responses arrive 1-2 days)


