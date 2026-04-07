# Music Charts System

> **Status**: Designed (v2 — ver também music-entities.md para entidades musicais)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real
> **Related**: music-entities.md (define a música como entidade mecânica: requisitos de performance + potencial de recepção), show-system.md, setlist-system.md

## Overview

O Music Charts System gerencia a criação, publicação, ranking e monetização de
músicas no jogo. Músicas são criadas por 3 vias: encomendadas a compositores NPC,
compostas pela própria idol, ou covers de músicas existentes. Cada música entra
num ranking mensal (estilo Oricon/Billboard) que determina royalties, fama, e
vendas de mídia física (CDs, vinil, edições especiais). Compositores são NPCs
com tier, especialidade e custo por faixa. O jogador pode nomear músicas criadas
por suas idols. O estado inicial do jogo já vem com músicas geradas nos 5 anos
de simulação pré-jogo.

## Player Fantasy

A fantasia é de **produtor musical** que decide quando lançar, com quem
colaborar, e como monetizar. Ver a música da sua idol subindo no ranking é
satisfação pura. Encomendar uma faixa de um compositor top pra impulsionar
uma novata, ou descobrir que sua idol compôs um hit sozinha, são momentos
memoráveis. Serve o **Pilar 1 (Simulação)**: músicas têm qualidade calculada
por stats, competem num mercado real, e geram receita mensurável.

## Detailed Design

### Core Rules

#### 1. Três Vias de Criação Musical

| Via | Quem cria | Custo | Qualidade | Royalties |
|---|---|---|---|---|
| **Encomenda a compositor** | Compositor NPC | Cachê do compositor | Proporcional ao tier do compositor | Compositor recebe % das vendas |
| **Idol compõe** | Idol com condições favoráveis | Zero (tempo da idol na agenda) | Proporcional aos stats da idol (Vocal + Aura) | Idol recebe bônus de compositor (+20%) |
| **Cover** | Idol performa música existente | Royalties ao original | Depende da idol + popularidade da música | Artista/compositor original recebe % |

**Encomenda a compositor:**
- Jogador escolhe compositor do pool de NPCs
- Paga cachê (one-time, proporcional ao tier)
- Compositor pode estar ocupado (disponibilidade limitada)
- Qualidade da música = tier_compositor × aleatoriedade (±20%)
- Agências rivais usam os mesmos compositores

**Idol compõe:**
- Idol precisa: Motivação > 60, slot livre na agenda, Vocal > 50 OU Aura > 50
- Qualidade = (Vocal + Aura) / 2 × fator_aleatorio
- Tempo: 1-4 semanas pra compor (depende de Adaptabilidade)
- Jogador pode nomear a música
- Idol recebe royalties de compositor + artista (bônus de +20%)

**Cover:**
- 3 fontes de covers:
  - Artista da mesma agência (fácil, sem custo extra)
  - Artista debutada/aposentada (semi-público, custo baixo)
  - Artista de outra agência (precisa negociar, custo de licenciamento)
- Qualidade = stats_idol × popularidade_original × 0.7 (cover nunca supera original)
- Original recebe 15-30% dos royalties do cover

#### 2. Compositores NPC (com Fama)

Compositores são entidades no World Pack com ficha fixa e **fama própria**:

```
Composer {
  id:          uint32
  name_jp:     string
  name_romaji: string
  specialty:   "pop" | "rock" | "ballad" | "electronic" | "idol" | "variety"
  cost:        ¥100K a ¥50M (proporcional à fama)
  region:      enum
  royalty_rate: 5-15%
  available:   bool
  fame:        float (calculada pelo histórico no chart)
  chart_history: [{song_id, months_in_chart, max_position}]
}
```

**Fama do Compositor** = Sum(T × Pos) para todas músicas que estiveram no chart:

```
fama_compositor = sum(meses_no_chart × bonus_posicao_maxima)

Bônus por posição máxima (inversamente proporcional ao sucesso):
  #100-80: ×1.0    #80-60: ×1.1    #60-40: ×1.2
  #40-20:  ×1.3    #20-10: ×1.5    Top 10: ×2.0

Exemplo: Compositor com 3 músicas no chart:
  Música A: 1 mês, max #80 → 1 × 1.0 = 1.0
  Música B: 3 meses, max #20 → 3 × 1.3 = 3.9
  Música C: 2 meses, max #3 → 2 × 2.0 = 4.0
  Fama total: 8.9
```

**Currículo do compositor**: Jogador vê "X músicas no top 100, Y tempo total
no chart, melhor posição: #Z". Custo proporcional à fama.

