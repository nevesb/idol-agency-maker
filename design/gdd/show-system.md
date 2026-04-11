# Show System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 4 — O Drama Nasce das Mecânicas
> **Related**: setlist-system.md, audience-system.md, music-entities.md, staff-functional.md, idol-attribute-stats.md
> **Equivalent FM26**: Match Engine — o sistema central onde o jogo ACONTECE

## Overview

O Show System é o **sistema central** do Star Idol Agency — o equivalente
direto do Match Engine do FM26. É aqui que todas as decisões do jogador
convergem em resultado: a idol que treinou, a música que ensaiou, a setlist
que montou, a produção que investiu, tudo se manifesta no show.

Um show não é um número único de "performance". É uma **sequência de músicas**
(setlist) executada diante de uma **audiência dinâmica** (audience-system.md),
com **qualidade de produção técnica** (staff-functional.md), onde cada música
tem resultado individual e o conjunto compõe a experiência.

**Princípio**: O show é a partida de futebol. A setlist é a tática. As idols
são os jogadores. A produção é o estádio. A audiência é a torcida. Tudo
interage.

## Player Fantasy

A fantasia é de **montar o show perfeito**. Escolher a música de abertura
que vai pegar a audiência, colocar a melhor vocal no center da ballad
emocional do meio, fechar com o hit que todo mundo conhece. Investir em
iluminação premium porque o venue é uma arena e você quer aquele momento
"wow". Ver a audiência reagir música por música, sentir o momentum subir,
torcer pra que a encore funcione.

E quando dá errado: a idol esqueceu a coreografia da música 3, o engagement
caiu, a audiência ficou morna pro resto do show. Decisões reais, consequências
reais.

## Detailed Design

### 1. Anatomia de um Show

Todo show ao vivo tem estes componentes:

```
Show {
  id:              uint32
  type:            enum (Solo Concert, Group Concert, Festival Slot,
                         Fan Meeting Live, TV Live, Award Show)
  venue:           Venue          // local, capacidade, tier
  setlist:         Setlist         // lista ordenada de músicas (setlist-system.md)
  performers:      Idol[]          // idols escaladas
  production:      ProductionSetup // pacotes de produção (staff-functional.md)
  stage_manager:   Staff?          // NPC ou null
  audience:        AudienceState   // estado dinâmico (audience-system.md)

  // Timing
  date:            date
  duration_slots:  uint8           // 1 slot = ~1 hora. Show típico: 2-3 slots
}
```

### 2. Fluxo de Processamento de um Show

```
PRÉ-SHOW (decisões do jogador)
  1. Escalar idols
  2. Montar setlist (ver setlist-system.md)
  3. Definir pacotes de produção (ver staff-functional.md)
  4. Atribuir papéis (center, backing, MC) por música
  5. Confirmar — show entra na agenda

SIMULAÇÃO DO SHOW (processado no tick semanal)
  Para cada música da setlist, em ordem:
    6. Calcular performance individual de cada idol na música
    7. Aplicar modificadores: mastery, condição, produção, pacing
    8. Calcular reação da audiência (audience-system.md)
    9. Atualizar engagement cumulativo
    10. Checar eventos mid-show (erro, momento brilhante, etc.)

PÓS-SHOW (consequências)
  11. Calcular nota geral do show (agregação das músicas)
  12. Gerar feedback individual por idol por música
  13. Atualizar fama, receita, wellness, mastery
  14. Gerar headline/moment summary (week-simulation.md)
  15. Atualizar audience loyalty (audience-system.md)
```

### 3. Performance por Música

Cada música da setlist é processada individualmente. A performance depende
de três camadas:

#### Camada 1: Execução da Idol

