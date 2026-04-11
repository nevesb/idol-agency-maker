# Medical System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-06
> **Implements Pillar**: Pilar 2 — Suas Decisões, Suas Consequências, Pilar 4 — O Drama Nasce das Mecânicas
> **Related**: happiness-wellness.md (Saúde Física, Stress, burnout), idol-attribute-stats.md (Resistência, stats afetados), agency-economy.md (Medical Center facility), staff-functional.md (Physical Therapist), schedule-agenda.md (agenda durante recuperação)

## Overview

O Medical System gerencia **lesões, recuperação e prevenção** de idols. Lesões
não são aleatórias — são **determinísticas**, baseadas em combinações de stats
baixos, carga de trabalho excessiva e semanas consecutivas de intensidade.
O jogador que ignora os sinais paga com semanas de inatividade. O jogador que
investe em prevenção (Medical Center, Physical Therapist) reduz risco e
acelera recuperação.

É o equivalente ao sistema de lesões do FM26: o atacante com 5 jogos seguidos
sem descanso tem risco exponencial de lesão muscular. Aqui, a idol com
Resistência baixa fazendo 4 shows intensos seguidos vai se machucar.

## Player Fantasy

A fantasia é de **gestor de saúde sob pressão**. Você SABE que a idol precisa
de descanso, mas o show da semana que vem paga ¥50M. Forçar ou descansar?
Serve o **Pilar 2**: o jogador vê o risco no dashboard médico (amarelo →
vermelho), e a decisão de ignorar é dele. Quando a lesão acontece e a idol
fica 6 semanas fora, a responsabilidade é clara. E quando o Physical Therapist
de skill 90 reduz a recuperação de 6 pra 4 semanas, o investimento em staff
se paga.

## Detailed Design

### 1. Tipos de Lesão

| Lesão | Causa Principal | Tempo Base Recuperação | Chance Dano Permanente |
|---|---|---|---|
| **Lesão Vocal** (vocal strain) | Jobs vocais > threshold de intensidade | 2-4 semanas | 25% |
| **Lesão Muscular** (muscle injury) | Jobs de dança/físicos > threshold de intensidade | 3-6 semanas | 25% |
| **Esgotamento Mental** (mental exhaustion) | Stress > 80 por 4+ semanas consecutivas | 4-8 semanas | 25% |
| **Lesão nas Costas** (back injury) | Show + má postura (Resistência baixa) | 4-8 semanas | 30% |
| **Lesão no Joelho** (knee injury) | Intensidade de dança + idade > 25 | 6-12 semanas | 35% |
| **Transtorno de Ansiedade** (anxiety disorder) | Felicidade < 20 por 8+ semanas consecutivas | 6-12 semanas | 20% |
| **Fadiga Geral** (general fatigue) | Carga de treino > 120% por 3+ semanas consecutivas | 1-3 semanas | 10% |

```
Injury {
  id:              uint32
  type:            enum (VocalStrain, MuscleInjury, MentalExhaustion,
                         BackInjury, KneeInjury, AnxietyDisorder, GeneralFatigue)
  base_recovery:   uint8          // Semanas base de recuperação
  actual_recovery: uint8          // Semanas reais (com modificadores)
  weeks_elapsed:   uint8          // Semanas já em recuperação
  idol_id:         uint32
  permanent_risk:  bool           // Se forçar trabalho, risco de dano permanente
  affected_stat:   string?        // Stat que pode ser danificado permanentemente
}
```

### 2. Triggers de Lesão (Determinísticos)

Lesões NÃO são puramente aleatórias. Cada tipo tem **condições necessárias**
e uma chance que escala com a gravidade da situação:

