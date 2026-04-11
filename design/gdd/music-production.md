# Music Production Pipeline

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-06
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 2 — Suas Decisões, Suas Consequências
> **Related**: music-entities.md (entidades musicais), music-charts.md (charts e rankings), setlist-system.md (mastery), job-assignment.md (Gravação como job), agency-economy.md (custos e receita), staff-functional.md (A&R / Music Producer), schedule-agenda.md (slots de agenda)
> **Wireframe**: design/wireframes/73-music-production-pipeline.md

## Overview

O Music Production Pipeline gerencia o ciclo completo de criação musical: desde
a encomenda ou composição até o lançamento no mercado. Uma música passa por uma
**fase criativa** — onde Música, Letra e Arranjo acontecem em paralelo como
partes interdependentes — seguida de **Coreografia** e **Gravação** em sequência.
Cada parte/estágio tem duração, staff necessário, facilities envolvidas e fórmula
de qualidade própria. O jogador gerencia múltiplos projetos musicais em paralelo via Kanban
(wireframe 73), decide o caminho de aquisição (encomenda a NPC, composição pela
idol, cover licenciado), e controla o release flow (single vs álbum, marketing,
mídia física).

**Princípio**: Criar uma música não é instantâneo. É um projeto com etapas,
dependências e gargalos. Um bom A&R acelera tudo. Sem coreógrafo, a música
trava. Sem estúdio, a gravação custa mais. Cada decisão na pipeline afeta
qualidade e custo — e qualidade afeta charts (music-charts.md).

## Player Fantasy

A fantasia é de **produtor executivo de uma gravadora**. Encomendar faixas a
compositores disputados, montar a sessão de gravação perfeita com suas idols
mais fortes, decidir se lança single rápido pra testar o mercado ou investe
num álbum completo com campanha de marketing. Sentir que cada música é um
**projeto** com riscos, custos e recompensas — não um item que aparece
magicamente no catálogo.

## Detailed Design

### 1. Pipeline de Produção — Fase Criativa + Sequência

Toda música (original ou cover) passa pelo pipeline abaixo. A **fase criativa**
(Música + Letra + Arranjo) acontece em paralelo — suas três partes são
interdependentes e se completam juntas. Só após a fase criativa estar 100%
concluída a pipeline avança para Coreografia e depois Gravação (sequenciais).
Cada estágio avança automaticamente no tick semanal conforme as condições são atendidas.

```
MusicProject {
  id:              uint32
  title:           string
  origin:          "commissioned" | "idol_composed" | "cover" | "cover_as_is"
  genre:           enum (Pop, Rock, Ballad, Dance, Enka, Idol, R&B, EDM, ...)
  target_artist:   Idol | Group       // quem vai gravar
  stage:           enum (FaseCriativa, Coreografia, Gravacao, Concluido)
  stage_progress:  0-100              // progresso no estágio atual (%)
  stage_quality:   float[]            // qualidade calculada por estágio [0-100]
  stalled:         bool               // travado por falta de recurso
  stall_reason:    string?            // "sem coreógrafo", "sem estúdio", etc.
  started_week:    uint16             // semana do calendário em que iniciou
  completed_week:  uint16?            // semana em que ficou pronta

  // Atribuições
  composer:        Composer | Idol    // quem compõe
  arranger:        Composer | Staff?  // quem faz arranjo (pode ser o compositor)
  choreographer:   Staff?             // NPC coreógrafo (null = sem coreografia)
  recording_idols: Idol[]             // quem grava
  producer:        Staff?             // A&R / Music Producer (staff-functional.md)
}
```

#### Fase Criativa — Música + Letra + Arranjo (paralelo)

As três partes da fase criativa (Música/melodia, Letra, Arranjo) correm em
paralelo e se influenciam mutuamente. A fase só avança quando todas as três
estão completas. O progresso da fase criativa é o mínimo de progresso entre
as três partes.

**Parte: Música/Melodia (Composição)**

| Aspecto | Valor |
|---|---|
| **Duração base** | 2-5 semanas (compositor NPC) / 2-8 semanas (idol) |
| **Staff necessário** | Compositor (NPC ou idol). A&R opcional (+20% qualidade) |
| **Facility necessária** | Nenhuma (compositor trabalha externo) |
| **Stall condition** | Compositor não atribuído, ou compositor ocupado por outro projeto |

```
qualidade_composicao =
  SE compositor NPC:
    skill_compositor × COMPOSER_QUALITY_FACTOR[tier]
    × (1 + fama_compositor / 100)
    × random(0.8, 1.2)
    × mult_a_and_r

  SE idol compõe:
    (Vocal × 0.4 + Aura × 0.3 + Comunicação × 0.2 + Adaptabilidade × 0.1)
    × mult_experiencia_composicao
    × random(0.85, 1.15)
    × mult_a_and_r

  SE cover:
    qualidade_original × 1.0  // cover usa qualidade da música original

  mult_a_and_r = 1.0 (sem A&R) | 1.2 (A&R contratado, skill ≥10)
               | 1.0 + (skill_a_and_r / 50) (proporcional ao skill)

  mult_experiencia_composicao = 1.0 + (musicas_compostas_antes × 0.05)
    Cap: 1.5 (10+ músicas compostas)

duracao_composicao =
  SE compositor NPC:
    BASE_COMPOSE_WEEKS_NPC × (1 - skill_compositor / 40)
    Mínimo: 2 semanas. Máximo: 5 semanas.

  SE idol compõe:
    BASE_COMPOSE_WEEKS_IDOL × (1 - Adaptabilidade / 200)
    × (1 / mult_experiencia_composicao)
    Mínimo: 2 semanas. Máximo: 8 semanas.
    Idol ocupa 1 slot/dia de agenda durante composição.
```

**Compositor NPC ocupado**: Se o compositor escolhido está trabalhando em
outro projeto (próprio ou de agência rival), o estágio fica **stalled** até
que ele termine ou o jogador atribua outro compositor.

**Parte: Arranjo** (corre em paralelo com Música e Letra)

