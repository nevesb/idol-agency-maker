# Happiness & Wellness System

> **Status**: Designed (v2 — referências a show/audience systems, 16 atributos)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 2 — Suas Decisões, Suas Consequências
> **Related**: show-system.md (stress pós-show), audience-system.md (motivação por reação), staff-functional.md (Wellness Advisor), idol-attribute-stats.md (Mentalidade, Foco, Resistência)

## Overview

O Happiness & Wellness System monitora o estado emocional e físico de cada idol
através de 4 barras visíveis: Saúde Física, Felicidade, Stress e Motivação.
Estas barras são o "painel de instrumentos" que o jogador lê pra entender como
suas idols estão. Agenda cheia, cláusulas ruins, escândalos e overwork degradam
as barras. Descanso, boas condições, sucesso e facilities as recuperam.
O jogador vê tudo claramente -- a decisão de ignorar os sinais é dele.

## Player Fantasy

A fantasia é de **cuidador e explorador**. O jogador sente o peso moral de
empurrar uma idol pro limite sabendo que a barra de stress está amarela.
Serve o **Pilar 2 (Consequências)**: o jogo nunca esconde o estado da idol.
Se ela quebra, é porque o jogador viu os sinais e escolheu ignorar. A tensão
entre "preciso do dinheiro desse job" e "minha idol não aguenta" é o coração
emocional do jogo.

## Detailed Design

### Core Rules

#### 1. As 4 Barras (escala 0-100)

| Barra | O que mede | Visibilidade |
|---|---|---|
| **Saúde Física** | Condição corporal, cansaço, resistência | Barra verde/amarela/vermelha |
| **Felicidade** | Satisfação geral com vida e trabalho | Barra + ícone de humor |
| **Stress** | Acúmulo de pressão (0=relaxada, 100=burnout) | Barra + código de cores na agenda |
| **Motivação** | Vontade de trabalhar e melhorar | Barra + afeta crescimento de stats |

Todas começam em 70 (bom, não perfeito) ao contratar uma idol.

#### 2. O que Aumenta / Diminui Cada Barra

**Saúde Física:**
- Sobe: Descanso, Área de Descanso (facility), poucos jobs na semana
- Desce: Jobs físicos (shows, dança, turnê), agenda cheia, idade avançada
- Relação com stat: Resistência alta = Saúde desce mais devagar

**Felicidade:**
- Sobe: Salário justo, cláusulas favoráveis, sucesso em jobs, boa fama,
  Sala de Convivência (facility), descanso adequado
- Desce: Salário baixo, cláusulas restritivas (namoro, imagem), fracasso
  em jobs, escândalos, overwork, fã club negativo
- Relação com oculto: Ambição alta + estagnação = felicidade cai rápido

**Stress:**
- Sobe: Jobs consecutivos sem descanso, escândalos, pressão de eventos
  grandes, agenda vermelha, conflitos internos
- Desce: Dias de folga, Psicólogo (facility), agenda leve, sucesso
- Relação com oculto: Temperamento baixo = stress sobe mais rápido
- **100 = Burnout** (ver Stats System para duração)

**Motivação:**
- Sobe: Jobs bem-sucedidos, subir de ranking, reconhecimento, boa fama
- Desce: Fracassos consecutivos, estagnação de ranking, jobs abaixo do
  nível, ser ignorada (sem jobs por semanas)
- Relação com oculto: Ambição alta = motivação cai rápido se estagnada,
  sobe rápido com sucesso

#### 3. Efeitos Mecânicos das Barras

| Barra | 80-100 (Ótimo) | 50-79 (OK) | 20-49 (Preocupante) | 0-19 (Crítico) |
|---|---|---|---|---|
| **Saúde** | Bônus Resistência +10% | Normal | Performance -20% em jobs físicos | Não pode trabalhar, forçar = dano permanente |
| **Felicidade** | Bônus crescimento +10%, renovação fácil | Normal | Renovação difícil, pode exigir rescisão | Exige rescisão, recusa jobs |
| **Stress** | N/A (stress=0 é bom) | Normal | Performance -10%, risco de escândalo ×2 | Overwork → Burnout em 80+, Burnout em 100 |
| **Motivação** | Crescimento +20% | Normal | Crescimento -30% | Crescimento zero, recusa treino |