**Idol que vira compositora**: Começa com fama de compositor = 0,
independente da fama como idol. Carreira de composição é separada.

Pool: ~100-200 compositores no pack padrão. Disputados com rivais.
Score da música leva em conta a fama do compositor.

#### 3. Pool de Ouvintes e Revenue Share

O mercado musical tem um **pool finito de ouvintes** que cresce com o
número de idols ativas:

```
ouvintes_totais = idols_ativas × 100.000

Com 3000 idols ativas: 300.000.000 ouvintes
Com 5000 idols ativas (época de ouro): 500.000.000 ouvintes

Cada ouvinte escuta ~288 músicas/dia (5 min por faixa, 24h)
Slots totais/dia = ouvintes × 288

Exemplo (3000 idols):
  300M × 288 = 86.400.000.000 slots de música por dia
```

**Revenue share de cada música:**
```
share_musica = score_musica / soma_scores_todas_musicas
receita_diaria_musica = share_musica × RECEITA_TOTAL_POOL_DIA
```

**Dinâmica temporal**:
- Mais tempo passa → mais músicas no pool → share individual cai
- Mais idols ativas → mais ouvintes → pool total cresce
- Jogador precisa competir pela fatia do bolo que cresce

**Ouvintes por região**: Proporcional à população de idols ativas na região.
Música de idol de Osaka tem boost no pool regional de Kansai.

#### 4. Ranking de Músicas (Charts)

**Top 100 atualizado mensalmente**. Porém jogador pode ver o **ranking
diário** com setas de variação vs. posição mensal a qualquer momento.

```
score_musica = qualidade × fama_artista × fama_compositor × promocao × tempo_no_mercado

onde:
  qualidade       = valor calculado na criação (1-100)
  fama_artista    = fama da idol/grupo (modificador)
  fama_compositor = fama do compositor (novo fator)
  promocao        = investimento em marketing + aparições em TV/rádio
  tempo_no_mercado = decay curve (nova = ×1.5, 1-3 meses = ×1.0, 6+ meses = ×0.5)
```

**Ações pra impulsionar música:**
- Investir em marketing (campanha de mídia social, ads)
- Cavar participação em programa de TV/rádio que toca a música
- Lançar merch físico (CD/vinil) que dá boost temporário

#### 5. Álbum vs. Single

| Aspecto | Single | Álbum |
|---|---|---|
| **Custo produção** | 1 faixa | N faixas (proporcional) |
| **Custo de marketing** | Normal | **Mesmo do single** (vantagem!) |
| **Efeito do marketing** | Promove 1 música | Promove TODAS as faixas simultaneamente |
| **Estratégia** | Barato, testa mercado | Caro na largada, mas marketing eficiente |

Álbum é investimento com ROI melhor se o artista é popular (marketing
impulsiona todas faixas). Single é mais seguro pra testar.

#### 6. Sazonalidade (Bônus de Marketing)

Semanas especiais no calendário japonês dão **bônus de marketing em músicas**:

| Temporada | Período | Bônus MKT | Motivo |
|---|---|---|---|
| **Hanami (Sakuras)** | Final de Março - Abril | +20% | Pessoas saem juntas, falam de músicas |
| **Golden Week** | Final de Abril - Maio | +20% | Feriado nacional, consumo alto |
| **Obon** | Agosto (semana) | +15% | Festival de verão, shows ao vivo |
| **Natal/Fim de Ano** | Dezembro | +25% | Maior consumo do ano, Kouhaku |
| **Ano Novo** | Janeiro (1ª semana) | +15% | Reflexão, playlists de "melhores do ano" |

#### 7. Mídia Física (CDs, Vinil, Edições Especiais)
  fama_artista    = fama da idol/grupo que performa
  promocao        = investimento em marketing da música (campanhas, aparições)
  tempo_no_mercado = decay curve (nova = ×1.5, 1-3 meses = ×1.0, 6+ meses = ×0.5)