```
// LESÃO VOCAL (vocal strain)
trigger_vocal_strain(idol, week) =
  intensidade_job_vocal > VOCAL_INTENSITY_THRESHOLD

  chance = (intensidade_job_vocal - VOCAL_INTENSITY_THRESHOLD) / 100
  // Jobs vocais acima do threshold escalam linearmente em risco

// LESÃO MUSCULAR (muscle injury)
trigger_muscle_injury(idol, week) =
  intensidade_job_fisico_ou_danca > PHYSICAL_INTENSITY_THRESHOLD

  chance = (intensidade_job_fisico_ou_danca - PHYSICAL_INTENSITY_THRESHOLD) / 100
  // Jobs físicos/dança acima do threshold escalam linearmente em risco

// ESGOTAMENTO MENTAL (mental exhaustion)
trigger_mental_exhaustion(idol, week) =
  Stress > 80
  AND semanas_stress_acima_80 >= 4

  chance = min(1.0, (semanas_stress_acima_80 - 3) × 0.20)
  // 4 semanas: 20%, 5 semanas: 40%, 6 semanas: 60%...

// LESÃO NAS COSTAS (back injury)
trigger_back_injury(idol, week) =
  show_esta_semana == true
  AND Resistência < BACK_INJURY_RESIST_THRESHOLD  // má postura = Resistência baixa

  chance = (BACK_INJURY_RESIST_THRESHOLD - Resistência) / 100
  // Resistência baixa aumenta chance durante shows

// LESÃO NO JOELHO (knee injury)
trigger_knee_injury(idol, week) =
  intensidade_danca > KNEE_DANCE_THRESHOLD
  AND idol.age > 25

  chance = (intensidade_danca - KNEE_DANCE_THRESHOLD) / 100
           × age_factor(idol.age)
  // Risco amplificado por idade > 25

// TRANSTORNO DE ANSIEDADE (anxiety disorder)
trigger_anxiety_disorder(idol, week) =
  Felicidade < 20
  AND semanas_felicidade_abaixo_20 >= 8

  chance = min(1.0, (semanas_felicidade_abaixo_20 - 7) × 0.15)
  // 8 semanas: 15%, 9 semanas: 30%, etc.

// FADIGA GERAL (general fatigue)
trigger_general_fatigue(idol, week) =
  training_load > MAX_SAFE_LOAD × 1.20  // > 120% da carga máxima segura
  AND semanas_sobrecarga >= 3

  chance = min(1.0, (semanas_sobrecarga - 2) × 0.25)
  // 3 semanas: 25%, 4 semanas: 50%, 5 semanas: 75%
```

### 3. Mecânica de Recuperação

```
actual_recovery_weeks = ceil(
  base_recovery
  × facility_multiplier
  × staff_multiplier
  × resilience_factor
)

facility_multiplier:
  Sem Medical Center:   1.0
  Medical Center Lv 1:  0.85  (×1.2 mais rápido)
  Medical Center Lv 2:  0.70  (×1.5 mais rápido)
  Medical Center Lv 3:  0.50  (×2.0 mais rápido)

staff_multiplier (ptMult):
  Sem Physical Therapist:  1.0
  Com Physical Therapist:  ptMult = 0.90 - (ptSkill / 100) × 0.30
    // ptSkill 0:   ptMult = 0.90 (10% mais rápido)
    // ptSkill 50:  ptMult = 0.75 (25% mais rápido)
    // ptSkill 100: ptMult = 0.60 (40% mais rápido)

resilience_factor = 1.0 - (Resistência / 200)
  // Resistência 80: 1.0 - 0.4 = 0.6 (40% mais rápido)
  // Resistência 20: 1.0 - 0.1 = 0.9 (10% mais rápido)
```

**Exemplo completo**: Lesão no Joelho (base 9 semanas), Medical Center
Lv 2, Physical Therapist skill 75, Resistência 60:
```
ptMult = 0.90 - (75/100) × 0.30 = 0.90 - 0.225 = 0.675
resilience_factor = 1.0 - (60/200) = 0.70
actual = ceil(9 × 0.70 × 0.675 × 0.70) = ceil(2.976) = 3 semanas
// De 9 semanas para 3 — investimento em facilities e staff compensa
```