| Aspecto | Valor |
|---|---|
| **Duração base** | 1-3 semanas |
| **Staff necessário** | Arranjador (pode ser o compositor, NPC dedicado, ou A&R) |
| **Facility necessária** | Nenhuma (trabalho externo) |
| **Stall condition** | Sem arranjador atribuído |

```
qualidade_arranjo =
  skill_arranjador × 0.8
  × genre_match(arranjador, musica)    // 1.0 match, 0.8 mismatch
  × random(0.85, 1.15)
  × mult_a_and_r

genre_match =
  1.0 SE arranjador.specialty == musica.genre
  0.9 SE gênero adjacente (Pop↔Idol, Rock↔EDM, etc.)
  0.8 SE gênero não relacionado

duracao_arranjo =
  BASE_ARRANGE_WEEKS × (1 - skill_arranjador / 40)
  Mínimo: 1 semana. Máximo: 3 semanas.
```

**Automação**: Se o compositor NPC tem skill ≥ 12, ele pode fazer o arranjo
automaticamente (sem arranjador separado) com qualidade 90% do que faria
um arranjador dedicado. Economiza tempo e custo.

**Nota sobre Letra**: A letra corre em paralelo com Música e Arranjo. Se o
compositor NPC também escreve letras (skill ≥ 10), a parte de Letra é incluída
automaticamente na fase criativa sem custo extra. Caso contrário, um letrista
separado (NPC ou idol com Comunicação ≥ 60) pode ser atribuído.

#### Estágio 2: Coreografia *(após fase criativa concluída)*

| Aspecto | Valor |
|---|---|
| **Duração base** | 1-4 semanas |
| **Staff necessário** | Coreógrafo (NPC staff ou idol promovida) |
| **Facility necessária** | Studio de Dança nível 1+ (facility da agência) |
| **Stall condition** | Sem coreógrafo OU sem Studio de Dança |

```
qualidade_coreografia =
  skill_coreografo × 0.7
  × dance_req_match(coreografia, target_artist)
  × random(0.85, 1.15)
  × mult_studio_danca

dance_req_match =
  // Coreógrafo ajusta dificuldade ao nível da idol/grupo
  SE avg_dance_target >= 70:  1.0  (pode fazer coreografia complexa)
  SE avg_dance_target >= 40:  0.85 (coreografia simplificada)
  SE avg_dance_target < 40:   0.7  (coreografia básica, menos impactante)

mult_studio_danca =
  Nível 1: 1.0   Nível 2: 1.1   Nível 3: 1.2

duracao_coreografia =
  BASE_CHOREO_WEEKS × (1 - skill_coreografo / 40)
  × (1 + num_membros_grupo / 20)   // grupos maiores demoram mais
  Mínimo: 1 semana. Máximo: 4 semanas.
```

**Música sem coreografia**: Para ballads puras ou músicas onde Dance
requirement < 20, coreografia é **opcional**. Se pulada, a música ganha
`requirements.dance = 0` e `qualidade_coreografia = N/A` (não entra na
média final). Isso permite lançar mais rápido mas limita potencial de
performance ao vivo.

**Idol promovida como coreógrafa**: Idols com Dance ≥ 70 podem ser
promovidas a coreógrafa (ocupa slot de agenda como Support Activity).
Skill = Dance / 5 (range: 14-20). Bônus: +10% se a coreógrafa é
membro do grupo que vai performar (chemistry).

#### Estágio 3: Gravação *(após coreografia concluída ou dispensada)*

| Aspecto | Valor |
|---|---|
| **Duração base** | 1-3 semanas |
| **Staff necessário** | Music Producer / A&R. Idols escaladas |
| **Facility necessária** | Studio de Gravação (facility). Sem studio = gravação externa (custo ×2) |
| **Stall condition** | Sem idols escaladas, ou todas idols com agenda lotada |

```
qualidade_gravacao =
  avg(vocal_match(idol, musica) para cada idol em recording_idols)
  × vocal_fit_medio                    // tessitura/textura match (music-entities.md)
  × mult_producer
  × mult_studio
  × mult_wellness_medio
  × random(0.9, 1.1)

vocal_match(idol, musica) =
  SE idol.Vocal >= musica.requirements.vocal:
    1.0 + (idol.Vocal - musica.requirements.vocal) × 0.003
  SE idol.Vocal < musica.requirements.vocal:
    idol.Vocal / musica.requirements.vocal

vocal_fit_medio = media(vocal_fit(idol, musica)) para cada idol
  // vocal_fit definido em music-entities.md (tessitura + textura match)

mult_producer =
  0.7  (sem producer — jogador supervisiona, qualidade base)
  1.0  (producer skill 10)
  1.0 + (skill_producer - 10) / 40  (proporcional, cap 1.25 com skill 20)

mult_studio =
  0.6  (gravação externa — sem Studio de Gravação)
  0.8  (Studio nível 1)
  1.0  (Studio nível 2)
  1.2  (Studio nível 3)

mult_wellness_medio = media(wellness_factor(idol)) para cada idol
  wellness_factor =
    1.0 SE stress < 40 AND saúde > 60
    0.9 SE stress 40-70 OR saúde 40-60
    0.7 SE stress > 70 OR saúde < 40

duracao_gravacao =
  BASE_RECORD_WEEKS × (1 + (num_idols - 1) × 0.3)
  × (1 - skill_producer / 40)
  Mínimo: 1 semana. Máximo: 3 semanas.
  Cada idol ocupa 1 slot de agenda por dia de gravação.
```

**Multi-idol coordination**: Quando múltiplas idols gravam (grupo), todas
precisam de slot livre na mesma semana. Se uma idol está indisponível, a
gravação pode prosseguir sem ela (parte gravada separado depois) com
penalidade de -10% em qualidade de gravação por idol ausente na sessão
principal. A&R/Producer com skill ≥ 14 reduz essa penalidade pra -5%.

### 2. Qualidade Final da Música

A qualidade final da música agrega os estágios:

