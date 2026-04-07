# Award Shows System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-06
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 4 — O Drama Nasce das Mecânicas
> **Related**: fame-rankings.md (fama afeta nomeações), show-system.md (cerimônia como show), agency-economy.md (receita/custos de campanha), staff-functional.md (PR Manager para lobbying), music-charts.md (chart position para nomeação)

## Overview

O Award Shows System simula o ciclo anual de premiações da indústria musical
japonesa — o equivalente à temporada de prêmios do futebol (Ballon d'Or, FIFA
Best). Premiações são marcos de prestígio que validam o trabalho do jogador:
nomeações geram buzz, vitórias geram fama massiva, e campanhas de lobbying
adicionam uma camada estratégica de investimento em influência.

Cada premiação tem calendário fixo, categorias com critérios mecânicos, e um
sistema de votação ponderada que combina dados objetivos (charts) com subjetivo
(painel da indústria, voto de fãs). O jogador pode investir ativamente em
campanhas para influenciar o resultado — mas nunca garantir vitória.

## Player Fantasy

A fantasia é de **colecionar troféus**. Ver sua idol nomeada, torcer pela
vitória, e sentir o boost de fama quando ganha. Serve o **Pilar 4 (Drama)**:
perder uma premiação por 1 ponto gera frustração real. Ganhar Best New Artist
com uma idol que você treinou desde rank F é satisfação máxima. E a decisão
de investir ¥50M em lobbying quando o orçamento está apertado é tensão pura
do **Pilar 2 (Consequências)**.

## Detailed Design

### 1. Premiações do Calendário Anual

O ciclo de premiações segue o calendário real japonês (simplificado):

| Premiação | Mês | Prestígio | Categorias | Notas |
|---|---|---|---|---|
| **Japan Record Awards** (日本レコード大賞) | Dezembro (semana 49) | SSS | 6 | A mais prestigiosa. Transmitida nacionalmente |
| **Oricon Year-End Awards** | Dezembro (semana 51) | SS | 4 | Baseada em dados de vendas Oricon |
| **Golden Disc Awards** | Fevereiro (semana 6) | SS | 5 | Foco em vendas físicas e digitais |
| **Japan Music Awards** | Março (semana 12) | S | 6 | Votação mais popular, foco em fãs |
| **Regional Music Prize** | Junho (semana 24) | A | 3 | Por região (Kanto, Kansai, Hokkaido, etc.) |
| **Rookie of the Season** | Trimestral (sem 13/26/39/52) | B | 1 | Apenas idols com < 1 ano de carreira |

```
AwardShow {
  id:            uint32
  name:          string
  month:         uint8           // Mês do ano (1-12)
  week:          uint8           // Semana exata no calendário
  prestige:      enum (SSS, SS, S, A, B)
  categories:    AwardCategory[]
  ceremony_type: enum (Televised, Industry, Regional)
  kouhaku:       bool            // Se é o evento especial NHK Kouhaku
}
```

### 2. Categorias de Prêmio

| Categoria | Critério Principal | Presente em |
|---|---|---|
| **Best Single** | Chart position + vendas do single mais popular | JRA, Oricon, Golden Disc, JMA |
| **Best Album** | Chart position + vendas do álbum mais popular | JRA, Oricon, Golden Disc |
| **Best New Artist** | Idol/grupo com debut nos últimos 12 meses + maior impacto | JRA, Golden Disc, JMA, Rookie |
| **Best Group** | Grupo com melhor performance combinada no ano | JRA, JMA |
| **Best Live Performance** | Melhor nota média de shows ao vivo no ano | JRA, JMA |
| **Producer of the Year** | Produtor (jogador ou IA) cuja agência mais cresceu | JRA, JMA |

```
AwardCategory {
  id:              uint32
  name:            string
  nominee_count:   5             // Top 5 nomeados por categoria
  weight_chart:    0.40          // 40% chart/vendas
  weight_panel:    0.30          // 30% painel da indústria
  weight_fans:     0.30          // 30% votação de fãs
  eligible_filter: function      // Filtro de elegibilidade (ex: debut < 12 meses)
}
```

### 3. Mecânica de Nomeação

Nomeações são **automáticas** — calculadas pelo sistema no início do mês da
premiação, baseadas em dados acumulados do ano:

```
nomination_score(idol, category) =
  chart_score         × WEIGHT_CHART        // Posição média no ranking + vendas
  + fame_score        × WEIGHT_FAME         // Fama atual (fame-rankings.md)
  + genre_relevance   × WEIGHT_GENRE        // Match de gênero com a premiação
  + show_score        × WEIGHT_SHOW         // Nota média de shows (só Best Live)

chart_score = sum(
  para cada single/album no top 100 durante o ano:
    (101 - posição_média) / 100
)

fame_score = fama_atual / 10000  // Normalizado 0-1

genre_relevance =
  1.0 se gênero da idol/música match com foco da premiação
  0.7 se gênero adjacente
  0.4 se gênero distante

show_score = media(nota_shows_ano)  // Só para Best Live Performance
```

