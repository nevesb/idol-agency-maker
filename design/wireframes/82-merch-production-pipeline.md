# Wireframe 82 — Merch Production Pipeline

> **Status**: Draft (FM26 UI Standard)
> **Visual Reference**: FM26 Finance (Commercial Income breakdown) + FM26 Youth Development Centre pipeline + existing WF-73 Music Production Pipeline (Kanban pattern)
> **Target Resolution**: 1920×1080 (PC-first)
> **Route**: `/agency/merch/pipeline`
> **GDDs**: merchandising-production.md, fan-club-system.md (segment multipliers), agency-economy.md (facility tiers)
> **ADRs**: ADR-017 (Economy Extensions — merch state machine, warehouse capacity), ADR-003 (MerchState slice)
> **IA Nav**: Agency > Merchandising

---

## Concept

In FM26, merchandise is an abstract line item under **Commercial Income** — the player
never touches individual products. The closest hands-on pattern is the **Youth Development
Centre** where prospects progress through stages. The existing **WF-73 Music Production
Pipeline** already adapts that pattern to a Kanban board for creative projects.

In **Star Idol Agency**, this is the **Merch Production Pipeline** — a Kanban-style board
where each product card moves through 5 states: Designing → In Production → In Stock →
Discounted → Write-off. Unlike FM, the producer makes hands-on decisions about print runs,
sales channels, discount timing, and warehouse capacity. Warehouse capacity is gated by
agency tier (Garage 5K / Small 15K / Mid 35K / Large 60K / Elite 100K+ units) and
overfilling triggers storage penalties.

---

## Screen Layout (FM26 Standard)

```text
+--------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Roster | Market | Operations | AGENCY (Active) | Producer    [Search] [>]  |
|--------------------------------------------------------------------------------------------------|
| Finances | Strategy | Staff | Intelligence | Media | Fans | Goals | MERCH (Active)               |
|--------------------------------------------------------------------------------------------------|
| Agency > Merchandising > Production Pipeline                                                      |
+--------------------------------------------------------------------------------------------------+
| [ TOP PANEL - WAREHOUSE & FINANCIAL SUMMARY ]                                                     |
|                                                                                                   |
| Warehouse (Mid Tier):  [██████████████░░░░] 68%   34,000 / 50,000 units                         |
| Tier Capacity Table:   Garage 5k | Small 15k | Mid 35k | Large 60k | Elite 100k+                |
| Storage Cost: ¥2.4M/mo (normal) | Overflow Penalty: ¥0 (within capacity)                        |
|                                                                                                   |
| Monthly Revenue: ¥18M  |  Monthly Cost: ¥5.1M  |  Net: +¥12.9M                                   |
| Active Products: 12 | In Design: 1 | In Prod: 2 | In Stock: 7 | Discounted: 1 | ⚠ Write-off: 1  |
+--------------------------------------------------------------------------------------------------+
| [ LEFT - PRODUCTS (25%) ]             | [ CENTER - KANBAN PIPELINE (50%) ]  | [ RIGHT - DETAIL (25%)]|
|                                       |                                     |                         |
| FILTERS                               | [DESIGN] [PROD] [STOCK] [DISC] [WO] | SELECTED PRODUCT        |
| Type:   [All ▾]                       |                                     |                         |
| Idol:   [All ▾]                       | ┌──────┐ ┌──────┐ ┌──────┐ ┌────┐   | [Image] Photocard       |
| Status: [All ▾]                       | │Phot. │→│Light │→│T-Sh. │→│Key.│   | Pack Vol.3              |
|                                       | │Pack  │ │stick │ │Rei   │ │chain│   | Idol: Yamada Rei        |
| ACTIVE PRODUCTS                       | │V.3   │ │Grp1  │ │Col.  │ │Rei │   | Type: Photocard Pack    |
| ● Photocard Pack V.3                  | │Rei   │ │      │ │      │ │    │   | Status: In Stock 🟢     |
|   Status: In Stock                    | │1wk   │ │2wk   │ │4wk   │ │6wk │   | Weeks in stock: 3        |
|   Stock: 4,200 / 5,000                | └──────┘ └──────┘ └──────┘ └────┘   |                         |
|   Revenue: ¥2.8M/wk                   |                                     | INVENTORY               |
|                                       | ┌──────┐ ┌──────┐ ┌──────┐ ┌────┐   | Produced:    5,000      |
| ● Lightstick (Celestial 9)            | │      │ │      │ │Hoodie│ │    │   | Sold:        800        |
|   Status: In Production (1/3)         | │      │ │      │ │Rei   │ │    │   | Remaining:   4,200      |
|   Batch: 10,000 units                 | │      │ │      │ │      │ │    │   | Warehouse %: 12%        |
|   ETA: 2 weeks                        | │      │ │      │ │8wk   │ │    │   |                         |
|                                       | │      │ │      │ │      │ │    │   | FINANCIALS              |
| ● T-shirt Collection (Rei)            | └──────┘ └──────┘ └──────┘ └────┘   | Design cost:  ¥800k     |
|   Status: In Stock                    |                                     | Unit cost:    ¥1,200    |
|   Stock: 2,800 / 3,000                | ┌──────┐ ┌──────┐ ┌──────┐ ┌────┐   | Sell price:   ¥3,500    |
|   Revenue: ¥980k/wk                   | │      │ │      │ │      │ │Anni│   | Margin:       ¥2,300    |
|                                       | │      │ │      │ │      │ │v.Bx│   | Est. profit:  ¥8.5M     |
| ● Keychain (Rei)                      | │      │ │      │ │      │ │⚠   │   | Realised:     ¥1.4M     |
|   Status: In Stock                    | │      │ │      │ │      │ │Rei │   |                         |
|   Stock: 1,100 / 1,500                | └──────┘ └──────┘ └──────┘ └────┘   | SALES CHANNELS          |
|                                       |                                     | Venue:   60%  Online:30%|
| ● Hoodie (Rei - Winter)               | [Click a card for details →]        | Retail:  10%            |
|   Status: In Production (2/4)         |                                     |                         |
|                                       |                                     | FAN SEGMENT MIX         |
| ● Anniversary Box Set ⚠               |                                     | Casual:    ×0.2 (low)   |
|   Status: Discounted (week 13)        |                                     | Dedicated: ×1.0 (mid)   |
|   Risk: Write-off in 11 weeks         |                                     | Hardcore:  ×3.0 (top)   |
|   Loss projection: -¥2.1M             |                                     |                         |
|                                       |                                     |-------------------------|
| [+ New Product]                       |                                     | ACTIONS                 |
|                                       |                                     | [💰 Discount Now]       |
|                                       |                                     | [📦 Add Channel]        |
|                                       |                                     | [🎁 Donate Stock]       |
|                                       |                                     | [🗑 Cancel Production]  |
+--------------------------------------------------------------------------------------------------+
```

