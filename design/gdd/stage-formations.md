# Stage Formations System

> **Status**: Designed (v2 — modelo de roles por música, sem grid espacial)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-07
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 2 — Suas Decisões, Suas Consequências
> **Related**: show-system.md (roles afetam performance), setlist-system.md (formação por música), group-management.md (composição do grupo), idol-attribute-stats.md (stats determinam fit por role), staff-functional.md (Choreographer recomenda formações)

## Overview

O Stage Formations System define como idols de um grupo são **escaladas em
roles para cada música** da setlist. Cada música tem sua própria formação:
quem é Center, quem é Main Vocal, quem faz Backing. Na indústria idol real,
formações rotacionam dentro da mesma música e entre músicas — o sistema
abstrai isso como **atribuição de roles per-song**.

Não existe grid espacial fixo — a coreografia real tem dezenas de rotações
por música. O que importa mecanicamente é **qual papel cada idol desempenha
em cada música**, e como a **chemistry entre membros** afeta a performance
coletiva.

É o equivalente a escalar 11 jogadores no FM26 com posições e funções
diferentes por esquema tático — mas aqui a "tática" muda a cada música.

## Player Fantasy

A fantasia é de **produtor que monta a escalação perfeita para cada música**.
"Na balada, a Hana é Center porque tem a melhor voz. No hit dance, a Riko
assume porque domina a coreografia. Na última música, coloco a Sakura como
Center porque é o momento emocional do encore." Cada música é uma escalação
tática diferente, e o jogador otimiza quem brilha onde.

## Detailed Design

### 1. Roles por Música

Cada música na setlist tem **roles atribuídos** a cada idol participante:

```
MusicFormation {
  song_index:    uint8           // Posição na setlist
  assignments:   RoleAssignment[]  // 1 por idol no grupo
}

RoleAssignment {
  idol_id:       uint32
  role:          enum (Center, MainVocal, MainDancer, Support, Backing, MC)
  featured:      bool            // Se é destaque nesta música (max 1-3 por música)
}
```

**Roles e seus multiplicadores** (definidos em show-system.md):

| Role | Performance Mult | Exposure | Fama Mult | Ideal para |
|---|---|---|---|---|
| **Center** | ×1.20 | Máxima | ×1.30 | Melhor match geral para a música |
| **Main Vocal** | ×1.10 | Alta | ×1.15 | Maior Vocal, música vocal-heavy |
| **Main Dancer** | ×1.10 | Alta | ×1.15 | Maior Dança, música dance-heavy |
| **Support** | ×1.00 | Normal | ×1.00 | Complementares, versatile |
| **Backing** | ×0.90 | Baixa | ×0.85 | Membros mais fracos para a música |
| **MC** | ×1.00 (Comunicação) | Entre músicas | ×1.05 | Maior Comunicação, entre músicas |

**Regras:**
- Toda música tem exatamente 1 Center
- Main Vocal e Main Dancer são opcionais (1 de cada, máximo)
- Restantes são Support ou Backing
- MC é atribuído entre músicas (não durante)
- Uma idol pode ter roles diferentes em músicas diferentes

### 2. Role-Stat Fit (Adequação)

A performance de uma idol no role depende de quão bem seus stats
combinam com o role:

```
role_fit(idol, role, song) =
  role == Center:
    fit = (idol.charisma × 0.35 + idol.aura × 0.30 + idol.visual × 0.20
           + match_song_primary(idol, song) × 0.15)
  
  role == MainVocal:
    fit = (idol.vocal × 0.60 + idol.communication × 0.20
           + idol.aura × 0.20)
  
  role == MainDancer:
    fit = (idol.dance × 0.55 + idol.stamina × 0.25
           + idol.aura × 0.20)
  
  role == Support:
    fit = average(idol.vocal, idol.dance, idol.charisma) / 100
  
  role == Backing:
    fit = 0.5 + (idol.teamwork × 0.005)  // Backing depende menos de stats
  
  role == MC:
    fit = (idol.communication × 0.50 + idol.variety × 0.30
           + idol.charisma × 0.20)

// fit range: 0.0 - 1.0+
// fit < 0.4: penalidade visível (audiência nota mismatch)
// fit > 0.8: bônus de confiança (+2% performance extra)
```

### 3. Chemistry entre Membros

A afinidade entre membros do grupo afeta a performance coletiva.
O sistema de chemistry vem de group-management.md (afinidade 0.0-1.0
por par) e é aplicado como **bônus ou penalidade global do grupo**:

```
group_chemistry_score(group, formation) =
  sum(affinity(i, j) para todos pares i,j no grupo) / num_pairs

chemistry_modifier =
  chemistry_score > 0.7: +CHEMISTRY_HIGH_BONUS    // +8%
  chemistry_score 0.5-0.7: +CHEMISTRY_MED_BONUS   // +3%
  chemistry_score 0.3-0.5: 0                       // neutro
  chemistry_score < 0.3: -CHEMISTRY_LOW_PENALTY    // -5%
```

**Pares específicos com impacto amplificado:**
- Center + Main Vocal com affinity > 0.7: bônus extra +3% (harmonia líder-voz)
- Center + qualquer membro com affinity < 0.2: penalidade extra -3% (conflito visível)
- 2+ membros com affinity < 0.2 entre si: chance de "dessincronização visível"
  durante show (evento de momento, -5% engagement)

### 4. Formação Recomendada pelo Coreógrafo

Se o staff inclui um **Choreographer** (staff-functional.md), ele sugere
a melhor escalação de roles para cada música:

```
choreographer_recommendation(group, song) =
  Para cada permutação viável de roles:
    score = sum(
      role_fit(idol, role, song) × role_multiplier(role)
    )
  Retorna top 3 escalações por score

  Qualidade da recomendação depende do skill:
    skill < 30:   40% chance de incluir a ótima nas top 3
    skill 30-60:  70% chance
    skill 61-80:  90% chance
    skill > 80:   100% chance (sempre inclui a ótima)
```

**Sem Choreographer**: Jogador monta formação manualmente. Sistema oferece
um auto-assign básico (idol com maior stat relevante ganha o role).

### 5. Mudança de Roles entre Músicas

O grande diferencial: **cada música tem sua própria formação**. A idol que
é Center na música 1 pode ser Support na música 5.

```
// Exemplo: Celestial Nine (6 membros) em setlist de 5 músicas

Música 1 (Opening, Dance):  Riko=Center, Hana=MainVocal, Sakura=MainDancer, ...
Música 2 (Ballad):          Hana=Center, Sakura=MainVocal, Riko=Support, ...
Música 3 (Hit single):      Sakura=Center, Hana=MainVocal, Riko=MainDancer, ...
Música 4 (MC):              Moe=MC (Variety Engine)
Música 5 (Finale, Energy):  Sakura=Center, Riko=MainDancer, Hana=MainVocal, ...
```

**Custo de rotação:**
- Mudar roles entre músicas é **grátis** (esperado e natural na indústria idol)
- Sem penalidade de transição (rotações são parte normal da coreografia)
- Isso incentiva o jogador a otimizar cada música individualmente

**Familiaridade por Role:**
- Idol que fica no **mesmo role por N músicas consecutivas** ganha bônus leve:

```
role_familiarity_bonus =
  2+ músicas consecutivas no mesmo role: +1%
  4+ músicas consecutivas: +2%
  Show inteiro no mesmo role: +3%
  
  // Incentiva consistência MAS rotação é viável
```

### 6. Restrições

```
- Grupos < 3: sem sistema de formação (solo/duo têm roles fixos)
- Grupos 3-12: formação obrigatória por música (auto-assign se não definida)
- Max 12 membros por formação (cap do group-management.md)
- Idol em burnout/incapacitada: não pode ser escalada
- Idol com mastery < 20 na música: aviso (pode escalar, mas penalidade severa)
- Trainee como backup: pode ser escalada como Support/Backing apenas
```

### 7. Presets de Formação

O jogador pode salvar configurações de roles como presets reutilizáveis:

```
FormationPreset {
  name:       string       // "Formação de Show", "Formação de TV"
  roles:      Map<idol_id, default_role>
  auto_apply: bool         // Aplicar automaticamente em shows futuros
}
```

Presets são úteis para não reconfigurar toda vez. O jogador pode ter um
preset "Padrão" e ajustar apenas músicas específicas.

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Não Definida** | Nenhum role atribuído | → Auto-Assigned ou Configurada |
| **Auto-Assigned** | Sistema atribuiu roles baseado em stats | → Configurada (jogador ajusta) |
| **Configurada** | Jogador definiu roles per-song | → Em Uso (show inicia) |
| **Em Uso** | Formação ativa durante show | → Processada (show termina) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **show-system.md** | → modifica | Role multiplier (×0.90 a ×1.20) por idol por música |
| **setlist-system.md** | ← estrutura | Setlist define músicas; formação é per-song |
| **group-management.md** | ← dados | Chemistry score afeta performance coletiva |
| **idol-attribute-stats.md** | ← stats | Stats determinam role_fit |
| **staff-functional.md** | ← skill | Choreographer recomenda formações e melhora auto-assign |
| **audience-system.md** | → modifica | Center exposure afeta fan conversion |
| **fame-rankings.md** | → modifica | Role exposure mult afeta fama por idol |

