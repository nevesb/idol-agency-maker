# Wireframe 86 — Producer Proposals (Agency Job Offers)

> **Status**: Draft (FM26 UI Standard)
> **Visual Reference**: FM26 Job Offer / Manager Approach screen + FM26 Contract Negotiation padlock pattern
> **Target Resolution**: 1920×1080 (PC-first)
> **Route**: `/producer/proposals`
> **GDDs**: agency-meta-game.md (agency switching), player-reputation-affinity.md (reputation requirements), agency-economy.md (offering agency profile)
> **ADRs**: ADR-018 (Meta-Game & Progression — agency switching, reputation thresholds)
> **IA Nav**: Producer > Proposals

---

## Concept

In FM26, high-reputation managers receive unsolicited job offers from clubs via the
**Job Offer / Manager Approach** screen. The offer arrives in the inbox and the manager
can accept, reject, negotiate, or stall a reply. Contract terms can be marked as
non-negotiable with a padlock icon. The right side of the screen shows the offering
club's negotiating style and key context. Rejecting an offer can actually increase the
club's respect for the manager.

In **Star Idol Agency**, this is the **Producer Proposals** screen — a list of pending
rival agency proposals to switch agencies. Per agency-meta-game.md, after 1+ year in
the current role with good reputation, the producer starts receiving offers from other
agencies. Each proposal shows the offering agency's profile (tier, fame, financial
state, current roster), the offered compensation (salary, signing bonus, performance
bonuses), and the new owner's expectations/goals. A right-side comparison panel helps
the producer decide by showing the net impact of accepting vs staying.

When the producer accepts, the agency-switch flow begins: keep reputation, affinity,
titles; leave behind the current roster and contracts. This is one of the most
consequential decisions in the game.

---

## Screen Layout

```text
+--------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Roster | Market | Operations | Agency | PRODUCER (Active)    [Search] [>]  |
|--------------------------------------------------------------------------------------------------|
| Profile | Affinity | History | PROPOSALS (Active) | Ex-Idols                                     |
|--------------------------------------------------------------------------------------------------|
| Producer > Proposals                                                  3 active proposals         |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - PROPOSALS LIST (25%) ]       | [ CENTER - SELECTED PROPOSAL (50%) ]| [ RIGHT - COMPARE (25%)]|
|                                       |                                     |                         |
| ACTIVE PROPOSALS                      | [Logo] CROWN AGENCY                 | YOUR vs CROWN           |
|                                       | "We want you to lead us back to     |                         |
| ● Crown Agency       (1 day ago)      |  the top of Oricon."                | TIER                    |
|   Tier: Major  ▲                      |                                     | Mid → Major  ▲          |
|   Offer: ¥8M/mo  3yr                  | OFFERING AGENCY PROFILE             |                         |
|   Status: 🟢 Strong fit               | Tier:        Major (4)              | RESOURCES               |
|                                       | Owner:       Hiroshi Tanaka         | Roster: 12 → 28 idols   |
|   Toranova Studios   (5 days ago)     | Founded:     2008                   | Budget: ¥85M → ¥320M    |
|   Tier: Mid  ──                       | Reputation:  ★★★★ (84/100)         | Facilities: 6 → 14      |
|   Offer: ¥5M/mo  2yr                  | Current Rank: #6 (was #2 last year) |                         |
|   Status: 🟡 Lateral move              |                                     | EXPECTATIONS            |
|                                       | FINANCIAL STATE                     | Goals: 4/yr → 7/yr      |
|   Aurora Lights      (12 days ago)    | Cash:        ¥420M                  | Patience: Mid → Low     |
|   Tier: Garage  ▼                     | Monthly net: +¥18M                  | Risk: Demanding owner   |
|   Offer: ¥1.5M/mo 1yr                 | Debt:        None                   |                         |
|   Status: 🔴 Downgrade                |                                     | YOUR PROFILE FIT        |
|   ⏰ Expires in 3 days                | CURRENT ROSTER (top 5)              | Reputation match: 91%   |
|                                       | • Reina Aoki (A)                    | Style match:      78%   |
|                                       | • Polaris Stars (group, A)          | Risk tolerance:   ⚠ Low |
| FILTERS                               | • Yuki Tendo (B)                    |                         |
| Status: [All ▾]                       | • Akane Mizuno (B)                  | LEGACY IMPACT           |
| Tier: [Any ▾]                         | • Hoshi Group (group, C)            | Affinity:    KEEP       |
| Sort: [Date ▾]                        |                                     | Reputation:  KEEP       |
|                                       | OFFERED CONTRACT                    | Titles:      KEEP       |
| REPUTATION                            | Salary:        ¥8M/month            | Roster:      LEAVE      |
| Current: 84/100 ★★★★                  | Length:        3 years              |                         |
| Required for Major+: 75               | Signing bonus: ¥30M                 | NET CAREER IMPACT       |
| Required for Elite:  92               | Performance bonuses:                | Step up: 1 tier         |
|                                       | • Top 3 finish: ¥10M                | Risk:    Medium-High    |
|                                       | • Major award: ¥15M                 | Recommended: 🟢 Accept  |
|                                       | • New idol scout: ¥5M               |                         |
|                                       |                                     |                         |
|                                       | OWNER EXPECTATIONS                  |                         |
|                                       | Year 1: Top 5 finish, 1 award       |                         |
|                                       | Year 2: Top 3 finish, 2 awards      |                         |
|                                       | Year 3: #1 ranking OR major award   |                         |
|                                       |                                     |                         |
|                                       | ┌─ Padlocked Terms ─┐               |                         |
|                                       | │ 🔒 Tier            │               |                         |
|                                       | │ 🔒 Length          │               |                         |
|                                       | └────────────────────┘               |                         |
|                                       |                                     |                         |
|                                       | [✓ Accept Offer]  [💬 Negotiate]    |                         |
|                                       | [✗ Decline]      [⏸ Stall reply]    |                         |
+--------------------------------------------------------------------------------------------------+
```

