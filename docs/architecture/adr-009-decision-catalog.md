# ADR-009: NPC Decision Catalog — Papéis, Cargos, Tarefas e Fluxogramas

## Status
Proposed

## Date
2026-04-07

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (unified pipeline — NPC decisions feed ActionList), ADR-003 (state slices — decision context), ADR-004 (events — decisions react to events) |
| **Enables** | All gameplay epics — every system that produces actions |
| **Blocks** | Implementation of any NPC decision logic |

## Context

ADR-002 established that all 51 agencies run the same pipeline. The Decision Phase
produces `AgencyAction[]` from NPC staff or player input. This ADR is the **complete
specification** of every action in the game, organized as:

```
Papel (Role) → Cargo (Post) → Tarefa (Task) → Fluxograma (Decision Flowchart)

Cada fluxograma recebe um Contexto e retorna uma Ação (ou nenhuma).
```

### Design Principles

1. **Deterministic**: same NPC attributes + context + seed = same action output
2. **Skill = search depth**: skilled NPCs evaluate more options, not better luck
3. **Overload degrades**: overworked NPCs skip steps in the flowchart
4. **Inaction is valid**: every task can return `null` (no action taken)
5. **Same code for all**: player with 100% NPCs = rival agency

---

## Universal Decision Context

Every task flowchart receives:

```typescript
interface TaskContext {
  // Who is deciding
  npc: StaffMember | null;         // null = uncovered or player doing it manually
  effectiveSkill: number;          // 0-100 after multi-role penalty + dedication roll
  searchDepth: number;             // 1-10 derived from effectiveSkill

  // Agency state (readonly snapshot)
  agency: AgencySnapshot;
  roster: IdolSnapshot[];
  schedule: ScheduleSnapshot;
  market: MarketSnapshot;
  jobBoard: JobSnapshot[];
  contracts: ContractSnapshot[];
  rivals: RivalSnapshot[];
  music: MusicSnapshot;
  events: EventSnapshot[];
  fanClubs: FanClubSnapshot[];
  economy: EconomySnapshot;
  facilities: FacilitySnapshot[];
  staff: StaffSnapshot[];

  // Temporal
  seed: number;
  week: number;
  rng: SeededRNG;
}
```

### Effective Skill Calculation

```
effectiveSkill = npc.skill
  × multiRolePenalty(npcWorkload)     // 1.0 / 0.7 / 0.5 / 0.3
  × dedicationRoll(npc.dedication)    // 1.0 or 0.5 (lazy day)

searchDepth = ceil(effectiveSkill / 10)  // 1 to 10
```

### Output

Every task flowchart returns: `AgencyAction | AgencyAction[] | null`
- `AgencyAction` = specific typed action to be executed by the pipeline
- `null` = no action (valid choice, consequences happen naturally)

---

## PAPEL 1: HEAD PRODUCER

> O "manager" do FM. Aloca staff, define direção, relaciona-se com board e idols.

### Cargo 1.1: Alocação de Staff

#### Tarefa: Contratar NPC

```
Contexto: lista de NPCs disponíveis no mercado, budget de staff, cargos vazios
Retorna: { type: 'hireStaff', npcId, salary } | null

Fluxograma:
  1. Listar cargos vazios na agência (sem NPC atribuído)
     → se nenhum vazio: return null
  2. Priorizar cargo vazio por impacto:
     skill ≥ 60: ranqueia por consequência de vazio (wellness > scheduling > scouting > treino > outros)
     skill < 60: pega primeiro cargo vazio na lista
  3. Filtrar NPCs disponíveis que cobrem o papel do cargo prioritário
     skill ≥ 70: filtra por skill ≥ 50 AND salary ≤ budget × 0.3
     skill < 70: filtra apenas por salary ≤ budget × 0.5
  4. Ranquear candidatos:
     skill ≥ 50: (npc.skill × 0.6 + npc.experience × 0.2 + npc.dedication × 0.2) / salary
     skill < 50: npc.skill / salary (simples)
  5. Se melhor candidato encontrado: return hireStaff(top1)
  6. Se ninguém no budget: return null
```

#### Tarefa: Demitir NPC

```
Contexto: staff atual, performance metrics, budget pressure
Retorna: { type: 'fireStaff', npcId } | null

Fluxograma:
  1. Agência em crise financeira (debt state ≥ 'crisis')?
     → encontrar NPC com pior ROI (skill/salary) → return fireStaff(worst)
  2. Algum NPC com performance consistentemente baixa (3+ meses)?
     skill ≥ 60: avalia trend de performance
     skill < 60: só checa se skill < 20
     → se sim: return fireStaff(underperformer)
  3. Caso contrário: return null (não mexer no staff)
```

#### Tarefa: Atribuir NPC a Cargo

```
Contexto: staff contratado, cargos vazios e ocupados, skill de cada NPC
Retorna: { type: 'assignStaffToCargo', npcId, cargoKey }[] | null

Fluxograma:
  1. Listar cargos e seus assignees atuais
  2. Identificar mismatches (NPC num cargo que não é do seu papel)
     skill ≥ 70: otimiza alocação global (melhor NPC → cargo de maior impacto)
     skill < 70: apenas preenche vazios com quem está disponível
  3. Para cada cargo vazio:
     a. Buscar NPC do mesmo papel que tenha capacidade
     b. Se não há NPC do mesmo papel: buscar NPC de outro papel (com penalty warning)
     c. Se ninguém disponível: cargo fica vazio
  4. Return lista de re-alocações ou null se tudo já está ok
```

#### Tarefa: Auto-atribuir-se a Cargo

```
Contexto: cargos vazios, PRODUCER_TIME_BUDGET restante, producer profile
Retorna: { type: 'selfAssign', cargoKey } | null

Fluxograma:
  1. Calcular tempo já consumido pelo produtor esta semana
  2. Se tempo > 80% do budget: return null (já sobrecarregado)
  3. Listar cargos vazios que o produtor pode cobrir
  4. Priorizar por:
     a. Cargos com consequência grave se vazio (wellness, scheduling)
     b. Cargos onde o producer profile dá bônus (background × style × trait)
  5. Se custo de tempo do cargo prioritário cabe no budget: return selfAssign(cargo)
  6. Se não cabe: return null
```

### Cargo 1.2: Direção Estratégica

#### Tarefa: Ajustar Estratégia

```
Contexto: strategy atual, resultados dos últimos 3 meses, estado do roster, economy
Retorna: { type: 'adjustStrategy', changes: Partial<AgencyStrategy> } | null

Fluxograma:
  1. Checar cooldowns ativos (focus: 12 semanas, image: 8 semanas)
     → se todos em cooldown: return null
  2. Avaliar performance recente:
     skill ≥ 70: analisa receita trend + fame trend + roster satisfaction
     skill < 70: analisa só receita (subindo ou descendo)
  3. Se receita caindo 3+ meses AND focus ≠ 'commercial':
     → return adjustStrategy({ focus: 'commercial' })
  4. Se roster com muitas novatas AND focus ≠ 'scouting':
     → return adjustStrategy({ focus: 'scouting' })
  5. Se fame crescendo rápido AND growthPosture ≠ 'aggressive':
     skill ≥ 60: return adjustStrategy({ growthPosture: 'aggressive' })
  6. Se tudo estável: return null (manter curso)
```

