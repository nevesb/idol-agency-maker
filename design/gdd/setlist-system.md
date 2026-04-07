# Setlist System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 2 — Suas Decisões, Suas Consequências
> **Related**: show-system.md, music-entities.md, audience-system.md, idol-attribute-stats.md, staff-functional.md

## Overview

A setlist é a **tática do show**. Assim como no FM26 a formação tática
determina como os jogadores atuam em campo, no Star Idol Agency a setlist
determina como o show se desenrola. A ordem das músicas importa, o pacing
importa, a escolha de quem faz center em cada música importa.

O jogador **constrói a setlist** escolhendo músicas do catálogo da agência,
definindo a ordem, atribuindo papéis, e decidindo o que ensaiar. Cada música
na setlist tem um **nível de mastery** por idol — quanto mais ensaiada, melhor
a performance.

**Princípio**: Setlist não é uma lista passiva. É um sistema com regras,
custos, trade-offs, e impacto direto no resultado do show.

## Player Fantasy

A fantasia é de **diretor criativo**. Abrir o show com o hit dançante pra
pegar a audiência, baixar o ritmo com uma ballad emocional no meio, construir
tensão com 3 músicas crescentes, fechar com o anthem que todo mundo canta.
Sentir que a ordem fez diferença — que o show seria pior se você trocasse a
música 4 pela 8.

## Detailed Design

### 1. Estrutura da Setlist

```
Setlist {
  id:           uint32
  name:         string             // "Summer Tour Setlist v3"
  show_type:    enum               // Solo, Group, Festival, etc.
  songs:        SetlistEntry[]     // Lista ordenada

  // Metadata
  total_duration:  uint16          // Soma das durações em segundos
  avg_energy:      float           // Energia média (pacing)
  pacing_score:    float           // Qualidade do sequenciamento (0-1)
}

SetlistEntry {
  position:     uint8              // 1, 2, 3...
  music:        Music              // Referência à entidade musical
  section:      enum (Opening, Rising, Peak, Cooldown, Finale, Encore)
  roles:        Map<Idol, Role>    // Quem faz o quê nesta música
  mc_after:     bool               // MC/interação com público após?
  transition:   enum (Direct, Fade, MC, VTR, Costume_Change)
}
```

### 2. Seções da Setlist (Pacing)

Cada posição na setlist pertence a uma **seção** que afeta o modificador
de pacing para a audiência (audience-system.md):

| Seção | Posição típica | Energy ideal | Efeito se correto | Efeito se errado |
|---|---|---|---|---|
| **Opening** | 1-2 | Alta (70+) | Engagement +15% base | Audiência morna desde o início |
| **Rising** | 3-5 | Média→Alta | Momentum crescendo | Platô, audiência perde interesse |
| **Peak** | Meio | Muito alta (80+) | Momento central. Engagement máximo | Pico desperdiçado |
| **Cooldown** | Após peak | Baixa-Média (30-50) | Respiro. Audiência processa emoções | Se for high-energy: exausta a audiência |
| **Finale** | Penúltima-última | Alta (75+) | Fechamento memorável. ×1.3 na nota | Encerramento morno |
| **Encore** | Após finale (opcional) | Variável | Bônus especial se engagement > 85% | Só acontece se audiência pedir |

**Pacing Score**: Calculado automaticamente pela qualidade do sequenciamento.

```
pacing_score = media(
  para cada transição entre músicas adjacentes:
    energy_transition_quality(musica_anterior, musica_seguinte)
)

energy_transition_quality =
  SE transição crescente (rising): 1.0
  SE transição lateral (similar energy): 0.85
  SE transição descendente intencional (cooldown): 0.9
  SE transição descendente abrupta (queda de energy >40): 0.5
  SE transição ascendente abrupta (salto de energy >50): 0.6
```

**O jogo mostra o pacing score** em tempo real enquanto o jogador monta
a setlist — como um "compasso" visual que indica se o sequenciamento faz
sentido. Não bloqueia nada: o jogador pode ignorar. Mas o score afeta
o resultado.

### 3. Mastery — Domínio da Música por Idol

Cada idol tem um **nível de mastery** para cada música que já ensaiou ou
tocou. Mastery afeta diretamente a qualidade da performance.

```
Mastery {
  idol_id:     uint32
  music_id:    uint32
  level:       0-100     // 0 = nunca ensaiou, 100 = domínio total
  rehearsals:  uint16    // vezes ensaiada
  performances: uint16   // vezes tocada ao vivo
}
```

#### Progressão de Mastery (Logarítmica)

```
mastery_gain_per_rehearsal = BASE_MASTERY_GAIN
  × (1 / (1 + rehearsals × 0.1))    // Logarítmica: primeiros ensaios valem mais
  × mult_coach                        // Coach presente: ×1.3-×2.0
  × mult_disciplina                   // Disciplina da idol / 50
  × mult_adaptabilidade               // Adaptabilidade / 100 (para músicas novas)

BASE_MASTERY_GAIN = 15  // Pontos por sessão de ensaio

Progressão típica (sem bônus):
  1º ensaio:  0 → 15  (grande salto)
  2º ensaio: 15 → 27  (bom avanço)
  3º ensaio: 27 → 36  (menor retorno)
  5º ensaio: 44 → 50  (platô chegando)
  10º ensaio: 64 → 66 (retornos mínimos)
  20º ensaio: 77 → 78 (quase no teto)

Tocar ao vivo também dá mastery (menor que ensaio, mas conta):
  mastery_gain_per_show = BASE_MASTERY_GAIN × 0.5
```

