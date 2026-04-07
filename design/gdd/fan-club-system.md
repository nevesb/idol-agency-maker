# Fan Club System

> **Status**: Designed (v2 — referências a audience/show systems)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 4 — O Drama Nasce das Mecânicas
> **Related**: audience-system.md (composição da audiência, conversão de fãs, lightstick distribution), show-system.md (resultado do show afeta loyalty)

## Overview

O Fan Club System simula o fã-clube de cada idol como entidade com tamanho,
humor, e opinião. Fã-clubes crescem com fama, reagem a decisões do jogador
(positiva e negativamente), geram receita de merch, e podem causar problemas
(cyberbullying, assédio, protestos). Fã-clubes opinam na vida da idol e
podem pressionar a agência.

## Player Fantasy

A fantasia é de **gerenciar uma comunidade volátil**. Fãs são aliados quando
felizes (compram merch, vão a shows, fazem campanha positiva) e inimigos
quando frustrados (assédio online, protestos, boicotes). Serve o **Pilar 4**:
reações dos fãs são emergentes e imprevisíveis.

## Detailed Design

### Core Rules

#### 1. Métricas do Fã-clube

```
FanClub {
  size:        uint32  // Número de fãs (cresce com fama)
  mood:        0-100   // Humor geral (feliz/neutro/irritado)
  loyalty:     0-100   // Quão dedicados (afeta compra de merch)
  toxicity:    0-100   // % de fãs tóxicos (assédio, stalking)
}
```

#### 2. O que Afeta o Humor dos Fãs

| Evento | Humor | Toxicidade |
|---|---|---|
| Job sucesso | +5 | 0 |
| Música no top 10 | +10 | 0 |
| Escândalo de namoro | -20 | +10 |
| Overwork visível | -5 | +5 (fãs preocupados) |
| Idol feliz e saudável | +3/mês | -2/mês |
| Idol adicionada a grupo | -10 (ciúme) ou +5 (animação) | +5 |
| Idol anuncia debut (aposenta) | -30 | +15 |

#### 3. Efeitos do Fã-clube

| Estado | Tamanho | Humor | Efeito |
|---|---|---|---|
| **Engajado** | Grande | >60 | Merch vende bem, campanhas positivas |
| **Neutro** | Médio | 40-60 | Normal |
| **Frustrado** | Qualquer | <40 | Boicote, comentários negativos, stress na idol |
| **Tóxico** | Qualquer | Qualquer + toxicidade >50 | Assédio a idol/staff, stalking, cyberbullying |

#### 4. Assédio de Fãs como Evento

Se toxicidade > 60:
- Chance de evento "assédio de fã" por semana
- Afeta: Felicidade -10, Stress +15, Mentalidade testada
- PR dept pode mitigar (reduz impacto)
- Idol com Mentalidade alta lida melhor

### Interactions with Other Systems

| Sistema | O que flui |
|---|---|
| **Fame & Rankings** | Fama determina tamanho do fã-clube |
| **Happiness & Wellness** | Humor dos fãs afeta felicidade. Assédio causa stress |
| **Event/Scandal Generator** | Escândalos afetam humor. Assédio é tipo de evento |
| **Agency Economy** | Fã-clube engajado compra mais merch |
| **News Feed** | Reações dos fãs aparecem no feed |

#### 5. Segmentação de Fãs

Fã-clubes não são monolíticos. Cada fã-clube tem **subsegmentos** com
comportamentos e valor econômico diferentes:

| Segmento | % Típica | Comportamento | Valor Econômico |
|---|---|---|---|
| **Casual** | 50-70% | Acompanha de longe, compra pouco, volátil | Baixo (streaming, social media) |
| **Dedicado** | 20-35% | Vai a shows, compra merch, vota em polls | Médio-alto (merch, tickets) |
| **Hardcore (Oshi)** | 5-15% | Compra tudo, defende online, stalking risk | Muito alto (merch premium, eventos) |
| **Anti-fan** | 0-10% | Critica ativamente, boicota, gera negatividade | Negativo (dano à imagem) |

