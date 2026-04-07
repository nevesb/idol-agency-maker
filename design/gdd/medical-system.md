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

| Lesão | Gravidade | Tempo Base Recuperação | Causa Principal |
|---|---|---|---|
| **Distensão Muscular** (muscle strain) | Leve | 1-2 semanas | Jobs físicos com Resistência < 40 |
| **Lesão Vocal** (vocal cord damage) | Média | 2-4 semanas | Vocal intensa com Vocal < 50 + 3+ shows/semana |
| **Fratura por Estresse** (stress fracture) | Grave | 4-8 semanas | Coreografia intensa + Resistência < 30 + 4+ semanas consecutivas sem folga |
| **Fadiga Crônica** (chronic fatigue) | Média | 2-3 semanas forçadas | Saúde < 30 por 4+ semanas consecutivas |
| **Colapso Mental** (mental breakdown / burnout) | Grave | 4-8 semanas | Stress = 100 (happiness-wellness.md) |
| **Entorse de Tornozelo** (ankle sprain) | Leve-Média | 1-3 semanas | Coreografia intensa + evento mid-show "Idol se Machuca" |
| **Tendinite** (tendinitis) | Média | 2-4 semanas | Repetitive strain: mesmo tipo de job físico 5+ semanas |

```
Injury {
  id:              uint32
  type:            enum (MuscleStrain, VocalCordDamage, StressFracture,
                         ChronicFatigue, MentalBreakdown, AnkleSprain, Tendinitis)
  severity:        enum (Light, Medium, Severe)
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
// DISTENSÃO MUSCULAR
trigger_muscle_strain(idol, week) =
  Resistência < 40
  AND job_fisico_esta_semana == true
  AND semanas_sem_folga >= 2

  chance = (40 - Resistência) / 100 × consecutive_weeks_factor
  consecutive_weeks_factor = 1.0 + (semanas_sem_folga - 1) × 0.3
  // Resistência 20, 4 semanas sem folga: (40-20)/100 × 1.9 = 38%

// LESÃO VOCAL
trigger_vocal_damage(idol, week) =
  shows_com_vocal_intensa_semana >= 2
  AND (Vocal < 50 OR Saúde < 40)

  chance = (2 - Vocal/100) × shows_vocais × 0.08
  // Vocal 30, 3 shows: (2 - 0.3) × 3 × 0.08 = 40.8%

// FRATURA POR ESTRESSE
trigger_stress_fracture(idol, week) =
  Resistência < 30
  AND coreografia_intensa_ultimas_4_semanas >= 3
  AND semanas_sem_folga >= 3

  chance = (30 - Resistência) / 100 × (semanas_sem_folga / 3) × 0.15
  // Resistência 15, 5 semanas: (30-15)/100 × 1.67 × 0.15 = 3.75%

// FADIGA CRÔNICA
trigger_chronic_fatigue(idol, week) =
  Saúde < 30
  AND Saúde_abaixo_30_por >= 4 semanas

  chance = (30 - Saúde) / 100 × (semanas_abaixo / 4) × 0.20
  // Saúde 15, 6 semanas: (30-15)/100 × 1.5 × 0.20 = 4.5%

// COLAPSO MENTAL
trigger_mental_breakdown(idol, week) =
  Stress >= 100  // Automático (happiness-wellness.md)
  chance = 1.0   // 100% — burnout é garantido

// ENTORSE
trigger_ankle_sprain(idol, week) =
  Durante show com coreografia intensa
  AND Resistência < 50

  chance = (50 - Resistência) / 200 × coreografia_intensidade
  // Processado dentro de show-system.md como "Idol se Machuca"

// TENDINITE
trigger_tendinitis(idol, week) =
  mesmo_tipo_job_fisico >= 5 semanas consecutivas
  AND Resistência < 45

  chance = (semanas_repetição - 4) × 0.10
  // 7 semanas de dança consecutiva: (7-4) × 0.10 = 30%
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

staff_multiplier:
  Sem Physical Therapist:              1.0
  Physical Therapist skill 1-30:       0.90
  Physical Therapist skill 31-60:      0.80
  Physical Therapist skill 61-80:      0.70
  Physical Therapist skill 81-100:     0.60

resilience_factor = 1.0 - (Resistência / 200)
  // Resistência 80: 1.0 - 0.4 = 0.6 (40% mais rápido)
  // Resistência 20: 1.0 - 0.1 = 0.9 (10% mais rápido)
```