```
execucao_idol(idol, musica) =
  match_vocal      × peso_vocal(musica)      // Vocal da idol vs. requisito vocal da música
  + match_danca    × peso_danca(musica)       // Dança vs. requisito coreográfico
  + match_presenca × peso_presenca(musica)    // Aura/Carisma vs. requisito de presença
  + match_stamina  × peso_stamina(musica)     // Resistência vs. demanda física

Cada match = min(atributo_idol / requisito_musica, 1.0)
  Se atributo > requisito: excedente gera bônus menor (diminishing returns)
  Se atributo < requisito: penalidade proporcional
```

Os requisitos de cada música vêm de `music-entities.md`.

#### Camada 2: Modificadores Contextuais

```
performance_modificada = execucao_idol
  × mult_mastery        // Mastery da idol nessa música (setlist-system.md)
  × mult_condition      // Estado atual (wellness, stress, fadiga no show)
  × mult_production     // Qualidade da produção técnica (staff-functional.md)
  × mult_pacing         // Posição na setlist afeta engagement (setlist-system.md)
  × mult_role           // Papel no show: center ×1.2, backing ×0.9
  × mult_consistency    // Oculto: Consistência (variância do resultado)
```

#### Camada 3: Eventos de Momento

Durante o processamento de cada música, há chance de **eventos de momento**:

| Evento | Chance base | Trigger | Efeito |
|---|---|---|---|
| **Momento Brilhante** | 5% | Execução > 0.9 + Aura > 80 | Audiência explode. Engagement +15%. Headline |
| **Erro de Coreografia** | 3% | Dança < requisito × 0.7 | Audiência percebe. Engagement -5% |
| **Esqueceu Letra** | 2% | Mastery < 40% + Stress > 60% | Engagement -10%. Idol stress +15 |
| **MC Emocional** | 4% | Comunicação > 70 + entre músicas | Audiência conecta. Engagement +8% |
| **Encore Espontâneo** | 3% | Só se engagement > 85% no final | Música extra. Audiência euforia |
| **Problema Técnico** | 2% | Produção < 0.5 | Pausa no show. Engagement -10% |
| **Idol se Machuca** | 1% | Resistência < 40 + Coreografia intensa | Idol sai. Penalidade severa |

### 4. Nota Geral do Show

```
nota_show = media_ponderada(performance_por_musica)
  × mult_pacing_global     // Setlist bem construída vs. mal sequenciada
  × mult_producao_global   // Produção técnica geral
  × mult_engagement_final  // Audiência ao fim do show

// Pesos por posição na setlist (ADR-007):
  // opener ×1.2 (mais importante — define o tom), meio ×1.0,
  // closer ×1.3, encore ×1.5
  abertura: ×1.2, meio: ×1.0, finale/closer: ×1.3, encore: ×1.5

// Nota convertida em letter grade (ADR-007):
  S  > 0.90   Lendário
  A  > 0.80   Excelente
  B  > 0.70   Bom
  C  > 0.60   Regular
  D  > 0.45   Fraco
  F  ≤ 0.45   Desastre
```

### 5. Tipos de Show e Suas Particularidades

| Tipo | Setlist | Audiência | Produção | Notas |
|---|---|---|---|---|
| **Solo Concert** | Full (8-15 músicas) | Dedicada (maioria fãs) | Controle total | O show "principal". Máximo controle do jogador |
| **Group Concert** | Full (10-20 músicas) | Dedicada | Controle total | Papéis por música. Sinergia de grupo importa |
| **Festival Slot** | Curta (3-5 músicas) | Mista (casual + fãs) | Parcial (venue define) | Chance de conquistar novos fãs. Pressão de tempo |
| **Fan Meeting Live** | Curta + MC (3 músicas + interação) | 100% fãs | Básica | Comunicação e Carisma pesam mais que performance |
| **TV Live** | 1-2 músicas | Audiência TV (milhões, casual) | TV controla | Visibilidade máxima. 1 erro = todo mundo viu |
| **Award Show** | 1-3 músicas | Indústria + TV | Premium (evento) | Prestígio. Mídia analisa cada detalhe |