Os **Top 5** por `nomination_score` em cada categoria são nomeados.

**Regras de elegibilidade:**
- Best New Artist: debut nos últimos 12 meses
- Best Group: apenas grupos (não solos)
- Best Live Performance: mínimo 5 shows no ano
- Producer of the Year: produtor (jogador ou IA) com agência ativa
- Best Single/Album: ao menos 1 single/álbum lançado no período

### 4. Sistema de Votação e Julgamento

A vitória é determinada por **weighted score** de 3 componentes:

```
final_score(nominee) =
  chart_performance × 0.40      // Dados objetivos
  + industry_panel  × 0.30      // Painel de juízes (semi-aleatório)
  + fan_voting      × 0.30      // Votação dos fãs

chart_performance =
  (vendas_totais_normalizadas + posição_media_normalizada) / 2
  // Normalizado 0-1 entre os 5 nomeados

industry_panel =
  base_reputation(idol) × 0.5
  + lobby_influence      × 0.3   // Campanha do jogador
  + random_variance      × 0.2   // ±0.1 variância (juízes são humanos)
  // Normalizado 0-1

base_reputation = (fama + anos_ativa × 50 + premios_anteriores × 100) / max_possivel

fan_voting =
  fan_club_size × fan_mood / 100 × hardcore_pct × FAN_VOTE_FACTOR
  // Normalizado 0-1 entre os 5 nomeados
```

**Vencedor**: nominee com maior `final_score`. Em caso de empate, `chart_performance` desempata.

### 5. Campanha de Lobbying

O jogador pode investir dinheiro em **lobbying** para influenciar o componente
`industry_panel`. Requer **PR Manager** no staff (staff-functional.md).

```
lobby_influence = min(
  investment / LOBBY_CAP × pr_manager_skill / 100,
  LOBBY_MAX_INFLUENCE
)

// investment: ¥ investido pelo jogador
// LOBBY_CAP: ¥50M (investimento máximo efetivo)
// pr_manager_skill: skill do PR Manager (0-100)
// LOBBY_MAX_INFLUENCE: 0.8 (máximo 80% do componente panel)
```

| Investimento | Influência (PR skill 70) | Influência (PR skill 100) |
|---|---|---|
| ¥5M | 0.07 | 0.10 |
| ¥10M | 0.14 | 0.20 |
| ¥25M | 0.35 | 0.50 |
| ¥50M+ | 0.56 | 0.80 |

**Regras de lobbying:**
- Só pode lobbiar por idols/grupos da própria agência
- Máximo 1 campanha por categoria por premiação
- Investimento perdido se idol não for nomeada (risco)
- PR Manager com skill < 30 desperdiça 50% do investimento
- Se descoberta (chance 5% por campanha), escândalo leve (+fama, -felicidade)

### 6. Resultados e Consequências

#### Nomeação (sem vitória)

| Efeito | Valor |
|---|---|
| Fama | +100 |
| Motivação | +10 |
| Fan club mood | +5 |
| Endorsement offers | +1 proposta nos próximos 30 dias |
| Board confidence | +2 |

#### Vitória

| Efeito | Prestígio SSS | Prestígio SS | Prestígio S | Prestígio A | Prestígio B |
|---|---|---|---|---|---|
| Fama boost | +500 | +350 | +250 | +150 | +100 |
| Revenue bonus (próximo mês) | ×1.5 merch/tickets | ×1.3 | ×1.2 | ×1.15 | ×1.1 |
| Endorsement offers | +3 premium | +2 premium | +2 standard | +1 standard | +1 local |
| Board confidence | +10 | +7 | +5 | +3 | +2 |
| Fan club mood | +15 | +10 | +8 | +5 | +3 |
| Headline news | Nacional, 2 semanas | Nacional, 1 semana | Nacional, 3 dias | Regional | Local |

#### Producer of the Year

| Efeito | Valor |
|---|---|
| Board confidence | +15 |
| Budget bonus next quarter | +20% |
| Scouting unlock | Acesso a idols tier S+ no mercado por 3 meses |
| Rival respect | Rivais menos agressivas em negociações por 6 meses |

### 7. Simulação da Cerimônia

O jogador decide se as idols nomeadas **comparecem** à cerimônia:

```
CeremonyAttendance {
  attend:     bool
  // Se attend = true:
  stress_cost:    +10 (preparação + evento)
  fame_gain:      +30 (exposição na cerimônia)
  // Se attend = false:
  stress_cost:    0
  fame_gain:      0
  public_opinion: -5 (fãs e mídia criticam ausência)
}
```

**Se vencer e presente**: Headline de destaque. Discurso gerado (emoção baseada
em Comunicação da idol). Momento brilhante possível se Carisma > 80.

**Se vencer e ausente**: Headline negativa ("Idol X não compareceu ao próprio
prêmio"). Fama do prêmio reduzida em 30%.

### 8. Kouhaku Uta Gassen (NHK)

O **Kouhaku** é um evento especial anual (Dezembro, semana 52) — não é premiação
mas sim um **convite de prestígio** para o show de ano novo da NHK.

```
kouhaku_eligibility =
  fama >= 7000                    // Tier SS+ obrigatório
  AND shows_no_ano >= 10          // Ativa em shows
  AND scandals_graves_ano == 0    // Sem escândalos graves no ano

kouhaku_invite_chance =
  se eligible:
    base 60% + (fama - 7000) / 3000 × 40%  // 60-100%
  se não eligible: 0%
```

| Efeito Kouhaku | Valor |
|---|---|
| Fama boost | +800 |
| Revenue (cachê NHK) | ¥100M |
| National exposure | Todos rankings +5% próximo mês |
| Fan club growth | +10% tamanho |
| Stress cost | +20 (evento de altíssima pressão) |

**Participar do Kouhaku é o pico da carreira de uma idol.** Equivale a jogar
a final da Champions League.

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Pré-Nomeação** | Mês anterior à premiação. Dados sendo coletados | → Nomeações (início do mês da premiação) |
| **Nomeações Abertas** | Top 5 anunciados. Lobbying ativo | → Cerimônia (semana da premiação) |
| **Cerimônia** | Evento processado, vencedores calculados | → Resultados |
| **Resultados** | Consequências aplicadas (fama, receita, headlines) | Terminal até próximo ciclo |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **fame-rankings.md** | ← lê / → afeta | Fama determina nomeação. Vitória gera boost de fama |
| **music-charts.md** | ← lê | Posição no chart determina chart_performance |
| **show-system.md** | ← lê | Nota de shows determina Best Live Performance |
| **agency-economy.md** | ← custos / → receita | Lobbying custa ¥. Vitória gera revenue bonus |
| **staff-functional.md** | ← lê | PR Manager skill afeta eficiência de lobbying |
| **fan-club-system.md** | ← lê / → afeta | Fan club size afeta fan voting. Vitória afeta mood |
| **happiness-wellness.md** | → afeta | Cerimônia gera stress. Vitória gera motivação |
| **news-feed.md** | → gera | Nomeações e vitórias geram headlines |
| **agency-meta-game.md** | → afeta | Vitórias aumentam board confidence |
| **event-scandal-generator.md** | ↔ bidirecional | Lobbying descoberto = escândalo. Escândalos afetam elegibilidade |

## Formulas

### Score de Nomeação

```
nomination_score(idol, category) =
  chart_score × 0.35
  + fame_score × 0.30
  + genre_relevance × 0.15
  + show_score × 0.20    // Só Best Live; 0 para outras categorias

chart_score = sum(
  para cada release no top 100:
    (101 - posição_média) / 100
) / num_releases  // Média normalizada

fame_score = clamp(fama_atual / 8000, 0, 1)

show_score = clamp(media_nota_shows / 0.95, 0, 1)  // S-rank = 1.0
```

### Score Final (Votação)

```
final_score =
  normalize(chart_performance, nominees) × 0.40
  + normalize(industry_panel, nominees)  × 0.30
  + normalize(fan_voting, nominees)      × 0.30

// normalize(x, set) = (x - min(set)) / (max(set) - min(set))
// Garante que scores são comparáveis entre nomeados
```

### Lobby ROI

```
lobby_roi = fame_gain_from_victory × revenue_bonus - investment

// Exemplo: Vitória JRA (SSS)
//   fame_gain = +500 → revenue estimado ¥200M extra no mês
//   investment = ¥50M lobbying
//   roi = ¥200M - ¥50M = ¥150M (se vencer)
//   roi = -¥50M (se perder)
```

### Kouhaku Fama Anual

```
kouhaku_fame_total =
  fame_boost(+800)
  + national_exposure(fama × 0.05)
  + fan_growth(fan_club_size × 0.10)

// Para uma idol com fama 8000 e fan club 500K:
//   +800 + 400 + 50K fans = impacto massivo
```

## Edge Cases

- **Idol nomeada em 3 categorias da mesma premiação**: Possível (Best Single +
  Best Live + Best Group). Cada categoria é independente. Lobby separado por
  categoria. Vencer múltiplas = headline especial ("Varredura!")
- **Lobbying para idol que não é nomeada**: Investimento perdido. Sem reembolso.
  PR Manager com skill > 70 avisa com 80% de chance se idol será nomeada
- **Idol em burnout na semana da cerimônia**: Não pode comparecer. Se vencer,
  perde 30% do fame boost por ausência. Headlines mistas ("Vitória agridoce")
- **Duas idols da mesma agência nomeadas na mesma categoria**: Possível. Jogador
  decide em qual investir lobby. Voto de fãs se divide entre as duas
- **Rookie of the Season com idol de 3 meses**: Elegível. Mas chart_score
  provavelmente baixo (pouco tempo para acumular). Compensa com hype de novidade
- **Producer of the Year para jogador em primeiro ano**: Possível se crescimento
  foi excepcional (ex: subiu 2 tiers de agência). Raro mas recompensador
- **Kouhaku recusado pelo jogador**: Possível. Idol não vai. Sem stress, sem
  fama, sem cachê. Fãs e mídia criticam severamente (mood -20, public -10)

## Dependencies

**Hard:**
- fame-rankings.md — fama determina nomeação e elegibilidade
- music-charts.md — posição no chart é 40% do score final

**Soft:**
- show-system.md — nota de shows para Best Live Performance
- staff-functional.md — PR Manager para lobbying
- fan-club-system.md — tamanho do fã-clube para fan voting
- agency-economy.md — custos de lobbying e revenue bonus

**Depended on by:**
- news-feed.md (headlines de nomeações e vitórias)
- fame-rankings.md (boost de fama pós-vitória)
- agency-meta-game.md (board confidence)
- happiness-wellness.md (stress de cerimônia, motivação de vitória)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `NOMINEE_COUNT` | 5 | 3-10 | Nomeados por categoria |
| `WEIGHT_CHART` | 0.40 | 0.2-0.6 | Peso de chart performance no score final |
| `WEIGHT_PANEL` | 0.30 | 0.1-0.5 | Peso do painel da indústria |
| `WEIGHT_FANS` | 0.30 | 0.1-0.5 | Peso da votação de fãs |
| `LOBBY_CAP` | ¥50M | ¥10M-¥200M | Investimento máximo efetivo em lobbying |
| `LOBBY_MAX_INFLUENCE` | 0.80 | 0.3-1.0 | Influência máxima no componente panel |
| `LOBBY_DISCOVERY_CHANCE` | 0.05 | 0.01-0.15 | Chance de lobbying virar escândalo |
| `FAME_BOOST_SSS` | 500 | 200-1000 | Fama ganha por vitória em premiação SSS |
| `FAME_BOOST_SS` | 350 | 150-700 | Fama ganha por vitória em premiação SS |
| `FAME_BOOST_S` | 250 | 100-500 | Fama ganha por vitória em premiação S |
| `NOMINATION_FAME` | 100 | 30-200 | Fama ganha só por ser nomeado |
| `KOUHAKU_FAME_BOOST` | 800 | 400-1500 | Fama ganha por participar do Kouhaku |
| `KOUHAKU_MIN_FAME` | 7000 | 5000-9000 | Fama mínima para elegibilidade Kouhaku |
| `CEREMONY_STRESS` | 10 | 5-20 | Stress de comparecer à cerimônia |
| `ABSENCE_FAME_PENALTY` | 0.30 | 0.1-0.5 | % de fame boost perdido por ausência |

## Acceptance Criteria

1. 6 premiações processadas no calendário anual correto (Dez, Dez, Fev, Mar, Jun, Trimestral)
2. Nomeações automáticas baseadas em chart + fama + gênero, top 5 por categoria
3. Score final calculado com pesos 40/30/30 (chart/panel/fans)
4. Lobbying funciona: investimento + skill do PR Manager aumenta influence no panel
5. Lobbying tem risco de descoberta (5% base) gerando escândalo
6. Vitória gera consequências corretas: fama, revenue bonus, endorsements, headlines
7. Cerimônia: comparecer gera stress + fame. Ausência gera penalidade
8. Kouhaku processado como evento especial com elegibilidade SS+ e efeitos massivos
9. Idol pode ser nomeada em múltiplas categorias da mesma premiação
10. Producer of the Year funciona para o jogador e produtores IA
11. Board confidence aumenta com vitórias conforme tabela de prestígio
12. Revenue bonus pós-vitória dura 1 mês e afeta merch + tickets

## Open Questions

- Nenhuma pendente
