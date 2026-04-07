# Music Entities

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real
> **Related**: setlist-system.md, show-system.md, music-charts.md, idol-attribute-stats.md
> **Supersedes**: Seção de composição/gravação de `music-charts.md` (que mantém charts e rankings)

## Overview

Músicas no Star Idol Agency não são apenas itens de catálogo. Cada música é uma
**entidade mecânica com dois lados**: requisitos de performance (o que exige
da idol) e potencial de recepção (como a audiência reage). Juntos, esses dois
lados determinam se uma música brilha ou fracassa no show, no chart, e na
memória dos fãs.

**Princípio**: Uma música difícil com requisito vocal alto pode ser um
desastre para uma idol com Vocal 40 — ou o momento que define a carreira de
uma idol com Vocal 90. A escolha de qual música tocar, quando, e com quem, é
tão tática quanto a escalação de um time.

## Player Fantasy

A fantasia é de **A&R que constrói repertório**. Encomendar a música perfeita
para sua ace, descobrir uma cover que encaixa perfeitamente com o perfil vocal
da novata, arriscar uma música difícil no festival porque a recompensa é enorme.
Sentir a satisfação quando "aquela música" vira hit — e a frustração quando
uma música que custou caro não encaixa com ninguém do roster.

## Detailed Design

### 1. Ficha da Música

```
Music {
  id:              uint32
  title:           string
  composer:        Composer          // quem compôs (tier, estilo)
  origin:          "original" | "cover" | "idol_composed"
  genre:           enum (Pop, Rock, Ballad, Dance, Enka, Idol, R&B, EDM, ...)
  era:             Year              // ano de composição/lançamento
  language:        "ja" | "en" | "mixed"

  // === LADO 1: REQUISITOS DE PERFORMANCE ===
  requirements: {
    vocal:         1-100     // Exigência vocal (range, afinação, potência)
    dance:         1-100     // Exigência coreográfica
    presence:      1-100     // Exigência de presença de palco / Aura
    stamina:       1-100     // Demanda física (duração, intensidade)
  }
  vocal_profile: {
    tessitura:     enum (Soprano, Mezzo, Alto, Tenor, Baritone)
    texture:       enum (Clear, Breathy, Husky, Powerful, Sweet, Raw)
    vocal_role:    enum (Lead, Harmony, Rap, Spoken)
  }

  // === LADO 2: POTENCIAL DE RECEPÇÃO ===
  reception: {
    catchiness:    1-100     // Quão "grudenta" é (afeta charts)
    emotional:     1-100     // Profundidade emocional (afeta loyalty dos fãs)
    energy:        1-100     // Energia da música (afeta engagement ao vivo)
    novelty:       1-100     // Originalidade (decai com repetição)
  }

  // === METADATA ===
  duration_sec:    uint16    // Duração em segundos (180-360 típico)
  bpm:             uint16    // Batidas por minuto (afeta pacing na setlist)
  mood:            enum (Upbeat, Melancholic, Hype, Intimate, Anthemic, Dark)
  released:        bool      // Já lançada oficialmente?
  chart_peak:      uint16?   // Melhor posição no chart (se lançada)
  familiarity:     0-100     // Quão conhecida pelo público geral
}
```

### 2. Os Dois Lados de uma Música

#### Lado 1: Requisitos de Performance

Definem **o que a música exige** de quem a performa:

| Requisito | O que mede | Exemplo baixo | Exemplo alto |
|---|---|---|---|
| **Vocal** | Dificuldade vocal (range, notas longas, riffs) | Talk-song simples (20) | Ballad com notas altíssimas (90) |
| **Dance** | Complexidade coreográfica | Balançar no ritmo (15) | Coreografia sincronizada intensa (85) |
| **Presence** | Demanda de presença/performance artística | Seguir marcação básica (20) | Dominar arena com expressão (80) |
| **Stamina** | Desgaste físico da performance | Cantar sentada (10) | Coreografia de 5min sem parar (75) |

**Match idol ↔ música**: Quando uma idol performa uma música, cada atributo
dela é comparado com o requisito correspondente. O match determina a qualidade.

```
match(atributo, requisito) =
  SE atributo >= requisito:
    1.0 + (atributo - requisito) × 0.005   // Bônus marginal
  SE atributo < requisito:
    atributo / requisito                     // Penalidade proporcional
```

#### Lado 2: Potencial de Recepção

Define **como a audiência pode reagir** à música:

| Potencial | O que mede | Impacto |
|---|---|---|
| **Catchiness** | Melodia grudenta, refrão memorável | Charts: posição e permanência. Fãs cantam junto |
| **Emotional** | Profundidade emocional, capacidade de emocionar | Loyalty dos fãs, momento "lágrimas na arena" |
| **Energy** | Intensidade, hype, faz querer pular | Engagement ao vivo, abertura/encerramento de show |
| **Novelty** | Originalidade, elemento surpresa | Impacto na primeira vez. **Decai com repetição** |