### 4. Physical Therapist (Staff)

Nova função de staff (extensão de staff-functional.md):

```
PhysicalTherapist {
  role:              "Physical Therapist"
  skill:             0-100
  salary:            ¥800K-¥5M/mês (proporcional ao skill)

  // Funções:
  reduce_recovery:   sim (ver staff_multiplier acima)
  prevent_reinjury:  sim (ver seção 5)
  rehab_training:    sim (supervisiona treino durante recuperação)
  risk_assessment:   sim (contribui para dashboard médico)
}
```

**Prevenção de Re-lesão**: Idol que retorna de lesão tem 30% chance de
re-lesão nas primeiras 2 semanas se voltar a carga intensa. Physical
Therapist reduz isso:

```
reinjury_chance = 0.30 × (1 - pt_skill / 150)
// PT skill 100: 0.30 × 0.33 = 10%
// PT skill 50:  0.30 × 0.67 = 20%
// Sem PT:       0.30 (30%)
```

### 5. Medical Center (Facility)

Facility do agency-economy.md expandida:

| Nível | Custo Inicial | Custo/Mês | Injury Chance Reduction | Recovery Speed | Extras |
|---|---|---|---|---|---|
| **Lv 1** | ¥20M | ¥2M | -10% | ×1.2 | Check-up mensal (detecta risco) |
| **Lv 2** | ¥50M | ¥4M | -20% | ×1.5 | + Equipamento de reabilitação. Rehab training desbloqueado |
| **Lv 3** | ¥100M | ¥8M | -30% | ×2.0 | + Prevenção avançada. Risk assessment automático semanal |

```
injury_chance_modified = injury_chance_base × (1 - medical_center_reduction)

// Medical Center Lv 2 + chance base 38%:
// 38% × (1 - 0.20) = 30.4%
```

### 6. Treino de Reabilitação

Durante recuperação, a idol pode fazer **treino leve** — apenas stats mentais,
sem stats físicos:

```
RehabTraining {
  available_stats:   [Comunicação, Foco, Aura, Carisma, Mentalidade]
  blocked_stats:     [Vocal, Dança, Resistência, Expressão Facial, Atuação]
  efficiency:        0.5 × normal_training  // 50% da eficiência normal
  requires:          Medical Center Lv 2+ AND Physical Therapist present
  agenda_slot:       1 slot por semana (não compete com jobs — idol está fora)
}
```

**Implicação tática**: Lesão não é 100% tempo perdido. Uma idol com 4 semanas
de recuperação pode sair com Comunicação e Mentalidade melhoradas. Otimizar
reabilitação é skill de jogador avançado.

### 7. Dano Permanente

Se o jogador **força trabalho** de uma idol lesionada (override manual com
aviso explícito), há chance de **dano permanente**:

```
permanent_damage_check(idol, injury) =
  se idol.status == "Recovering" AND jogador força job:
    chance = PERMANENT_DAMAGE_CHANCE[injury.type]

    PERMANENT_DAMAGE_CHANCE por tipo de lesão:
      VocalStrain:      0.25  (25%)
      MuscleInjury:     0.25  (25%)
      MentalExhaustion: 0.25  (25%)
      BackInjury:       0.30  (30%)
      KneeInjury:       0.35  (35%)
      AnxietyDisorder:  0.20  (20%)
      GeneralFatigue:   0.10  (10%)

  se dano permanente:
    affected_stat -= 5 (permanente, não recuperável)
    // VocalStrain:      Vocal -5
    // MuscleInjury:     Resistência -5
    // MentalExhaustion: Mentalidade -5
    // BackInjury:       Resistência -5
    // KneeInjury:       Dança -5
    // AnxietyDisorder:  Mentalidade -5
    // GeneralFatigue:   Resistência -5
```

**O jogo AVISA explicitamente**: "Forçar [Idol] a trabalhar com [Lesão] pode
causar dano permanente de -5 em [Stat]. Continuar?" Diálogo com botão
vermelho. Sem desculpa.