#### 4. Agenda e Código de Cores

A agenda semanal mostra cores baseadas na combinação das barras:
- **Verde**: Todas barras OK. Pode adicionar mais jobs
- **Amarelo**: 1+ barra em Preocupante. Cuidado ao adicionar jobs
- **Vermelho**: 1+ barra em Crítico. Não deveria trabalhar
- **Roxo**: Burnout ativo. Não pode trabalhar

O jogo MOSTRA tudo. Nunca esconde. O casual vê "vermelho" e para. O hardcore
calcula exatamente quantos jobs cabem antes do amarelo virar vermelho.

#### 5. Psicólogo (Facility Integration)

Se a agência tem Psicólogo (facility do Agency Economy):
- **Nível 1**: Alerta 2 semanas antes de burnout ("Idol X está próxima do limite")
- **Nível 2**: + Redução de stress ×0.8 pra idols que frequentam (requer slot na agenda)
- **Nível 3**: + Recuperação de crise emocional mais rápida (escândalos, fracassos)

Idol precisa de **slot na agenda** pra ir ao psicólogo. Compete com jobs.

### States and Transitions

| Estado | Saúde | Felicidade | Stress | Motivação | Efeito |
|---|---|---|---|---|---|
| **Saudável** | 50+ | 50+ | <50 | 50+ | Normal, sem penalidades |
| **Cansada** | 20-49 | — | — | — | Performance física -20% |
| **Infeliz** | — | 20-49 | — | — | Renovação difícil, risco de rescisão |
| **Estressada** | — | — | 50-79 | — | Performance -10%, escândalos ×2 |
| **Desmotivada** | — | — | — | 20-49 | Crescimento -30% |
| **Overwork** | — | — | 80-99 | — | Crescimento ×0.5, decaimento ×2.0 |
| **Burnout** | — | — | 100 | — | Não trabalha, 1-8 semanas recuperação |
| **Em Crise** | — | <20 | — | — | Exige rescisão, recusa jobs |
| **Incapacitada** | <20 | — | — | — | Não pode trabalhar, forçar = dano permanente |

Estados são **combináveis**: uma idol pode estar Cansada + Estressada + Desmotivada
simultaneamente. Efeitos empilham.

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Stats System** | ← lê | Resistência afeta Saúde. Mentalidade afeta Stress. Ocultos (Temperamento, Ambição) modificam velocidades |
| **Stats System** | → afeta | Burnout zera crescimento. Motivação alta/baixa modifica crescimento. Saúde crítica = dano permanente |
| **Contract System** | ← lê | Cláusulas (namoro, carga, descanso, salário) afetam Felicidade |
| **Contract System** | → dispara | Felicidade <20 por 4 semanas = idol exige rescisão |
| **Schedule/Agenda** | ← lê | Número de jobs na semana, dias de folga, carga vs. limite |
| **Schedule/Agenda** | → afeta | Código de cores na agenda, bloqueio de escalação se Incapacitada |
| **Job Assignment** | → afeta | Performance de job modificada por Saúde e Stress |
| **Week Simulation** | ← tick | Atualiza todas barras no fim da semana |
| **Event/Scandal Generator** | ↔ bidirecional | Stress alto aumenta chance de escândalo. Escândalo derruba Felicidade e sobe Stress |
| **Fame & Rankings** | ← lê | Subir ranking = Motivação sobe. Cair = desce |
| **Agency Economy** | ← lê | Facilities (Psicólogo, Convivência, Descanso) modificam barras |
| **Fan Club System** | ← lê | Fã club negativo derruba Felicidade |
| **Music Charts** | ← lê | Música no top 100 = Motivação +5. Hit #1 = Motivação +15. Chart success aumenta Felicidade |
| **Media Entities** | ← lê | Aparecer em show de prestígio = Motivação +5-10, Felicidade +5 |
| **Idol Personal Finance** | ↔ bidirecional | Conquistas de vida (casa, carro) = Felicidade permanente +3-10. Dívida = Stress +5-20/semana, Felicidade -2-10. Cirurgia = pode afetar Stats |