### Cargo 1.3: Relações com Board

#### Tarefa: Negociar Orçamento de Staff

```
Contexto: budget atual, staff costs, resultados recentes, tier da agência
Retorna: { type: 'negotiateBudget', requestedRatio: number, justification: string } | null

Fluxograma:
  1. Avaliação trimestral pendente?
     → se não: return null (só roda a cada 12 semanas)
  2. Staff budget atual é suficiente para cobrir todos cargos?
     → se sim: return null
  3. Calcular ratio necessário:
     skill ≥ 60: projeta custos de staff ideal (todos cargos cobertos) / budget total
     skill < 60: pede +10% flat
  4. Montar justificativa:
     skill ≥ 70: inclui ROI do staff existente + projeção de retorno
     skill < 70: "Precisamos de mais staff"
  5. return negotiateBudget(ratio, justification)
```

### Cargo 1.4: Relações com Idols

#### Tarefa: Conversar com Idol

```
Contexto: idol com conversa pendente (trigger ativo), idol state, afinidade
Retorna: { type: 'idolConversation', idolId, tone, promises } | null

Fluxograma:
  1. Alguma idol com conversa pendente (trigger do dialogue-system)?
     → se não: return null
  2. Selecionar idol prioritária:
     a. Idol em crise (happiness < 20): prioridade máxima
     b. Idol pedindo conversa: prioridade alta
     c. Idol com contrato expirando: prioridade média
  3. Escolher tom:
     skill ≥ 70: avalia Temperamento + Profissionalismo + afinidade da idol
       → idol Temperamento > 12: tom 'empathetic'
       → idol Ambição > 14: tom 'motivational'
       → idol Lealdade alta: tom 'friendly'
     skill < 70: sempre tom 'neutral' (safe)
  4. Promessas:
     skill ≥ 60: faz promessa só se pode cumprir (verifica budget, agenda)
     skill < 60: não faz promessas (evita risco)
  5. return idolConversation(idolId, tone, promises)
```

---

## PAPEL 2: VICE-PRODUCER

### Cargo 2.1: Substituição Geral

#### Tarefa: Cobrir Cargo Vazio

```
Contexto: lista de cargos vazios, vice skill, budget de tempo
Retorna: delega para o flowchart do cargo específico com effectiveSkill = viceSkill × 0.7

Fluxograma:
  1. Listar cargos vazios (sem NPC, sem producer assigned)
  2. Para cada vazio, verificar se vice tem tempo:
     → custo do cargo × 0.8 (vice é mais eficiente que producer cobrindo)
  3. Executar o flowchart do cargo com:
     effectiveSkill = vice.skill × 0.7 (generalista, não especialista)
  4. Return resultado do flowchart delegado
```

### Cargo 2.2: Conselheiro

#### Tarefa: Recomendar Ação

```
Contexto: estado geral da agência, decisões pendentes do player
Retorna: { type: 'suggestion', area, suggestion, reasoning } | null

Fluxograma:
  1. Scan rápido dos KPIs:
     a. Budget negativo? → suggest cortar custos
     b. Idol em burnout iminente? → suggest descanso
     c. Contrato expirando em 2 semanas? → suggest iniciar renovação
     d. 3+ cargos vazios? → suggest contratar staff
  2. skill ≥ 60: prioriza sugestões por impacto financeiro
     skill < 60: lista os problemas sem priorizar
  3. return suggestion(top3) ou null se tudo ok
```

---

## PAPEL 3: TALENT DIRECTOR

### Cargo 3.1: Negociação de Contratos

#### Tarefa: Renovar Contrato Expirando

```
Contexto: contratos com expiração em ≤4 semanas, idol stats, economy
Retorna: { type: 'renewContract', contractId, newClauses } | null

Fluxograma:
  1. Listar contratos expirando em ≤4 semanas
     → se nenhum: return null
  2. Para cada contrato:
     a. Avaliar idol:
        skill ≥ 70: ROI (receita gerada - custo) + potencial futuro + archetype gap
        skill 40-69: ROI simples (receita vs salário)
        skill < 40: fame > 500? renovar. Senão, não.
     b. Se vale renovar:
        skill ≥ 60: calcular oferta ótima (salário atual × 1.2-1.5, ajustado por fame trend)
        skill < 60: salário atual × 1.3 (flat)
     c. Se não vale: return null (deixar expirar)
  3. return renewContract(contractId, newClauses) para o mais prioritário
```

#### Tarefa: Rescindir Contrato

```
Contexto: idols com ROI negativo, budget pressure, roster composition
Retorna: { type: 'terminateContract', contractId } | null

Fluxograma:
  1. Listar idols com ROI negativo por 3+ meses
     skill ≥ 70: calcula projeção (idol melhorando? ceiling alto?)
     skill < 70: só vê ROI bruto
  2. Se idol dispensável (archetype coberto por outra, tier baixo):
     a. Calcular custo de rescisão vs custo de manter
     b. Se rescisão é mais barato: return terminateContract
  3. Se agência em crise financeira: forçar rescisão do idol mais caro com ROI negativo
  4. Caso contrário: return null
```

#### Tarefa: Responder a Buyout

```
Contexto: proposta de buyout recebida (agencyId, idolId, offerYen)
Retorna: { type: 'respondBuyout', proposalId, response: 'accept'|'reject'|'counter', counterOffer? } | null

Fluxograma:
  1. Calcular valor de mercado da idol (economy.marketValue(idolId))
  2. Avaliar importância da idol:
     skill ≥ 70: archetype coverage, revenue share, fan impact, replacement cost
     skill 40-69: revenue share + fame
     skill < 40: só fame
  3. Se oferta > marketValue × 1.3 AND idol substituível: return accept
  4. Se oferta > marketValue × 1.0 AND idol não-essencial:
     skill ≥ 60: return counter(oferta × 1.2) — tenta mais
     skill < 60: return accept
  5. Se oferta < marketValue × 0.8: return reject
  6. Entre 0.8 e 1.0: return counter(marketValue × 1.1)
```

### Cargo 3.2: Gestão de Roster

#### Tarefa: Avaliar Composição do Roster

```
Contexto: roster atual, archetypes, age distribution, revenue per idol
Retorna: { type: 'rosterAssessment', gaps, recommendations } (informativo, não ação direta)

Fluxograma:
  1. Contar idols por archetype:
     skill ≥ 60: identifica archetype com <2 idols (gap)
     skill < 60: identifica archetype com 0 idols
  2. Checar distribuição de idade:
     skill ≥ 70: flag se >50% do roster na mesma faixa etária (risco futuro)
     skill < 70: skip
  3. Checar star dependency:
     skill ≥ 50: calcular % receita do top-1 idol
     → se >40%: flag "dependência excessiva"
  4. Return assessment com gaps e recomendações (usado por scout e producer)
```

