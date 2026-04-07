# Talent Development Plans

> **Status**: Designed (v2 — referências a setlist/mastery, 16 atributos, traits)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulacao com Profundidade Real, Pilar 2 — Suas Decisoes, Suas Consequencias
> **Related**: idol-attribute-stats.md (16 atributos + traits), setlist-system.md (3 tipos de treino: genérico/setlist/música), staff-functional.md (coaches)

## Overview

O Talent Development Plans estrutura a **jornada de desenvolvimento** de cada
idol em estagios claros com ferramentas de planejamento. Vai alem do crescimento
passivo de stats (que ja existe no Idol Attribute/Stats System) -- adiciona
**metas explicitas**, **foco de treino configuravel**, **readiness checks** e
**planos trimestrais** que o jogador define por idol. E o equivalente do
youth development + role training + mentoring do Football Manager.

## Player Fantasy

A fantasia e de **mentor que constroi um plano de carreira**. Nao so jogar idols
em jobs e esperar que cresçam -- mas definir: "nos proximos 3 meses, Kimura vai
focar em Vocal, fazer pelo menos 2 gravacoes, e se tiver Vocal > 65, debuta solo."
O plano pode dar certo ou errado, mas ter um plano *e* o jogo.

## Detailed Design

### Core Rules

#### 1. Estagios de Desenvolvimento

Cada idol passa por estagios claros que afetam quais ferramentas e oportunidades
estao disponiveis:

| Estagio | Condicao de Entrada | Duracao Tipica | Caracteristicas |
|---|---|---|---|
| **Trainee** | Recem-contratada, sem debut | 3-12 meses | Foco em treino. Sem jobs publicos. Crescimento ×1.2. Custo baixo |
| **Pre-Debut** | Treino minimo concluido + readiness check | 1-3 meses | Preparacao pra estreia. Jobs menores permitidos. Expectativa crescendo |
| **Rookie** | Apos primeiro job publico | 6-18 meses | Primeiras experiencias. Crescimento rapido. Fragil a criticas |
| **Rising** | Fama tier C+ e TA > 50% do PT | 1-3 anos | Em ascensao. Jobs melhores. Demanda de fas crescendo |
| **Established** | Fama tier B+ e 2+ anos ativa | Indefinido | Pilar do roster. Estavel. Jobs premium |
| **Ace** | Top 3 do roster em fama e/ou receita | Enquanto mantiver | Estrela principal. Pressao alta. Define a agencia |
| **Veteran** | Idade > limiar de declinio fisico | Indefinido | Experiencia compensa declinio. Mentora natural |
| **Legacy** | Preparando graduation ou pos-carreira | 3-12 meses | Projetos de despedida. Transicao pra pos-debut |

**Regras:**
- Estagios sao **automaticos** baseados em metricas (o jogo atribui)
- Jogador pode **forcar** transicao (ex: pular Pre-Debut direto pra Rookie)
  mas com risco (idol nao preparada pode floppar)
- Cada estagio desbloqueia acoes especificas e modifica comportamento de outros sistemas
- Estagios sao visiveis no perfil da idol

#### 2. Plano de Desenvolvimento (por idol)

O jogador pode criar um **plano trimestral** (12 semanas) pra cada idol:

```
DevelopmentPlan {
  idol_id:        uint32
  duration:       12 semanas (fixo)
  created_at:     date

  // Metas (ate 3)
  goals: [
    { type: "stat_growth", target: "Vocal", target_value: 65, priority: "primary" },
    { type: "job_experience", target: "TV_appearance", count: 2, priority: "secondary" },
    { type: "readiness", target: "solo_debut", priority: "stretch" }
  ]

  // Foco de treino
  training_focus:  "Vocal" | "Danca" | "Atuacao" | "Variedade" | "Visual" | "Carisma" | ...
  training_hours:  "light" | "normal" | "intensive"

  // Foco de imagem
  image_focus:     "variety" | "vocal" | "dance" | "acting" | "visual" | "all-rounder" | null
  
  // Protecao
  max_workload:    "light" | "normal" | "heavy"
  protect_from:    ["escandalo_leve", "overexposure"] // categorias a evitar

  // Resultado
  status:          "active" | "completed" | "failed" | "abandoned"
  progress:        0-100%
}
```

**Tipos de meta:**

| Tipo | Exemplo | Metrica |
|---|---|---|
| **stat_growth** | "Vocal chegar a 65" | Valor do atributo |
| **job_experience** | "Fazer 2 aparicoes em TV" | Contagem de jobs do tipo |
| **fame_target** | "Atingir fama tier C" | Tier de fama |
| **readiness** | "Pronta pra debut solo" | Check de multiplos criterios |
| **image_shift** | "Reposicionar como variety" | Arquetipo mudar |
| **stress_management** | "Manter stress abaixo de 50%" | Barra de stress |
| **graduation_prep** | "Preparar graduation digna" | Fama + moral + projeto final |

