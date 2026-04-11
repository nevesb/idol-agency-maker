# ADR-017: Economy Extensions — Merchandising, Personal Finance, Financial Reporting, Media Entities

## Status
Accepted

## Date
2026-04-09

## Last Verified
2026-04-09

## Decision Makers
user + architecture-review

## Summary
Four economy-adjacent systems extend ADR-003's EconomySlice without changing
its core architecture. This ADR defines merchandising revenue, idol personal
finance (debt/goals/living standards), financial reporting (ROI/projections),
and media entity economics (show fees, airplay) as sub-domains of the economy.

---

## Engine Compatibility

| Field | Value |
|-------|-------|
| Engine | SvelteKit 2.50 + Svelte 5 |
| Domain | Simulation / Economy |
| Knowledge Risk | LOW |
| Post-Cutoff APIs Used | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| Depends On | ADR-002 (pipeline), ADR-003 (EconomySlice + FameSlice), ADR-004 (events), ADR-008 (music charts for revenue) |
| Enables | Merchandising, personal finance, reporting, and media entity stories |
| Blocks | Economy extension features |

---

## Decision

### Sub-Domain Architecture

All four systems are **consumers and enrichers** of the existing EconomySlice.
They do not create new top-level state slices — they add typed sub-structures
within the existing economy and roster domains.

```
EconomySlice (ADR-003)
├── balanceYen                    # existing
├── ledger: LedgerEntry[]         # existing — 6 revenue + 11 expense
├── monthlyReports: MonthlyReport[]  # existing
├── merchState: MerchState           # NEW (this ADR)
├── financialProjections: Projection[]  # NEW (this ADR)
└── mediaContracts: MediaContract[]     # NEW (this ADR)

RosterSlice (ADR-003)
└── idols[].personalFinance: PersonalFinance  # NEW (this ADR)
```

### Part A: Merchandising Production (TR-merch-001..006)

```typescript
interface MerchState {
  activeMerchLines: MerchLine[];
  weeklySales: Map<string, number>;  // merchId → units sold this week
}

interface MerchLine {
  id: string;
  idolId: string | null;      // null = agency merch
  groupId: string | null;
  type: 'photobook' | 'goods' | 'apparel' | 'digital' | 'collab' | 'graduation';
  productionCostPerUnit: number;
  pricePerUnit: number;
  launchWeek: number;

  // STOCK MANAGEMENT — player must produce stock before selling
  stockProduced: number;       // total units produced (cumulative)
  stockRemaining: number;      // units available for sale
  productionBatchSize: number; // units per production order
  productionLeadWeeks: number; // weeks to produce a batch (1-4)
  pendingProduction: number;   // units currently being produced
  pendingReadyWeek: number | null; // when pending batch finishes

  // Popularity / decay
  popularityBonus: number;     // from active marketing campaigns (0.0-1.0)
  salesDecayRate: number;      // weekly multiplier (e.g. 0.85)
}
```

#### Revenue Model — Two Channels

**Channel 1: Passive Sales** (weekly, fame-driven)
```typescript
// Passive sales happen every week based on idol/group fame
// passive_demand = base_demand × fan_multiplier × fame_modifier × decay × (1 + popularityBonus)
// fan_multiplier: Casual ×0.2, Dedicated ×1.0, Hardcore ×3.0 (from fan-club-system.md)
// fame_modifier: fame / 1000 (capped at 5.0)
// popularityBonus: boosted by marketing campaigns, discounts, public appearances
// ACTUAL SOLD = min(passive_demand, stockRemaining)
// If stockRemaining < passive_demand → "money left on the table"
```