### Cargo 3.3: Transferências

#### Tarefa: Listar Idol para Venda

```
Contexto: roster assessment, budget pressure, roster size vs tier
Retorna: { type: 'listForTransfer', idolId, askingPrice } | null

Fluxograma:
  1. Roster acima do limite do tier? → vender excedente
  2. Idol com ROI negativo 3+ meses E não é único no archetype?
     → calcular asking price:
     skill ≥ 60: marketValue × 1.1 (pedir acima)
     skill < 60: marketValue × 0.9 (aceitar abaixo pra vender rápido)
  3. Se ninguém a vender: return null
```

---

## PAPEL 4: CHIEF SCOUT

### Cargo 4.1: Gestão de Olheiros

#### Tarefa: Contratar Scout

```
Contexto: scouts disponíveis no mercado, budget, scouts atuais
Retorna: { type: 'hireScout', scoutId } | null

Fluxograma:
  1. Agência tem menos scouts que o ideal para o tier?
     garagem: 1, indie: 2, regional: 3, nacional: 4, elite: 5+
     → se não: return null
  2. Budget permite salário de scout?
  3. Selecionar:
     skill ≥ 60: melhor skill/salary ratio no mercado
     skill < 60: mais barato disponível
  4. return hireScout(selected)
```

#### Tarefa: Enviar Scout em Missão

```
Contexto: scouts ociosos, roster gaps (do rosterAssessment), regiões
Retorna: { type: 'sendScoutMission', scoutId, regionId, duration, focus } | null

Fluxograma:
  1. Scouts ociosos (sem missão ativa)?
     → se nenhum: return null
  2. Qual região?
     skill ≥ 70: cruza roster gaps com regiões que têm idols do archetype necessário
     skill 40-69: região com maior densidade de idols
     skill < 40: região aleatória (weighted by proximity)
  3. Duração:
     skill ≥ 50: 4 semanas (deep search) se budget permite
     skill < 50: 2 semanas (rápido)
  4. Foco:
     skill ≥ 60: archetype específico do gap identificado
     skill < 60: sem foco (genérico)
  5. return sendScoutMission(scout, region, duration, focus)
```

### Cargo 4.2: Avaliação de Candidatos

#### Tarefa: Avaliar e Shortlist

```
Contexto: scout reports recebidos com candidatos descobertos
Retorna: { type: 'shortlistCandidate', idolId }[] | null

Fluxograma:
  1. Reports não lidos?
     → se nenhum: return null
  2. Para cada candidato no report:
     a. Filtrar:
        tier ≥ mínimo da agência?
        idade dentro do range alvo?
        archetype é um gap no roster?
     b. Ranquear:
        skill ≥ 70: potential × affordability × archetype_need × age_value
        skill 40-69: potential × affordability
        skill < 40: potential apenas
  3. Shortlist top-N (N = searchDepth)
  4. return shortlistCandidate[] para os top-N
```

#### Tarefa: Recomendar Contratação

```
Contexto: shortlist atual, budget, roster assessment
Retorna: { type: 'recommendSigning', idolId, urgency } | null

Fluxograma:
  1. Shortlist tem candidatos?
     → se não: return null
  2. Algum candidato preenche gap crítico (archetype com 0 idols)?
     → urgency: 'high'
  3. Algum candidato é tier S+ com preço acessível?
     → urgency: 'high'
  4. skill ≥ 60: avalia custo total (salário × duração + training cost) vs receita projetada
     skill < 60: avalia só se salary cabe no budget
  5. return recommendSigning(bestCandidate, urgency) — vai para Talent Director
```

---

## PAPEL 5: DEVELOPMENT DIRECTOR

### Cargo 5.1: Planos de Desenvolvimento

#### Tarefa: Criar Plano

```
Contexto: idols sem plano ativo, idol stats vs ceiling, archetype needs
Retorna: { type: 'createDevPlan', idolId, goals, focusStat, duration, intensity } | null

Fluxograma:
  1. Idols sem plano ativo E com potencial de crescimento (stats < ceiling × 0.8)?
     → se nenhum: return null
  2. Priorizar:
     skill ≥ 70: idol com maior gap entre stats atuais e ceiling AND menor idade (mais retorno)
     skill < 70: idol com menor tier no roster
  3. Definir metas:
     skill ≥ 60: identifica stat mais fraco para o archetype da idol → foco nele
     skill < 60: stat mais baixo overall
  4. Intensidade:
     idol stress < 40: 'intensive'
     idol stress 40-60: 'normal'
     idol stress > 60: 'light' (ou defer)
  5. return createDevPlan(idol, goals, stat, 12weeks, intensity)
```

#### Tarefa: Ajustar Plano Existente

```
Contexto: planos ativos, progresso vs metas, idol wellness
Retorna: { type: 'adjustDevPlan', planId, changes } | null

Fluxograma:
  1. Plano ativo com >6 semanas decorridas E progresso < 40% da meta?
     skill ≥ 60: analisar causa (treino insuficiente? stress? intensidade errada?)
     skill < 60: skip análise
  2. Se idol em stress alto: reduzir intensidade
  3. Se stat não está a crescer: mudar foco para stat complementar
  4. Se tudo on-track: return null
  5. return adjustDevPlan(planId, changes)
```

### Cargo 5.2: Mentoria

#### Tarefa: Atribuir Mentor

```
Contexto: idols junior (tier F-C), idols senior (tier A+), afinidade entre pares
Retorna: { type: 'assignMentor', mentorId, menteeId } | null

Fluxograma:
  1. Idols junior sem mentor E senior disponível (workload < 80%)?
     → se não: return null
  2. Match mentor-mentee:
     skill ≥ 70: melhor por afinidade × stat complementarity × personalidade compatível
     skill 40-69: melhor por stat complementarity
     skill < 40: senior com maior skill overall
  3. Verificar que mentor tem stats relevantes ≥ 70 na área de foco do mentee
  4. return assignMentor(senior, junior)
```

### Cargo 5.3: Avaliação de Potencial

#### Tarefa: Projetar Timeline de Idol

```
Contexto: idol stats, PT (potencial), age, growth rate recente
Retorna: { type: 'potentialAssessment', idolId, projectedPeakWeek, recommendation } (informativo)

Fluxograma:
  1. Para cada idol do roster:
     skill ≥ 70: projeta growth curve baseado em taxa de crescimento recente + ceiling
     skill 40-69: estima peak como current_age + (ceiling - current_avg) / growth_rate
     skill < 40: "tem potencial" ou "não tem" (binário)
  2. Flag idols estagnados (growth rate ≈ 0 por 8+ semanas)
     → recommendation: 'change training focus' ou 'accept ceiling reached'
  3. return assessment
```

---

## PAPEL 6: VOCAL COACH

### Cargo 6.1: Treino Vocal

#### Tarefa: Conduzir Sessão de Treino