### 8. Dashboard Médico (Medical Audit)

Interface de risco por idol:

```
MedicalDashboard {
  per_idol: {
    risk_level:        enum (Green, Yellow, Red)
    risk_factors:      string[]     // Ex: "Resistência baixa", "4 semanas sem folga"
    training_load:     0-100%       // Carga de treino atual vs máximo seguro
    recovery_status:   string?      // "Recuperando: Distensão Muscular (2/4 semanas)"
    injury_history:    Injury[]     // Histórico de lesões
    recommendation:    string       // "Reduzir carga", "Dar folga", "OK"
  }
}

risk_level_calculation(idol) =
  Green:  training_load < 80% AND sem lesão ativa AND sem risco de re-lesão > 20%
  Yellow: training_load entre 80-100%
          OU em recuperação de lesão
  Red:    training_load > 100%
          OU lesão ativa
          OU risco de re-lesão > 20%

training_load(idol) =
  (jobs_fisicos_semana × PHYSICAL_JOB_COST + treinos_semana × TRAINING_COST)
  / MAX_SAFE_LOAD

MAX_SAFE_LOAD = 100  // Fixo para todas as idols
```

**Medical Center Lv 3** gera relatório automático semanal com risk_level
de todas as idols. Sem Medical Center, jogador precisa inferir dos stats.

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Saudável** | Sem lesão. Dashboard verde/amarelo | → Lesionada (trigger de lesão bem-sucedido) |
| **Lesionada** | Lesão ativa. Não pode trabalhar (jobs bloqueados) | → Recuperando (próxima semana) |
| **Recuperando** | Em recuperação. Rehab training possível | → Saudável (weeks_elapsed >= actual_recovery) |
| **Forçada** | Jogador forçou trabalho durante recuperação | → Saudável (com risco de dano permanente) |
| **Dano Permanente** | Stat reduzido permanentemente | Estado permanente (stat não recupera) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **happiness-wellness.md** | ← lê / → afeta | Saúde Física e Stress determinam triggers. Lesão reduz Saúde e aumenta Stress |
| **idol-attribute-stats.md** | ← lê / → afeta | Resistência, Vocal, Dança determinam risco. Dano permanente reduz stat |
| **schedule-agenda.md** | → bloqueia | Idol lesionada não pode ser escalada para jobs. Rehab ocupa slot |
| **show-system.md** | ← trigger | Evento "Idol se Machuca" mid-show pode gerar lesão |
| **agency-economy.md** | ← custos | Medical Center e Physical Therapist são despesas fixas |
| **staff-functional.md** | ← lê | Physical Therapist skill afeta recuperação e prevenção |
| **week-simulation.md** | ← processado | Lesões checadas e recuperação avançada no tick semanal |
| **news-feed.md** | → gera | Lesões de idols famosas geram headlines ("Idol X fora por 6 semanas") |
| **contract-system.md** | ← lê | Cláusula de saúde pode limitar carga máxima (se existir) |
| **talent-development-plans.md** | → afeta | Lesão pausa plano de desenvolvimento. Rehab como alternativa |

## Formulas

### Risco Semanal Agregado

```
weekly_injury_risk(idol) = max(
  chance_vocal_strain,
  chance_muscle_injury,
  chance_mental_exhaustion,
  chance_back_injury,
  chance_knee_injury,
  chance_anxiety_disorder,
  chance_general_fatigue
) × (1 - medical_center_reduction)

// O risco exibido no dashboard é o MAIOR risco individual
// Medical Center reduz todos os riscos uniformemente
```

### Custo Total de Lesão

```
injury_total_cost(injury) =
  lost_revenue                    // Jobs perdidos durante recuperação
  + medical_costs                 // Medical Center + PT salary (prorrateado)
  + replacement_costs             // Se precisou substituir em shows/jobs
  + morale_impact                 // Queda de moral do grupo (-5 mood por membro)

lost_revenue = avg_weekly_revenue(idol) × actual_recovery_weeks
medical_costs = (medical_center_monthly / 4) × actual_recovery_weeks
replacement_costs = variável (depende se tinha backup)
```