**Channel 2: Show Sales** (per show, audience-budget model)
```typescript
// Each show generates a purchase budget based on audience size
// show_merch_budget = audience_size × MERCH_SPEND_PER_PERSON  // e.g. ¥500/person
//
// Budget allocation:
// 1. Up to 30% of budget goes to GROUP items (if group is performing)
// 2. Remaining 70%+ split among IDOL items proportional to performance score
//    - Idol who performed well → larger share of budget
//    - idolShare = (idol_performance / total_performance) × remaining_budget
//
// For each idol's share:
//   units_demanded = idolShare / pricePerUnit (for each of their merch lines)
//   units_sold = min(units_demanded, stockRemaining)
//   revenue = units_sold × pricePerUnit
//
// This forces the player to:
// - Create merch for ALL performing idols/groups
// - Manage stock levels before shows
// - A popular idol with no stock = lost revenue (budget allocated but nothing to sell)
```

**Pipeline integration:** Phase 3 end-of-week calculates passive merch sales.
Show merch sales are calculated in ADR-007 post-show settlement. Both add
to EconomySlice.ledger under revenue category `merchandising`. Stock is
decremented on sale; production orders advance by 1 week.

### Part B: Idol Personal Finance (TR-idol-finance-001..005)

```typescript
interface PersonalFinance {
  savings: number;             // accumulated from salary
  debt: number;                // accumulated from goals/lifestyle
  livingStandard: 'low' | 'normal' | 'high' | 'luxury';
  activeGoal: LifeGoal | null;
  completedGoals: string[];    // goal IDs
  monthlyExpense: number;      // derived from living standard
}

interface LifeGoal {
  id: string;
  type: 'house' | 'car' | 'surgery' | 'education' | 'family' | 'charity';
  cost: number;
  savedToward: number;
  completionEffect: { stat?: string; delta?: number; happinessDelta: number };
  // e.g. house: +5 happiness permanent; surgery: Visual +5-15 permanent
}
```

**Debt mechanics:**
- Interest: 1%/month on outstanding debt
- Max payment: 30% of monthly income
- Crisis: debt > 3× annual income → living standard auto-downgrades
- Low living standard: -2 to -5 happiness per week

**Pipeline integration:** Phase 3 monthly processing (week 4) updates personal
finance: salary deposits, goal progress, debt interest, living standard adjustment.

### Part C: Financial Reporting (TR-finance-report-001..004)

```typescript
interface FinancialReport {
  month: number;
  year: number;
  revenue: Record<string, number>;     // by category
  expenses: Record<string, number>;    // by category
  netIncome: number;
  idolROI: Map<string, number>;        // idolId → ROI%
  cashProjection: number[];            // next 3 months predicted balance
  alerts: FinancialAlert[];
}

// ROI per idol:
// roi = (idol_revenue - idol_total_cost) / idol_total_cost × 100
// idol_total_cost = salary_accumulated + training_cost + marketing_cost

// Projection: 3-month moving average × trend_factor
// Alert if cash < 0 within CASH_ALERT_MONTHS (default: 3)

// Rival estimation: 0.7 accuracy baseline on competing agencies
```

**Pipeline integration:** Generated at end of month (week 4, Phase 3). Stored
in EconomySlice.monthlyReports. UI reads for financial reporting screen.

### Part D: Media Entities (TR-media-001..004)

```typescript
interface MediaContract {
  id: string;
  showName: string;
  networkId: string;
  timeslot: { day: number; time: 'morning' | 'afternoon' | 'prime' | 'late' };
  preferredTier: string;       // minimum fame tier for guests
  baseFee: number;             // ¥ per appearance
  audiencia: number;           // viewer count, fluctuates monthly
  guestSpots: number;          // available per week
}

// Fee formula:
// cache = base_fee × mult_idol_tier × mult_audiencia
// mult_audiencia = log10(audiencia) / log10(max_audiencia)

// Audiencia fluctuation (monthly):
// new_audiencia = current × (1 + satisfaction × diversity - fatigue)

// Airplay boost for music:
// boost = audiencia_radio × AIRPLAY_FACTOR × plays_per_week
```