```
qualidade_final =
  qualidade_composicao × PESO_COMPOSICAO
  + qualidade_arranjo × PESO_ARRANJO
  + qualidade_coreografia × PESO_COREOGRAFIA   // 0 se não aplicável
  + qualidade_gravacao × PESO_GRAVACAO

PESO_COMPOSICAO   = 0.40   // composição é o fator dominante
PESO_ARRANJO      = 0.15
PESO_COREOGRAFIA  = 0.15   // redistribuído se N/A: composição ganha 0.10, arranjo ganha 0.05
PESO_GRAVACAO     = 0.30

SE coreografia N/A:
  PESO_COMPOSICAO = 0.50, PESO_ARRANJO = 0.20, PESO_GRAVACAO = 0.30, PESO_COREOGRAFIA = 0

qualidade_final é clamped a [1, 100].
```

A qualidade_final alimenta `Music.reception` (music-entities.md) e
`chart_score` (music-charts.md):

```
// Distribuição da qualidade_final nos 4 potenciais de recepção
// baseada no estilo do compositor e gênero:
catchiness  = qualidade_final × weight_catchiness[genre]
emotional   = qualidade_final × weight_emotional[genre]
energy      = qualidade_final × weight_energy[genre]
novelty     = qualidade_final × weight_novelty[genre] × mult_novidade

weight_catchiness: Pop=0.35, Rock=0.20, Ballad=0.15, Dance=0.30, Idol=0.35, EDM=0.25
weight_emotional:  Pop=0.20, Rock=0.25, Ballad=0.45, Dance=0.10, Idol=0.20, EDM=0.10
weight_energy:     Pop=0.25, Rock=0.35, Ballad=0.10, Dance=0.40, Idol=0.25, EDM=0.45
weight_novelty:    Pop=0.20, Rock=0.20, Ballad=0.30, Dance=0.20, Idol=0.20, EDM=0.20

mult_novidade = 1.2 SE primeiro single do artista (debut)
              = 1.0 normal
              = 0.9 SE 3+ músicas do mesmo gênero lançadas nos últimos 3 meses (saturação)
```

### 3. Commissioning de Compositores NPC

O jogador acessa o pool de compositores pelo painel do Estúdio Musical
(wireframe 73, aba "Compositores").

#### 3a. Browse e Filtros

```
Filtros disponíveis:
  - Gênero/specialty: Pop, Rock, Ballad, Dance, etc.
  - Tier: F, E, D, C, B, A, S
  - Custo máximo: ¥ slider
  - Disponibilidade: "Livre agora" / "Todos"
  - Região: Kanto, Kansai, etc.
  - Fama mínima: slider
  - Ordenação: por skill, por custo, por fama, por disponibilidade
```

#### 3b. Pool de Compositores

~150 compositores no World Pack padrão (100-200 range). Distribuição:

| Tier | Quantidade | Skill Range | Custo por faixa | Royalty rate |
|---|---|---|---|---|
| F | ~40 | 4-7 | ¥100K-¥500K | 5% |
| E | ~35 | 6-9 | ¥300K-¥1M | 5-7% |
| D | ~30 | 8-11 | ¥800K-¥3M | 7-8% |
| C | ~20 | 10-13 | ¥2M-¥8M | 8-10% |
| B | ~12 | 12-15 | ¥5M-¥15M | 10-12% |
| A | ~8 | 14-17 | ¥10M-¥30M | 12-14% |
| S | ~5 | 16-20 | ¥20M-¥50M | 14-15% |

#### 3c. Fluxo de Contratação

```
1. BROWSE: Jogador filtra e seleciona compositor
2. VERIFICAR: Sistema checa disponibilidade
   - Disponível: pode contratar imediatamente
   - Ocupado: mostra "Disponível em ~X semanas" (estimativa)
   - Exclusivo: compositor com contrato exclusivo com outra agência (indisponível)
3. NEGOCIAR:
   - Custo = BASE_COMPOSER_FEE × mult_tier × mult_demand
   - mult_demand = 1.0 (normal) | 1.3 (alta demanda — 2+ agências querem) | 0.8 (baixa demanda)
   - Jogador pode pagar extra (+20%) pra prioridade (entrega mais rápida: -30% duração)
4. CONFIRMAR: Cachê debitado. Compositor inicia composição no próximo tick semanal
5. DELIVERY: Compositor entrega em duracao_composicao semanas
   - Chance de atraso: 10% base. +5% por cada projeto simultâneo do compositor
   - Atraso = +1-2 semanas. Compositor notifica via News Feed
```

#### 3d. Disponibilidade e Competição

```
Cada compositor pode trabalhar em MAX_CONCURRENT_PROJECTS projetos simultâneos:
  Tier F-D: 3 projetos simultâneos
  Tier C-A: 2 projetos simultâneos
  Tier S:   1 projeto por vez (exclusividade total por projeto)

Agências rivais usam os mesmos compositores.
Compositor popular pode estar ocupado por meses.
A&R contratado sugere compositores disponíveis com melhor custo-benefício.
```

### 4. Composição pela Idol

Quando uma idol compõe sua própria música, o processo difere:

#### 4a. Pré-requisitos

```
Idol pode compor SE:
  - Motivação > 60
  - Vocal > 50 OU Aura > 50
  - Tem slot livre na agenda (Composição ocupa 1 slot/dia)
  - Não está em burnout, incapacitada, ou em turnê

Idol promovida a "Compositora" (flag permanente):
  - Primeira composição: qualquer idol que atenda pré-requisitos
  - Após 3+ músicas compostas: idol ganha flag "Compositora"
  - Compositora aparece no painel de compositores da agência
  - Pode compor para OUTROS artistas da agência (não só pra si)
```

#### 4b. Qualidade de Composição pela Idol

```
qualidade_idol_comp =
  (Vocal × 0.4 + Aura × 0.3 + Comunicação × 0.2 + Adaptabilidade × 0.1)
  × mult_experiencia     // músicas compostas anteriormente
  × mult_motivacao       // motivação no momento da composição
  × mult_a_and_r         // A&R ajuda a refinar
  × random(0.7, 1.3)     // inspiração

mult_experiencia:
  0 músicas:   1.0
  1-2 músicas: 1.1
  3-5 músicas: 1.2
  6-9 músicas: 1.3
  10+ músicas: 1.5  (cap)

mult_motivacao:
  Motivação 60-70: 1.0
  Motivação 71-85: 1.1
  Motivação 86+:   1.2

Qualidade min: 10, max: 100
```