### Eficiência de Prevenção

```
prevention_savings =
  injuries_prevented × avg_injury_cost
  - annual_prevention_cost

annual_prevention_cost =
  medical_center_monthly × 12
  + pt_salary × 12

// Break-even: se previne 2+ lesões médias por ano, se paga
// Medical Center Lv 2 (¥4M/mês) + PT skill 70 (¥3M/mês) = ¥84M/ano
// 1 fratura por estresse = ~¥100M em lost revenue para idol famosa
```

## Edge Cases

- **Idol com Resistência 99 se machuca**: Quase impossível por triggers
  determinísticos. Mas evento "Idol se Machuca" no show (1% chance) ainda
  pode acontecer. Stats altos reduzem mas não eliminam risco
- **Todas idols do grupo lesionadas ao mesmo tempo**: Shows cancelados. Multas
  de contrato. Cenário catastrófico possível se jogador sobrecarregou todo
  o grupo. Dashboard médico deveria ter mostrado vermelho pra todas
- **Lesão durante show ao vivo**: Processado como evento mid-show. Idol sai.
  Grupo continua com penalidade. Audiência reage com simpatia (engagement
  não cai tanto). Lesão aplicada pós-show
- **Forçar trabalho 3 vezes consecutivas durante lesão**: Cada vez é check
  separado de dano permanente. Chance cumulativa depende do tipo de lesão.
  Ex: KneeInjury (35%): 1 - (1-0.35)^3 = 73% de pelo menos 1 dano permanente.
  Ex: GeneralFatigue (10%): 1 - (1-0.10)^3 = 27%. Jogador está destruindo a idol
- **Physical Therapist demitido durante recuperação**: Recuperação volta ao
  ritmo normal (sem staff_multiplier). Semanas restantes recalculadas
- **Idol novata (debut recente) com lesão grave**: 6 semanas fora no início
  da carreira. Fãs perdem interesse rápido (inactivity penalty). Pode
  precisar de "relançamento" pós-recuperação
- **Medical Center downgraded durante tratamento**: Recuperação em andamento
  usa o novo multiplicador. Pode estender o tempo restante

## Dependencies

**Hard:**
- happiness-wellness.md — Saúde Física e Stress são inputs primários para triggers
- idol-attribute-stats.md — Resistência determina risco e velocidade de recuperação

**Soft:**
- agency-economy.md — Medical Center e Physical Therapist são investimentos
- staff-functional.md — Physical Therapist como função de staff
- show-system.md — lesões podem ocorrer durante shows
- schedule-agenda.md — agenda bloqueada durante recuperação