**Novelty decay**: Toda vez que a música é tocada num show, novelty cai:
```
novelty_efetiva = novelty_base × (NOVELTY_DECAY ^ vezes_tocada)
NOVELTY_DECAY = 0.95  // -5% por execução

Após 20 shows: novelty efetiva = base × 0.36 (36%)
Após 50 shows: novelty efetiva = base × 0.08 (8%)
```

Compensado por **familiarity**: músicas repetidas ganham familiaridade, e fãs
gostam de cantar junto. O trade-off: novidade vs. familiaridade.

### 3. Perfil Vocal — Sistema Híbrido

Cada música tem um **perfil vocal ideal** — a combinação de atributo numérico
(Vocal 0-100) com classificação qualitativa:

#### Tessitura
| Classe | Range | Músicas típicas |
|---|---|---|
| **Soprano** | Agudo (C4-C6) | Pop alto, power ballads |
| **Mezzo** | Médio (A3-A5) | Pop standard, maioria idol |
| **Alto** | Grave feminino (F3-F5) | R&B, jazz, músicas maduras |
| **Tenor** | Agudo masculino (C3-C5) | Pop masculino |
| **Baritone** | Grave masculino (A2-A4) | Rock, baladas graves |

#### Textura Vocal
| Classe | Descrição | Vantagem |
|---|---|---|
| **Clear** | Limpa, precisa | Músicas técnicas, harmonias |
| **Breathy** | Aerada, suave | Ballads intimistas |
| **Husky** | Rouca, texturada | Rock, R&B, músicas com atitude |
| **Powerful** | Potente, projeção | Anthems, músicas de arena |
| **Sweet** | Doce, leve | Idol pop clássico |
| **Raw** | Crua, emocional | Punk, alternativo, músicas confessionais |

#### Vocal Role
| Classe | Função na música | Quem faz |
|---|---|---|
| **Lead** | Melodia principal | Center vocal do grupo / solista |
| **Harmony** | Harmonias e backing vocal | Membros de suporte |
| **Rap** | Partes faladas/rap | Idol com flow e Comunicação |
| **Spoken** | Narração, talk-song | Comunicação + Carisma |

**Vocal Fit**: Quando a tessitura/textura da idol combina com a música:
```
vocal_fit = 1.0 (match perfeito)
          = 0.85 (adjacente — ex: Mezzo cantando Soprano)
          = 0.65 (incompatível — ex: Alto cantando Soprano)

performance_vocal = match_vocal × vocal_fit
```

Idols também têm perfil vocal (definido no idol-attribute-stats.md revisado).

### 4. Tipos de Origem

| Origem | Custo | Qualidade | Propriedade |
|---|---|---|---|
| **Original** | Cachê do compositor (¥500K-¥20M) | Depende do tier do compositor | Agência (royalties vão pro compositor + agência) |
| **Cover** | Licença (¥100K-¥2M) | Fixa (da música original) | Artista original (royalties limitadas) |
| **Idol Composed** | ¥0 (tempo da idol) | Depende de Vocal + Aura + skill composição | Agência + idol (split) |

**Composição pela idol** (slot especial na agenda):
```
qualidade_composicao =
  (Vocal × 0.4 + Aura × 0.3 + Comunicação × 0.2 + Adaptabilidade × 0.1)
  × mult_experiencia   // Mais músicas compostas = melhor
  × random(0.7, 1.3)   // Inspiração

Se A&R contratado: qualidade × 1.2 (mentoria e refinamento)
```

### 5. Músicas e Shows

Uma música numa setlist (show-system.md) é processada assim:

```
performance_musica = execucao_idol(stats vs requisitos)
                   × mastery(idol, musica)      // setlist-system.md
                   × vocal_fit                   // match de perfil vocal
                   × producao                    // staff-functional.md

reacao_audiencia = recepcao_potencial(musica)
                 × performance_musica
                 × familiaridade(audiencia)
                 × pacing_bonus(posicao_setlist) // setlist-system.md
```

### 6. Músicas e Charts

Quando uma música é lançada oficialmente (single, album, digital):

```
chart_score = catchiness × mult_fama × mult_promocao × mult_timing
            + streaming_bonus × catchiness
            + fan_purchase × loyalty

posicao_chart = ranking por chart_score entre todas músicas ativas
```

Detalhes completos em `music-charts.md` (que mantém a mecânica de charts
e rankings musicais).

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Em Composição** | Sendo escrita (compositor ou idol) | → Composta (completa) |
| **Composta** | Pronta mas não gravada/lançada | → Em Gravação, → Na Setlist (não precisa lançar pra tocar) |
| **Em Gravação** | No studio | → Gravada |
| **Gravada** | Studio version pronta | → Lançada (release), → Na Setlist |
| **Lançada** | No mercado (charts, streaming) | → Fora do Chart (se cair), permanece lançada |
| **Na Setlist** | Incluída na setlist de show | Pode estar em qualquer outro estado simultâneo |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **setlist-system.md** | → compõe | Músicas são os blocos da setlist |
| **show-system.md** | → processada | Requisitos vs. stats = performance por música |
| **audience-system.md** | → recepção | Potencial de recepção afeta engagement |
| **idol-attribute-stats.md** | ← match | Stats da idol comparados com requisitos |
| **music-charts.md** | → charts | Músicas lançadas competem no chart |
| **agency-economy.md** | ← custos / → receita | Cachê de compositor. Royalties de lançamento |
| **staff-functional.md** | ← qualidade | A&R melhora composição. Produtor melhora gravação |

