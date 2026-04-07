# Merchandising & Production System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-06
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 2 — Suas Decisões, Suas Consequências
> **Related**: agency-economy.md (receita de merch, facilities de produção), fan-club-system.md (segmentação de fãs afeta vendas), fame-rankings.md (fama afeta demanda), show-system.md (merch vendido em shows)

## Overview

O Merchandising & Production System expande o merch básico do Agency Economy
numa **pipeline de produção completa**: design → produção → estoque → vendas.
O jogador decide QUAIS produtos criar, QUANTO produzir (print run), e COMO
vender (loja online, shows, distribuidores). Produção em excesso gera estoque
encalhado; produção insuficiente perde vendas. É o equivalente à gestão de
merchandising de um clube — camisas, álbuns comemorativos, produtos licenciados.

O sistema introduz decisões de risco real: investir ¥30M numa tiragem de 50K
photobooks quando só 20K fãs hardcore compram é prejuízo. Mas acertar a demanda
num lançamento de aniversário com photocard limitado é lucro explosivo.

## Player Fantasy

A fantasia é de **empresário de merch**. Criar a camiseta perfeita, lançar o
photobook no momento certo, ver a edição limitada esgotar em 3 dias. Serve o
**Pilar 2 (Consequências)**: tiragem conservadora perde receita, tiragem
agressiva pode encalhar. E o **Pilar 1 (Simulação)**: a pipeline de produção
tem tempo real — se você não encomendou a tempo, não tem produto pro show.

## Detailed Design

### 1. Tipos de Produto por Tier de Agência

Produtos desbloqueiam progressivamente conforme o tier da agência
(agency-economy.md):

| Tier | Produtos Disponíveis | Custo Unitário Base | Margem Típica |
|---|---|---|---|
| **Garagem** | Buttons, stickers, light sticks, fans (uchiwa) | ¥50-300 | 60-80% |
| **Pequena** | + T-shirts, pôsters, chaveiros, towels | ¥500-2.000 | 50-70% |
| **Média** | + CDs, singles físicos, photocards (random packs) | ¥1.000-3.000 | 40-60% |
| **Grande** | + Photobooks, figurines, vinil, DVDs/Blu-ray | ¥3.000-8.000 | 35-55% |
| **Elite** | + Premium box sets, collaboration items, edições numeradas | ¥8.000-30.000 | 30-50% |

```
MerchProduct {
  id:              uint32
  type:            enum (Button, Sticker, LightStick, Uchiwa, TShirt, Poster,
                         Keychain, Towel, CD, Single, PhotocardPack, Photobook,
                         Figurine, Vinyl, DVD, BluRay, BoxSet, CollabItem, NumberedEdition)
  idol_or_group:   EntityRef       // Idol, grupo, ou agência (branding geral)
  design_cost:     uint32          // Custo de design (one-time)
  unit_cost:       uint32          // Custo por unidade (depende da tiragem)
  base_price:      uint32          // Preço de venda sugerido
  print_run:       uint32          // Quantidade produzida
  stock:           uint32          // Estoque atual
  weeks_in_stock:  uint8           // Semanas desde produção
  status:          enum (Designing, InProduction, InStock, Discounted, WrittenOff)
  special_edition: bool            // Se é edição especial (seasonal, anniversary)
}
```

### 2. Pipeline de Produção

Cada produto segue uma pipeline fixa com tempos reais:

```
DESIGN (1 semana)
  → Custo: design_cost (fixo por tipo)
  → Requer: decisão do jogador (tipo, idol, tiragem)
  → Output: produto em status "Designing"

PRODUÇÃO (2-4 semanas, depende do tipo)
  → Custo: unit_cost × print_run
  → Tempo: buttons/stickers 2 semanas, CDs/photobooks 3 semanas, figurines/box sets 4 semanas
  → Facility bonus: Gráfica/Impressão = tempo -1 semana (mín 1)
  → Output: produto em status "InProduction" → "InStock"

ESTOQUE
  → Produto disponível para venda
  → Custo de armazenamento semanal (warehouse)
  → Vendas ocorrem semanalmente

DESCONTO (após 12 semanas em estoque)
  → Preço reduzido automaticamente para 50% do base_price
  → Status: "Discounted"

WRITE-OFF (após 24 semanas em estoque)
  → Estoque restante é perda total
  → Status: "WrittenOff"
  → Contabilizado como prejuízo
```