### State: New Product Wizard (Modal)

```text
+--------------------------------------------------------------------------------------------------+
|                         [ MODAL - CREATE NEW MERCH PRODUCT ]                                      |
|                                                                                                   |
|  Step 1 of 3: Select Type                                                                        |
|                                                                                                   |
|  [Button]  [Sticker]  [Lightstick]  [T-Shirt]  [Photocard Pack]  [Photobook]  [CD]  [Box Set]    |
|                                                                                                   |
|  Selected: Photocard Pack                                                                         |
|                                                                                                   |
|  Step 2: Idol / Group                                                                            |
|  [Yamada Rei ▾]                                                                                  |
|                                                                                                   |
|  Step 3: Print Run                                                                                |
|  ├─────●────────┤ 5,000 units                                                                    |
|  Scale factor: ×1.0 (5k-10k range)                                                               |
|                                                                                                   |
|  DEMAND ESTIMATE (±20%)                                                                           |
|  Expected sales: 4,000 - 5,500 units                                                              |
|  Expected revenue: ¥14M - ¥19M                                                                    |
|                                                                                                   |
|  WAREHOUSE IMPACT                                                                                 |
|  Current: 34k / 50k (68%) → After production: 39k / 50k (78%)                                    |
|                                                                                                   |
|  [Cancel]  [Confirm & Start Design]                                                              |
+--------------------------------------------------------------------------------------------------+
```

---

## FM26 Components Applied

### 1. Commercial Income Breakdown → Warehouse & Financial Summary
FM26's Finance screen shows a top-level breakdown of income streams. Idol Agency adapts
this into the top panel showing warehouse utilisation (with the tier capacity table as
reference) plus monthly revenue/cost/net. This gives the producer an at-a-glance view of
financial health and storage pressure.