#### 4c. Custos e Benefícios

```
Custo direto:  ¥0 (não paga cachê a si mesma)
Custo oculto:  Slots de agenda ocupados (1 slot/dia × duração)
               Idol não faz jobs/treinos durante composição

Benefícios:
  - Sem royalty de compositor (agência + idol ficam com tudo)
  - Idol recebe bônus de +20% nas royalties (music-charts.md)
  - Idol constrói fama de compositora separada
  - Idol com Motivação alta pode compor hits surpreendentes
```

### 5. Cover Licensing

Covers permitem performar/gravar músicas de outros artistas.

#### 5a. Fontes de Cover

| Fonte | Custo de licença | Disponibilidade | Royalty split |
|---|---|---|---|
| Artista da mesma agência | ¥0 | Sempre | 0% (tudo interno) |
| Artista aposentada/debutada (semi-público) | ¥100K-¥500K | Quase sempre | 10-15% |
| Artista de outra agência (ativa) | ¥500K-¥5M | Precisa negociar | 15-30% |
| Hit clássico (patrimônio público, 20+ anos) | ¥50K-¥200K | Sempre | 5% (publisher) |

#### 5b. Restrições

```
- Cover nunca supera qualidade do original: cap = qualidade_original × 0.85
- Máximo de 2 covers por álbum (se álbum tem 10+ faixas)
- Cover de música que está no Top 10: custo de licença ×3 (demanda alta)
- Cover de música da mesma agência: sem custo, sem restrição
- Cover precisa passar por Arranjo + Coreografia + Gravação (pula Composição)
```

#### 5c. Pipeline de Cover

```
Cover entra na pipeline no estágio ARRANJO (composição já existe):
  1. Arranjo: Re-arranjar pra estilo do artista (duração normal)
  2. Coreografia: Nova coreografia (ou adaptar original, -30% duração)
  3. Gravação: Normal

Qualidade do cover:
  qualidade_cover = min(
    qualidade_original × 0.85,
    qualidade_arranjo × 0.3 + qualidade_coreografia × 0.2 + qualidade_gravacao × 0.5
  )
```

### 6. Recording Sessions — Detalhamento

A gravação é o estágio mais mecânico e o que mais depende das idols.

#### 6a. Escalação de Gravação

```
Jogador escala idols pra sessão de gravação:
  - Solo: 1 idol. Grava todas as partes vocais
  - Grupo: N idols. Cada uma grava sua parte (lead, harmony, rap, spoken)
  - Collab: Idols de agências diferentes (precisa de acordo cross-agency)

Atribuição de partes vocais:
  Lead:    Idol com melhor vocal_fit pra tessitura da música
  Harmony: Idols com textura complementar (Clear + Sweet = harmonia rica)
  Rap:     Idol com Comunicação > 60 e flow
  Spoken:  Idol com Comunicação + Carisma altos
```

#### 6b. Stats que Afetam Gravação

| Stat da Idol | Peso na gravação | Efeito |
|---|---|---|
| **Vocal** | 0.45 | Qualidade técnica da voz gravada |
| **Aura** | 0.20 | Emoção e presença na gravação |
| **Comunicação** | 0.10 | Dicção, timing, expressividade |
| **Disciplina (oculto)** | 0.10 | Menos takes necessários, menos tempo |
| **Consistência (oculto)** | 0.10 | Variância menor no resultado |
| **Adaptabilidade** | 0.05 | Facilidade de gravar gêneros diferentes |

```
session_score(idol) =
  Vocal × 0.45
  + Aura × 0.20
  + Comunicação × 0.10
  + Disciplina × 0.10
  + Consistência × 0.10
  + Adaptabilidade × 0.05
```

#### 6c. Session Quality Formula

```
qualidade_gravacao =
  avg(session_score(idol) × vocal_fit(idol, musica))
    para cada idol em recording_idols
  × mult_producer          // A&R/Producer skill
  × mult_studio            // facility level
  × mult_wellness_medio    // estado físico/mental médio
  × mult_takes             // mais takes = marginal improvement
  × random(0.9, 1.1)

mult_takes:
  1 semana de gravação:  1.0
  2 semanas de gravação: 1.05 (tempo extra = refinar)
  3 semanas de gravação: 1.08 (retornos decrescentes)
```

#### 6d. Multi-idol Coordination

```
Para grupo de N idols:
  - Todas precisam de slot livre na mesma semana pra sessão principal
  - Sessão principal: todas gravam juntas. Qualidade máxima
  - Sessão parcial: idols gravam separadas. Penalidade:
    partial_penalty = 1.0 - (idols_ausentes / total_idols × 0.10)
    A&R skill ≥14: penalty reduzida × 0.5

  - Se grupo tem Chemistry alto (social-dynamics):
    chemistry_bonus = group_chemistry / 200  // max 0.5 = +50%
    Afeta: coesão vocal, harmonias naturais, dinâmica da sessão

scheduling_conflict:
  Se 2+ idols têm agenda conflitante:
    Opção A: Atrasar gravação até slot disponível (stall)
    Opção B: Gravar em sessões separadas (penalidade de -10% por ausência)
    Opção C: Substituir idol ausente por outra do roster (qualidade depende da substituta)
```

### 7. Album vs Single Assembly

Após músicas completarem a pipeline, o jogador decide como agrupar para
release.

#### 7a. Tipos de Release

```
Release {
  id:              uint32
  type:            "single" | "album" | "mini_album" | "compilation"
  title:           string
  artist:          Idol | Group
  tracklist:       Music[]          // lista ordenada de faixas
  lead_single:     Music?           // faixa principal (recebe marketing boost)
  release_date:    date             // data escolhida pelo jogador
  marketing:       MarketingCampaign?
  physical_media:  PhysicalMedia[]  // CDs, vinil, etc.
  state:           "assembling" | "pre_release" | "released"
}
```