**Depended on by:**
- schedule-agenda.md (bloqueio de jobs durante recuperação)
- show-system.md (disponibilidade de idols)
- talent-development-plans.md (interrupção de planos)
- news-feed.md (headlines de lesões)
- happiness-wellness.md (lesão afeta Saúde e Stress)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `VOCAL_INTENSITY_THRESHOLD` | 70 | 50-90 | Intensidade de job vocal acima do qual risco de lesão vocal começa |
| `PHYSICAL_INTENSITY_THRESHOLD` | 70 | 50-90 | Intensidade de job físico/dança acima do qual risco de lesão muscular começa |
| `MENTAL_EXHAUSTION_STRESS_THRESHOLD` | 80 | 60-95 | Nível de Stress mantido por 4+ semanas que dispara esgotamento mental |
| `BACK_INJURY_RESIST_THRESHOLD` | 40 | 20-60 | Resistência abaixo da qual há risco de lesão nas costas durante shows |
| `KNEE_DANCE_THRESHOLD` | 70 | 50-90 | Intensidade de dança acima do qual idols com idade > 25 têm risco de joelho |
| `ANXIETY_DISORDER_HAPPINESS_THRESHOLD` | 20 | 10-35 | Felicidade abaixo da qual há risco de transtorno de ansiedade (requer 8+ semanas) |
| `MAX_SAFE_LOAD` | 100 | 80-120 | Carga máxima segura fixa (todas as idols) |
| `OVERLOAD_FATIGUE_THRESHOLD` | 120 | 110-150 | % de MAX_SAFE_LOAD que dispara fadiga geral (3+ semanas) |
| `CONSECUTIVE_WEEKS_FACTOR` | 0.3 | 0.1-0.5 | Incremento de risco por semana consecutiva fora do threshold |
| `MEDICAL_CENTER_LV1_REDUCTION` | 0.10 | 0.05-0.20 | Redução de chance de lesão Lv 1 |
| `MEDICAL_CENTER_LV2_REDUCTION` | 0.20 | 0.10-0.35 | Redução de chance de lesão Lv 2 |
| `MEDICAL_CENTER_LV3_REDUCTION` | 0.30 | 0.15-0.50 | Redução de chance de lesão Lv 3 |
| `RECOVERY_FACILITY_LV1` | 0.85 | 0.7-0.95 | Multiplicador de recuperação Medical Center Lv 1 |
| `RECOVERY_FACILITY_LV2` | 0.70 | 0.5-0.85 | Multiplicador de recuperação Medical Center Lv 2 |
| `RECOVERY_FACILITY_LV3` | 0.50 | 0.3-0.70 | Multiplicador de recuperação Medical Center Lv 3 |
| `PT_BASE_MULTIPLIER` | 0.90 | 0.80-1.0 | Multiplicador base do PT (sem skill). ptMult = PT_BASE_MULTIPLIER - (ptSkill/100)×0.30 |
| `PT_SKILL_COEFFICIENT` | 0.30 | 0.15-0.45 | Quanto cada ponto de skill do PT reduz o multiplicador de recuperação |
| `PERMANENT_DAMAGE_AMOUNT` | -5 | -3 a -10 | Quanto o stat perde permanentemente ao forçar trabalho durante lesão |
| `REINJURY_BASE_CHANCE` | 0.30 | 0.15-0.50 | Chance de re-lesão nas 2 primeiras semanas |
| `REHAB_TRAINING_EFFICIENCY` | 0.50 | 0.25-0.75 | Eficiência do treino de reabilitação vs normal |

## Acceptance Criteria

1. Lesões são determinísticas: triggers baseados em intensidade de jobs, stats e semanas consecutivas
2. 7 tipos de lesão (VocalStrain, MuscleInjury, MentalExhaustion, BackInjury, KneeInjury, AnxietyDisorder, GeneralFatigue) com tempos de recuperação e chances de dano permanente distintos conforme ADR-016
3. Medical Center Lv 1-3 reduz chance de lesão em 10/20/30% e acelera recuperação ×1.2/1.5/2.0
4. Physical Therapist reduz tempo de recuperação via fórmula contínua: ptMult = 0.90 - (ptSkill/100) × 0.30
5. Rehab training permite treino de stats mentais durante recuperação (50% eficiência)
6. Forçar trabalho durante recuperação aplica chance de dano permanente per-tipo: 25/25/25/30/35/20/10% conforme tipo de lesão
7. Dashboard médico mostra Green (<80% load), Yellow (80-100% load ou em recuperação), Red (>100% load, lesão ativa, ou risco re-lesão >20%)
8. Training load % visível usando MAX_SAFE_LOAD = 100 (fixo, igual para todas as idols)
9. Re-lesão: 30% chance nas 2 primeiras semanas pós-recuperação, reduzida por PT
10. Lesão mid-show processada como evento (idol sai, grupo continua com penalidade)
11. Custo total de lesão inclui lost revenue + medical + replacement + morale
12. Prevenção tem ROI calculável: Medical Center + PT se pagam com ~2 lesões médias prevenidas/ano

## Open Questions

- Nenhuma pendente