| Tipo de Produto | Design Cost | Tempo Produção | Unit Cost Range |
|---|---|---|---|
| Buttons/Stickers | ¥200K | 2 semanas | ¥30-80 |
| Light sticks/Uchiwa | ¥500K | 2 semanas | ¥200-500 |
| T-shirts/Towels | ¥800K | 2 semanas | ¥400-1.200 |
| Pôsters/Chaveiros | ¥300K | 2 semanas | ¥100-400 |
| CDs/Singles | ¥2M | 3 semanas | ¥300-800 |
| Photocard Packs | ¥1.5M | 3 semanas | ¥200-500 |
| Photobooks | ¥5M | 3 semanas | ¥1.500-4.000 |
| Figurines | ¥8M | 4 semanas | ¥2.000-5.000 |
| Vinil/DVD/Blu-ray | ¥3M | 3 semanas | ¥800-2.000 |
| Box Sets | ¥10M | 4 semanas | ¥5.000-15.000 |
| Collaboration Items | ¥15M | 4 semanas | ¥3.000-10.000 |
| Edições Numeradas | ¥20M | 4 semanas | ¥8.000-20.000 |

### 3. Decisão de Tiragem (Print Run)

O jogador escolhe a quantidade a produzir. Custo unitário diminui com escala
(economia de escala), mas risco de encalhe aumenta:

```
unit_cost_adjusted = base_unit_cost × scale_factor(print_run)

scale_factor:
  < 1.000 unidades:  ×1.5  (tiragem pequena, custo alto)
  1.000-5.000:       ×1.2
  5.000-10.000:      ×1.0  (baseline)
  10.000-50.000:     ×0.85
  50.000-100.000:    ×0.70
  > 100.000:         ×0.60 (economia máxima)
```

**Trade-off central**: tiragem alta = custo unitário baixo mas risco de encalhe.
Tiragem baixa = custo unitário alto mas estoque seguro.

### 4. Sistema de Inventário e Warehouse

A agência tem **capacidade de armazenamento** baseada no tier de facilities:

| Tier Agência | Capacidade Base (unidades) | Custo Armazenamento/semana |
|---|---|---|
| Garagem | 5.000 | ¥50K |
| Pequena | 20.000 | ¥150K |
| Média | 100.000 | ¥500K |
| Grande | 500.000 | ¥1.5M |
| Elite | 2.000.000 | ¥3M |

```
warehouse_cost_weekly = base_cost + (stock_total / capacity) × OVERFLOW_PENALTY

// Se stock > capacity:
//   overflow = stock - capacity
//   OVERFLOW_PENALTY = ¥100/unidade/semana (aluguel de espaço extra)
```

### 5. Sistema de Photocard / Gacha

Photocard packs são um tipo especial de produto com mecânica de **coleção
aleatória** que impulsiona compras repetidas:

```
PhotocardPack {
  cards_per_pack:    5            // 5 cards por pack
  total_unique:      20-50        // Total de cards únicas na coleção
  rarity_tiers:      {
    Common:   60%    // Fotos de grupo, poses padrão
    Rare:     25%    // Fotos solo, poses especiais
    SuperRare: 12%   // Fotos de bastidores, momentos especiais
    Secret:   3%     // Fotos exclusivas, autografadas (virtual)
  }
  price_per_pack:    ¥500-1.000
}
```

**Comportamento de compra**:
- Fãs Hardcore (oshi): compram até completar coleção (média 4-8 packs)
- Fãs Dedicados: compram 1-2 packs
- Fãs Casual: raramente compram

```
packs_sold_per_fan = {
  hardcore: total_unique / cards_per_pack × COMPLETION_DRIVE × 1.5
  dedicated: 1.5
  casual: 0.1
}

// COMPLETION_DRIVE = 0.6 (nem todos completam, mas tentam)
// Hardcore com 30 cards únicas: 30/5 × 0.6 × 1.5 ≈ 5.4 packs em média
```

### 6. Edições Especiais

Edições especiais têm **janela de venda limitada** e preço premium:

| Tipo | Trigger | Window | Price Mult | Demand Mult |
|---|---|---|---|---|
| **Seasonal** (Natal, Verão) | Datas fixas no calendário | 4 semanas | ×1.3 | ×1.5 |
| **Aniversário** (debut anniversary) | Aniversário da idol/grupo | 2 semanas | ×1.5 | ×2.0 |
| **Collaboration** (com outra idol/marca) | Decisão do jogador | 3 semanas | ×1.8 | ×1.8 (combina fanbases) |
| **Award Commemoration** | Vitória em premiação (award-shows.md) | 2 semanas | ×2.0 | ×2.5 |
| **Limited Numbered** | Decisão do jogador, tiragem fixa ≤ 1000 | Até esgotar | ×3.0 | Alta (escassez) |

```
special_edition_revenue =
  units_sold × base_price × price_multiplier
  - (design_cost × 1.5)       // Design especial custa mais
  - (unit_cost × print_run)

special_demand =
  base_demand × demand_multiplier × hype_factor

hype_factor =
  1.0 + (days_since_announcement / 7) × 0.1   // Hype acumula
  cap: 1.5 (máximo 50% de hype extra)
```

### 7. Canais de Venda

| Canal | Margem | Alcance | Requisito |
|---|---|---|---|
| **Shows (merch booth)** | 70% | Apenas audiência do show | Show agendado |
| **Loja Online Própria** | 85% | Fan club + marketing reach | Facility "Loja Online" |
| **Distribuidores** | 45% | Mercado nacional | Tier Média+ |
| **Lojas de Conveniência** | 40% | Massa, casual | Tier Grande+ e fame B+ |
| **Internacional** | 50% | Overseas fans | Tier Grande+ e overseas_pct > 10% |

```
sales_by_channel = {
  shows:        attendance × MERCH_CONVERSION_SHOW × product_appeal
  online:       fan_club_reach × MERCH_CONVERSION_ONLINE × product_appeal
  distributors: national_reach × MERCH_CONVERSION_DIST × product_appeal
  convenience:  mass_reach × MERCH_CONVERSION_CONV × product_appeal
  international: overseas_fans × MERCH_CONVERSION_INTL × product_appeal
}

MERCH_CONVERSION_SHOW = 0.15    // 15% da audiência compra merch no show
MERCH_CONVERSION_ONLINE = 0.08  // 8% do alcance online compra
MERCH_CONVERSION_DIST = 0.02    // 2% do alcance distribuidores
MERCH_CONVERSION_CONV = 0.005   // 0.5% do alcance em conveniências
MERCH_CONVERSION_INTL = 0.04    // 4% dos fãs overseas compram
```

### 8. Fórmula de Vendas Semanais

```
units_sold_weekly(product) =
  fan_club_size
  × segment_multiplier
  × (mood / 100)
  × price_elasticity
  × channel_reach
  × novelty_factor
  × special_mult

segment_multiplier =
  casual_pct × 0.05
  + dedicated_pct × 0.15
  + hardcore_pct × 0.40

price_elasticity =
  se price ≤ base_price × 0.8:  1.3   // Barato, vende mais
  se price = base_price:         1.0   // Normal
  se price ≥ base_price × 1.5:  0.6   // Caro, vende menos
  se price ≥ base_price × 2.0:  0.3   // Premium, só hardcore

novelty_factor =
  semana 1-2:  1.5   // Lançamento, hype alto
  semana 3-4:  1.2   // Ainda novo
  semana 5-8:  1.0   // Normal
  semana 9-12: 0.7   // Esfriando
  semana 13+:  0.4   // Discounted territory

channel_reach = sum(sales_by_channel) / fan_club_size  // Normalizado
```

### 9. Gestão de Estoque Encalhado

```
ESTOQUE TIMELINE:
  Semanas 1-12:   Venda normal (preço cheio)
  Semanas 13-24:  Desconto automático (50% do preço)
  Semana 25:      Write-off (estoque restante = prejuízo)

write_off_loss = remaining_stock × unit_cost + storage_costs_accumulated

// Jogador pode antecipar desconto manualmente a qualquer momento
// Jogador pode doar estoque (goodwill +5 public opinion, tax write-off zero)
```

### 10. Facilities de Produção

Integração com facilities do agency-economy.md:

| Facility | Efeito no Merch |
|---|---|
| **Gráfica/Impressão** (¥30M + ¥2M/mês) | Custo de produção -40%. Tempo -1 semana. Qualidade +10% (melhor product_appeal) |
| **Loja Online Própria** (¥10M + ¥1M/mês) | Margem +15% em vendas diretas. Canal online desbloqueado sem distribuidores |
| **Studio de Gravação** (¥50M + ¥3M/mês) | CDs/Singles: custo -50%. Qualidade de áudio = product_appeal +15% |

```
product_appeal =
  base_appeal(type)
  + facility_quality_bonus
  + idol_fame_factor
  + design_quality      // Aleatório 0.7-1.0, modificado por staff de design

// product_appeal afeta todas conversões de venda
// Range: 0.5-1.5
```

### States and Transitions

| Estado do Produto | Descrição | Transição |
|---|---|---|
| **Designing** | Em design, 1 semana | → InProduction (design completo) |
| **InProduction** | Sendo produzido, 2-4 semanas | → InStock (produção completa) |
| **InStock** | Disponível para venda | → Discounted (12 semanas) ou vendido |
| **Discounted** | Preço reduzido 50% | → WrittenOff (24 semanas) ou vendido |
| **WrittenOff** | Estoque perdido, prejuízo | Terminal |
| **SoldOut** | Todo estoque vendido | Terminal (pode relançar) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **agency-economy.md** | ↔ bidirecional | Custo de produção (despesa). Receita de vendas. Facilities reduzem custos |
| **fan-club-system.md** | ← lê | Tamanho do fã-clube, segmentação (casual/dedicado/hardcore), mood |
| **fame-rankings.md** | ← lê | Fama da idol afeta demanda base e product_appeal |
| **show-system.md** | ← trigger | Shows vendem merch no local (merch booth). Merch de show depende de attendance |
| **award-shows.md** | ← trigger | Vitórias geram oportunidade de edição comemorativa |
| **time-calendar.md** | ← tick | Pipeline avança por semana. Seasonal editions triggered por data |
| **news-feed.md** | → gera | Lançamentos de merch, sold-outs, e collabs geram headlines |
| **idol-personal-finance.md** | → alimenta | % de receita de merch flui pra idol conforme contrato |

## Formulas

### Receita Líquida de Produto

```
receita_liquida(product) =
  units_sold × sale_price × margin_by_channel
  - design_cost
  - (unit_cost × print_run)
  - storage_cost_total

storage_cost_total = weeks_in_stock × (stock_remaining × STORAGE_COST_PER_UNIT)
STORAGE_COST_PER_UNIT = ¥5/unidade/semana (dentro da capacidade)
                        ¥100/unidade/semana (overflow)
```

### Demanda Estimada (para decisão de tiragem)

```
estimated_demand(idol, product_type) =
  fan_club_size
  × segment_weight(product_type)
  × (mood / 100)
  × fame_factor
  × seasonal_mult

segment_weight:
  Buttons/Stickers:     casual × 0.10 + dedicated × 0.30 + hardcore × 0.50
  T-shirts/Towels:      casual × 0.05 + dedicated × 0.25 + hardcore × 0.60
  CDs:                  casual × 0.03 + dedicated × 0.20 + hardcore × 0.70
  Photocard Packs:      casual × 0.02 + dedicated × 0.15 + hardcore × 0.80
  Photobooks:           casual × 0.01 + dedicated × 0.10 + hardcore × 0.50
  Premium (box/fig):    casual × 0.00 + dedicated × 0.05 + hardcore × 0.30

fame_factor = clamp(fama / 5000, 0.2, 2.0)
seasonal_mult = 1.0 (normal), 1.5 (Natal/verão), 2.0 (aniversário)
```

### ROI de Print Run

```
roi(print_run) =
  min(estimated_demand, print_run) × (sale_price - unit_cost_adjusted)
  - max(0, print_run - estimated_demand) × unit_cost_adjusted  // Encalhe
  - design_cost
  - storage_cost_estimated

// Jogador vê estimativa de ROI antes de confirmar tiragem
// Estimativa tem ±20% de margem de erro (demanda real varia)
```

## Edge Cases

- **Produto esgota em 1 dia**: Tiragem muito conservadora. Jogador pode iniciar
  nova tiragem (re-print) mas leva 2-4 semanas pra chegar. Janela de hype
  pode ter passado
- **Warehouse lotado com novo produto chegando**: Overflow penalty se aplica.
  Jogador precisa descontar/doar estoque antigo ou expandir warehouse