```
Contexto: idol assignada ao slot de treino vocal, idol stats, wellness, devPlan
Retorna: { type: 'conductTraining', idolId, stat, intensity, day } | null

Fluxograma:
  1. Idol disponível no slot? (não bloqueada, não em burnout)
     → se não: return null
  2. Qual stat treinar?
     a. Idol tem DevPlan ativo com foco em stat vocal? → treinar esse stat
     b. Sem DevPlan:
        skill ≥ 60: stat vocal mais fraco para o archetype da idol
        skill 30-59: stat vocal mais baixo absoluto
        skill < 30: stat aleatório do domínio vocal
  3. Intensidade:
     a. Idol stress < 40 AND stat gap > 15 do ceiling: 'intensive' (×3, +stress)
     b. Idol stress 40-70: 'normal' (×2)
     c. Idol stress > 70: return null (pular treino, idol precisa de descanso)
        skill ≥ 50: checa stress > 60 (mais conservador)
        skill < 50: checa stress > 80 (arrisca mais)
  4. Bonus de charisma do coach:
     charisma > 70: idol motivation +5
     charisma < 30: idol motivation -3
  5. return conductTraining(idol, stat, intensity, day)
```

#### Tarefa: Avaliar Progresso

```
Contexto: idol com 4+ semanas de treino vocal, growth history
Retorna: { type: 'trainingAssessment', idolId, verdict, recommendation } (informativo)

Fluxograma:
  1. Calcular growth rate do stat treinado nas últimas 4 semanas
  2. skill ≥ 60: comparar com growth rate esperado (baseado em PT + idade + coach quality)
     → se abaixo do esperado: recommendation = 'change focus or check wellness'
     → se acima: recommendation = 'continue current plan'
  3. skill < 60: "melhorando" ou "estagnado" (binário)
  4. Se stat atingiu ceiling: recommendation = 'switch to another stat'
  5. return assessment
```

---

## PAPEL 7: DANCE COACH

### Cargo 7.1: Treino de Dança

#### Tarefa: Conduzir Sessão

```
(Mesmo fluxograma do Vocal Coach, mas para stats de dança: dance, stamina, expression)
Diferença: Dance Coach com skill ≥ 70 também avalia group choreography readiness
  → se idol está em grupo com show próximo: prioriza dance + stamina sobre outros
```

#### Tarefa: Preparar Idol para Coreografia de Grupo

```
Contexto: idol em grupo com show agendado, mastery da setlist
Retorna: { type: 'groupChoreoPrepare', idolId, songIds } | null

Fluxograma:
  1. Idol está em grupo com show nas próximas 2 semanas?
     → se não: return null
  2. Quais músicas da setlist a idol tem mastery baixo (<50)?
     skill ≥ 60: identifica músicas fracas E prioriza por position na setlist (opener/closer = prioridade)
     skill < 60: identifica só as com mastery < 30
  3. return groupChoreoPrepare(idol, weakSongs) — sinaliza para scheduling alocar slots de rehearsal
```

---

## PAPEL 8: ACTING/VARIETY COACH

### Cargo 8.1: Treino de Atuação

#### Tarefa: Conduzir Sessão

```
(Mesmo fluxograma do Vocal Coach, mas para stats: acting, variety, communication)
Diferença: Acting Coach com skill ≥ 60 prepara idol especificamente para o tipo de job:
  → idol tem TV show esta semana: foca communication + variety
  → idol tem gravação de drama: foca acting
  → sem job específico: stat mais fraco do domínio
```

#### Tarefa: Preparar para Programa de TV

```
Contexto: idol com job TV agendado esta semana, idol stats
Retorna: { type: 'tvPreparation', idolId, focusAreas } | null

Fluxograma:
  1. Idol tem job de TV/variety agendado nos próximos 3 dias?
     → se não: return null
  2. Analisar tipo de programa:
     skill ≥ 50: variety show → foca communication + charisma
                 drama → foca acting
                 talk show → foca variety + communication
     skill < 50: foco genérico em communication
  3. return tvPreparation(idol, focusAreas) — slot de treino especial pré-job
```

---

## PAPEL 9: MUSIC DIRECTOR (A&R)

### Cargo 9.1: Produção Musical

#### Tarefa: Encomendar Música Nova

```
Contexto: projetos ativos, compositores disponíveis, roster, strategy, budget
Retorna: { type: 'commissionMusic', composerId, genre, targetIdols, config } | null

Fluxograma:
  1. Precisa de música nova?
     a. Nenhum projeto ativo E roster tem idols performando: sim
     b. Grupo sem single nos últimos 3 meses: sim
     c. Strategy focus == 'commercial' E chart position caindo: sim
     → se não precisa: return null
  2. Selecionar compositor:
     skill ≥ 70: avaliar tier × custo × estilo × disponibilidade → melhor fit para roster
     skill 40-69: melhor tier disponível dentro do budget
     skill < 40: mais barato disponível
  3. Verificar capacidade do compositor (MAX_CONCURRENT não atingido)
     → se cheio: tentar próximo na lista ou return null
  4. Género/estilo:
     skill ≥ 60: match com pontos fortes do idol/grupo alvo + trend do chart
     skill < 60: género padrão do repertório existente
  5. return commissionMusic(composer, genre, targetIdols, config)
```

#### Tarefa: Resolver Pipeline Stalled

```
Contexto: projetos com stalled == true, stall reason, recursos
Retorna: { type: 'resolveStall', projectId, action } | null

Fluxograma:
  1. Projetos stalled?
     → se não: return null
  2. Analisar stall reason:
     a. 'composer_unavailable': 
        skill ≥ 60: buscar compositor alternativo
        skill < 60: esperar (return null)
     b. 'no_dance_studio':
        skill ≥ 50: recomendar upgrade de facility (→ Operations Director)
        skill < 50: skip choreography (redistribute weights)
     c. 'idol_schedule_conflict':
        skill ≥ 60: coordenar com Talent Manager para abrir slots
        skill < 60: esperar próxima semana
  3. return resolveStall(project, resolveAction)
```

### Cargo 9.2: Gestão de Compositores

#### Tarefa: Reservar Compositor

```
Contexto: compositor selecionado, projeto, capacidade do compositor
Retorna: { type: 'bookComposer', composerId, projectId } | null

Fluxograma:
  1. Compositor tem capacidade (activeProjects < maxConcurrent)?
     → se não: return null (stall)
  2. Fee dentro do budget?
     → se não: return null
  3. return bookComposer(composer, project)
```

### Cargo 9.3: Planeamento de Lançamento

#### Tarefa: Planear Release

```
Contexto: projeto com gravação completa, chart state, calendar, marketing budget
Retorna: { type: 'planRelease', projectId, releaseDate, tracklist, marketing, hypeActivities } | null

Fluxograma:
  1. Projeto completou gravação?
     → se não: return null
  2. Escolher data de lançamento:
     skill ≥ 70: evitar semanas com lançamentos de rivais, preferir semanas com boost sazonal (Natal, Golden Week)
     skill 40-69: 2-4 semanas no futuro
     skill < 40: próxima semana (sem planeamento)
  3. Tracklist order:
     skill ≥ 60: lead single primeiro, encerrar com ballad (otimizar chart entry score)
     skill < 60: ordem de composição (como foram feitas)
  4. Marketing:
     skill ≥ 70: calcular budget ótimo via diminishing returns formula
     skill 40-69: alocar 10% do budget mensal
     skill < 40: sem marketing (orgânico)
  5. Hype pré-lançamento:
     skill ≥ 60: planear 2-3 atividades (teaser → MV → press listening)
     skill < 60: skip hype
  6. return planRelease(project, date, tracklist, marketing, hype)
```

