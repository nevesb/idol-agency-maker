# Wireframe 80 — Contract Negotiation

> **Status**: Draft (FM26 UI Standard)
> **Visual Reference**: FM26 Contract Offer Screen (Suggest Terms / Mood Gauge / Clauses)
> **Target Resolution**: 1920×1080 (PC-first)
> **Route**: `/agency/market/negotiate/:idolId`
> **GDDs**: contract-system.md, ui-contract-negotiation.md
> **ADRs**: ADR-003 (ContractsSlice state), ADR-004 (contract events), ADR-009 (NPC negotiation decisions)
> **IA Nav**: Market > Transfers > Negotiation

---

## Concept

In FM26, the **Contract Offer** screen is where the Manager sets each contract clause:
wage, duration, bonuses, release clause. The player clicks "Suggest Terms" and the game
pre-fills reasonable values. A **mood gauge** shows in real-time how the player will react
to the offer. The player's agent appears at the top with contextual dialogue.

In **Star Idol Agency**, this is the **Clause-by-Clause Contract Negotiation** screen.
There are 9 idol-specific clauses (duration, salary, revenue share, exclusivity, workload
cap, image rights, rescission fee, dating restriction, mandatory rest). FM26's mood gauge
becomes a **real-time acceptance percentage** that recalculates on every adjustment.
"Suggest Terms" becomes **Auto-Fill** which populates the idol's preferences guaranteeing
>90% acceptance. Up to 3 counter-proposal rounds are supported.

---

## Screen Layout (FM26 Standard)

```text
+--------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Roster | MARKET (Active) | Operations | Agency | Producer    [Search] [>]  |
|--------------------------------------------------------------------------------------------------|
| Scouting | Market | Shortlist | TRANSFERS (Active) | Rivals                                     |
|--------------------------------------------------------------------------------------------------|
| Market > Transfers > Contract Negotiation: Yamada Rei                                            |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - IDOL PROFILE (25%) ]         | [ CENTER - 9 CLAUSES (50%) ]    | [ RIGHT - IMPACT (25%)] |
|                                       |                                 |                         |
| [Avatar 160×200] YAMADA REI           | ┌─────────────────────────────┐ | ACCEPTANCE CHANCE       |
| ★ Tier: A  |  Age: 17                | │ ● DURATION                 │ | [████████░░] 87% 🟢     |
| Archetype: Ace                        | │ [6m] [1y ●] [2y] [3y]      │ |                         |
|                                       | │ Requested: 1 year           │ | Recalculates in real    |
| STATS SUMMARY (top 4)                 | ├─────────────────────────────┤ | time on every clause    |
| Vocal:    82 [████████░░]             | │ ● FIXED SALARY              │ | adjustment.             |
| Charisma: 78 [███████░░░]             | │ ├──────●──────────┤ ¥2M    │ |                         |
| Dance:    71 [███████░░░]             | │ Requested: ¥2M  Yours: ¥2M │ | COLOR:                  |
| Aura:     85 [████████░░]             | ├─────────────────────────────┤ | 🟢 >70%  🟡 40-70%      |
|                                       | │ ● REVENUE SHARE             │ | 🔴 <40%                 |
| WELLNESS                              | │ ├────●────────────┤ 25%    │ |                         |
| Happiness: 72 [Green]                | │ Requested: 30% Yours: 25%  │ |-------------------------|
| Stress:    28 [Green]                | │ [-5% acceptance]            │ | LEGAL ADVISORY          |
|                                       | ├─────────────────────────────┤ | [💼 Active: +20%]       |
| CURRENT CONTRACT                      | │ ● EXCLUSIVITY               │ | If facility hired,      |
| (No contract - Free Agent)           | │ [Yes ●] [No]               │ | +20% acceptance bonus.  |
|                                       | ├─────────────────────────────┤ |                         |
| AFFINITY WITH PRODUCER                | │ ● MAX WORKLOAD (jobs/week)  │ |-------------------------|
| [████████░░] 75 (Good)               | │ [3] [4] [5●] [6] [7]      │ | ESTIMATED MONTHLY COST  |
|                                       | ├─────────────────────────────┤ | Salary:      ¥2.0M     |
| PRODUCER TRAIT                        | │ ● IMAGE RIGHTS              │ | Revenue ~:   ¥0.5M     |
| 🎯 Talent Builder                     | │ [Full●] [Partial] [Restr.] │ | Total:       ¥2.5M/mo  |
| (+10% base acceptance)               | ├─────────────────────────────┤ |                         |
|                                       | │ ● RESCISSION FEE            │ |-------------------------|
|                                       | │ ├──────●──────────┤ ¥20M   │ | COMPETITION             |
|                                       | ├─────────────────────────────┤ | ⚠ Crown Agency is also  |
|                                       | │ ● DATING RESTRICTION        │ | negotiating with        |
|                                       | │ [Yes] [No ●]               │ | Yamada Rei.             |
|                                       | ├─────────────────────────────┤ |                         |
|                                       | │ ● MANDATORY REST            │ | ROUND                   |
|                                       | │ [0] [1●] [2] [3] days/week │ | Round 1 of 3            |
|                                       | └─────────────────────────────┘ |                         |
|                                       |                                 |                         |
|                                       | [🤖 Auto-Fill]  [📤 Propose]    |                         |
+--------------------------------------------------------------------------------------------------+
```

