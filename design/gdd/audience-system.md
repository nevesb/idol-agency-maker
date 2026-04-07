# Audience System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 4 — O Drama Nasce das Mecânicas
> **Related**: show-system.md, setlist-system.md, music-entities.md, fan-club-system.md, fame-rankings.md

## Overview

A audiência é um **sistema dinâmico** que reage em tempo real ao show.
Não é um número estático — é um estado que evolui música por música,
influenciado pela performance das idols, pelo pacing da setlist, pela
produção técnica, e pela composição do público presente.

A audiência é a "torcida" do FM26: pode carregar o time em noites
mágicas ou ser indiferente quando o show não entrega. A diferença é
que a composição da audiência (fãs dedicados vs. público casual) muda
o comportamento e as expectativas.

## Player Fantasy

A fantasia é de **sentir a arena**. Ver o engagement subir quando a música
certa toca na hora certa, sentir a tensão quando a audiência esfria no
meio do show, torcer pelo encore que só acontece se o engagement estiver
alto. O jogador não controla a audiência diretamente — ele controla
as decisões que a influenciam.

## Detailed Design

### 1. Composição da Audiência

Cada show tem uma audiência com composição específica:

```
Audience {
  total:          uint32          // Pessoas presentes
  composition: {
    hardcore_fans:  float  (0-1)  // Fãs dedicados (lightstick, calls)
    casual_fans:    float  (0-1)  // Conhecem a idol, gostam, vieram ver
    general_public: float  (0-1)  // Não conhecem, vieram pelo evento/venue
    industry:       float  (0-1)  // Profissionais da indústria (award shows)
  }
  // Soma = 1.0

  // Estado dinâmico (muda durante o show)
  engagement:     0-100    // Nível geral de envolvimento
  energy:         0-100    // Energia atual da audiência
  emotional_state: enum    // Neutra, Animada, Emocionada, Eufórica, Entediada, Frustrada
}
```

#### Composição por Tipo de Show

| Tipo de show | Hardcore | Casual | Público geral | Indústria |
|---|---|---|---|---|
| Solo Concert | 60% | 30% | 10% | 0% |
| Group Concert | 50% | 35% | 15% | 0% |
| Festival | 10% | 20% | 70% | 0% |
| Fan Meeting | 90% | 10% | 0% | 0% |
| TV Live | 0% | 10% | 85% | 5% |
| Award Show | 5% | 10% | 30% | 55% |

### 2. Engagement — O Indicador Central

Engagement é o **"placar" do show**. Começa num valor base e sobe ou
desce conforme cada música é processada.

```
engagement_base =
  30                                    // Base universal
  + hardcore_fans × 30                  // Fãs já vêm animados
  + casual_fans × 15                    // Casuals começam receptivos
  + general_public × 5                  // GP precisa ser convencido
  + industry × 10                       // Profissionais são neutros-atentos
  + sold_out_bonus × 10                 // Venue lotado: energia ambiental
  + producao_pre_show × 5              // Cenografia, iluminação pré-show

Típico:
  Solo concert (60% hardcore, sold out): base ~55
  Festival (70% GP): base ~38
  TV Live (85% GP): base ~35
```

#### Engagement por Música

Após cada música, engagement é atualizado:

```
delta_engagement(musica) =
  performance_musica                    // Resultado da execução (show-system.md)
  × recepcao_musica                     // Potencial de recepção (music-entities.md)
  × pacing_bonus                         // Sequência adequada? (setlist-system.md)
  × audience_preference                  // A audiência gosta desse tipo de música?
  × ENGAGEMENT_SENSITIVITY              // Calibração geral

ENGAGEMENT_SENSITIVITY = 15  // Delta máximo por música em condições normais

engagement_nova = clamp(engagement + delta_engagement, 0, 100)
```

**Audience Preference**: Diferentes composições de audiência preferem
coisas diferentes:

| Segmento | Prefere | Rejeita |
|---|---|---|
| **Hardcore fans** | Músicas originais, deep cuts, fan favorites | Covers genéricas, músicas sem conexão emocional |
| **Casual fans** | Hits conhecidos, singles, visuals fortes | Músicas obscuras, ballads longas |
| **Público geral** | Energy alta, catchiness, presença de palco | Músicas de nicho, MCs internos |
| **Indústria** | Técnica, originalidade, novidade | Fórmulas gastas, erros técnicos |

### 3. Reação por Música — Feedback Individual

Cada música gera uma **reação da audiência** com componentes:

