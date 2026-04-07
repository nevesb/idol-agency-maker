# Media Entities System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real

## Overview

O Media Entities System define rádios, canais de TV e plataformas online como
entidades persistentes no mundo do jogo, cada uma com audiência, perfil
editorial, slots de programação e preferências. Fechar um slot no NHK é
diferente de fechar numa rádio regional de Osaka. Essas entidades são fontes
de jobs (aparições em TV, spots de rádio, programas regulares) e amplificadores
de fama e música. São carregadas do World Pack e suas audiências flutuam ao
longo do jogo.

## Player Fantasy

A fantasia é de **networking e influência midiática**. Saber que o programa
"Music Monday" da TV Tokyo prefere idols de Dança alta e tem 2M de audiência
-- e que colocar sua idol lá vai explodir a fama dela. Ou perceber que a
rádio indie de Shimokitazawa é perfeita pra testar uma novata sem exposição
demais. Serve o **Pilar 1**: mídia funciona com regras reais de audiência e
preferência editorial.

## Detailed Design

### Core Rules

#### 1. Tipos de Entidades de Mídia

| Tipo | Quantidade | Alcance | Exemplos |
|---|---|---|---|
| **TV Nacional** | 5-7 | País inteiro, audiência 1M+ | NHK, Fuji TV, TV Asahi |
| **TV Regional** | 10-15 | 1-2 regiões, audiência 100K-500K | Kansai TV, TVQ Kyushu |
| **Rádio Nacional** | 5-8 | País inteiro | NHK Radio, J-WAVE |
| **Rádio Regional** | 15-20 | 1 cidade/região | FM Osaka, Cross FM |
| **Plataforma Online** | 5-10 | Global, audiência variável | SHOWROOM, NicoNico, YouTube |

#### 2. Ficha de Entidade de Mídia

```
MediaEntity {
  id:             uint32
  name:           string
  type:           "tv_national" | "tv_regional" | "radio_national" |
                  "radio_regional" | "online_platform"
  region:         enum (ou "national" pra alcance nacional)
  tier:           F-SSS (prestígio da emissora)
  audience: {
    size:         uint32 (ouvintes/espectadores médios)
    age_range:    (min, max)
    gender_ratio: (female%, male%)
    preferences:  string[] // "pop", "rock", "idol", "variety", "drama"
  }
  shows: Show[]  // programas regulares com slots
}

Show {
  id:             uint32
  name:           string  // "Music Monday", "Idol Hour", "Variety Night"
  media_id:       uint32
  type:           "music" | "variety" | "talk" | "drama" | "reality"
  timeslot:       (day_of_week, time)  // horário fixo
  duration_min:   30 | 60 | 90 | 120
  guest_spots:    uint8   // quantos convidados por episódio
  preferred_tier: F-SSS   // tier mínimo preferido do convidado
  preferred_stats: string[]  // "vocal", "variety", "visual", etc.
  audience_base:  uint32  // audiência base do programa
  payment:        ¥amount // cachê por aparição
  frequency:      "weekly" | "monthly" | "seasonal"
}
```

#### 3. Aparições em Mídia como Jobs

Aparições em TV/rádio são **jobs** disponíveis no Job Board:
- Shows publicam "vagas" semanalmente/mensalmente
- Requisitos: tier mínimo, stats preferidos, gênero, disponibilidade
- Agência se candidata → emissora avalia → aceita/recusa
- Performance da idol no programa afeta audiência do show
- Show de alta audiência = mais fama, mais pagamento

#### 4. Rádios e Charts de Música

Rádios tocam músicas que afetam o ranking de charts:
- Cada rádio tem playlist baseada no perfil editorial
- Música tocada em rádio de alta audiência = boost no chart score
- Jogador pode negociar "airplay" (pagar pra rádio tocar música da idol)
- Rádio indie tocando novata = boost menor mas pra público nichado

#### 5. Audiência Flutuante

Audiência de cada entidade varia mensalmente:
- Shows com bons convidados → audiência sobe
- Shows repetitivos (mesmos convidados) → audiência cai
- Temporada (verão tem festivais, inverno tem especiais) → variação sazonal
- Escândalos de convidados podem afetar audiência do show (positiva ou negativamente)

### States and Transitions

| Estado do Show | Descrição | Transição |
|---|---|---|
| **No ar** | Programa regular, aceitando convidados | → Hiato (entre temporadas) |
| **Hiato** | Fora do ar temporariamente | → No ar (nova temporada) |
| **Especial** | Programa único/sazonal (Kouhaku, especial de natal) | → Encerrado |
| **Encerrado** | Show cancelado por baixa audiência | Terminal |
| **Novo** | Show recém-lançado pela emissora | → No ar |

Emissoras podem cancelar shows com audiência baixa e criar novos.
Isso mantém o ecossistema de mídia dinâmico ao longo dos 20 anos.

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Job Assignment** | → fornece | Shows disponíveis como jobs no board |
| **Agency Economy** | ← receita/custo | Cachê de aparição (receita), airplay pago (custo) |
| **Fame & Rankings** | → fama | Aparição em mídia de alta audiência = boost de fama |
| **Music Charts** | ↔ bidirecional | Rádio toca música → boost chart. Chart alto → rádio quer tocar |
| **Happiness & Wellness** | → motivação | Aparecer em show de prestígio = Motivação +5-10 |
| **Time/Calendar** | ← tick | Shows seguem programação semanal. Audiência atualiza mensalmente |
| **Idol Database** | ← lê | Entidades de mídia carregadas do World Pack |
| **Stats System** | ← lê | Stats da idol afetam performance no show |
| **Scouting** | → visibilidade | Idol aparecendo em TV = mais visível pra scouting |
| **News Feed** | → notícias | Aparições, audiência recorde, shows novos/cancelados |