| Tipo | Faixas | Custo marketing | Marketing ROI | Uso |
|---|---|---|---|---|
| **Single** | 1-2 | Base | Promove 1 faixa | Testar mercado, debut rápido |
| **Mini Album (EP)** | 3-5 | Base × 1.2 | Promove todas faixas | Compromisso custo/impacto |
| **Album** | 6-14 | Base × 1.0 | Promove TODAS faixas (mesmo custo do single!) | Investimento alto, ROI máximo |
| **Compilation** | 8-20 | Base × 0.8 | Promove seleção de hits | Receita passiva, legado |

**Vantagem do álbum**: Marketing custa o mesmo que single mas promove
todas as faixas. Porém custo de produção é N × custo_por_faixa.

#### 7b. Tracklist Order

```
Regras da tracklist:
  - Lead single: posição 1 ou 2 (recebe ×1.5 boost de marketing)
  - Faixas fortes: posições 1-3 e penúltima-última (recebem mais escutas)
  - Faixas fracas: meio do álbum (recebem menos escutas passivas)
  - Pacing: semelhante ao setlist (upbeat → mid → ballad → finale)

chart_entry_per_track =
  track_position_mult × qualidade_musica × marketing_mult

track_position_mult:
  Posição 1 (lead):     1.5
  Posição 2-3:          1.2
  Meio do álbum:        0.8
  Penúltima-última:     1.1
```

### 8. Release Flow

#### 8a. Escolher Data de Release

```
O jogador escolhe a data de lançamento com antecedência mínima de 2 semanas.

Fatores que afetam a escolha:
  - Sazonalidade (music-charts.md seção 6): Natal +25%, Golden Week +20%, etc.
  - Competição: se muitos releases na mesma semana, share diluído
  - Eventos da idol: lançar antes de turnê = boost por performances ao vivo
  - Aniversário da idol/grupo: lançar na data = boost de engagement de fãs

Semana de release dá boost temporário:
  chart_score × RELEASE_WEEK_BOOST (default: ×1.5 na primeira semana)
  Decai pra ×1.0 após 4 semanas
```

#### 8b. Marketing Campaign

```
MarketingCampaign {
  budget:          ¥amount           // quanto investir
  channels:        enum[]            // TV_AD, SOCIAL_MEDIA, RADIO_PUSH, BILLBOARD, COLLAB_PROMO
  duration_weeks:  uint8             // 1-8 semanas de campanha
  start_offset:    int8              // semanas antes do release (-4 a 0)
}

marketing_effect =
  budget / MARKETING_BASE_COST
  × channel_reach_sum
  × duration_diminishing        // mais semanas = retornos decrescentes
  × sazonalidade_bonus          // music-charts.md seção 6
  × social_media_staff_mult     // staff-functional.md Social Media Manager

channel_reach:
  TV_AD:          1.5  (custo alto, alcance máximo)
  SOCIAL_MEDIA:   1.2  (custo médio, viral potencial)
  RADIO_PUSH:     1.0  (custo baixo, alcance moderado)
  BILLBOARD:      0.8  (custo alto, alcance estético/branding)
  COLLAB_PROMO:   1.3  (custo variável, cross-promotion com outro artista)

duration_diminishing:
  1 semana:  1.0
  2 semanas: 1.6   (retorno de 80% por semana extra)
  4 semanas: 2.2
  8 semanas: 2.8   (retorno muito diminuído)

MARKETING_BASE_COST = ¥5M  // custo que gera efeito 1.0
Investir ¥10M: efeito 2.0. Investir ¥1M: efeito 0.2.
```

#### 8c. Pre-Release Strategy

```
Estratégias opcionais antes do release:

| Estratégia | Custo | Efeito | Antecedência |
|---|---|---|---|
| Teaser (30s clip) | ¥500K | Awareness +15% antes do release | 2-4 semanas |
| Music Video (MV) | ¥3M-¥20M | Catchiness boost +10%, awareness +30% | 1-2 semanas |
| Preview ao vivo | ¥0 (tocar em show) | Hype +20% se show tem audiência alta | 1-4 semanas |
| Fan exclusive (streaming) | ¥200K | Loyalty de fãs +10%, awareness limitada | 1 semana |
| Press listening | ¥1M | Críticas de mídia geram buzz (aleatório, pode ser negativa) | 1-2 semanas |

MV_quality =
  budget_mv / BASE_MV_COST × dance_quality × visual_quality
  dance_quality = avg(idol.Dance) / 100
  visual_quality = avg(idol.Visual) / 100
  BASE_MV_COST = ¥10M  // custo que gera MV de qualidade 1.0
```

#### 8d. Mídia Física — Decisão de Tiragem

```
O jogador decide a tiragem (quantidade) de mídia física:

PhysicalMedia {
  type:            "cd_single" | "cd_album" | "vinyl" | "box_set" | "limited_edition"
  units_ordered:   uint32           // tiragem encomendada
  unit_cost:       ¥amount          // custo de produção por unidade
  unit_price:      ¥amount          // preço de venda ao público
  bonus_content:   string[]?        // photo cards, poster, etc.
}

Custo total = units_ordered × unit_cost
  Com Gráfica própria (facility): unit_cost × 0.6 (desconto de 40%)

Vendas estimadas (o jogador vê estimativa, não número exato):
  vendas_base = fama_artista × PHYSICAL_SALES_FACTOR
              × chart_position_mult
              × marketing_mult
              × tiragem_availability   // se tiragem < demanda, esgota mas perde vendas

  chart_position_mult:
    Top 10:   ×3.0
    Top 50:   ×1.5
    Top 100:  ×1.0
    Fora:     ×0.3

Risco:
  SE vendas < units_ordered × 0.5:
    Estoque encalhado. Prejuízo = (units_ordered - vendas) × unit_cost × 0.3
    Pode liquidar com desconto (recupera 20% do custo do encalhado)

  SE vendas > units_ordered:
    Esgotado! Perde vendas potenciais mas ganha hype:
    esgotado_bonus = +10% chart score por 2 semanas (escassez = desejo)
```