## Formulas

#### Atualização Semanal de Stress

```
delta_stress = stress_ganho - stress_perdido

stress_ganho = (jobs_na_semana × STRESS_PER_JOB) + eventos_stress
  STRESS_PER_JOB = 5 (base), modificado por tipo de job (físico=8, leve=3)
  eventos_stress = escândalo (+20), fracasso (+10), conflito (+15)

stress_perdido = (dias_folga × REST_PER_DAY) + psicologo_bonus
  REST_PER_DAY = 4 (base)
  psicologo_bonus = 0 (sem), nível 1: 0, nível 2: stress × 0.2, nível 3: stress × 0.3

Modificador oculto: Temperamento baixo (<8) → stress_ganho × 1.3
                     Temperamento alto (>14) → stress_ganho × 0.7
```

#### Atualização Semanal de Felicidade

```
delta_felicidade = positivos - negativos

positivos = sucesso_jobs(+3 cada) + salario_justo(+2) + descanso_ok(+2)
          + facility_convivencia(+1/+2/+3 por nível) + fama_subiu(+5)
negativos = fracasso(-5) + salario_baixo(-3) + clausula_restritiva(-2 cada)
          + escandalo(-15) + overwork(-5) + fan_club_negativo(-3)

Modificador: Ambição alta + ranking estagnado por 4+ semanas → -5/semana extra
```

#### Atualização Semanal de Saúde

```
delta_saude = recuperacao - desgaste

recuperacao = dias_folga × HEALTH_RECOVERY_PER_DAY × facility_descanso_mult
  HEALTH_RECOVERY_PER_DAY = 3
  facility_descanso_mult = 1.0 (sem), 1.3 (nível 1), 1.5 (nível 2)

desgaste = jobs_fisicos × PHYSICAL_JOB_COST + idade_penalty
  PHYSICAL_JOB_COST = 5 (show), 8 (turnê), 3 (gravação)
  idade_penalty = 0 (antes 24), +1/semana (24-30), +2/semana (30+)

Modificador stat: Resistência alta → desgaste × (1 - Resistência/200)
  Ex: Resistência 80 → desgaste × 0.6
```

#### Atualização Semanal de Motivação

```
delta_motivacao = ganhos - perdas

ganhos = sucesso_job(+5) + ranking_subiu(+8) + reconhecimento(+3)
perdas = fracasso(-5) + ranking_caiu(-8) + sem_jobs_semana(-4) + estagnacao(-3)

Modificador: Ambição alta (>14) → ganhos × 1.5, perdas × 1.5 (extremos maiores)
             Ambição baixa (<8) → ganhos × 0.7, perdas × 0.7 (mais estável)
```

## Edge Cases

- **Todas barras em Crítico simultaneamente**: Idol está destruída. Burnout +
  Crise + Incapacitada. Só descanso forçado de muitas semanas resolve
- **Idol com Motivação 0 mas Felicidade 100**: Possível (feliz mas sem vontade
  de trabalhar). Recusa treinos mas não exige rescisão
- **Psicólogo alerta burnout mas agenda já está cheia**: Alerta aparece. Jogador
  decide se cancela jobs (com consequências) ou ignora (com risco)
- **Idol novata contratada: todas barras em 70**: Design intencional. Não começa
  em 100 porque recém-chegada tem adaptação
- **Idol em Burnout recebe proposta de rival**: Pode aceitar se Lealdade baixa.
  Jogador pode perder idol enquanto ela se recupera