---

## Empty State (No Active Proposals)

```text
+--------------------------------------------------------------------------------------------------+
| Producer > Proposals                                                  0 active proposals         |
+--------------------------------------------------------------------------------------------------+
|                                                                                                   |
|                                  [ icon: empty mailbox ]                                          |
|                                                                                                   |
|                              No proposals at the moment.                                          |
|                                                                                                   |
|     Other agencies will reach out as your reputation grows. Improve your standing by:            |
|                                                                                                   |
|       • Hitting your monthly goals                                                                |
|       • Climbing the agency rankings                                                              |
|       • Accumulating years of experience                                                          |
|       • Developing high-affinity idols                                                            |
|                                                                                                   |
|     Current reputation: 84/100  ★★★★                                                              |
|     Years in current role: 1y 4mo                                                                 |
|     Next milestone: Reputation 92 (unlocks Elite-tier offers)                                    |
|                                                                                                   |
+--------------------------------------------------------------------------------------------------+
```

---

## Accept Confirmation Modal

```text
+--------------------------------------------------------------------------------------------------+
|                         [ MODAL - CONFIRM AGENCY SWITCH ]                                         |
|                                                                                                   |
|  ⚠ This is a major career decision and cannot be undone.                                        |
|                                                                                                   |
|  You are about to leave Star Idol Agency to join Crown Agency.                                   |
|                                                                                                   |
|  WHAT YOU KEEP                                                                                    |
|  ✓ Producer profile (name, traits, styles)                                                       |
|  ✓ Reputation: 84/100                                                                             |
|  ✓ Career history (12 ex-idols, 2 Hall of Fame)                                                  |
|  ✓ Legacy titles earned                                                                           |
|  ✓ Affinity with all current and former idols                                                    |
|                                                                                                   |
|  WHAT YOU LEAVE BEHIND                                                                            |
|  ✗ Star Idol Agency roster (12 idols)                                                            |
|  ✗ Active contracts and obligations                                                              |
|  ✗ Star Idol Agency facilities and staff                                                         |
|  ✗ Pending events and music projects                                                             |
|                                                                                                   |
|  WHAT YOU GAIN                                                                                    |
|  ✓ Crown Agency roster (28 idols, including Reina Aoki and Polaris Stars)                       |
|  ✓ ¥320M starting budget                                                                          |
|  ✓ 14 facilities                                                                                  |
|  ✓ ¥30M signing bonus + ¥8M/month salary                                                         |
|                                                                                                   |
|  AFFINITY PRESERVATION                                                                            |
|  Your former Star Idol Agency idols will remember you. Their affinity transfers but you no       |
|  longer manage them directly. They may appear as ex-idols in WF-85 over time.                    |
|                                                                                                   |
|  Type "ACCEPT" to confirm:  [_____________]                                                      |
|                                                                                                   |
|                                            [Cancel]  [Confirm Switch]                            |
+--------------------------------------------------------------------------------------------------+
```

---

## FM26 Components Applied

### 1. Job Offer / Manager Approach → Proposal List
FM26 receives club approaches via the inbox with a dedicated job offer screen. Idol
Agency adapts this with a persistent Proposals tab in the Producer domain, listing all
active offers with status indicators (🟢 strong fit / 🟡 lateral / 🔴 downgrade) and
expiration warnings.

### 2. Padlock Non-Negotiable Terms → Padlocked Terms Box
FM26 lets players mark contract terms as non-negotiable with a padlock icon. The
offering agency uses the same pattern to mark terms they refuse to negotiate (in this
example: tier and contract length). The padlocked terms box shows what's locked before
the producer enters negotiation.

### 3. Negotiation Style Side Panel → Owner Profile + Expectations
FM26's contract negotiation shows the staff member's negotiating style on the right.
Idol Agency replaces this with the offering agency's owner profile and stated
expectations (Year 1, 2, 3 goals). This helps the producer judge if the owner is
demanding, patient, or unrealistic.