### 6. Fadiga Intra-Show

Idols se cansam durante o show. A fadiga acumula e afeta performance:

```
fadiga_acumulada = 0

Para cada música na setlist:
  custo_fadiga = demanda_fisica(musica) × (1 / Resistência_normalizada)
  fadiga_acumulada += custo_fadiga

  // Fatigue brackets (ADR-007 — 4-bracket system):
  mult_fadiga =
    fadiga <  30: 1.00     // Fresca
    fadiga 30-50: 0.95     // Cansando
    fadiga 50-70: 0.85     // Visivelmente cansada
    fadiga 70-90: 0.70     // Exausta (audiência nota)
    fadiga >= 90: 0.50     // À beira do colapso

  performance_musica × mult_fadiga
```

// Between-song fatigue recovery (ADR-007):
//   between_song_rest: fadiga -= 2 (BETWEEN_SONG_REST = 2)
//   MC/interlude rest:  fadiga -= 5 (MC_REST_RECOVERY = 5)

**Implicação tática**: Músicas fisicamente intensas no início desgastam a
idol para o finale. Colocar a ballad depois do bloco de dança dá tempo de
recuperar. Inserir um MC/interlúdio permite recuperação mais significativa (−5
fadiga). A ordem da setlist importa.

### 7. Papéis no Show (para Grupos)

Em shows de grupo, cada idol tem um **papel por música**:

| Papel | Multiplicador | Exposição | Quem deve ocupar |
|---|---|---|---|
| **Center** | ×1.2 | Máxima (câmera focada) | Melhor match para a música |
| **Main Vocal** | ×1.1 | Alta (destaque vocal) | Maior Vocal |
| **Main Dancer** | ×1.1 | Alta (destaque coreográfico) | Maior Dança |
| **Support** | ×1.0 | Normal | Membros complementares |
| **Backing** | ×0.9 | Baixa | Membros mais fracos nessa música |
| **MC** | ×1.0 (Comunicação) | Entre músicas | Maior Comunicação |

- Papéis podem mudar **por música** na setlist
- A idol escalada como center da música 3 pode ser backing na música 7
- O produtor define (ou delega ao Talent Manager / Stage Manager)

### 8. Show como Catalisador de Outros Sistemas

O show é o ponto de convergência de TODOS os sistemas:

```
ANTES DO SHOW:
  idol-attribute-stats.md  → Stats da idol determinam execução
  setlist-system.md        → Setlist define a estrutura
  music-entities.md        → Cada música tem requisitos
  staff-functional.md      → Stage Manager + pacotes de produção
  talent-development-plans.md → Treino afetou mastery

DURANTE O SHOW:
  audience-system.md       → Audiência reage em tempo real
  happiness-wellness.md    → Stress e condição afetam performance

DEPOIS DO SHOW:
  fame-rankings.md         → Fama sobe/desce conforme resultado
  agency-economy.md        → Receita de bilheteria + merch
  happiness-wellness.md    → Stress/motivação pós-show
  idol-attribute-stats.md  → Experiência gera crescimento
  music-charts.md          → Músicas tocadas ganham exposição
  fan-club-system.md       → Fãs reagem, loyalty muda
  news-feed.md             → Headlines geradas
  setlist-system.md        → Mastery evolui por música executada
```

### States and Transitions