**Pipeline integration:** Phase 1 generates available media slots (like job
generation). Media appearances are a job type processed in Phase 2. Audiencia
updates monthly in Phase 3.

---

## Consequences

### Positive
- Economy extensions use existing slice architecture — no new top-level slices
- Personal finance creates meaningful long-term idol management decisions
- Financial reporting gives player strategic visibility
- All four systems integrate via existing pipeline phases

### Negative
- PersonalFinance embedded in idol data increases RosterSlice size
- Media audiencia fluctuation adds monthly computation

---

## Performance Implications

| Metric | Budget |
|--------|--------|
| Merch revenue calculation (50 agencies) | <2ms in Phase 3 |
| Personal finance updates (3000 idols, monthly) | <5ms |
| Financial report generation (per agency) | <1ms |
| Media slot generation (Phase 1) | <2ms |

---

## GDD Requirements Addressed

| GDD Document | TR-ID | Requirement | How This ADR Satisfies It |
|-------------|-------|-------------|--------------------------|
| merchandising-production.md | TR-merch-001 | Merch line creation tied to idol/group fame | MerchLine with idol/group FK + fame modifier |
| merchandising-production.md | TR-merch-002 | Fan segment multipliers on merch sales | Casual ×0.2, Dedicated ×1.0, Hardcore ×3.0 |
| merchandising-production.md | TR-merch-003 | Sales decay over time post-launch | salesDecayRate weekly multiplier |
| merchandising-production.md | TR-merch-004 | 6 merch types with different cost/revenue profiles | MerchLine.type enum with per-type economics |
| merchandising-production.md | TR-merch-005 | Graduation merch with 3-month carryover | graduation type + 12-week decay window |
| merchandising-production.md | TR-merch-006 | Collaboration merch with external brands | collab type with partner revenue split |
| idol-personal-finance.md | TR-idol-finance-001 | Life goals queue with stat-based prioritization | LifeGoal with activeGoal + completedGoals |
| idol-personal-finance.md | TR-idol-finance-002 | Goal completion permanent effects | completionEffect with stat delta + happiness |
| idol-personal-finance.md | TR-idol-finance-003 | Debt mechanics with 1%/month interest | Monthly interest + 30% max payment cap |
| idol-personal-finance.md | TR-idol-finance-004 | 4 living standard levels affecting happiness | livingStandard enum with happiness penalties |
| idol-personal-finance.md | TR-idol-finance-005 | Manager (assessor) fee and negotiation bonus | 10% income cost + negotiation/overwork protection |
| financial-reporting.md | TR-finance-report-001 | ROI per idol formula | (revenue - cost) / cost × 100 per idol |
| financial-reporting.md | TR-finance-report-002 | 3-month cash projection | Moving average × trend_factor |
| financial-reporting.md | TR-finance-report-003 | Rival agency estimation at 0.7 accuracy | Rival finance estimated with ±30% noise |
| financial-reporting.md | TR-finance-report-004 | Cash alert when runway < 3 months | Alert if projected balance < 0 within CASH_ALERT_MONTHS |
| media-entities.md | TR-media-001 | Show-level data model with timeslot/guests/payment | MediaContract interface with all fields |
| media-entities.md | TR-media-002 | Cachê formula with tier and audiencia modifiers | base_fee × mult_idol_tier × mult_audiencia |
| media-entities.md | TR-media-003 | Audiencia monthly fluctuation | Monthly update formula with satisfaction/diversity/fatigue |
| media-entities.md | TR-media-004 | Airplay boost for music chart position | audiencia_radio × AIRPLAY_FACTOR × plays_per_week |

---

## Related

- [ADR-003: Game State Schema](adr-003-game-state-schema.md) — extends EconomySlice
- [ADR-008: Music Production](adr-008-music-production.md) — music charts feed media/merch
- [ADR-009: Decision Catalog](adr-009-decision-catalog.md) — NPC merch/finance decisions