---

## PAPEL 10: SHOW DIRECTOR

### Cargo 10.1: Planeamento de Shows

#### Tarefa: Planear Show

```
Contexto: roster fame, venues disponíveis, calendar, budget, strategy
Retorna: { type: 'planShow', venue, date, lineup, budget } | null

Fluxograma:
  1. Há razão para fazer show?
     a. Música nova lançada recentemente → release concert
     b. Idol/grupo atingiu fame milestone → celebration
     c. Strategy growthPosture == 'aggressive' → regular shows
     d. Fan club mood > 80 → fan meeting/concert
     skill ≥ 60: avalia todos critérios
     skill < 60: só faz se explicitamente na strategy
     → se não há razão: return null
  2. Venue (match fame):
     fame < 500: café/bar (100-300 seats)
     fame 500-2000: casa de show (500)
     fame 2000-5000: hall (2000)
     fame 5000+: arena (10000)
     skill ≥ 70: ajusta ±1 size baseado em trend (crescendo = stretch goal)
  3. Date:
     skill ≥ 60: evitar conflitos (outro show na mesma semana, eventos do calendar)
     skill < 60: próximo slot livre
  4. Lineup:
     skill ≥ 50: seleciona idols com melhor performance score + wellness ok
     skill < 50: todas as idols do grupo/top-3 solo
  5. return planShow(venue, date, lineup, estimatedBudget)
```

### Cargo 10.2: Gestão de Palco

#### Tarefa: Selecionar Pacotes de Produção

```
Contexto: show planeado, venue, budget, SM skill
Retorna: { type: 'selectPackages', showId, packages: PackageSelection } | null

Fluxograma:
  1. Para cada tipo de pacote (som, luz, banda, cenografia, FX):
     a. Verificar mínimo do venue (arena precisa profissional+)
     b. Alocar:
        skill ≥ 70: otimizar por impacto/custo — investir mais em som e luz (maior ROI)
        skill 40-69: tudo no mínimo do venue
        skill < 40: tudo no básico (mesmo se venue pede mais → penalidade -30%)
  2. Aplicar desconto SM:
     SM skill ≥ 70: -15% custo total
     SM skill ≥ 50: -5%
  3. Verificar budget total:
     → se excede: downgrade pacote de menor impacto
  4. return selectPackages(show, packages)
```

#### Tarefa: Gerir Substituições Mid-Show

```
Contexto: show em execução, idol performance mid-show, backup roster
Retorna: { type: 'midShowSubstitution', showId, outIdolId, inIdolId } | null

Fluxograma:
  1. Alguma idol com performance < 0.3 em 2+ músicas consecutivas?
     → se não: return null
  2. Backup disponível (declarado pré-show)?
     → se não: return null (aguentar)
  3. Substituições já feitas < max (2, ou 3 se SM skill > 15)?
     → se atingiu max: return null
  4. Backup tem stats adequados para o role da idol saindo?
     skill ≥ 60: verifica role fit
     skill < 60: qualquer backup serve
  5. return midShowSubstitution(show, outIdol, inIdol)
```

### Cargo 10.3: Coreografia e Formações

#### Tarefa: Atribuir Formações por Música

```
Contexto: setlist do show, idols do grupo, stats de cada idol
Retorna: { type: 'assignFormations', showId, formations: MusicFormation[] } | null

Fluxograma:
  1. Show tem setlist definida?
     → se não: return null (setlist primeiro)
  2. Para cada música na setlist:
     a. Identificar roles necessários (center, vocal, dance, support, etc.)
     b. Match idol → role:
        skill ≥ 70: otimiza role_fit global (best idol for each role considering all songs)
        skill 40-69: greedy per-music (best available for each role)
        skill < 40: posição fixa (mesmo role em todas músicas)
     c. Calcular chemistry score:
        skill ≥ 50: pairwise affinity check, flag combos ruins
        skill < 50: skip chemistry (pode resultar em conflitos)
  3. return assignFormations(show, formations)
```

### Cargo 10.4: Setlist

#### Tarefa: Montar Setlist

```
Contexto: repertório disponível (músicas gravadas + mastery), show config, audience expectation
Retorna: { type: 'buildSetlist', showId, songIds, mcSlots } | null

Fluxograma:
  1. Listar músicas disponíveis (gravadas, mastery > 30 para todos membros)
  2. Selecionar:
     skill ≥ 70: otimizar pacing (opener high-energy → build → peak → cool → encore)
                 variar géneros, evitar 3 baladas seguidas
                 incluir lead single + fan favorites (chart position)
     skill 40-69: sort by mastery descending (tocar o que sabem melhor)
     skill < 40: random selection até preencher slots
  3. Número de músicas:
     show duration / avg_song_duration, minus MC slots
     skill ≥ 60: planear 2-3 MC/interludes para costume changes e descanso
     skill < 60: sem MC (todas músicas seguidas)
  4. Encore:
     skill ≥ 50: reservar 1-2 músicas para encore (hit mais popular)
     skill < 50: sem encore planeado
  5. return buildSetlist(show, songIds, mcSlots)
```

### Cargo 10.5: Figurino e Wardrobe

#### Tarefa: Atribuir Figurinos para Show

```
Contexto: inventário de figurinos, idols do show, setlist, themes
Retorna: { type: 'assignCostumes', showId, assignments: {idolId, costumeId, songs}[] } | null

Fluxograma:
  1. Inventário tem figurinos disponíveis (durability > 25%)?
     → se vazio: return null (idols vão com roupa default, penalidade visual)
  2. Match figurino → música/theme:
     skill ≥ 70: match theme do figurino com genre/mood da música
                 priorizar tier alto para opener e closer
     skill 40-69: melhor tier disponível para cada idol
     skill < 40: primeiro disponível por idol
  3. Costume changes mid-show?
     skill ≥ 60 AND MC slots no setlist: planear 1 change no meio do show
     skill < 60: sem changes (mesma roupa o show todo)
  4. return assignCostumes(show, assignments)
```

#### Tarefa: Comprar Figurinos

```
Contexto: inventário atual, capacidade, budget, shows próximos
Retorna: { type: 'purchaseCostume', costumeType, theme, tier } | null

Fluxograma:
  1. Inventário abaixo de 50% da capacidade E shows planeados?
     → se não: return null
  2. Que tipo?
     skill ≥ 60: analisar gaps (theme sem figurino, tier 1 desgastado, grupo sem unificado)
     skill < 60: tipo mais versátil (uso geral)
  3. Tier:
     budget alto: tier 2-3 (durável, visual impactful)
     budget apertado: tier 1 (barato, desgasta rápido)
  4. return purchaseCostume(type, theme, tier)
```

---