```

Posições no ranking geram:
- Fama contínua pro artista (top 10 = +100 fama/mês, top 100 = +10)
- Royalties mensais proporcionais à posição
- Exposição no News Feed proporcional ao tier

#### 4. Mídia Física (CDs, Vinil, Edições Especiais)

Jogador pode decidir produzir mídia física baseada na popularidade:

| Produto | Custo produção | Preço venda | Quando disponível |
|---|---|---|---|
| Single digital | ¥0 | Royalties de streaming | Sempre |
| CD single | ¥500/unidade | ¥1,200-2,000 | Tier agência Média+ |
| CD álbum | ¥800/unidade | ¥2,500-3,500 | Tier agência Média+ |
| Vinil | ¥2,000/unidade | ¥3,000-5,000 | Tier agência Grande+ |
| Box set / edição especial | ¥5,000/unidade | ¥8,000-20,000 | Tier agência Grande+ |

**Regras:**
- Produzir mídia física é investimento com risco (se não vende, prejuízo)
- Vendas proporcionais à fama do artista + posição no ranking
- Gráfica própria (facility) reduz custo de produção em 40%
- Coletâneas: disco com várias idols/grupos. Artista famoso impulsiona novatos
- Vender disco aumenta popularidade da música E da idol (feedback loop)

#### 8. Colaborações e Coletâneas

- Gravar com artista famoso de outra agência impulsiona novato
- Coletânea da agência: disco com múltiplas idols, custo compartilhado
- Colaboração cross-agency: precisa negociar via sistema de colaboração
  do Market/Transfer
- Disco de "melhores hits" de idol que debutou: receita passiva de legado

#### 9. Social Media (canal de marketing + viral)

Uma plataforma de social media inicialmente (tipo TikTok/Instagram):
- Canal de **marketing** pra promover músicas e idols
- **Viralização**: Não é a música que viraliza, mas um meme/dancinha sobre ela
- Viral = bônus de marketing massivo (aumenta escutas no pool)
- Viral é evento do Event/Scandal Generator (trigger: Carisma alto + música popular + sorte)

#### 10. Streaming ao Vivo

| Tipo | Onde | Efeito |
|---|---|---|
| **No canal de famoso** | Show/podcast de idol/personalidade famosa | Ganha fãs novos que não conheciam a idol. Boost de awareness |
| **No próprio canal** | Canal da idol/grupo | Não ganha fãs novos. Aumenta share de ouvintes no pool semanal |

Streaming no canal de famoso = scouting reverso (idol fica conhecida).
Streaming no próprio canal = engagement de fã base existente.

#### 11. Playlists e Curadoria (Rádio)

- Rádios com gênero específico dão **boost pra músicas do gênero**
- Playlists da semana são notícias no News Feed
- Aparecer numa playlist de rádio popular = boost no score da música
- Gênero musical é **label da música** (pop, rock, ballad, etc.) -- inicialmente
  sem mecânica complexa, só matching com preferência da rádio

### States and Transitions

| Estado da Música | Descrição | Transição |
|---|---|---|
| **Em produção** | Sendo composta/gravada | → Lançada (produção completa) |
| **Lançada** | Entra no ranking, gera receita | → Estável (após pico) |
| **No topo** | Top 10, máxima receita/fama | → Estável (decai naturalmente) |
| **Estável** | Top 100, receita moderada | → Declinando (tempo) |
| **Declinando** | Saindo do top 100 | → Legado (sai do ranking) |
| **Legado** | Fora do ranking, receita mínima | Permanente (royalties residuais) |

Ciclo de vida típico: 1-2 meses no topo → 3-6 meses estável → declínio gradual.
Hits excepcionais podem ficar no top 100 por 12+ meses.

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Agency Economy** | → receita | Royalties mensais, vendas de mídia física, cachê de compositor (despesa) |
| **Contract System** | ← lê | % de royalties do contrato da idol. Bônus de compositor pra idol que compõe |
| **Fame & Rankings** | → fama | Posição no chart gera fama contínua pro artista |
| **Time/Calendar** | ← tick | Rankings atualizam mensalmente. Produção leva semanas |
| **Happiness & Wellness** | → motivação | Música no top 100 = Motivação +5. Hit #1 = Motivação +15 |
| **Idol Database** | ← lê | Compositores NPC do World Pack. Músicas seed do estado inicial |
| **Stats System** | ← lê | Vocal + Aura pra qualidade de composição da idol |
| **Schedule/Agenda** | ← slot | Idol precisa de slot pra compor. Compositor precisa de slot pra gravar |
| **News Feed** | → notícias | Lançamentos, mudanças no ranking, collabs aparecem no feed |
| **Media Entities** | ↔ bidirecional | Rádios tocam músicas (boost chart). Programas de TV promovem lançamentos |

## Formulas

#### Qualidade da Música

```
// Encomenda a compositor (fama do compositor influencia)
qualidade = base_compositor × fama_compositor_mult × (0.8 + random(0, 0.4))
  base_compositor = proporcional ao custo/experiência
  fama_compositor_mult = 1.0 + (fama_compositor / 50)