```
SongReaction {
  music_id:        uint32
  engagement_delta: float       // Quanto o engagement subiu/desceu
  energy_delta:     float       // Mudança de energia da audiência
  emotional_impact: float       // Profundidade emocional sentida
  memorable:        bool        // Será lembrada como "momento"?
  crowd_response:   enum        // Silent, Polite, Warm, Enthusiastic, Euphoric, Booing

  // Feedback individual por idol (para grupos)
  idol_reactions:   Map<IdolId, IdolSongFeedback>
}

IdolSongFeedback {
  idol_id:          uint32
  lightstick_pct:   float (0-1)  // % dos fãs que direcionaram lightstick para esta idol
  support_level:    float (0-1)  // Nível de apoio/call específico
  standout:         bool          // Esta idol se destacou nesta música?
  weak_point:       bool          // Esta idol foi o ponto fraco nesta música?
}
```

### 4. Lightstick / Support System (Para Grupos)

Em shows de grupo, fãs distribuem atenção entre as membras. Isso gera
o **feedback individual por idol por música** — o relatório pós-show
mostra quem brilhou e quem ficou apagada.

```
lightstick_distribution(musica, grupo):
  Para cada idol no grupo:
    base_support = fama_idol / soma_fama_grupo    // Popularidade relativa
    performance_bonus = performance_idol - media_grupo  // Se performou acima da média
    role_bonus = 0.15 se center, 0.1 se main, 0 senão

    lightstick_pct = normalize(base_support + performance_bonus + role_bonus)

  // Soma de lightstick_pct = 1.0 (distribuição proporcional)
```

**Implicação**: Uma idol novata como center pode ter lightstick baixo
(pouca base de fãs) mas performance alta — e isso gera crescimento de
fãs para ela ("quem é a center? ela é incrível!"). Uma idol popular mas
com performance fraca tem lightstick alto baseado em lealdade mas o
suporte diminui ao longo do show.

### 5. Crowd Response (Resposta Coletiva)

O tipo de resposta da audiência após cada música:

| Response | Engagement | Sinais | Consequência |
|---|---|---|---|
| **Silent** | <20 | Sem aplausos, desconforto | Idol stress +5, motivação -3 |
| **Polite** | 20-40 | Aplausos educados | Neutro |
| **Warm** | 40-60 | Aplausos, alguns calls | Motivação +1 |
| **Enthusiastic** | 60-80 | Calls fortes, lightsticks | Motivação +3, fama +pequeno |
| **Euphoric** | 80-95 | Arena explode, fanchants | Motivação +5, fama +médio, headline |
| **Legendary** | 95+ | Ovação de pé, choro coletivo | Motivação +10, fama +grande, headline especial |

### 6. Encore — O Momento Emergente

Encore não é garantido. Acontece por mecânica emergente:

```
chance_encore =
  SE engagement_final < 75: 0% (não acontece)
  SE engagement_final 75-85: 30%
  SE engagement_final 85-95: 70%
  SE engagement_final > 95: 95%

  × mult_hardcore_fans   // Fãs dedicados pedem mais que casual
  × mult_venue           // Arenas grandes amplificam o pedido

SE encore acontece:
  - Idol(s) volta(m) para 1-2 músicas extras
  - Engagement recebe +10 bonus (momento especial)
  - Música de encore com mastery bom: momento memorável garantido
  - Música de encore improvisada (mastery baixo): risco mas autêntico
```

### 7. Pós-Show — Impacto nos Fãs

Resultado do show afeta o fan-club-system.md:

```
pos_show:
  SE nota >= A:
    loyalty_fans += 5-10
    novos_fans = general_public_presente × conversao(nota)
    mood_fans = +15
  SE nota C-B:
    loyalty_fans += 0-3
    novos_fans = poucos
    mood_fans = +5
  SE nota D-F:
    loyalty_fans -= 5-15
    novos_fans = 0
    mood_fans = -10 a -20

conversao(nota) = 0.01 (C) a 0.15 (S)
// Show nota S num festival: 70% GP × 15% conversão = ~10% viram casual fans
```

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Pré-Show** | Audiência entrando, composição definida | → Ativa (show começa) |
| **Ativa** | Reagindo música por música | → Pós-Show (última música) |
| **Encore** | Pedindo/assistindo encore | → Pós-Show |
| **Pós-Show** | Consequências calculadas | Terminal |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **show-system.md** | ← performance | Performance por música alimenta reação |
| **setlist-system.md** | ← pacing | Pacing da setlist afeta engagement progressivo |
| **music-entities.md** | ← recepção | Potencial de recepção modula reação |
| **fan-club-system.md** | ↔ bidirecional | Composição da audiência vem dos fãs. Resultado afeta loyalty |
| **fame-rankings.md** | → fama | Shows bons geram fama proporcional |
| **happiness-wellness.md** | → motivação | Reação da audiência afeta motivação/stress das idols |
| **news-feed.md** | → headlines | Momentos memoráveis geram headlines |
| **idol-attribute-stats.md** | ← composição | Stats das idols determinam quem se destaca |