| Estado do Show | Descrição | Transição |
|---|---|---|
| **Planejado** | Setlist + produção definidos, na agenda | → Pronto (dia anterior ao show) |
| **Pronto** | Últimos ajustes possíveis | → Em Execução (dia do show) |
| **Em Execução** | Simulação rodando música por música | → Concluído (última música) |
| **Concluído** | Resultado calculado, consequências aplicadas | Terminal |
| **Cancelado** | Jogador cancelou ou idol indisponível | Terminal (multas/reputação) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **setlist-system.md** | ← input | Setlist completa (ordem, músicas, papéis) |
| **music-entities.md** | ← requisitos | Requisitos técnicos de cada música |
| **audience-system.md** | ↔ feedback | Engagement dinâmico afeta e é afetado pela performance |
| **staff-functional.md** | ← produção | Stage Manager + pacotes definem qualidade técnica |
| **idol-attribute-stats.md** | ← stats | Atributos determinam execução. Show gera XP |
| **happiness-wellness.md** | ↔ bidirecional | Condição afeta performance. Resultado afeta wellness |
| **fame-rankings.md** | → fama | Shows geram/perdem fama proporcional ao resultado e venue |
| **agency-economy.md** | → receita | Bilheteria + merch vendido no show |
| **news-feed.md** | → headlines | Shows geram moments e headlines proporcionais |
| **week-simulation.md** | ← processado | Show processado dentro do pipeline semanal |
| **fan-club-system.md** | → loyalty | Resultado afeta loyalty e mood dos fãs |

## Formulas

### Receita de Show

```
receita_show =
  bilheteria              // capacidade_venue × taxa_ocupacao × preco_ingresso
  + merch_no_show          // fama × fan_mood × MERCH_SHOW_FACTOR
  - custo_producao         // pacotes + venue + staff
  - cachê_idols            // conforme contrato

bilheteria = min(capacidade, demanda) × preco_ingresso
demanda = fama_combinada × mult_tipo_show × mult_cidade × mult_temporada

taxa_ocupacao = demanda / capacidade
  Se > 1.0: SOLD OUT (audiência = capacidade, demanda insatisfeita gera hype)
  Se < 0.3: VAZIO (penalidade de engagement, mídia negativa)
```

### Experiência Ganha por Idol

```
xp_show(idol) = soma(
  para cada musica onde idol participou:
    performance_na_musica × SHOW_XP_FACTOR × mult_papel
)

SHOW_XP_FACTOR = 2.0  // Shows dão mais XP que treino
mult_papel: center ×1.3, main ×1.2, support ×1.0, backing ×0.8
```

### Rotação de Posição Mid-Show (em vez de substituição)

> **ADR-007**: Mid-show idol substitution was explicitly **rejected**. The show
> uses **position rotation** instead — center/front/back shifts between songs.
> There is no substitution mechanic (no `max_substituicoes`, no backup roster
> slots, no substitution penalties). If an idol is injured or collapses, the
> group continues with fewer members and the deficit is reflected in sinergia
> and performance penalties.

Entre músicas, o produtor pode ajustar papéis: uma idol que estava no centro
pode passar para backing, e vice-versa. Isso é **rotação de posição**, não
substituição de performer.

#### Regras de Rotação

```
// Rotação de posição (center/front/back shifts) entre músicas:
// - Permitida apenas durante MC/Interlúdio entre músicas
// - Não altera o roster — as mesmas idols permanecem no palco
// - Sem limite de rotações por show
// - Efeito: redistribui multiplicadores de papel (center ×1.2, backing ×0.9)

// Se idol colapse (fadiga > 95 ou crise emocional mid-show):
//   - Grupo continua com menos 1 membro (sem backup automático)
//   - Penalidade de sinergia aplicada ao grupo
//   - Headline negativa gerada
```

## Edge Cases

- **Show com 1 música (TV Live)**: Toda a nota depende de 1 performance.
  Sem margem de erro. Máxima pressão — como penalidade decisiva
- **Idol entra em burnout no dia do show**: Show cancelado automaticamente
  se é solo. Se é grupo: membro removido, grupo performa com menos 1
  (penalidade de sinergia)