// Idol compõe
qualidade = ((Vocal + Aura) / 2) × (0.7 + random(0, 0.6))
  Mínimo: 10. Máximo: 100
  Fama de compositor da idol = 0 inicialmente (carreira separada)

// Cover
qualidade = ((stats_idol_relevantes) / 2) × popularidade_original_mult × 0.7
  popularidade_original_mult = top 10 = 1.5, top 100 = 1.0, legado = 0.8
```

#### Fama do Compositor

```
fama_compositor = sum(meses_no_chart × bonus_posicao_maxima) pra todas músicas

Bônus por posição máxima:
  #100-80: ×1.0    #80-60: ×1.1    #60-40: ×1.2
  #40-20:  ×1.3    #20-10: ×1.5    Top 10: ×2.0

Exemplo: 3 músicas no chart:
  1 mês, max #80 → 1×1.0 = 1.0
  3 meses, max #20 → 3×1.3 = 3.9
  2 meses, max #3 → 2×2.0 = 4.0
  Fama total: 8.9
```

#### Pool de Ouvintes e Revenue Share (Diário)

```
// Pool de ouvintes
ouvintes = idols_ativas × 100.000
slots_dia = ouvintes × 288  // 288 músicas de 5 min por dia

// Revenue share de cada música
share_musica = score_musica / soma_todos_scores
receita_diaria_musica = share_musica × RECEITA_TOTAL_POOL_DIA

// Ouvintes por região
ouvintes_regiao = idols_ativas_regiao × 100.000
  Música de idol de Osaka tem boost no pool de Kansai
```

#### Receita de Mídia Física

```
receita_fisica = unidades_vendidas × (preco_venda - custo_producao)
  unidades_vendidas = fama_artista × chart_position_mult × SALES_FACTOR
  SALES_FACTOR = calibrar por playtest

receita_total = receita_streaming + receita_fisica
```

#### Distribuição de Royalties

```
// Música encomendada
compositor: receita_total × compositor_royalty_rate (5-15%)
idol: receita_total × contrato_percent_receita
agência: receita_total - compositor - idol

// Idol compôs
idol: receita_total × contrato_percent_receita × 1.20 (+20% bônus compositor)
agência: receita_total - idol

// Cover
original: receita_total × COVER_ORIGINAL_SPLIT (15-30%)
idol: (receita_total - original) × contrato_percent_receita
agência: receita_total - original - idol
```

#### Decay do Ranking

```
score_decay = score_atual × (1 - WEEKLY_DECAY_RATE)
  WEEKLY_DECAY_RATE = 0.05 (5%/semana)
  Modificado por: nova promoção (+boost), collab (+boost), sem ação (decay normal)
```

### Release Flow

O fluxo de lançamento é detalhado no GDD `music-production.md` (seções 6-8).
Resumo da integração com charts:

#### Entrada no Chart

Quando uma música é lançada (estado "Lançada"), ela entra na competição
do ranking no próximo tick mensal com um `chart_entry_score`:

```
chart_entry_score = qualidade_musica
  × mult_fama_artista
  × mult_fama_compositor
  × mult_marketing
  × mult_sazonalidade
  × mult_tipo_release
  × mult_pre_release_hype

mult_tipo_release:
  Single:     1.0 (baseline)
  Mini Album:  0.8 por faixa (mais faixas competem entre si)
  Album:      0.6 por faixa (diluição, mas marketing promove todas)

mult_pre_release_hype: 1.0 (sem) a 1.3 (campanha completa)
  Teaser MV: +0.05
  Preview single: +0.08
  Fan exclusive: +0.07
  Press listening: +0.10
```

#### Marketing Campaign

O jogador aloca budget de marketing em 5 canais (ver `music-production.md`
seção 7 para detalhes). O efeito total no chart é:

```
mult_marketing = 1.0 + sum(canal_effect)
  canal_effect = investment / CANAL_COST_BASE × CANAL_MAX_EFFECT
  Diminishing returns: real_effect = canal_effect × (1 / (1 + total_investment / ¥50M))
```

#### Physical Media Impact

Vendas físicas (CD, vinil) contribuem para o chart score como boost
adicional proporcional às unidades vendidas:

```
physical_boost = units_sold × PHYSICAL_CHART_WEIGHT
  PHYSICAL_CHART_WEIGHT = 0.001 (1 ponto de score por 1000 unidades)