### 4. Job Reputation Filter → Reputation Required Hint
FM26 shows reputation requirements for jobs (e.g. "World Class"). Idol Agency's left
panel always shows the producer's current reputation alongside the threshold for the
next tier of offers (Major+ requires 75, Elite requires 92).

### 5. Side-by-Side Compare → YOUR vs OFFERED Panel
FM26 doesn't have a built-in vs panel for job offers but the Player Comparison view
follows this layout. Idol Agency adapts it as the right column: tier change, resources
delta, expectations delta, profile fit %, legacy impact, and a recommended action.

### 6. Confirmation Type-to-Confirm Pattern
For irreversible high-stakes actions (FM26 uses confirmation dialogs but not type-to-
confirm), Idol Agency requires the producer to type "ACCEPT" before switching agencies.
This prevents accidental career-ending clicks.

### 7. 3-Column Layout (FM26 Standard)
- **Left (25%)**: Active proposals list with status badges + filters + reputation panel
- **Center (50%)**: Selected proposal detail with full agency profile and offer terms
- **Right (25%)**: YOUR vs OFFERED comparison and recommendation

---

## Interactions and Flows

### Screen Entry
1. Via top nav: `Producer > Proposals` (badge shows count if active proposals exist)
2. Via inbox message: "Crown Agency wants to offer you a job"
3. Via context menu on a rival agency in Market > Rivals → "Check job offers"

### Proposal States
- **Active**: Within response window (default 14 days), pending player decision
- **Stalled**: Player chose "Stall reply" — offer remains open but agency loses patience
- **Negotiating**: Player chose "Negotiate" — counter-proposal flow active (max 2 rounds)
- **Expired**: Response window closed without action — offer withdrawn, reputation -2
- **Declined**: Player rejected — offer withdrawn, may improve agency respect

### Accept Flow
1. Click "Accept Offer" → opens confirmation modal
2. Modal shows what is kept, lost, and gained
3. Player must type "ACCEPT" to confirm
4. On confirmation: agency-switch flow begins
5. Save state branches: legacy save preserved, new save created for new agency
6. Producer profile, reputation, affinity, titles transfer to new save
7. Old agency continues as NPC-led rival

### Negotiate Flow
1. Click "Negotiate" → opens negotiation modal
2. Player can adjust non-padlocked terms (salary, signing bonus, performance bonuses)
3. Maximum 2 counter-proposal rounds
4. Each round may improve or worsen acceptance odds
5. After 2 rounds, must accept the final terms or decline

### Decline Flow
1. Click "Decline" → confirmation prompt
2. On confirm: offer withdrawn, agency notified
3. Possible reputation outcomes:
   - Polite decline: agency respect +5 (may re-offer in 6 months)
   - Direct decline: no change
   - Aggressive decline: agency respect -10 (no future offers)
4. Player chooses tone via radio buttons in the confirmation prompt

### Stall Reply
- Player can stall once per offer
- Adds 7 days to the response window
- Agency patience drops; if patience reaches zero, offer auto-expires
- Useful for waiting on other offers to compare

### Reputation Thresholds (Per agency-meta-game.md)
- Reputation < 30: only Garage tier offers (downgrades only)
- Reputation 30-50: Small + occasional Mid offers
- Reputation 50-75: Mid + occasional Large offers
- Reputation 75-92: Large + Major offers (lateral or step-up)
- Reputation 92+: Elite offers (top of the industry)

---

## Acceptance Criteria

1. Three-column layout: proposal list (25%) | selected proposal detail (50%) | comparison (25%)
2. Proposal list shows offering agency name, time received, tier, offer summary, status badge
3. Status badges: 🟢 strong fit / 🟡 lateral / 🔴 downgrade
4. Expiration timer visible for proposals approaching deadline
5. Center panel shows full agency profile (tier, owner, founded, reputation, rank, financials, top roster)
6. Center panel shows offered contract (salary, length, bonuses) with padlocked term icons
7. Center panel shows owner expectations broken down by year
8. Right panel shows YOUR vs OFFERED comparison (tier, resources, expectations, profile fit, legacy impact)
9. Right panel shows recommended action with reasoning
10. Action buttons: Accept Offer, Negotiate, Decline, Stall reply
11. Empty state explains how to attract proposals
12. Reputation thresholds visible in left panel (current reputation + next tier requirement)
13. Accept flow opens confirmation modal with type-to-confirm "ACCEPT" gate
14. Modal explicitly lists what is kept (reputation, affinity, titles) vs lost (roster, contracts)
15. Negotiate flow allows up to 2 counter-proposal rounds on non-padlocked terms
16. Decline flow offers tone choice (polite/direct/aggressive) with different reputation impact
17. Screen accessible from top nav, inbox messages, and rival agency context menus