```
FanClubDetailed {
  // Métricas existentes
  size:        uint32
  mood:        0-100
  loyalty:     0-100
  toxicity:    0-100

  // Segmentação (novo)
  casual_pct:     0-100  // % de fãs casuais
  dedicated_pct:  0-100  // % de fãs dedicados
  hardcore_pct:   0-100  // % de fãs hardcore (oshi)
  antifan_pct:    0-100  // % de anti-fãs

  // Demografia (novo)
  domestic_pct:   0-100  // % de fãs domésticos (Japão)
  overseas_pct:   0-100  // % de fãs internacionais
  young_pct:      0-100  // % de fãs < 20 anos
  adult_pct:      0-100  // % de fãs 20-35
  older_pct:      0-100  // % de fãs 35+
}
```

**Conversão entre segmentos:**
- Sucesso consistente: Casual → Dedicado (+2%/mês)
- Conexão pessoal (fan meets, streams): Dedicado → Hardcore (+1%/mês)
- Escândalo grave: Dedicado → Anti-fan (+5% imediato)
- Idol ausente por muito tempo: Hardcore → Casual (-3%/mês)
- Conteúdo digital consistente: atrai Overseas (+1%/mês)

**Impacto por segmento:**

| Segmento | Merch Multiplier | Show Attendance | Social Buzz | Risk |
|---|---|---|---|---|
| Casual | ×0.2 | Raramente | Baixo | Nenhum |
| Dedicado | ×1.0 | Frequente | Médio | Baixo |
| Hardcore | ×3.0 | Sempre | Alto | Stalking, ciúme |
| Anti-fan | ×0.0 | Protesta | Alto (negativo) | Cyberbullying |

#### 6. Dinâmicas de Fandom

| Dinâmica | Trigger | Efeito |
|---|---|---|
| **Shipping** | 2 idols do mesmo grupo com muita interação | Fãs shippers surgem. Se separadas: mood -20 |
| **Ciúme entre fandoms** | Idol de um grupo recebe mais destaque | Fãs dos outros membros ficam frustrados (mood -5) |
| **Fandom de grupo vs individual** | Idol popular num grupo | Tensão: fãs do grupo vs fãs da idol solo |
| **Anti-fan mobilizado** | Escândalo + comunidade online | Anti-fans criam campanha negativa. Stress +20 |
| **Campanha positiva** | Fãs hardcore + aniversário/marco | Boost de fama +5%, mood +10 |
| **Overseas boom** | Conteúdo digital viral internacionalmente | Overseas fans +10%, merch internacional |

#### 7. Merch & Ticket Conversion

Receita de merch e tickets depende diretamente da segmentação:

```
receita_merch = size × (casual_pct × 0.2 + dedicated_pct × 1.0 + hardcore_pct × 3.0)
             × mood / 100 × MERCH_BASE_PRICE

receita_tickets = min(venue_capacity, size × (dedicated_pct + hardcore_pct))
               × TICKET_PRICE
```

## Dependencies

**Hard**: Fame, Happiness, Events
**Soft**: Economy (merch), News Feed, Agency Strategy (postura de imagem)
**Depended on by**: Happiness (assédio), Events (trigger), Economy (vendas),
Agency Intelligence (fan sentiment reports), Roster Balance (fan dependency)

## Acceptance Criteria

1. Fã-clube cresce proporcionalmente à fama
2. Humor reage a eventos (escândalos, namoro, sucesso)
3. Toxicidade alta gera eventos de assédio
4. Fã-clube engajado aumenta vendas de merch
5. PR dept mitiga impacto de fãs tóxicos
6. 4 segmentos de fãs (casual, dedicado, hardcore, anti-fan) com comportamentos distintos
7. Conversão entre segmentos baseada em ações do jogador
8. Demografia domestic vs overseas afeta tipo de receita
9. Dinâmicas de shipping e ciúme funcionam em grupos
10. Receita de merch calculada por segmentação