#### Efeito da Mastery na Performance

```
mult_mastery =
  mastery 0-20:    0.5-0.7    // Não ensaiada: penalidade severa
  mastery 21-50:   0.7-0.9    // Parcialmente ensaiada
  mastery 51-80:   0.9-1.0    // Bem ensaiada
  mastery 81-100:  1.0-1.15   // Dominada: bônus de confiança

Linear interpolation entre breakpoints.
```

**Implicação**: Tocar música não ensaiada (mastery <20) reduz performance
em ~30-50%. Tocar música dominada (mastery >80) dá bônus de até 15%.
Ensaiar é investimento direto no resultado do show.

### 4. Tipos de Treinamento

Três modos de treino que afetam mastery e atributos de forma diferente:

#### 4a. Treino Genérico (Atributo Focus)

```
Slot de agenda: "Treino [Vocal/Dança/Atuação/etc.]"
Efeito:
  - Atributo alvo cresce conforme idol-attribute-stats.md
  - NÃO aumenta mastery de nenhuma música específica
  - É o treino "base" — melhora a idol como um todo

Quando usar: Idol precisa desenvolver atributos fundamentais
             (novata com Vocal 40 precisa de base antes de ensaiar)
```

#### 4b. Ensaio de Setlist (Setlist Rehearsal)

```
Slot de agenda: "Ensaio — [Nome da Setlist]"
Efeito:
  - TODAS as músicas da setlist ganham mastery (dividido)
  - mastery_gain_por_musica = BASE_MASTERY_GAIN / N_musicas × 2
  - Treina transições entre músicas (melhora pacing na execução)
  - Atributos NÃO crescem (ou crescem minimamente: ×0.2)

Quando usar: Pré-show, quando toda a setlist precisa de ensaio geral
             Bom para shows com muitas músicas
```

#### 4c. Ensaio de Música Específica (Song Rehearsal)

```
Slot de agenda: "Ensaio — [Nome da Música]"
Efeito:
  - UMA música ganha mastery total (sem dividir)
  - mastery_gain = BASE_MASTERY_GAIN × mult_coach × mult_disciplina
  - Atributo principal da música cresce ×0.5 (subproduto do ensaio)

Quando usar: Música nova e difícil que precisa de domínio antes de estrear
             Música-chave do show que precisa ser perfeita
```

**Trade-off**: Ensaio de setlist prepara tudo mas nada profundamente. Ensaio
de música foca mas ignora o resto. Treino genérico não ensaia nada mas
melhora a base. O jogador precisa balancear tempo limitado da agenda.

### 5. Affinity — Afinidade Idol ↔ Música

Além de mastery (ensaio), existe **affinity** — quão naturalmente a música
combina com a idol, independente de prática.

```
affinity(idol, musica) =
  vocal_fit(idol, musica)      × 0.4    // Tessitura + textura
  + genre_preference(idol)     × 0.3    // Idol tem preferência de gênero (oculto)
  + mood_match(idol, musica)   × 0.2    // Personalidade da idol vs. mood da música
  + experience_factor          × 0.1    // Já tocou músicas similares?

Range: 0.5 (incompatível) a 1.2 (match perfeito natural)
```

**Affinity é semi-fixa** — muda muito pouco com o tempo. Uma idol com
textura vocal Sweet sempre terá alta affinity com músicas idol pop e
baixa affinity com músicas rock. Mastery pode compensar affinity baixa
(ensaio supera desconforto natural), mas nunca completamente.

```
performance_musica = execucao_base × mastery × affinity × producao × pacing
```

### 6. Setlists Salvas e Templates

- Jogador pode **salvar setlists** nomeadas e reutilizar
- Templates por tipo de show:
  - "Festival 5 músicas" (Opening-Rising-Peak-Cooldown-Finale rápido)
  - "Full Concert 12 músicas" (completo com encore)
  - "Fan Meeting 3+MC" (curto com foco em interação)
- Setlists podem ser **compartilhadas entre shows** do mesmo tipo
- Mudar 1 música na setlist não invalida mastery das outras

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Em Construção** | Jogador montando a setlist | → Pronta (todas posições preenchidas) |
| **Pronta** | Setlist completa, pode ser atribuída a show | → Em Ensaio, → Atribuída |
| **Em Ensaio** | Idols ensaiando (mastery subindo) | → Atribuída (dia do show chega) |
| **Atribuída** | Vinculada a um show agendado | → Executada (show acontece) |
| **Executada** | Show rodou com esta setlist | Terminal (resultados registrados) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **music-entities.md** | ← músicas | Músicas são os blocos da setlist |
| **show-system.md** | → estrutura | Setlist define a sequência do show |
| **audience-system.md** | → pacing | Pacing score afeta engagement cumulativo |
| **idol-attribute-stats.md** | ← stats, → XP | Stats afetam performance. Ensaio gera crescimento |
| **staff-functional.md** | ← coaches | Coaches aceleram mastery. SM coordena transições |
| **schedule-agenda.md** | ← slots | Ensaios ocupam slots da agenda |