### State: Counter-Proposal (After Rejection)

```text
+--------------------------------------------------------------------------------------------------+
| Market > Transfers > Counter-Proposal: Yamada Rei (Round 2 of 3)                                 |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - PROFILE ]                    | [ CENTER - COUNTER-PROPOSAL ]   | [ RIGHT - IMPACT ]      |
|                                       |                                 |                         |
| (same left column)                    | ┌─────────────────────────────┐ | ACCEPTANCE CHANCE       |
|                                       | │ ❌ REJECTED                  │ | [██████░░░░] 62% 🟡     |
|                                       | │ "Yamada wants better revenue │ |                         |
|                                       | │  share and more rest days." │ | IDOL'S CHANGES:         |
|                                       | ├─────────────────────────────┤ | Revenue: 25% → 28%     |
|                                       | │ Adjusted clauses highlighted│ | Rest: 1 → 2 days       |
|                                       | │ in 🟡 yellow                 │ |                         |
|                                       | │                             │ | [Accept counter]        |
|                                       | │ 3. REVENUE SHARE            │ | [Adjust & re-propose]   |
|                                       | │ ├──────●──────────┤ 🟡28%   │ | [Walk away]             |
|                                       | │ Requested: 28%  Prev: 25%  │ |                         |
|                                       | │                             │ |                         |
|                                       | │ 9. MANDATORY REST           │ |                         |
|                                       | │ [0] [1] [2●] [3] 🟡         │ |                         |
|                                       | │ Requested: 2   Prev: 1     │ |                         |
|                                       | └─────────────────────────────┘ |                         |
+--------------------------------------------------------------------------------------------------+
```

---

## FM26 Components Applied

### 1. Mood Gauge → Acceptance Percentage
In FM26, the mood gauge is a colored bar reflecting the player's reaction to the offer.
In Idol Agency, we replace it with a precise number (0-100%) with color coding
(green/yellow/red). It recalculates instantly on every clause click, using the
contract-system.md formula (per-clause acceptance × affinity and legal advisory modifiers).

### 2. Suggest Terms → Auto-Fill
In FM26, "Suggest Terms" asks the game for a reasonable proposal. In Idol Agency,
"Auto-Fill" populates all 9 clauses with the idol's declared preferences, guaranteeing
>90% acceptance. The casual player clicks Auto-Fill and confirms. The hardcore player
adjusts each slider seeking the optimal combination.

### 3. Agent Dialogue → Requested vs Yours (Inline)
In FM26, the player's agent appears with speech bubbles at the top. In Idol Agency,
we eliminate the separate dialogue — each clause shows inline "Requested: X | Yours: Y"
with the difference highlighted. Changes that reduce acceptance appear in red with the
delta shown (e.g., [-5%]).

### 4. Clause Tiles (3-Column Standard)
Each of the 9 clauses is an independent tile/card in the center. Controls vary by type:
- **Segmented buttons**: Duration, Exclusivity, Workload, Image Rights, Dating, Rest
- **Sliders**: Salary, Revenue %, Rescission Fee

### 5. Counter-Proposal Flow (FM26 Back-and-Forth)
In FM26, players reject and make counter-proposals. In Idol Agency, after rejection,
the screen switches to "Counter-Proposal" mode — clauses the idol adjusted are highlighted
in yellow with "Requested: [new] | Previous: [yours]". Maximum 3 rounds. If a rival is
competing, a competition badge appears in the right column.

### 6. Profile in Left Column (FM26 Player Overview)
In FM26, the sidebar shows photo, position, key attributes. In Idol Agency, the left
column shows avatar, tier, archetype, summary stats, wellness, current contract, affinity
with producer, and producer trait (which affects acceptance chance).

---

## Interactions and Flows

### Screen Entry
1. Player clicks "Propose contract" from idol profile, market, or scouting
2. System auto-fills 9 clauses with idol preferences (Auto-Fill active by default)
3. Acceptance chance shows >90% initially

### Negotiation Flow
1. Player adjusts clauses → acceptance recalculates in real time
2. Player clicks "Propose" → system evaluates acceptance
3. If accepted: confirmation screen with signed contract summary
4. If rejected: screen switches to counter-proposal mode (round 2)
5. Player accepts counter, adjusts and re-proposes, or walks away
6. Maximum 3 rounds. After 3 rejections: negotiation terminated

### Rival Competition
- If another agency is negotiating simultaneously: ⚠ badge in right column
- If rival makes a better offer: message "Crown Agency offered ¥2.5M/month"
- Player can match/beat or walk away

---

## Acceptance Criteria

1. 9 editable clauses with appropriate controls (sliders and segmented buttons)
2. Acceptance chance (0-100%) recalculates in real time on every clause adjustment
3. Chance color: green (>70%), yellow (40-70%), red (<40%)
4. Auto-Fill populates idol preferences (>90% chance) with one click
5. "Requested vs Yours" visible inline per clause
6. Legal Advisory badge with +20% when facility is active
7. Total monthly cost calculated and updated in real time
8. Counter-proposal works up to 3 rounds with adjusted clauses highlighted
9. Rival competition badge visible when another agency is negotiating
10. 3-column layout: profile (25%) | clauses (50%) | impact (25%)
11. Left column shows stats, wellness, affinity, and producer trait
12. Screen accessible from idol profile, market, and scouting