#### 3. Foco de Treino

Quando o jogador define foco de treino, o atributo focado cresce mais rapido:

```
Treino focado:    atributo escolhido ganha ×2.0 de crescimento
Treino normal:    outros atributos crescem ×1.0
Treino intensivo: foco ganha ×3.0 mas stress +5/semana extra
Treino leve:      foco ganha ×1.5 mas stress -2/semana
```

- Coach contratado do tipo relevante amplifica o foco (empilha)
- Foco pode ser mudado a qualquer momento (efeito na semana seguinte)
- Sem foco definido: crescimento uniforme (padrao atual)

#### 4. Readiness Check

Antes de transicoes importantes, o sistema avalia se a idol esta pronta:

| Transicao | Criterios de Readiness | Risco de Forcar |
|---|---|---|
| **Debut solo** | Vocal OU Danca > 60, Carisma > 50, Mentalidade > 40, 6+ meses ativa | Fracasso publico, moral -20, fas desapontados |
| **Centro de grupo** | Carisma > 65, Aura > 60, pelo menos 3 jobs de grupo | Grupo perde sinergia, lider anterior ressentida |
| **TV regular** | Variedade > 55, Comunicacao > 50, sem escandalo ativo | Audiencia fraca, emissora perde interesse |
| **Turnê** | Resistencia > 60, 10+ shows concluidos, Stress < 50% | Cancelamento, burnout mid-tour |
| **Graduation** | Projeto final concluido, fas informados, moral > 50 | Graduation triste, fas frustrados, legado manchado |

**Regras:**
- Readiness aparece como **barra de progresso** com criterios listados
- Criterios nao atendidos ficam em vermelho
- Forcar transicao e possivel mas consequencias sao reais
- Coach pode sugerir "ela nao esta pronta" (se contratado)

#### 5. "Loan Equivalent" — Desenvolvimento Externo

No FM, emprestimos desenvolvem jovens. No Idol Agency, o equivalente:

| Mecanismo | Descricao | Efeito |
|---|---|---|
| **Collab com agencia maior** | Idol participa de projeto de agencia de tier superior | Exposicao + experiencia rapida. Risco de buyout |
| **Circuito regional** | Idol faz turnê de shows menores em regiao especifica | Crescimento de Aura e Resistencia. Baixo risco |
| **Aparicoes menores** | Jobs abaixo do tier da idol pra ganhar confianca | Crescimento de Mentalidade. Sem fama |
| **Guest em grupo rival** | Participacao temporaria em grupo de outra agencia | Aprendizado rapido de sinergia. Risco de ser "roubada" |
| **Programa de mentoria** | Veterana mentora uma novata (requer veterana no roster) | Novata ganha ×1.5 crescimento mental. Veterana ganha moral |

**Regras:**
- Jogador escolhe mecanismo e duração (1-8 semanas)
- Durante desenvolvimento externo, idol nao esta disponivel pra jobs da agencia
- Risco de buyout aumenta se idol impressionar agencia anfitria
- Mentoria requer veterana (estagio Veteran) no roster com workload < 80%

#### 6. Progresso e Avaliacao

Ao final do trimestre (ou quando o plano expira):

```
Avaliacao do Plano: Suzuki Mei (12 semanas)

Meta primaria:   Vocal chegar a 65  → CUMPRIDA (Vocal: 67)
Meta secundaria: 2 aparicoes em TV  → CUMPRIDA (3 aparicoes)
Meta stretch:    Readiness solo     → PARCIAL (4/5 criterios)

Crescimento geral: TA +8 (de 42 pra 50)
Estagio: Trainee → Rookie

Avaliacao do coach: "Evolucao excelente. Recomendo foco em Aura
  no proximo trimestre pra preparar debut solo."
```

- Planos concluidos com sucesso dao **bonus de moral** a idol e ao jogador
- Planos falhados dao informacao util (o que nao funcionou)
- Historico de planos fica registrado no perfil da idol

### 7. Arcos Emocionais — Narrativas Emergentes de Desenvolvimento

O sistema de desenvolvimento nao e so mecanico. Os estagios e transicoes
geram **arcos narrativos** que o jogo deve dramatizar.

#### Arcos Classicos (emergentes, nao scriptados)