### 2. Youth Development Centre Pipeline → Kanban Board
FM26's Youth Centre shows prospects progressing through stages (Under-18 → Under-21 →
First Team). Idol Agency uses the same staged-progression concept but as a true Kanban
board with 5 columns matching the merch state machine (Designing → In Production →
In Stock → Discounted → Write-off). Cards flow left to right.

### 3. Tile-and-Card System → Product Cards
FM26's new UI treats every item as a tile that expands into a card with detail. Each
product on the Kanban is a compact tile showing name, idol, and time-in-state. Clicking
it reveals the full detail panel on the right (inventory, financials, sales channels,
fan segment mix).

### 4. Finance Drill-Down → Detail Panel
FM26's Finance screen lets you drill into any revenue line for detail. The right column
replicates this pattern for the selected product — inventory counts, cost/price/margin,
estimated profit, realised revenue, and sales channel distribution.

### 5. 3-Column Layout with Top Context Panel
Standard FM26 layout: top context panel (warehouse/finance summary) + 3 columns below
(products list, Kanban, detail). This matches WF-73 Music Production Pipeline's pattern
for consistency.

### 6. Warehouse Capacity Gating (FM Stadium Parallel)
FM26 stadiums have hard capacity limits that constrain matchday revenue. Idol Agency
warehouses have hard capacity limits that constrain production batches. The top panel
always shows the tier capacity table so the producer understands why expanding the
agency (upgrading tier) matters.

---

## Interactions and Flows

### Screen Entry
1. Via `Agency > Merchandising` in top nav
2. Via idol profile → "Merch" tab → "View Pipeline"
3. Via inbox message (e.g., "Stock running low on Photocard Pack V.3")

### Creating a New Product
1. Click `+ New Product` → opens 3-step wizard modal
2. Step 1: Select type (from 19 types — Button, Sticker, Lightstick, etc.)
3. Step 2: Select idol or group (roster dropdown)
4. Step 3: Set print run with slider (shows scale factor, demand estimate, warehouse impact)
5. Confirm → product enters "Designing" column, stays 1 week, then auto-advances

### Moving Cards Through Pipeline
- **Automatic**: Products advance through states on weekly tick per merchandising-production.md
- **Player intervention**: Click card → detail panel → use action buttons (discount, donate, cancel)
- **Discount**: Manually triggered before week 12 cutoff
- **Donate**: Writes off stock early without loss penalty (reputation bonus)
- **Cancel**: Stops production mid-batch (refunds 50% of unit cost)

### Warehouse Overflow
- If total stock > tier capacity: top panel turns yellow, overflow penalty appears (¥100/unit/week)
- Red warning when stock > 120% of capacity
- Inbox alert: "Warehouse overflowing — consider discounting or expanding (upgrade tier)"

### Write-Off Risk Alerts
- Products at week 20+ of stock get ⚠ badge in left column
- Left column sorts write-off-risk products first
- Loss projection shown in detail panel

---

## Acceptance Criteria

1. Top panel shows warehouse utilisation bar with current tier capacity and tier table
2. Top panel shows monthly revenue, cost, net, and product count breakdown by state
3. 5-column Kanban board matches merch state machine (Designing/In Prod/In Stock/Discounted/Write-off)
4. Product cards are tiles showing name, idol, time-in-state (compact format)
5. Clicking a card populates the right detail panel (inventory, finances, channels, fan mix)
6. Left column lists active products with status and revenue, filterable by type/idol/status
7. Write-off risk products appear with ⚠ badge and sort to top
8. `+ New Product` opens 3-step wizard modal (type → idol → print run)
9. New product wizard shows demand estimate (±20%) and warehouse impact preview
10. Warehouse capacity gated by agency tier (Garage 5k / Small 15k / Mid 35k / Large 60k / Elite 100k+)
11. Overflow penalty visible in top panel when stock > capacity
12. Detail panel actions (Discount, Donate, Cancel) trigger state machine transitions
13. Sales channels breakdown visible per product (Venue / Online / Retail)
14. Fan segment multiplier reference visible in detail panel (Casual ×0.2, Dedicated ×1.0, Hardcore ×3.0)
15. Screen accessible from top nav, idol profile, and inbox message actions