## Formulas

### Engagement Final Ponderado

```
engagement_final = engagement_pos_ultima_musica
  × producao_global        // Qualidade técnica geral (staff-functional.md)
  × mult_venue_fit         // Show adequado ao venue (arena para act de arena)
  × mult_weather           // Eventos outdoor: clima afeta (opcional)

nota_audiencia = engagement_final / 100  // Contribui para nota geral do show
```

### Taxa de Conversão de Novos Fãs

```
novos_fans = publico_geral_presente × taxa_conversao × mult_visibilidade

taxa_conversao:
  nota S: 15%
  nota A: 8%
  nota B: 3%
  nota C: 1%
  nota D-F: 0%

mult_visibilidade:
  TV Live: ×10 (milhões vendo)
  Festival: ×3
  Award Show: ×5
  Solo Concert: ×1 (só quem estava lá)
```

## Edge Cases

- **Show para 50 pessoas num café (90% hardcore)**: Engagement base alto
  (~68), quase todo mundo é fã. Pouca chance de novos fãs, mas loyalty
  dos existentes sobe muito com bom show. "Intimate show" vira memória
  afetiva
- **Festival para 30000 (70% GP)**: Engagement base baixo (~38). Precisa
  de energy alta e hits conhecidos para conquistar. Se nota S: 4500
  potenciais novos fãs casuals. Game-changer para idol em ascensão
- **Award show com nota F**: Indústria viu tudo. Reputação com produtores
  e TV cai significativamente. Demora meses para recuperar acesso a jobs
  premium
- **Encore pedido mas idol em fadiga >90**: Idol aceita (ambição alta) ou
  recusa (mentalidade prevalece). Se aceita e performa mal: momento
  agridoce. Se aceita e supera: momento lendário
- **100% hardcore fans mas nota D**: Fãs decepcionados. Loyalty cai mais
  do que o normal porque tinham expectativa alta. "Vocês são melhores
  que isso" no mood dos fãs
- **TV Live com 1 música nota S**: Audiência de milhões viu. Conversão
  máxima. Pode gerar viral. Equivalente a gol em final de Copa no FM
- **Show de grupo com 1 idol recebendo 60% do lightstick**: Desequilíbrio.
  Outros membros percebem → felicidade/motivação delas cai. Idol popular
  sobe mais rápido, grupo fica internamente tenso. Drama emergente real

## Dependencies

**Hard:**
- show-system.md — audiência existe dentro de um show
- fan-club-system.md — composição dos fãs determina audiência

**Soft:**
- fame-rankings.md — fama determina demanda
- setlist-system.md — pacing afeta engagement
- music-entities.md — recepção modula reação

**Depended on by:**
- show-system.md (engagement afeta nota geral)
- fan-club-system.md (resultado afeta loyalty e conversão)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `ENGAGEMENT_SENSITIVITY` | 15 | 8-25 | Delta máximo por música |
| `ENGAGEMENT_BASE_HARDCORE` | 30 | 20-40 | Contribuição de hardcore fans ao base |
| `ENCORE_THRESHOLD` | 75 | 60-85 | Engagement mínimo para encore possível |
| `CONVERSION_RATE_S` | 0.15 | 0.05-0.25 | % de GP que vira fã com nota S |
| `LOYALTY_GAIN_GOOD_SHOW` | 5-10 | 2-15 | Loyalty ganho com nota A+ |
| `LOYALTY_LOSS_BAD_SHOW` | 5-15 | 3-20 | Loyalty perdido com nota D-F |
| `LIGHTSTICK_FAME_WEIGHT` | 0.5 | 0.3-0.7 | Peso da fama na distribuição de lightstick |

## Acceptance Criteria

1. Audiência tem composição variável (hardcore, casual, GP, indústria) por tipo de show
2. Engagement começa em valor base e evolui música por música
3. Cada música gera reação com delta de engagement e resposta coletiva
4. Feedback individual por idol por música (lightstick %) em shows de grupo
5. Crowd response tem 6 níveis com consequências para motivação e fama
6. Encore é emergente, baseado em engagement final (>75 para possível)
7. Pós-show converte público geral em novos fãs proporcionalmente à nota
8. Composição da audiência afeta preferências (hardcore quer deep cuts, GP quer hits)
9. Shows de TV Live amplificam conversão de fãs (×10)
10. Loyalty de fãs sobe ou desce conforme resultado do show

## Open Questions

- Nenhuma pendente