## PAPEL 11: COMMUNICATIONS DIRECTOR

### Cargo 11.1: PR e Gestão de Crise

#### Tarefa: Responder a Escândalo

```
Contexto: escândalo ativo (type, severity, idol, triggers), idol personality, fan state
Retorna: { type: 'respondScandal', eventId, strategy, followUp } | null

Fluxograma:
  1. Escândalo não resolvido esta semana?
     → se não: return null
  2. Escolher estratégia por severidade:
     LEVE:
       skill ≥ 50: 'spin' (transformar em press positiva)
       skill < 50: 'silence' (ignorar, passa sozinho)
     MÉDIO:
       skill ≥ 70: avaliar personalidade da idol:
         → Temperamento > 12: 'apologize' (sincero funciona)
         → Temperamento < 8: 'deny' (desculpa parece fraco)
         → Fan mood > 70: 'spin' (fãs vão defender)
       skill 40-69: sempre 'apologize'
       skill < 40: 'silence' (não sabe o que fazer)
     GRAVE:
       skill ≥ 60: 'apologize' + imediato damage_control campaign
       skill < 60: 'silence' (pior outcome)
  3. Follow-up:
     skill ≥ 60: agendar PR campaign de recovery para próxima semana
     skill < 60: sem follow-up
  4. return respondScandal(event, strategy, followUp)
```

#### Tarefa: Campanha PR Proativa

```
Contexto: roster fame, fan moods, recent job results, opportunities
Retorna: { type: 'launchPRCampaign', idolId, campaignType, budget } | null

Fluxograma:
  1. Oportunidade existe?
     a. Idol com job S-grade recente → 'viral_push'
     b. Idol com fame > 3000 E fan mood < 60 → 'damage_control'
     c. Novo single lançado → 'image_boost'
     skill ≥ 50: detecta todas oportunidades
     skill < 50: só reage a crises (mood < 40)
  2. Se nenhuma oportunidade: return null
  3. Budget:
     skill ≥ 60: calcula ROI esperado para dimensionar budget
     skill < 60: 5% do budget mensal (flat)
  4. return launchPRCampaign(idol, type, budget)
```

### Cargo 11.2: Social Media

#### Tarefa: Gerir Presença Online

```
Contexto: roster, fan moods, trending topics, social media state
Retorna: { type: 'socialMediaAction', idolId, action } | null

Fluxograma:
  1. Priorizar:
     a. Idol com trending negativo → 'manage_negative' (urgente)
     b. Idol com fan mood > 80 + recent success → 'engage_fans'
     c. Idol com lançamento esta semana → 'promote_release'
     skill ≥ 60: gere top-5 idols por semana
     skill < 60: gere top-3 apenas
  2. Se nada urgente: return null
  3. return socialMediaAction(idol, action)
```

### Cargo 11.3: Fan Club Management (Community Manager)

#### Tarefa: Analisar Estado dos Fãs

```
Contexto: fan clubs de todas idols/grupos, moods, demandas pendentes
Retorna: { type: 'fanClubReport', insights, demandas, recommendations } (informativo)

Fluxograma:
  1. Scan fan clubs:
     a. Algum com mood < 40? → flag crise
     b. Algum com toxicidade > 60? → flag risco
     c. Algum com demanda pendente há 3+ semanas? → flag
  2. Demandas não atendidas:
     skill ≥ 60: prioriza por impacto (hardcore fãs > casual)
     skill < 60: lista tudo sem priorizar
  3. return fanClubReport(insights, demands, recommendations)
     → alimenta Decision Phase de outros papéis (Events, PR, Strategy)
```

#### Tarefa: Planear Evento de Fãs

```
Contexto: fan club state, budget, calendar, idol availability
Retorna: { type: 'planFanEvent', type, idolIds, date, budget } | null

Fluxograma:
  1. Fan mood caindo para um grupo/idol específico?
     → sim: fan event para esse grupo (fan meeting, online Q&A)
  2. Fan club atingiu milestone (10K, 50K, 100K members)?
     → sim: celebration event
  3. Nenhuma razão? return null
  4. Tipo:
     skill ≥ 60: match event type com fan segment predominante
       → hardcore majority: signing event
       → casual majority: online event (mais alcance)
     skill < 60: fan meeting genérico
  5. return planFanEvent(type, idols, date, budget)
```

#### Tarefa: Gerir Toxicidade

```
Contexto: fan clubs com toxicidade alta, recent events
Retorna: { type: 'manageToxicity', fanClubId, action } | null

Fluxograma:
  1. Toxicidade > 60 em algum fan club?
     → se não: return null
  2. Acção:
     skill ≥ 70: identificar fonte (anti-fans? inter-fan conflict? recent scandal?) → targeted action
     skill 40-69: 'engagement_campaign' genérica (+mood, -toxicity gradual)
     skill < 40: return null (não sabe lidar)
  3. return manageToxicity(fanClub, action)
```

---

## PAPEL 12: OPERATIONS DIRECTOR

### Cargo 12.1: Gestão Financeira

#### Tarefa: Rever e Ajustar Budget

```
Contexto: income/expense breakdown, projections, debt state, ROI per category
Retorna: { type: 'adjustBudget', changes: {category, newAmount}[] } | null

Fluxograma:
  1. Projections indicam deficit nos próximos 3 meses?
     skill ≥ 60: projeta 3 meses baseado em trend
     skill < 60: só vê mês atual
     → se não: return null (budget estável)
  2. Identificar categoria com pior ROI:
     skill ≥ 70: full ROI analysis (revenue generated / cost per category)
     skill < 70: maior custo absoluto
  3. Cortar ou realocar:
     skill ≥ 60: realoca de categoria baixo-ROI para alto-ROI
     skill < 60: corta flat -10% em todas categorias
  4. return adjustBudget(changes)
```

#### Tarefa: Flag Risco Financeiro

```
Contexto: balance trend, debt state, expense growth
Retorna: { type: 'financialAlert', risk, severity, recommendation } | null

Fluxograma:
  1. Balance negativo 2+ meses consecutivos? → risk: 'deficit', severity: 'high'
  2. Despesas > receita este mês? → risk: 'overspend', severity: 'medium'
  3. Debt state escalou (Healthy → Difficulty)? → risk: 'debt', severity: 'critical'
  4. skill ≥ 50: detecta riscos 1 mês antes (projeção)
     skill < 50: só detecta quando já aconteceu
  5. Se nenhum risco: return null
  6. return financialAlert(risk, severity, recommendation)
```

### Cargo 12.2: Gestão de Facilities

#### Tarefa: Recomendar Upgrade

```
Contexto: facilities atuais, roster needs, budget, agency tier
Retorna: { type: 'upgradeFacility', facilityType, toLevel } | null

Fluxograma:
  1. Facilities críticas em falta:
     a. Sem sala de psicólogo E alguma idol stress > 60? → prioridade
     b. Sem estúdio de dança E projetos musicais precisam coreografia? → prioridade
     c. Sem estúdio de gravação E projetos stalled em recording? → prioridade
  2. ROI:
     skill ≥ 60: estimar ROI (custo vs benefício mensal projetado)
     skill < 60: verificar só se cabe no budget
  3. Se budget permite E facility crítica: return upgradeFacility(type, level)
  4. Se nada crítico: return null
```