| Produto | Custo/un | Preço venda | Tier agência mín. |
|---|---|---|---|
| CD single | ¥500 | ¥1,200-¥2,000 | Média |
| CD álbum | ¥800 | ¥2,500-¥3,500 | Média |
| Vinil | ¥2,000 | ¥3,000-¥5,000 | Grande |
| Box set | ¥5,000 | ¥8,000-¥20,000 | Grande |
| Limited edition | ¥3,000 | ¥5,000-¥12,000 | Média |

**Limited edition**: Tiragem máxima de 5.000 unidades. Bonus content
obrigatório (photo cards, poster, etc.). Esgota rápido = hype. Margem
alta mas volume baixo.

### 9. Release Results — Chart Entry Score

Quando um release acontece, cada música do release recebe um **chart entry
score** que a insere no ranking (music-charts.md):

```
chart_entry_score =
  qualidade_final
  × fama_artista_mult
  × fama_compositor_mult
  × marketing_total_mult
  × sazonalidade_mult
  × release_type_mult
  × pre_release_hype

fama_artista_mult = 0.5 + (fama_artista / 100)
  Fama 0: ×0.5 (desconhecida). Fama 100: ×1.5 (super estrela)

fama_compositor_mult = 1.0 + (fama_compositor / 100)
  Compositor desconhecido: ×1.0. Compositor famoso: até ×2.0

marketing_total_mult = 1.0 + (marketing_effect × MARKETING_CHART_WEIGHT)
  MARKETING_CHART_WEIGHT = 0.3
  Sem marketing: ×1.0. Marketing forte (¥10M+): até ×1.6

sazonalidade_mult = ver music-charts.md seção 6
  Normal: 1.0. Natal: 1.25. Golden Week: 1.20. etc.

release_type_mult:
  Single: 1.0
  Mini Album: 0.95 por faixa (atenção dividida, mas todas entram)
  Album: 0.90 por faixa (diluição maior, mas lead single mantém 1.0)
  Compilation: 0.7 (re-releases menos impactantes)

pre_release_hype = 1.0 + sum(bonus de cada estratégia pré-release)
  Teaser: +0.10. MV: +0.20. Preview ao vivo: +0.15. Fan exclusive: +0.08.
  Cap: 1.5 (máximo +50% de hype)
```

**Após entry**: A música segue as regras de ranking e decay de music-charts.md
(seção 4: decay semanal de 5%, bônus de promoção contínua, etc.).

**Feedback loop**: Posição no chart → mais vendas de mídia física → mais
receita → mais budget pra marketing → posição no chart. O jogador decide
quanto reinvestir.

### 10. Integration Points

#### 10a. Job Assignment (Gravação como Job)

```
Conexão: job-assignment.md define "Gravação" como tipo de job.
  - Tipo: "Gravação" (Single, Álbum, Collab, Cover)
  - Stats primários: Vocal, Dança (pra MV)
  - Duração: 1-4 semanas
  - Processamento: NÃO usa fórmula genérica de job-assignment.
    Usa fórmula de gravação DESTE GDD (seção 6c).
    job-assignment apenas agenda o slot e dispara o processamento.

Quando jogador escala "Gravação" na agenda:
  1. Job Assignment agenda slots
  2. Music Production Pipeline processa qualidade
  3. Resultado volta pra Job Assignment como "Concluído"
  4. Stats da idol crescem (Vocal +XP proporcional ao tempo gravando)
```

#### 10b. Schedule/Agenda

```
Atividades que ocupam agenda:
  - Composição (idol compõe): Support Activity, 1 slot/dia
  - Gravação: Job, 1-2 slots/dia conforme duração
  - Coreografia (idol promovida): Support Activity, 1 slot/dia
  - Nenhuma atividade de pipeline para composição NPC (externo)
  - Nenhuma atividade de pipeline para arranjo NPC (externo)

Impacto na agenda:
  - Idol compondo: perde slots pra jobs e treinos
  - Idol gravando: perde slots mas ganha XP de Vocal
  - Conflitos de agenda = stall no pipeline
```

#### 10c. Music Charts

```
Música concluída na pipeline entra no pool de "pronta pra lançar".
Release Flow (seção 8) dispara chart_entry_score.
Após lançamento, música vive no Music Charts System:
  - Ranking mensal/diário
  - Revenue share do pool de ouvintes
  - Decay semanal
  - Promoção contínua possível

Pipeline → qualidade_final → chart_entry_score → posição no ranking → receita
```

#### 10d. Agency Economy

```
CUSTOS (despesas na pipeline):
  - Cachê de compositor NPC: ¥100K-¥50M (pontual, ao encomendar)
  - Custo de arranjador externo: ¥200K-¥5M (se não usar compositor)
  - Gravação externa: custo × 2 se sem Studio de Gravação
  - Licença de cover: ¥50K-¥5M (pontual)
  - Marketing campaign: ¥1M-¥50M (por campanha)
  - MV production: ¥3M-¥20M (pontual)
  - Mídia física: tiragem × custo unitário
  - Facilities (Studio, Gráfica): custo mensal (agency-economy.md seção 6)

RECEITAS (receitas geradas):
  - Royalties de streaming: proporcional a chart position (music-charts.md)
  - Vendas de mídia física: tiragem vendida × preço - custo
  - Royalties residuais: músicas fora do chart geram receita mínima
```

#### 10e. Staff Functional (A&R / Music Producer)

```
Music Producer / A&R (staff-functional.md):
  - Melhora qualidade em TODOS os estágios (+mult_a_and_r)
  - Reduz duração de estágios (~-20% com skill alto)
  - Reduz penalidade de sessões parciais (multi-idol)
  - Sugere compositores disponíveis com melhor custo-benefício
  - Sugere timing de release (sazonalidade)
  - Pode rejeitar música de baixa qualidade antes de avançar estágio

Sem Music Producer:
  - Jogador (produtor) faz o papel com BASE_PRODUCER_QUALITY = 0.5
  - Qualidade significativamente menor
  - Sem sugestões automáticas
  - Pipeline funciona, mas com resultados medíocres
```