- **Venue lotado + produção ruim**: Audiência animada mas produção decepciona.
  Engagement começa alto, cai ao longo do show. Fãs ficam frustrados ("estou
  na arena e o som é horrível")
- **Show de novata em venue grande**: Venue vazio (demanda baixa). Engagement
  base baixo. Mas se performa bem, "conquistar a arena vazia" gera headline
  positiva e boost de fama por superação
- **Setlist com 1 música ensaiada e 14 não ensaiadas**: Performance da música
  ensaiada é boa, o resto é medíocre. Nota geral puxada pra baixo. Incentivo
  claro para ensaiar setlist inteira
- **Show de grupo com 1 membro muito melhor que os outros**: Center óbvio.
  Mas audiência pode notar o desequilíbrio (engagement de "grupo" cai se
  disparidade > 30 pontos entre melhor e pior). O grupo é tão forte quanto
  seu elo mais fraco
- **Festival com 3 músicas: jogador coloca 3 ballads**: Pacing terrível.
  Audiência de festival quer energia. Penalidade severa de pacing. O tipo
  de venue/evento influencia o que a setlist deveria ser

## Dependencies

**Hard:**
- setlist-system.md — sem setlist, não há show
- music-entities.md — músicas definem requisitos
- idol-attribute-stats.md — stats determinam execução
- audience-system.md — audiência determina recepção

**Soft:**
- staff-functional.md — produção técnica
- happiness-wellness.md — condição pré/pós show
- fame-rankings.md — resultado afeta fama

**Depended on by:**
- week-simulation.md (processa shows na pipeline)
- news-feed.md (headlines de shows)
- fan-club-system.md (loyalty de fãs pós-show)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `SHOW_XP_FACTOR` | 2.0 | 1.0-4.0 | XP de show vs. treino |
| `FATIGUE_BASE_RATE` | 1.0 | 0.5-2.0 | Velocidade de fadiga intra-show |
| `BETWEEN_SONG_REST` | 2 | 1-5 | Fadiga recuperada entre músicas normais (ADR-007) |
| `MC_REST_RECOVERY` | 5 | 3-10 | Fadiga recuperada durante MC/interlúdio (ADR-007) |
| `CENTER_MULTIPLIER` | 1.2 | 1.1-1.5 | Bônus de performance para center |
| `OPENER_WEIGHT` | 1.2 | 1.0-1.5 | Peso da música de abertura na nota geral (ADR-007) |
| `CLOSER_WEIGHT` | 1.3 | 1.0-1.5 | Peso do finale/closer na nota geral (ADR-007) |
| `ENCORE_WEIGHT` | 1.5 | 1.2-2.0 | Peso do encore na nota geral (ADR-007) |
| `MOMENT_CHANCE_BASE` | 0.05 | 0.02-0.10 | Chance base de eventos mid-show |
| `SOLD_OUT_HYPE_BONUS` | 1.15 | 1.05-1.3 | Bônus de engagement para show esgotado |
| `EMPTY_VENUE_PENALTY` | 0.7 | 0.5-0.9 | Penalidade para venue com <30% ocupação |
| `GROUP_DISPARITY_THRESHOLD` | 30 | 15-50 | Diferença de stats que audiência percebe |

## Acceptance Criteria

1. Shows processam setlist música por música, com performance individual por idol
2. Cada música tem resultado próprio baseado em execução × mastery × condição × produção
3. Eventos de momento (brilhante, erro, esqueceu letra) ocorrem com chance baseada em stats
4. Fadiga acumula ao longo do show e afeta músicas finais
5. Papéis (center, main, backing) afetam multiplicador de performance e exposição
6. Nota geral agrega performances com peso por posição na setlist
7. Tipos de show (solo, grupo, festival, TV) têm regras e audiência distintas
8. Receita = bilheteria + merch - custos de produção
9. Experiência ganha proporcional à performance e papel
10. Show é o ponto de convergência de todos os sistemas (stats, setlist, audience, production, wellness)
11. Cancelamento de show tem consequências (multa, reputação, fãs)
12. Show gera headlines e moments para o Moment Engine

## Open Questions

- Nenhuma pendente