## Formulas

### Qualidade de Composição Original

```
qualidade_original = skill_compositor × COMPOSER_QUALITY_FACTOR
                   + random(-5, +5)    // variância criativa

COMPOSER_QUALITY_FACTOR:
  Compositor tier F: ×0.4
  Compositor tier C: ×0.7
  Compositor tier B: ×1.0
  Compositor tier A: ×1.3
  Compositor tier S: ×1.6

// Distribui qualidade entre os 4 potenciais de recepção
// baseado no estilo do compositor:
//   Pop comercial: catchiness alta, emotional médio
//   Artístico: emotional alto, novelty alto, catchiness baixo
//   Hitmaker: catchiness muito alta, energia alta
```

### Custo de Compositor

```
custo_compositor = BASE_COMPOSER_FEE × mult_tier × mult_exclusividade

BASE_COMPOSER_FEE = ¥1M
mult_tier: F=0.5, E=0.8, C=1.0, B=2.0, A=5.0, S=10.0+
mult_exclusividade: 1.0 (não exclusivo), 2.0 (exclusivo por 6 meses)
```

## Edge Cases

- **Música com vocal 95 mas dance 10**: Ballad pura. Idol com Vocal alto
  brilha independente de Dança. Match perfeito para idol especializada
- **Cover de hit famoso**: Familiarity alta desde o início (público conhece).
  Mas novelty 0 — precisa de boa performance para se destacar
- **Idol compondo com Vocal 30**: Qualidade baixa. A&R pode rejeitar (se
  contratado). Sem A&R, música medíocre entra no catálogo
- **Mesma música tocada 50 vezes**: Novelty quase zero. Mas familiarity
  altíssima — fãs cantam junto. Trade-off: energia de novidade vs. nostalgia
- **Música com requisitos acima de qualquer idol do roster**: Ninguém performa
  bem. Pode ser mantida como "meta" de desenvolvimento — quando a idol crescer,
  será o momento de debut dela
- **Compositor tier S escrevendo pra agência Garagem**: Possível se tiver
  dinheiro (¥10M+). Música de qualidade alta em agência sem idol que faça
  justiça. Investimento de longo prazo
- **Idol com tessitura Alto cantando música Soprano**: Vocal fit 0.65.
  Performance vocal penalizada em ~35%. Pode compensar com outros atributos
  altos, mas nunca será ideal

## Dependencies

**Hard:**
- idol-attribute-stats.md — stats definem match com requisitos

**Soft:**
- music-charts.md — charts e rankings de músicas lançadas
- staff-functional.md — A&R e produtor musical afetam qualidade
- agency-economy.md — custos de compositor e receita de royalties

**Depended on by:**
- setlist-system.md — músicas compõem setlists
- show-system.md — performance calculada por música
- audience-system.md — recepção baseada nos potenciais

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `NOVELTY_DECAY` | 0.95 | 0.90-0.99 | Velocidade de decaimento de novelty |
| `VOCAL_FIT_ADJACENT` | 0.85 | 0.75-0.95 | Penalidade por tessitura adjacente |
| `VOCAL_FIT_INCOMPATIBLE` | 0.65 | 0.5-0.8 | Penalidade por tessitura incompatível |
| `COMPOSER_QUALITY_FACTOR_S` | 1.6 | 1.3-2.0 | Qualidade de compositor S tier |
| `BASE_COMPOSER_FEE` | ¥1M | ¥500K-¥3M | Custo base de encomendar música |
| `IDOL_COMPOSE_VOCAL_WEIGHT` | 0.4 | 0.3-0.5 | Peso de Vocal na composição pela idol |

## Acceptance Criteria

1. Cada música tem 4 requisitos de performance (vocal, dance, presence, stamina)
2. Cada música tem 4 potenciais de recepção (catchiness, emotional, energy, novelty)
3. Perfil vocal (tessitura, textura, vocal role) afeta vocal fit
4. Match idol ↔ música calcula performance com penalidade proporcional
5. Novelty decai com repetição (×0.95 por execução)
6. 3 origens (original, cover, idol composed) com custos e regras distintas
7. Compositores têm tiers que afetam qualidade e custo
8. A&R contratado melhora qualidade de composições em 20%
9. Músicas podem ser tocadas em show sem ser lançadas oficialmente
10. Vocal fit penaliza tessituras incompatíveis em 35%

## Open Questions

- Nenhuma pendente