### Cargo 12.3: Merchandising

#### Tarefa: Decidir Produção de Merch

```
Contexto: roster fame, fan club sizes, upcoming shows, inventory, budget
Retorna: { type: 'produceMerch', productType, theme, idolId, printRun, price } | null

Fluxograma:
  1. Precisa de merch?
     a. Show agendado sem merch preparado? → sim
     b. Idol atingiu fame milestone? → special edition
     c. Stock de produtos populares < 20% capacidade? → restock
     → se não precisa: return null
  2. Tipo de produto:
     skill ≥ 60: match tipo com fan segment (hardcore → photocard, casual → camiseta)
     skill < 60: camiseta genérica (safe)
  3. Print-run:
     skill ≥ 70: calcula demanda projetada = fanClub.size × segment_weights × mood/100
     skill < 70: print-run médio para o tier
  4. Preço:
     skill ≥ 60: price elasticity analysis (maxRevenue = price × demand_at_price)
     skill < 60: preço padrão do tier
  5. return produceMerch(type, theme, idol, printRun, price)
```

### Cargo 12.4: Marketing

#### Tarefa: Lançar Campanha

```
Contexto: lançamentos recentes, shows próximos, idols trending, budget
Retorna: { type: 'launchCampaign', targetId, campaignType, budget, duration } | null

Fluxograma:
  1. Oportunidade de marketing?
     a. Release esta semana? → 'release_promotion'
     b. Show em 2 semanas? → 'show_promotion'
     c. Idol trending positivo? → 'momentum_boost'
     skill ≥ 60: identifica todas oportunidades
     skill < 60: só releases
     → se não: return null
  2. Budget:
     skill ≥ 70: diminishing returns calc → alocar no ponto ótimo
     skill 40-69: 5-10% do budget mensal
     skill < 40: mínimo (token campaign)
  3. Duration:
     release: 2-4 semanas
     show: 1-2 semanas antes
     momentum: 1 semana (strike while hot)
  4. return launchCampaign(target, type, budget, duration)
```

### Cargo 12.5: Planeamento de Eventos

#### Tarefa: Planear Evento Custom

```
Contexto: calendar, budget, roster, strategy, rival events
Retorna: { type: 'planCustomEvent', eventType, date, budget, lineup, invites } | null

Fluxograma:
  1. Razão para evento?
     a. Charity event (reputation boost): 1× por temporada
     b. Collab event com rival: se relação > 50 com algum rival
     c. Special concert (graduation, anniversary): calendar trigger
     skill ≥ 60: avalia todas razões
     skill < 60: só faz se explicitamente solicitado
     → se não: return null
  2. Tipo e budget:
     skill ≥ 70: otimiza tipo para maximizar exposure × custo
     skill < 70: tipo padrão para a ocasião
  3. Convidar artistas externos?
     skill ≥ 60: avalia se collab aumenta visibilidade (target tier > our tier)
     skill < 60: não convida (fica in-house)
  4. return planCustomEvent(type, date, budget, lineup, invites)
```

---

## PAPEL 13: WELLNESS DIRECTOR

### Cargo 13.1: Monitoramento de Wellness

#### Tarefa: Scan Semanal de Wellness

```
Contexto: todas idols do roster, wellness bars, schedule, history
Retorna: { type: 'wellnessAlert', idolId, risk, recommendation }[] | null

Fluxograma:
  1. Para cada idol (sorted by urgency):
     a. Stress > 85? → flag 'burnout_imminent', recommend 3 rest days
     b. Happiness < 25 há 2+ semanas? → flag 'crisis_imminent'
     c. Health < 30? → flag 'injury_risk', recommend 2 rest days
     d. Stress > 60? → flag 'elevated_stress', recommend psychologist
     e. Motivation < 30 há 3+ semanas? → flag 'demotivated'
     skill ≥ 50: detecta no threshold mencionado
     skill < 50: detecta só em thresholds +20 mais altos (tarde demais)
  2. Prevenção:
     skill ≥ 70: track trend de 4 semanas (barras descendo? ritmo de queda?)
       → flag preventivamente ANTES de atingir threshold
     skill < 70: só reage ao snapshot atual
  3. return alerts[] ou null se todos saudáveis
```

#### Tarefa: Agendar Sessão de Psicólogo

```
Contexto: idol com stress > threshold, facility psicólogo disponível
Retorna: { type: 'schedulePsychologist', idolId, day } | null

Fluxograma:
  1. Facility psicólogo existe?
     → se não: return null (não pode agendar o que não existe)
  2. Idol com stress > 60 (ou > 80 se skill < 50)?
     → se não: return null
  3. Slot livre na agenda da idol esta semana?
     → se não: return null (agenda cheia)
  4. return schedulePsychologist(idol, bestDay)
     → sinaliza para Scheduling alocar o slot
```

#### Tarefa: Conduzir Sessão de Wellness

```
Contexto: idol com wellness preocupante, wellness advisor disponível
Retorna: { type: 'wellnessSession', idolId, focus } | null

Fluxograma:
  1. Idol precisa de intervenção direta (stress > 70 ou happiness < 30)?
     → se não: return null
  2. Foco:
     stress > happiness problem: focus = 'stress_reduction' (−15 stress)
     happiness < stress problem: focus = 'morale_boost' (+10 happiness)
  3. Advisor charisma modifica eficácia:
     charisma > 70: +50% effect
     charisma < 30: −30% effect
  4. return wellnessSession(idol, focus)
```

### Cargo 13.2: Gestão de Lesões

#### Tarefa: Avaliar Risco de Lesão

```
Contexto: idol schedule, consecutive work days, age, health bar, injury history
Retorna: { type: 'injuryRiskAssessment', idolId, risk, recommendation } | null

Fluxograma:
  1. Para cada idol:
     a. 5+ dias consecutivos de trabalho? → risk: 'high'
     b. Idade > 25 E health < 50? → risk: 'medium'
     c. Lesão recente (< 4 semanas)? → risk: 'high' (re-injury window)
     skill ≥ 60: avalia todos fatores combinados
     skill < 60: só checa dias consecutivos
  2. Se risco > 'low': return assessment com recommendation de reduzir carga
  3. Se todos ok: return null
```

#### Tarefa: Coordenar Reabilitação

```
Contexto: idol com lesão ativa, injury type, severity, medical facility
Retorna: { type: 'rehabPlan', idolId, schedule, restrictions } | null

Fluxograma:
  1. Idol com lesão ativa?
     → se não: return null
  2. Medical Center existe?
     sim: recovery speed ×1.2-1.5 dependendo do level
     não: recovery speed base
  3. Restrições:
     → bloquear stats físicos (vocal, dance, stamina, acting, expression)
     → permitir stats mentais a 50% eficiência
  4. Duração estimada: base_recovery × (1 − medical_bonus)
  5. return rehabPlan(idol, schedule, restrictions)
```