**Exemplo completo**: Fratura por estresse (base 6 semanas), Medical Center
Lv 2, Physical Therapist skill 75, Resistência 60:
```
actual = ceil(6 × 0.70 × 0.70 × 0.70) = ceil(2.058) = 3 semanas
// De 6 semanas para 3 — investimento em facilities e staff compensa
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
    chance = PERMANENT_DAMAGE_CHANCE × severity_mult

    PERMANENT_DAMAGE_CHANCE = 0.25  // 25% base
    severity_mult:
      Light:  0.5  (12.5% chance)
      Medium: 1.0  (25% chance)
      Severe: 1.5  (37.5% chance)

  se dano permanente:
    affected_stat -= 5 (permanente, não recuperável)
    // Distensão: Resistência -5
    // Vocal damage: Vocal -5
    // Stress fracture: Dança -5 ou Resistência -5
    // Ankle sprain: Dança -5
    // Tendinitis: stat mais usado -5
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
  Green:  nenhum trigger de lesão ativo. Todas stats > thresholds
  Yellow: 1+ trigger parcialmente ativo (ex: Resistência < 40 mas com folga)
          OU retornando de lesão (risco de re-lesão)
  Red:    2+ triggers ativos simultaneamente
          OU Saúde < 25
          OU semanas_sem_folga >= 4 com jobs físicos

training_load(idol) =
  (jobs_fisicos_semana × PHYSICAL_JOB_COST + treinos_semana × TRAINING_COST)
  / max_safe_load(idol)

max_safe_load(idol) = Resistência × 0.5 + 20
  // Resistência 80: max load = 60
  // Resistência 30: max load = 35
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
  chance_muscle_strain,
  chance_vocal_damage,
  chance_stress_fracture,
  chance_chronic_fatigue,
  chance_ankle_sprain,
  chance_tendinitis
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
  separado de dano permanente. Chance cumulativa: 1 - (1-0.25)^3 = 58%
  chance de pelo menos 1 dano permanente. Jogador está destruindo a idol
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
| `MUSCLE_STRAIN_RESIST_THRESHOLD` | 40 | 20-60 | Resistência abaixo da qual risco de distensão aumenta |
| `VOCAL_DAMAGE_VOCAL_THRESHOLD` | 50 | 30-70 | Vocal abaixo do qual risco de lesão vocal aumenta |
| `STRESS_FRACTURE_RESIST_THRESHOLD` | 30 | 15-50 | Limiar de Resistência para fratura por estresse |
| `CHRONIC_FATIGUE_HEALTH_THRESHOLD` | 30 | 20-50 | Saúde abaixo da qual fadiga crônica pode ocorrer |
| `CONSECUTIVE_WEEKS_FACTOR` | 0.3 | 0.1-0.5 | Incremento de risco por semana consecutiva |
| `MEDICAL_CENTER_LV1_REDUCTION` | 0.10 | 0.05-0.20 | Redução de chance de lesão Lv 1 |
| `MEDICAL_CENTER_LV2_REDUCTION` | 0.20 | 0.10-0.35 | Redução de chance de lesão Lv 2 |
| `MEDICAL_CENTER_LV3_REDUCTION` | 0.30 | 0.15-0.50 | Redução de chance de lesão Lv 3 |
| `RECOVERY_FACILITY_LV1` | 0.85 | 0.7-0.95 | Multiplicador de recuperação Medical Center Lv 1 |
| `RECOVERY_FACILITY_LV2` | 0.70 | 0.5-0.85 | Multiplicador de recuperação Medical Center Lv 2 |
| `RECOVERY_FACILITY_LV3` | 0.50 | 0.3-0.70 | Multiplicador de recuperação Medical Center Lv 3 |
| `PT_SKILL_RECOVERY_FACTOR` | skill-based | 0.60-1.0 | Multiplicador do Physical Therapist |
| `PERMANENT_DAMAGE_CHANCE` | 0.25 | 0.10-0.50 | Chance de dano permanente ao forçar trabalho |
| `PERMANENT_DAMAGE_AMOUNT` | -5 | -3 a -10 | Quanto o stat perde permanentemente |
| `REINJURY_BASE_CHANCE` | 0.30 | 0.15-0.50 | Chance de re-lesão nas 2 primeiras semanas |
| `REHAB_TRAINING_EFFICIENCY` | 0.50 | 0.25-0.75 | Eficiência do treino de reabilitação vs normal |

## Acceptance Criteria

1. Lesões são determinísticas: triggers baseados em stats + carga + semanas consecutivas
2. 7 tipos de lesão com gravidades e tempos de recuperação distintos
3. Medical Center Lv 1-3 reduz chance de lesão em 10/20/30% e acelera recuperação ×1.2/1.5/2.0
4. Physical Therapist reduz tempo de recuperação proporcional ao skill
5. Rehab training permite treino de stats mentais durante recuperação (50% eficiência)
6. Forçar trabalho durante recuperação tem 25% chance base de dano permanente (-5 stat)
7. Dashboard médico mostra risk level (green/yellow/red) por idol com fatores de risco
8. Training load % visível e comparável ao max_safe_load da idol
9. Re-lesão: 30% chance nas 2 primeiras semanas pós-recuperação, reduzida por PT
10. Lesão mid-show processada como evento (idol sai, grupo continua com penalidade)
11. Custo total de lesão inclui lost revenue + medical + replacement + morale
12. Prevenção tem ROI calculável: Medical Center + PT se pagam com ~2 lesões médias prevenidas/ano

## Open Questions

- Nenhuma pendente