### States and Transitions

| Estado do Projeto | Descrição | Transição |
|---|---|---|
| **Encomendado** | Compositor atribuído, aguardando início | → Em Composição (próximo tick) |
| **Em Composição** | Estágio 1 em progresso | → Em Arranjo (composição completa) / → Stalled (compositor ocupado) |
| **Em Arranjo** | Estágio 2 em progresso | → Em Coreografia (arranjo completo) / → Stalled (sem arranjador) |
| **Em Coreografia** | Estágio 3 em progresso | → Em Gravação (coreografia completa) / → Pulado (sem coreografia) / → Stalled (sem coreógrafo/studio dança) |
| **Em Gravação** | Estágio 4 em progresso | → Concluído (gravação completa) / → Stalled (idols indisponíveis) |
| **Concluído** | Música pronta pra release | → Em Release (jogador monta release) |
| **Em Release** | Aguardando data de lançamento | → Lançada (data chega) |
| **Lançada** | No mercado (chart entry calculado) | Terminal (transita pra Music Charts System) |
| **Stalled** | Travada por falta de recurso | → Retoma estágio anterior (recurso alocado) |
| **Cancelado** | Jogador cancelou o projeto | Terminal (custos já pagos perdidos) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **music-entities.md** | → cria | Pipeline produz entidades Music com stats preenchidos |
| **music-charts.md** | → chart entry | chart_entry_score ao lançar. Receita de streaming e ranking |
| **job-assignment.md** | ↔ bidirecional | Gravação como tipo de job. Pipeline processa qualidade |
| **schedule-agenda.md** | ← slots | Composição e gravação ocupam slots da idol |
| **agency-economy.md** | ↔ bidirecional | Custos (compositor, studio, marketing, mídia). Receitas (vendas, royalties) |
| **staff-functional.md** | ← qualidade | A&R/Producer, Coreógrafo afetam qualidade e velocidade |
| **happiness-wellness.md** | ← modifica | Stress/saúde afetam qualidade de gravação |
| **fame-rankings.md** | ← modifica | Fama do artista afeta chart entry score |
| **contract-system.md** | ← lê | Royalty split definido no contrato da idol |
| **social-dynamics** | ← modifica | Chemistry de grupo afeta coesão de gravação |
| **news-feed.md** | → notícias | Lançamentos, chart entries, esgotados, atrasos no feed |
| **producer-profile.md** | ← modifica | Estilo do produtor pode afetar velocidade/qualidade |

## Formulas

### Qualidade Final Aggregada

```
qualidade_final =
  qualidade_composicao × 0.40
  + qualidade_arranjo × 0.15
  + qualidade_coreografia × 0.15
  + qualidade_gravacao × 0.30

Clamped: [1, 100]
```

### Duração Total da Pipeline

```
duracao_total =
  duracao_composicao          // 2-8 semanas
  + duracao_arranjo           // 1-3 semanas
  + duracao_coreografia       // 0-4 semanas (0 se pulada)
  + duracao_gravacao           // 1-3 semanas

Range típico:
  Pipeline rápida (NPC skill alto, sem coreografia, A&R):  4-6 semanas
  Pipeline normal (NPC médio, com coreografia):            8-12 semanas
  Pipeline lenta (idol compõe, grupo grande, sem A&R):     12-18 semanas
```

### Custo Total de Produção

```
custo_total =
  cachê_compositor             // ¥0 (idol) a ¥50M (NPC tier S)
  + custo_arranjador           // ¥0 (compositor faz) a ¥5M
  + custo_coreografo           // ¥0 (staff) ou custo externo
  + custo_gravacao             // ¥0 (studio próprio) ou ×2 (externo)
  + custo_marketing            // ¥0 a ¥50M
  + custo_mv                   // ¥0 a ¥20M
  + custo_midia_fisica         // tiragem × custo unitário

ROI_esperado = receita_charts_12_meses + vendas_fisicas - custo_total
```

### Chart Entry Score

```
chart_entry_score =
  qualidade_final
  × (0.5 + fama_artista / 100)
  × (1.0 + fama_compositor / 100)
  × (1.0 + marketing_effect × 0.3)
  × sazonalidade_mult
  × release_type_mult
  × pre_release_hype
```

## Edge Cases

- **Compositor morre/aposenta durante composição**: Projeto stalla. Jogador
  pode atribuir outro compositor que "termina" a obra, mas com penalidade de
  -15% qualidade (falta coerência artística). A&R skill ≥16 reduz penalidade
  pra -5%.
- **Idol em burnout durante gravação**: Sessão pausada (stall). Retoma
  quando idol se recupera. Se outra idol pode substituir na parte vocal,
  substituição possível mas com recast penalty (-10%).
- **Pipeline com 10+ projetos simultâneos**: Possível mas composer/staff
  bottleneck. A&R ajuda a priorizar. Sem A&R, todos projetos avançam
  igualmente devagar.
- **Album com 14 faixas, todas qualidade <30**: Pode lançar. Vai floppar no
  chart. Prejuízo de marketing + mídia física. Lição aprendida.
- **Cover de música #1 no chart agora**: Custo de licença ×3. Cover nunca
  supera original. Mas dá exposição à idol se original é mega-popular.
- **Dois projetos usando mesmo compositor simultaneamente**: Compositor com
  slots (tier F-D: 3 slots). Se todos slots ocupados, segundo projeto stalla.
  A&R avisa antes de encomendar.
- **Esgotado na primeira semana (tiragem baixa demais)**: Hype bonus +10%
  mas receita perdida. Jogador pode encomendar segunda tiragem (2 semanas
  de delay). Segunda tiragem não dá hype bonus.
- **Release na mesma semana que rival lança hit**: Chart share diluído.
  Ambas músicas competem pelo mesmo pool de ouvintes. Timing importa.
- **Idol compõe durante turnê**: Não pode (pré-requisito: sem turnê ativa).
  Precisa de estabilidade na agenda.