```

## Edge Cases

- **Idol compõe hit #1 e depois é rescindida**: Royalties de compositor
  continuam sendo pagos à idol enquanto música estiver no ranking
- **Compositor tier SSS ocupado por 6 meses**: Possível -- rivais também
  encomendam. Jogador precisa planejar com antecedência ou usar tier menor
- **Cover de música que já saiu do ranking**: Pode reviver a original.
  Original volta ao ranking se cover faz sucesso
- **CD produzido mas não vende**: Prejuízo absorvido pela agência. Estoque
  pode ser liquidado com desconto
- **Idol com Vocal 10 tenta compor**: Pode tentar mas qualidade será ~7-15.
  Vai floppar no ranking. Jogador desperdiçou slot de agenda
- **Coletânea com idol rank F + idol rank SSS**: Qualidade média. SSS
  carrega, mas F se beneficia com exposição (fama sobe pelo associação)
- **Duas músicas da mesma agência competindo no top 10**: Possível e bom.
  Ambas geram receita. Sem canibalização artificial

## Dependencies

**Hard:**
- Agency Economy — royalties e vendas são receita; cachê é despesa
- Time/Calendar — tick mensal pra atualizar rankings
- Contract System — % de royalties definida no contrato

**Soft:**
- Fame & Rankings — chart success gera fama
- Stats System — Vocal/Aura pra composição de idol
- Idol Database — compositores e músicas seed no World Pack
- Media Entities — rádio/TV promovem músicas
- Producer Profile (#50): Estilo (Hit Factory) afeta posição em charts +10%. Ver producer-profile.md seção 4c.

**Depended on by:**
Agency Economy (receita), Fame & Rankings (fama de charts), News Feed (notícias),
Happiness (motivação de hits)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `BASE_STREAM_REVENUE` | ¥500K/mês | ¥100K-¥5M | Receita base de streaming |
| `COMPOSER_COST_BY_TIER` | Ver tabela | ¥50K-¥100M | Custo de encomendar música |
| `COMPOSER_ROYALTY_RATE` | 5-15% | 1-30% | % pro compositor |
| `COVER_ORIGINAL_SPLIT` | 20% | 10-40% | % pro artista original em covers |
| `IDOL_COMPOSER_BONUS` | 1.20 (+20%) | 1.10-1.50 | Bônus pra idol que compõe |
| `WEEKLY_DECAY_RATE` | 0.05 | 0.02-0.10 | Velocidade de queda no ranking |
| `CD_PRODUCTION_COST` | ¥500/un | ¥200-¥1000 | Custo unitário de CD |
| `CHART_TOP_SIZE` | 100 | 50-200 | Quantas músicas no ranking |
| `COMPOSITION_WEEKS` | 1-4 | 1-8 | Semanas pra idol compor |

## Acceptance Criteria

1. 3 vias de criação produzem músicas com qualidade calculada corretamente
2. Ranking mensal ordena top 100 músicas por score
3. Royalties são distribuídos conforme fórmula (compositor, idol, agência, original)
4. Idol que compôs recebe bônus de +20% mesmo após rescisão
5. Covers pagam 15-30% ao artista original
6. Mídia física (CD/vinil) tem custo de produção e receita proporcional a vendas
7. Gráfica própria (facility) reduz custo de produção em 40%
8. Compositores NPC podem estar ocupados (disputados com rivais)
9. Decay natural faz músicas caírem do ranking após meses
10. Estado inicial tem ranking populado com músicas dos 5 anos simulados
11. Jogador pode nomear músicas de suas idols

## Open Questions

- **RESOLVIDO**: Gênero musical é label. Rádio com gênero específico dá boost
  pra músicas que matcham. Playlists da semana viram notícias
- **RESOLVIDO**: Álbum vs single: álbum custa mais (mais faixas) mas marketing
  promove TODAS as faixas pelo mesmo custo. Investimento com ROI melhor se popular
- **RESOLVIDO**: Sazonalidade: Hanami +20%, Golden Week +20%, Obon +15%,
  Natal/Fim Ano +25%, Ano Novo +15%
- **RESOLVIDO**: Playlists: rádios com gênero dão boost. Playlists são notícia
- **RESOLVIDO**: Social media: 1 plataforma inicialmente, canal de marketing + viral
- **RESOLVIDO**: Streaming: canal de famoso = fãs novos, canal próprio = share do pool
- RECEITA_TOTAL_POOL_DIA precisa de calibração por playtest. Valor base TBD
- Programas regulares de TV (residência musical): como tipo de job concorrido
  aberto a todas agências -- detalhar no Media Entities GDD