## Formulas

#### Cachê de Aparição

```
cache_aparicao = base_show × mult_idol_tier × mult_audiencia

onde:
  base_show     = ¥50K (rádio regional) a ¥10M (TV nacional prime time)
  mult_idol_tier = F 0.3, E 0.5, D 0.8, C 1.0, B 1.5, A 2.0, S+ 3.0
  mult_audiencia = log(audiencia) / log(max_audiencia) // normalizado
```

#### Performance no Show

```
performance = stat_principal × (0.7 + random(0, 0.6)) × mult_fit

onde:
  stat_principal = stat preferido pelo show (Vocal pra music show, Variety pra talk)
  mult_fit = 1.3 (idol encaixa perfeitamente no perfil), 1.0 (ok), 0.7 (fora do perfil)
```

#### Audiência do Show (atualização mensal)

```
audiencia_nova = audiencia_atual × (1 + satisfaction × diversity - fatigue)

onde:
  satisfaction = media_performance_convidados / 100 × 0.2
  diversity = unique_guests_mes / total_guests_mes × 0.1
  fatigue = repeticoes_convidado / total_guests × 0.15 (mesmo convidado várias vezes)
```

#### Boost de Chart por Airplay

```
chart_boost = audiencia_radio × AIRPLAY_FACTOR × plays_per_week
  AIRPLAY_FACTOR = 0.001 (calibrar por playtest)
```

## Edge Cases

- **Show de TV cancela com idol agendada**: Job é cancelado. Idol fica com
  slot livre. Sem multa (show cancelou, não a idol)
- **Rádio regional toca música que vira hit nacional**: Boost de chart vem
  da audiência da rádio (pequena), mas news feed pega e amplifica
- **Idol aparece em 3 shows diferentes na mesma semana**: Possível se agenda
  comporta. Diversidade de aparições = mais fama. Repetir mesmo show = fadiga
- **Emissora prefere tier A mas jogador candidata tier D**: Emissora pode
  aceitar se não tem candidatos melhores. Performance será avaliada
- **Airplay pago pra música que flopa**: Dinheiro gasto, boost de chart
  mínimo se música é ruim. Rádio pode recusar tocar novamente
- **Show Kouhaku (especial de ano novo NHK)**: Evento fixo anual, maior
  audiência do ano. Requisito tier SS+. Aparecer = explosão de fama

## Dependencies

**Hard:**
- Idol Database — entidades de mídia carregadas do World Pack
- Time/Calendar — programação semanal, atualização mensal de audiência
- Agency Economy — cachê como receita, airplay como custo

**Soft:**
- Job Assignment — shows como fonte de jobs
- Music Charts — rádio/TV promovem músicas
- Fame & Rankings — aparições geram fama

**Depended on by:**
Job Assignment (fonte de jobs), Music Charts (airplay), Fame & Rankings (exposição),
News Feed (notícias de mídia)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `TV_NATIONAL_COUNT` | 6 | 3-10 | Quantidade de TVs nacionais |
| `RADIO_TOTAL_COUNT` | 25 | 10-50 | Total de rádios |
| `SHOW_GUEST_SPOTS` | 2-5 | 1-10 | Convidados por episódio |
| `BASE_CACHE_TV_NATIONAL` | ¥5M | ¥1M-¥20M | Cachê base TV nacional |
| `BASE_CACHE_RADIO_REGIONAL` | ¥50K | ¥10K-¥200K | Cachê base rádio regional |
| `AIRPLAY_FACTOR` | 0.001 | 0.0001-0.01 | Impacto de airplay no chart |
| `AUDIENCE_FATIGUE_RATE` | 0.15 | 0.05-0.30 | Penalidade por repetir convidado |
| `SHOW_CANCEL_THRESHOLD` | 3 meses baixa audiência | 1-6 | Quando show é cancelado |

## Acceptance Criteria

1. World Pack contém 40-60 entidades de mídia com perfis distintos
2. Shows publicam vagas como jobs no board com requisitos corretos
3. Cachê de aparição calculado pela fórmula (varia por tier/audiência)
4. Audiência de shows flutua mensalmente baseada em qualidade dos convidados
5. Rádios tocam músicas e dão boost ao chart score
6. Shows cancelados por baixa audiência, novos shows criados pela emissora
7. Eventos especiais (Kouhaku, festivais de TV) aparecem no calendário correto
8. Airplay pago funciona e tem impacto mensurável no ranking de músicas
9. Performance da idol no show usa stat preferido do programa
10. Repetir mesmo convidado causa fadiga de audiência

## Open Questions

- **RESOLVIDO**: Residência em show: Sim, é um job especial concorrido com
  competição de múltiplas agências. Idol fica com aparição fixa semanal
- **RESOLVIDO**: Social media: Cada NPC/Empresa/Grupo/Agência tem conta com
  número de seguidores baseado na popularidade. Divulgar no canal do idol =
  boost de MKT. Divulgar no canal de outro NPC = ganha fama baseada no canal
  do NPC. Diminishing returns ao repetir mesmo canal
- **RESOLVIDO**: Streaming ao vivo: Canal de famoso = ganha fãs novos.
  Canal próprio = aumenta share de ouvintes no pool semanal