- **Música pronta há 6 meses sem lançar**: Sem penalidade. Música espera no
  pool. Mas novidade percebida pelo público pode diminuir se idol já tocou
  ao vivo repetidamente (novelty de music-entities.md).

## Dependencies

**Hard:**
- music-entities.md — pipeline produz entidades Music
- music-charts.md — chart entry score e ranking
- agency-economy.md — custos e receitas da pipeline
- schedule-agenda.md — slots de agenda pra composição/gravação

**Soft:**
- staff-functional.md — A&R, Coreógrafo melhoram qualidade
- job-assignment.md — Gravação como tipo de job
- happiness-wellness.md — wellness afeta gravação
- fame-rankings.md — fama afeta chart entry
- contract-system.md — royalty splits
- producer-profile.md — estilo do produtor afeta pipeline
- social-dynamics — chemistry de grupo afeta gravação

**Depended on by:**
- music-charts.md (recebe chart_entry_score de releases)
- music-entities.md (recebe entidades Music com stats populados)
- agency-economy.md (custos e receitas de produção musical)
- setlist-system.md (músicas concluídas ficam disponíveis pra setlist)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `BASE_COMPOSE_WEEKS_NPC` | 3 | 2-6 | Semanas base de composição (NPC) |
| `BASE_COMPOSE_WEEKS_IDOL` | 5 | 3-10 | Semanas base de composição (idol) |
| `BASE_ARRANGE_WEEKS` | 2 | 1-4 | Semanas base de arranjo |
| `BASE_CHOREO_WEEKS` | 2 | 1-5 | Semanas base de coreografia |
| `BASE_RECORD_WEEKS` | 2 | 1-4 | Semanas base de gravação |
| `PESO_COMPOSICAO` | 0.40 | 0.30-0.50 | Peso da composição na qualidade final |
| `PESO_ARRANJO` | 0.15 | 0.10-0.20 | Peso do arranjo na qualidade final |
| `PESO_COREOGRAFIA` | 0.15 | 0.10-0.20 | Peso da coreografia na qualidade final |
| `PESO_GRAVACAO` | 0.30 | 0.20-0.40 | Peso da gravação na qualidade final |
| `MARKETING_BASE_COST` | ¥5M | ¥1M-¥20M | Budget que gera marketing_effect 1.0 |
| `MARKETING_CHART_WEIGHT` | 0.3 | 0.1-0.5 | Peso do marketing no chart entry |
| `RELEASE_WEEK_BOOST` | 1.5 | 1.2-2.0 | Boost na semana de lançamento |
| `BASE_MV_COST` | ¥10M | ¥5M-¥30M | Custo pra MV de qualidade 1.0 |
| `PHYSICAL_SALES_FACTOR` | 100 | 50-500 | Multiplicador base de vendas físicas |
| `COVER_QUALITY_CAP` | 0.85 | 0.7-0.95 | Cap de qualidade do cover vs original |
| `MAX_CONCURRENT_PROJECTS_LOW` | 3 | 2-5 | Projetos simultâneos (compositor tier F-D) |
| `MAX_CONCURRENT_PROJECTS_HIGH` | 2 | 1-3 | Projetos simultâneos (compositor tier C-A) |
| `ESGOTADO_HYPE_BONUS` | 0.10 | 0.05-0.20 | Boost no chart quando CD esgota |
| `PARTIAL_SESSION_PENALTY` | 0.10 | 0.05-0.20 | Penalidade por idol ausente na gravação |
| `PRIORITY_FEE_MULT` | 1.20 | 1.10-1.50 | Custo extra pra prioridade de compositor |
| `PRIORITY_SPEED_MULT` | 0.70 | 0.50-0.85 | Redução de duração com prioridade |

## Acceptance Criteria

### MVP

1. Pipeline de 4 estágios (Composição → Arranjo → Coreografia → Gravação) funciona sequencialmente
2. Encomenda a compositor NPC: browse, filtro, contratação e delivery
3. Stall conditions detectadas e mostradas ao jogador (compositor ocupado, sem coreógrafo)
4. Qualidade final calculada pela fórmula agregada dos 4 estágios
5. Gravação usa stats das idols (Vocal, Aura, etc.) pra calcular session quality
6. Single release funcional com chart entry score calculado
7. Custos de produção debitados da agência

### Vertical Slice

8. Composição pela idol funcional (agenda, pré-requisitos, qualidade)
9. Cover licensing funcional (3 fontes, custo, restrições)
10. Album assembly com tracklist e lead single
11. Marketing campaign com budget e channels
12. Mídia física com tiragem, custo, vendas e risco de encalhe
13. A&R/Producer melhora qualidade e velocidade em todos estágios
14. Multi-idol coordination na gravação (sessão principal vs parcial)

### Alpha

15. Pre-release strategies (teaser, MV, preview ao vivo, fan exclusive, press listening)
16. Music Video production com qualidade proporcional ao budget
17. Kanban visual do pipeline (wireframe 73) com drag-and-drop
18. Compilations/coletâneas funcional
19. Idol promovida a compositora/coreógrafa
20. Esgotado bonus e segunda tiragem
21. Estimativa de vendas visível antes de decidir tiragem

### Full Vision

22. Compositores com contratos de exclusividade (6 meses)
23. Pipeline de até 20 projetos simultâneos com bottleneck visual
24. Limited editions com bonus content customizável
25. Press listening com reviews aleatórias (positivas/negativas)
26. Sugestões de timing do A&R baseadas em sazonalidade e competição
27. Histórico de ROI por release visível no Financial Reporting

## Open Questions

- `PHYSICAL_SALES_FACTOR` precisa de calibração por playtest (quantas
  unidades fama 50 + chart top 30 vende?)
- Custo exato de arranjador externo NPC: definir pool separado ou reusar
  compositores? Decisão atual: compositor com skill ≥12 faz arranjo
  automático; abaixo disso, precisa de arranjador externo ou A&R
- MV como job separado (envolve Dança + Visual) ou como sub-etapa do
  release? Decisão atual: sub-etapa do release com custo único e fórmula
  própria. Se necessário, pode virar job no futuro