| Arco | Condicao de Trigger | Como o jogo dramatiza |
|---|---|---|
| **Prodígio que quebra cedo** | Idol tier S+ com < 18 anos entra em burnout antes de 1 ano | News Feed: "Promessa [idol] se afasta dos palcos". Fas: mood -30, campanha de apoio. Se recuperar: arco de retorno mais impactante |
| **Empurrada rapido demais** | Idol forcada de Trainee pra Rookie sem readiness | Primeiros 3 jobs: penalidade oculta de -15% performance ("inseguranca"). Mentalidade testada todo job. Se falhar 2x seguida: crise emocional, recusa trabalhar por 2 semanas |
| **Veterana que se reinventa** | Idol estagio Veteran muda de arquetipo (ex: Ace Vocal → Variety Engine) | News Feed: "Reinvencao? [idol] surpreende em programa de TV". Fas divididos (puristas vs apoiadores). Periodo de 2 meses com performance variavel ate estabilizar |
| **Mediana que vira favorita** | Idol All-Rounder com 2+ anos sem destaque atinge 10 jobs consecutivos sucesso | Ganha trait emergente "Confiavel" visivel no perfil. Bonus: +5% performance base permanente. Fas: loyalty +15. News: "A trabalhadora silenciosa que conquistou o Japao" |
| **Ex-ace em decadencia** | Idol que foi top 3 cai pra estagio Veteran com fama caindo | Idol com Ambicao > 12: resiste, pede mais jobs, recusa folga (stress sobe). Idol com Ambicao < 8: aceita o declinio mas pede graduation com dignidade. Ambas reacoes geram drama |
| **Rivalidade interna** | 2 idols do mesmo estagio (Rising) competindo pelo mesmo tipo de job | Ambas ganham trait "Rival de [nome]". Performance em jobs onde ambas poderiam ser escaladas: +10% (motivacao por competicao). MAS: se uma fica muito atras, ressentimento → afinidade -5/mes |
| **Graduation que ninguem esperava** | Idol estagio Established com felicidade < 30 por 3+ meses pede pra sair | Evento urgente. Jogador pode: aceitar (graduation bonita), convencer a ficar (requer afinidade > 60), ou ignorar (idol sai com ressentimento e News Feed negativo) |

#### Traits Emergentes

Traits sao **labels que surgem do comportamento**, nao dos stats:

```
Trait {
  name:        string    // "Confiavel", "Bomba-Relogio", "Renascida", "Rival de X"
  trigger:     condition // condicao que gerou o trait
  effect:      modifier  // efeito mecanico (se houver)
  visible:     bool      // aparece no perfil?
  permanent:   bool      // permanente ou temporario?
}
```

| Trait | Trigger | Efeito | Duracao |
|---|---|---|---|
| **Confiavel** | 10+ jobs sucesso consecutivo | +5% performance base | Permanente (perde se 3 fracassos seguidos) |
| **Renascida** | Retorno de burnout/crise com sucesso | +10% performance por 3 meses, fas +20 mood | Temporario (3 meses) |
| **Traumatizada** | Burnout ou crise antes dos 18 anos | Mentalidade cresce 50% mais devagar | Permanente (pode ser curado com psicólogo — 12 semanas) |
| **Diva** | Fama top 10 por 6+ meses | Exige clausulas melhores. Recusa jobs "abaixo" dela. Carisma +5 | Permanente enquanto top 10 |
| **Sombra** | 6+ meses como membro menos famosa de grupo | Motivacao -2/mes. Se Ambicao > 12: pede saida do grupo | Ate sair da sombra |
| **Rival de [X]** | 2 idols do mesmo estagio competindo | +10% performance quando compete | Enquanto rivalidade durar |
| **Favorita do Publico** | Votacao de fas (se poll feature existir) ou fan_club loyalty > 85 | Endorsements +20%, mas pressao extra (stress +2/mes) | Enquanto loyalty alta |

Traits sao o elo entre **mecanica e narrativa**. Eles fazem o jogador
sentir que as idols tem historias, nao so numeros.

### Interactions with Other Systems

| Sistema | Direcao | O que flui |
|---|---|---|
| **Idol Attribute/Stats** | <-> bidirecional | Foco de treino modifica crescimento. Stats determinam estagio |
| **Job Assignment** | <- informa | Plano sugere tipos de job prioritarios |
| **Happiness & Wellness** | <-> bidirecional | Intensidade de treino afeta stress. Stress limita treino |
| **Fame & Rankings** | <- lê | Fama determina estagio (Rookie/Rising/Established) |
| **Agency Staff** | <- Coach avalia | Coach sugere plano e avalia readiness |
| **Contract System** | <- restricoes | Contrato limita carga de treino |
| **Idol Lifecycle** | <-> bidirecional | Estagios complementam lifecycle. Graduation prep |
| **Idol Archetypes** | <- informa | Foco de imagem pode mudar arquetipo |
| **Market/Transfer** | <- risco | Desenvolvimento externo cria risco de buyout |
| **Agency Intelligence** | -> alimenta | Trajetoria de crescimento aparece nos reports |
| **Roster Balance** | -> informa | Pipeline de desenvolvimento afeta profundidade futura |