- **Idol sai da agência com merch em estoque**: Merch continua vendendo
  (desconto acelerado). Direitos autorais dependem do contrato. Sem novas
  tiragens permitidas
- **Collab entre idol da agência e idol rival**: Possível se ambas agências
  concordam. Receita dividida 50/50. Fanbases combinadas para demanda. Risco:
  fãs podem rejeitar (mood -5)
- **Photocard com idol impopular no pack**: Pack vende menos. Fãs reclamam
  ("por que tem a X no pack?"). Pode gerar drama de fã-clube
- **CD lançado sem hit no chart**: Vendas dependem puramente do fã-clube.
  Sem boost de chart, demanda é só segment_weight × fan_club_size
- **100K unidades de box set ¥30K**: Investimento de ¥3B. Se vender 10K,
  prejuízo de ¥2.7B. Decisão catastrófica possível. O jogo avisa mas não
  impede — consequências são do jogador

## Dependencies

**Hard:**
- agency-economy.md — todo o fluxo financeiro de merch passa pela economia
- fan-club-system.md — segmentação de fãs determina demanda

**Soft:**
- fame-rankings.md — fama afeta demanda e product_appeal
- show-system.md — merch vendido em shows
- time-calendar.md — pipeline e sazonalidade
- award-shows.md — edições comemorativas pós-prêmio

**Depended on by:**
- agency-economy.md (receita de merch como fonte principal)
- idol-personal-finance.md (% de merch revenue pro idol)
- news-feed.md (headlines de lançamentos e sold-outs)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `DESIGN_TIME_WEEKS` | 1 | 1-3 | Tempo de design de produto |
| `PRODUCTION_TIME_BASE` | 2-4 | 1-6 | Tempo de produção por tipo |
| `DISCOUNT_THRESHOLD_WEEKS` | 12 | 8-20 | Semanas até desconto automático |
| `WRITEOFF_THRESHOLD_WEEKS` | 24 | 16-36 | Semanas até write-off |
| `DISCOUNT_RATE` | 0.50 | 0.3-0.7 | % do preço original no desconto |
| `MERCH_CONVERSION_SHOW` | 0.15 | 0.05-0.30 | % da audiência que compra merch no show |
| `MERCH_CONVERSION_ONLINE` | 0.08 | 0.02-0.15 | % do alcance online que compra |
| `STORAGE_COST_PER_UNIT` | ¥5/sem | ¥1-20 | Custo de armazenamento por unidade/semana |
| `OVERFLOW_STORAGE_COST` | ¥100/sem | ¥50-200 | Custo de overflow por unidade/semana |
| `GRAFICA_COST_REDUCTION` | 0.40 | 0.2-0.6 | Redução de custo com Gráfica/Impressão |
| `LOJA_ONLINE_MARGIN_BONUS` | 0.15 | 0.05-0.25 | Bônus de margem com Loja Online |
| `COMPLETION_DRIVE` | 0.6 | 0.3-0.9 | % de hardcore que tenta completar coleção photocard |
| `NOVELTY_FACTOR_LAUNCH` | 1.5 | 1.2-2.0 | Multiplicador de vendas nas primeiras 2 semanas |
| `SCALE_FACTOR_100K` | 0.60 | 0.4-0.8 | Economia de escala para tiragem > 100K |

## Acceptance Criteria

1. Pipeline design→produção→estoque→vendas funciona com tempos reais por tipo
2. Print run afeta custo unitário (economia de escala) e risco de encalhe
3. Desconto automático após 12 semanas, write-off após 24
4. Warehouse tem capacidade limitada por tier, overflow gera custo extra
5. Photocard packs com raridades e comportamento de compra repetida (coleção)
6. Edições especiais (seasonal, anniversary, collab) com janela limitada e demand multiplier
7. 5 canais de venda com margens e alcances distintos
8. Gráfica/Impressão reduz custo 40% e tempo 1 semana
9. Loja Online Própria dá +15% margem em vendas diretas
10. Vendas semanais calculadas por fan_club × segmento × mood × price_elasticity × novelty
11. Estimativa de demanda visível ao jogador com ±20% margem de erro
12. Receita líquida contabiliza design + produção + storage corretamente

## Open Questions

- Nenhuma pendente