## Formulas

### Performance por Role na Formação

```
formation_performance(idol, role, song) =
  role_fit(idol, role, song)
  × role_multiplier(role)
  × (1 + chemistry_modifier)
  × (1 + role_familiarity_bonus)

// Alimenta show-system.md como mult_role na Camada 2
```

### Score de Formação (para recomendação)

```
formation_score(assignments, group, song) =
  sum(
    role_fit(idol, role, song) × role_multiplier(role)
    para cada assignment
  ) / group_size

// Range típico: 0.70 - 1.15
```

## Edge Cases

- **Idol com stats todos iguais**: Funciona como Support em qualquer música.
  Jogador escolhe onde mais precisa
- **Grupo com 12 membros, só 1 Center por música**: 11 membros competem
  por roles de destaque. Gera drama natural (quem não é escalado reclama)
- **Idol insiste em ser Center mas não é a melhor**: Se Ambição alta +
  não escalada como Center por 3+ músicas: felicidade -3/show.
  Parte do drama emergente
- **Todas idols com Vocal alto, nenhuma com Dance**: Músicas dance-heavy
  terão performance fraca independente da formação. Problema de roster
- **MC atribuído a idol com Comunicação 20**: Péssima transição entre
  músicas. Audiência perde engagement no intervalo
- **Preset desatualizado (idol saiu do grupo)**: Preset ignora idols
  ausentes e auto-assign preenche

## Dependencies

**Hard:**
- show-system.md — formação é processada dentro da simulação do show
- group-management.md — chemistry entre membros

**Soft:**
- setlist-system.md — formação per-song
- staff-functional.md — Choreographer
- idol-attribute-stats.md — stats para role_fit

**Depended on by:**
- show-system.md (role multiplier na performance)
- fame-rankings.md (exposure por role afeta fama)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `CENTER_PERFORMANCE_MULT` | 1.20 | 1.10-1.35 | Multiplicador do Center |
| `CENTER_FAME_MULT` | 1.30 | 1.15-1.50 | Fama extra por ser Center |
| `MAIN_PERFORMANCE_MULT` | 1.10 | 1.05-1.20 | Mult Main Vocal/Dancer |
| `BACKING_PERFORMANCE_MULT` | 0.90 | 0.80-0.95 | Mult Backing |
| `CHEMISTRY_HIGH_BONUS` | 0.08 | 0.03-0.15 | Bônus chemistry > 0.7 |
| `CHEMISTRY_MED_BONUS` | 0.03 | 0.01-0.08 | Bônus chemistry 0.5-0.7 |
| `CHEMISTRY_LOW_PENALTY` | 0.05 | 0.02-0.10 | Penalidade chemistry < 0.3 |
| `ROLE_FIT_PENALTY_THRESHOLD` | 0.40 | 0.30-0.50 | Fit abaixo = penalidade visível |
| `ROLE_FIT_BONUS_THRESHOLD` | 0.80 | 0.70-0.90 | Fit acima = bônus confiança |
| `ROLE_FAMILIARITY_2` | 0.01 | 0.005-0.02 | Bônus 2+ músicas no mesmo role |
| `ROLE_FAMILIARITY_4` | 0.02 | 0.01-0.03 | Bônus 4+ músicas |
| `ROLE_FAMILIARITY_FULL` | 0.03 | 0.02-0.05 | Bônus show inteiro |

## Acceptance Criteria

1. Cada música na setlist tem atribuição independente de roles (Center, MainVocal, MainDancer, Support, Backing, MC)
2. Role multiplier afeta performance e fama por idol por música
3. role_fit calcula adequação do idol ao role baseado em stats
4. Chemistry do grupo (afinidade entre pares) modifica performance coletiva
5. Choreographer sugere formações otimizadas com qualidade proporcional ao skill
6. Idol pode ter roles diferentes em músicas diferentes (rotação livre)
7. Sem penalidade de transição entre roles (rotação é natural)
8. Presets salvam configurações de roles reutilizáveis
9. Auto-assign funciona se jogador não define (baseado em stats ou Choreographer)
10. Grupos < 3 não usam sistema de formação
11. Familiaridade por role dá bônus leve por consistência
12. Idol não escalada como destaque por muitas músicas pode reclamar (drama emergente)

## Open Questions

- Nenhuma pendente