### Cargo 13.3: Cuidado Pós-crise

#### Tarefa: Plano de Recovery de Burnout

```
Contexto: idol recém-recuperada de burnout, wellness state
Retorna: { type: 'recoveryPlan', idolId, weeksDuration, maxJobsPerWeek } | null

Fluxograma:
  1. Idol recuperou de burnout nas últimas 2 semanas?
     → se não: return null
  2. Plano:
     skill ≥ 60: gradual return (semana 1: 1 job, semana 2: 2 jobs, semana 3: normal)
     skill < 60: return direto à normalidade (risco de re-burnout)
  3. return recoveryPlan(idol, duration, maxJobs)
     → sinaliza para Scheduling respeitar limites
```

---

## PAPEL 14: INTELLIGENCE ANALYST

### Cargo 14.1: Analytics de Performance

#### Tarefa: Análise Pós-Mortem

```
Contexto: resultados de jobs/shows da semana, expected vs actual
Retorna: { type: 'postMortem', jobId, positives, negatives, keyFactor } (informativo)

Fluxograma:
  1. Para cada job/show completado esta semana:
     a. Comparar performance vs expectativa (baseado em stats + job difficulty)
     b. Identificar top-3 fatores positivos (stats que contribuíram)
     c. Identificar top-3 fatores negativos (stats que falharam, wellness impact)
     d. Key factor: o fator com maior |delta| entre expected e actual
     skill ≥ 70: análise detalhada com fan/media reaction correlation
     skill < 70: análise básica de stats vs resultado
  2. return postMortem por job
```

### Cargo 14.2: Inteligência Competitiva

#### Tarefa: Monitorar Rivais

```
Contexto: rival agencies visíveis, market movements, news de rivais
Retorna: { type: 'rivalIntel', agencyId, insights, threats } | null

Fluxograma:
  1. Algum rival fez movimento significativo?
     a. Contratou idol tier S+? → threat
     b. Lançou música no top 10? → insight
     c. Fez buyout proposal nos nossos idols? → threat
     skill ≥ 70: monitora top-10 rivais por tier
     skill 40-69: monitora top-5
     skill < 40: monitora top-3
  2. Prever buyout attempts:
     skill ≥ 60: se rival budget alto + nosso idol com contrato expirando → flag
     skill < 60: não prevê
  3. return rivalIntel(agency, insights, threats) ou null
```

### Cargo 14.3: Relatórios

#### Tarefa: Gerar Relatório Semanal

```
Contexto: todos KPIs da semana, comparativo com semana anterior
Retorna: { type: 'weeklyReport', kpis, trends, alerts } (informativo, sempre gerado)

Fluxograma:
  1. Compilar KPIs:
     receita total, despesa total, lucro, balance, roster size, avg wellness,
     avg fame, shows realizados, jobs completados, scandals, fan mood avg
  2. Trends:
     skill ≥ 60: comparar com últimas 4 semanas, flag tendências
     skill < 60: comparar com semana anterior apenas
  3. Alertas automáticos:
     a. KPI com queda > 20% week-over-week
     b. KPI atingindo threshold crítico
  4. return weeklyReport(kpis, trends, alerts)
     → este relatório é SEMPRE gerado (mesmo sem NPC: gerado com dados brutos sem análise)
```

---

## Summary

### Total Inventory

| Papel | Cargos | Tarefas | Flowcharts |
|-------|--------|---------|------------|
| 1. Head Producer | 4 | 7 | 7 |
| 2. Vice-Producer | 2 | 2 | 2 |
| 3. Talent Director | 3 | 5 | 5 |
| 4. Chief Scout | 2 | 4 | 4 |
| 5. Development Director | 3 | 5 | 5 |
| 6. Vocal Coach | 1 | 2 | 2 |
| 7. Dance Coach | 1 | 2 | 2 |
| 8. Acting/Variety Coach | 1 | 2 | 2 |
| 9. Music Director (A&R) | 3 | 4 | 4 |
| 10. Show Director | 5 | 7 | 7 |
| 11. Communications Director | 3 | 6 | 6 |
| 12. Operations Director | 5 | 6 | 6 |
| 13. Wellness Director | 3 | 6 | 6 |
| 14. Intelligence Analyst | 3 | 3 | 3 |
| **Total** | **39** | **61** | **61** |

### Skill Impact Summary

| Effective Skill | Search Depth | Behavior |
|----------------|-------------|----------|
| 0 (uncovered) | 0 | No actions. Function not executed. Consequences natural. |
| 1-20 | 1 | Reactive only. Handles crises. Random from small pool. |
| 21-40 | 2-4 | Handles basics. Top-3/5 evaluations. Safe defaults. |
| 41-60 | 5-6 | Competent. Most options evaluated. Strategy-aware. |
| 61-80 | 7-8 | Skilled. All viable options. Proactive. ROI-aware. Trend tracking. |
| 81-100 | 9-10 | Expert. Full optimization. Anticipates 3+ months. Cross-system awareness. |

### Multi-Role Rules

Cargos do mesmo papel: sem penalidade.
Cargos de papéis diferentes: ×0.7 (2 papéis), ×0.5 (3), ×0.3 (4+).

Combinações naturais cross-papel (penalidade reduzida ×0.8):
- Vocal + Dance + Acting Coach (domínio: treino)
- PR + Social Media + Fan Club (domínio: comunicação)
- Financial + Facilities + Marketing + Merch (domínio: operações)

### Cargo Vazio = Consequência Natural

Cada tarefa pode return null. Se nenhuma tarefa de um cargo retorna ações,
é equivalente a cargo vazio — não há NPC fazendo, não há player input.
Consequências são naturais e documentadas por cargo (ver draft-action-catalog.md).

## GDD Requirements Addressed

| GDD | Requirement | Coverage |
|-----|------------|----------|
| staff-functional.md | 12 funções operacionais | Expandido para 14 papéis, 39 cargos, 61 tarefas |
| staff-functional.md | NPC com multi-role penalty | effectiveSkill calculation com workload penalty |
| staff-functional.md | PRODUCER_TIME_BUDGET 100pts | Head Producer self-assign flowchart checks budget |
| staff-functional.md | Progressão garagem → elite | Skill-gated flowcharts: baixo skill = básico, alto = otimizado |
| rival-agency-ai.md | 50 agencies with decisions | Same flowcharts run for all 51 agencies via ADR-002 |
| producer-profile.md | Producer traits affect quality | Background/style/trait modifiers in producer execution quality |
| All system GDDs | Every player action | 61 flowcharts covering every delegatable action |

## Related Decisions

- [ADR-002](adr-002-simulation-pipeline.md) — unified pipeline consumes ActionLists from these flowcharts
- [ADR-003](adr-003-game-state-schema.md) — state slices feed TaskContext
- [ADR-004](adr-004-event-system.md) — events trigger reactive tasks (scandal response, buyout response)
- [ADR-005](adr-005-performance-budgets.md) — decision phase budget ~2ms per agency
- [draft-action-catalog.md](draft-action-catalog.md) — source document for papel/cargo structure