## Formulas

#### Multiplicador de Foco de Treino

```
crescimento_focado = crescimento_base × mult_foco × mult_coach × mult_intensity

mult_foco = 2.0 (atributo focado), 1.0 (nao focado)
mult_coach = 1.0 + (coach_eficacia × COACH_GROWTH_FACTOR)  // do Staff system
mult_intensity:
  leve:      1.5 foco, stress -2/semana
  normal:    2.0 foco, stress +0/semana
  intensivo: 3.0 foco, stress +5/semana
```

#### Bonus de Mentoria

```
bonus_mentoria = mentor_mentalidade / 100 × mentor_comunicacao / 100 × 0.5
// Mentora com Mental 80 + Comunicacao 75: bonus = 0.3 = +30% crescimento mental
// Aplica em: Mentalidade, Disciplina, Adaptabilidade da novata
```

#### Progresso de Meta

```
progresso_meta = valor_atual / target_value × 100
// Capped em 100%
// Meta de tipo "count": progresso = count_atual / count_target × 100
```

## Edge Cases

- **Plano ativo + idol entra em burnout**: Plano e pausado automaticamente.
  Retoma quando idol sai do burnout. Prazo nao estende (pode falhar)
- **Foco de treino em atributo no teto**: Crescimento = 0 mesmo com foco.
  Sistema avisa: "Atributo no teto. Considere mudar foco"
- **Idol rejeita plano intensivo**: Se felicidade < 40, idol pode recusar
  treino intensivo. Jogador precisa melhorar moral primeiro
- **Mentora e novata com personalidades incompativeis**: Bonus de mentoria
  reduzido em 50% se ocultos indicam conflito (Temperamento da mentora vs novata)
- **Desenvolvimento externo + idol recebe proposta de buyout**: Risco real.
  Jogador recebe alerta e pode cancelar o desenvolvimento externo
- **3 metas primarias no plano**: Maximo 3 metas. Pelo menos 1 deve ser primaria.
  Mais metas = mais dificil cumprir todas
- **Forcar debut de idol estagio Trainee**: Possivel mas readiness sera ~20%.
  Consequencias severas se floppar

## Dependencies

**Hard:**
- Idol Attribute/Stats -- crescimento e estagios
- Week Simulation -- treino processado semanalmente
- Happiness & Wellness -- stress limita treino

**Soft:**
- Agency Staff (coaches)
- Idol Lifecycle (graduation)
- Idol Archetypes (image focus)
- Producer Profile (#50): Estilo (Talent Developer) aumenta eficiência de planos em +10%. Ver producer-profile.md seção 4c.

**Depended on by:**
- Agency Intelligence (trajectoria)
- Roster Balance (pipeline futuro)
- Agency Planning Board (planos de longo prazo)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `PLAN_DURATION_WEEKS` | 12 | 8-16 | Duracao do plano trimestral |
| `FOCUS_TRAINING_MULT` | 2.0 | 1.5-3.0 | Multiplicador de crescimento focado |
| `INTENSIVE_STRESS_COST` | 5/semana | 2-10 | Stress extra de treino intensivo |
| `MENTORING_FACTOR` | 0.5 | 0.2-0.8 | Impacto base da mentoria |
| `EXTERNAL_DEV_BUYOUT_RISK` | 0.15 | 0.05-0.30 | Chance de buyout durante dev externo |
| `FORCED_TRANSITION_PENALTY` | -20 moral | -10 a -30 | Penalidade por forcar transicao |
| `PLAN_SUCCESS_MORALE_BONUS` | +10 | +5 a +20 | Bonus de moral por plano cumprido |

## Acceptance Criteria

1. 8 estagios de desenvolvimento visiveis no perfil da idol
2. Plano trimestral com ate 3 metas configuraveis pelo jogador
3. Foco de treino acelera crescimento do atributo escolhido
4. 3 intensidades de treino com trade-off stress/crescimento
5. Readiness check mostra criterios com barra de progresso
6. Forcar transicao sem readiness causa consequencias reais
7. 5 mecanismos de desenvolvimento externo funcionais
8. Mentoria entre veterana e novata com bonus mensuravel
9. Avaliacao ao final do plano com feedback do coach
10. Historico de planos mantido no perfil da idol

## Open Questions

- Nenhuma pendente