- **Stress = 100 durante evento ao vivo (modo Live)**: Burnout dispara Pause
  automático. Jogador é forçado a lidar imediatamente
- **Facilities de bem-estar com agenda lotada**: Idol precisa de slot pra
  psicólogo/descanso. Se agenda está cheia, facilities não ajudam. Trade-off
  direto com jobs
- **Felicidade <20 por 4 semanas**: Idol exige rescisão. Se jogador recusar,
  idol para de cooperar (performance -50% em todos jobs)

## Dependencies

**Hard:**
- Stats System — Resistência, Mentalidade afetam cálculos. Ocultos (Temperamento,
  Ambição) modificam velocidades. Burnout definido no Stats System

**Soft:**
- Agency Economy (facilities) — Psicólogo, Convivência, Descanso melhoram barras
- Contract System — Cláusulas afetam Felicidade
- Fan Club System — Fã club negativo afeta Felicidade
- **Producer Profile** (#50): Traços e estilo afetam stress/happiness base. Ver `producer-profile.md` seção 4c-4d.

**Depended on by:**
Job Assignment, Schedule/Agenda, Contract System (rescisão), Week Simulation,
Event/Scandal Generator, Idol Lifecycle (condição de debut), Stats System (crescimento)

## Tuning Knobs

| Knob | Default | Range | Se muito alto | Se muito baixo |
|---|---|---|---|---|
| `STRESS_PER_JOB` | 5 | 2-10 | Poucas idols aguentam agenda cheia | Stress irrelevante |
| `REST_PER_DAY` | 4 | 2-8 | Recupera rápido demais | Impossível recuperar sem facilities |
| `HEALTH_RECOVERY_PER_DAY` | 3 | 1-6 | Saúde nunca é problema | Idols sempre cansadas |
| `PHYSICAL_JOB_COST` | 5 (show) | 2-12 | Shows destroem saúde | Sem tensão física |
| `INITIAL_BARS_VALUE` | 70 | 50-90 | Sem pressão inicial | Começa em crise |
| `UNHAPPINESS_CRISIS_WEEKS` | 4 | 2-8 | Muito tolerante | Idol exige rescisão rápido demais |
| `MOTIVATION_STAGNATION_PENALTY` | -3/semana | -1 a -8 | Motivação despenca rápido | Estagnação sem consequência |
| `TEMPERAMENT_STRESS_MODIFIER` | ±0.3 | ±0.1 a ±0.5 | Temperamento domina stress | Temperamento irrelevante |

## Acceptance Criteria

1. Idol com 5+ jobs físicos/semana sem folga atinge Stress 80+ em 3-4 semanas
2. Idol com 2 dias de folga/semana e Psicólogo nível 2 mantém Stress abaixo de 50
3. Burnout (Stress 100) dispara 1-8 semanas de recuperação conforme fórmula de resiliência
4. Felicidade <20 por 4 semanas dispara exigência de rescisão
5. Código de cores na agenda reflete corretamente o estado combinado das barras
6. Facilities (Psicólogo, Convivência, Descanso) têm efeito mensurável nas barras
7. Motivação alta (+80) acelera crescimento de stats em +20%
8. Motivação zero impede todo crescimento e treino
9. Idol Incapacitada (Saúde <20) é bloqueada de jobs. Forçar causa dano permanente
10. Ocultos (Temperamento, Ambição) modificam velocidades de barras conforme fórmulas

## Open Questions

- **RESOLVIDO**: Contagio de grupo: não precisa de mecânica separada -- já
  afeta o estado do grupo nos trabalhos via Group Management
- **RESOLVIDO**: Eventos de felicidade criados pelo jogador: cobertos pelo
  Player-Created Events (festas, team building como tipo de evento)
- **RESOLVIDO**: Idade mínima: limite de carga apenas pra menores de idade
  (infantil), não regra geral por idade