## Formulas

### Pacing Global

```
pacing_global = pacing_score
  × opening_quality     // Opening correta: ×1.05. Fraca: ×0.85
  × finale_quality      // Finale forte: ×1.1. Fraco: ×0.8
  × variety_bonus        // Variedade de gêneros/moods: +0 a +0.1
  × MC_bonus             // MC bem posicionados (após pico): +0.05 cada

Range efetivo: 0.5 (setlist terrível) a 1.3 (setlist perfeita)
```

### Tempo de Ensaio Necessário (estimativa)

```
Para setlist de N músicas, ensaio genérico:
  sessoes_para_mastery_70 ≈ N × 3   // ~3 sessões por música no ensaio de setlist
  sessoes_para_mastery_90 ≈ N × 8   // Retornos decrescentes

Para música individual, ensaio focado:
  sessoes_para_mastery_70 ≈ 4
  sessoes_para_mastery_90 ≈ 12

Idols com Disciplina alta: -20% sessões necessárias
Idols com Adaptabilidade alta: -15% sessões para mastery inicial (0→50)
Coach presente: -30% sessões necessárias
```

## Edge Cases

- **Setlist com 15 músicas, 0 ensaiadas**: Performance terrível em todas.
  Nota geral provavelmente D ou F. Idols podem cometer erros visíveis
  (esqueceu letra, coreografia errada). Consequência merecida
- **Setlist com 1 música dominada e 14 medíocres**: Se a dominada for o
  finale, pode salvar a nota (peso ×1.3). Se for a abertura, audiência
  gosta do início e se decepciona depois
- **Música nova nunca tocada como encore**: Mastery 0. Mas encores são
  emocionais por natureza — audiência perdoa imperfeição se o momento for
  genuíno. Penalidade de mastery reduzida para ×0.7 (em vez de ×0.5)
- **Duas setlists diferentes na mesma semana**: Mastery é por música,
  não por setlist. Músicas em comum mantêm mastery. Músicas exclusivas de
  cada setlist precisam de ensaio separado
- **Idol com affinity 0.5 e mastery 100**: Performance = medíocre × excelente
  = aceitável (~0.75). Mastery compensa parcialmente, mas a música nunca
  soa natural nessa idol. Melhor trocar
- **3 ballads seguidas na setlist**: Pacing score despenca (transições
  laterais repetidas + energy baixa contínua). Audiência desengaja.
  O jogo avisa visualmente no editor de setlist

## Dependencies

**Hard:**
- music-entities.md — músicas definem o que é possível
- show-system.md — setlist é processada no show
- idol-attribute-stats.md — stats e mastery determinam performance

**Soft:**
- staff-functional.md — coaches aceleram mastery
- schedule-agenda.md — ensaios ocupam slots
- audience-system.md — pacing afeta engagement

**Depended on by:**
- show-system.md (processa setlist música por música)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `BASE_MASTERY_GAIN` | 15 | 8-25 | Mastery por sessão de ensaio |
| `MASTERY_DECAY_RATE` | 0.0 | 0-0.5/semana | Mastery cai se não ensaia? (0 = não cai) |
| `MASTERY_PERFORMANCE_MIN` | 0.5 | 0.3-0.7 | Multiplicador com mastery 0 |
| `MASTERY_PERFORMANCE_MAX` | 1.15 | 1.05-1.3 | Multiplicador com mastery 100 |
| `PACING_WEIGHT` | 0.15 | 0.05-0.25 | Quanto pacing afeta nota geral |
| `SETLIST_REHEARSAL_SPLIT` | 2.0 | 1.0-3.0 | Multiplicador de divisão no ensaio de setlist |
| `AFFINITY_MIN` | 0.5 | 0.3-0.7 | Piso de affinity (incompatível) |
| `AFFINITY_MAX` | 1.2 | 1.1-1.4 | Teto de affinity (match perfeito) |

## Acceptance Criteria

1. Setlists são construídas pelo jogador com editor visual
2. Ordem das músicas afeta pacing score calculado automaticamente
3. Pacing score mostrado em tempo real durante edição da setlist
4. Mastery por idol por música cresce logaritmicamente com ensaio
5. 3 tipos de treino distintos: genérico (atributo), setlist (geral), música (focado)
6. Ensaio de setlist divide mastery entre todas músicas
7. Ensaio de música foca mastery em 1 música
8. Affinity semi-fixa baseada em vocal fit + personalidade
9. Setlists salváveis e reutilizáveis entre shows
10. Seções (Opening, Rising, Peak, etc.) têm efeitos documentados
11. MC entre músicas dá bônus de pacing e engagement
12. Mastery <20 penaliza performance em 30-50%

## Open Questions

- Nenhuma pendente
