# ADR-009: NPC Decision Catalog — Papéis, Cargos, Tarefas e Flowcharts

## Status
Proposed

## Date
2026-04-08

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (unified pipeline), ADR-003 (state slices), ADR-004 (events) |
| **Enables** | All gameplay epics |
| **Blocks** | Implementation of any NPC decision logic |

## Context

ADR-002: all 51 agencies run the same pipeline. The Decision Phase produces
`AgencyAction[]`. This ADR specifies every action, organized as:

```
Papel (Role) → Cargo (Post) → Tarefa (Task) → Behavior Table (8 levels)
```

Each task has a **primary attribute** (1-20, shown as label). The NPC's label
level determines which **behavior row** executes — not an if/else with arbitrary
thresholds, but a **defined behavior per level**.

### Attribute Labels (FM26 model)

| Label | Range | Color |
|-------|-------|-------|
| Elite | 20 | Roxo |
| Outstanding | 18-19 | Dourado |
| Very Good | 15-17 | Verde escuro |
| Good | 12-14 | Verde |
| Average | 10-11 | Verde claro |
| Competent | 7-9 | Amarelo |
| Reasonable | 4-6 | Cinza |
| Unsuited | 1-3 | Vermelho |

### Effective Attribute

```
effectiveAttr = npc.[primaryAttribute for this task]
  × multiRolePenalty(workload)        // 1.0 / 0.7 / 0.5 / 0.3
  × determinationRoll(npc.determination, seed)

Label is derived from effectiveAttr after penalties.
That label selects the behavior row in the task table.
```

### Secondary Modifiers (applied AFTER behavior row executes)

| Modifier | Effect |
|----------|--------|
| `motivating` | Idol motivation delta: +(motivating−10)×0.5 per interaction |
| `peopleManagement` | Idol happiness delta: +(peopleMgmt−10)×0.5 per interaction |
| `adaptability` | Multi-role penalty reduced: ≥15 uses ×0.8 instead of ×0.7 |
| `discipline` | Quality floor: never below (discipline/20)×0.5 of max quality |
| `authority` | Conflict resolution success: authority/20 probability |

---

## PAPEL 1: HEAD PRODUCER

### Cargo 1.1: Alocação de Staff

#### Tarefa: Contratar NPC
**Primary attribute:** Judging Idol Ability
**Context:** NPCs no mercado, budget de staff, cargos vazios
**Returns:** `{ type: 'hireStaff', npcId, salary }` | null

| Label | Behavior |
|-------|----------|
| Unsuited | Não contrata ninguém. Cargo fica vazio. |
| Reasonable | Contrata o mais barato disponível independente de qualidade. |
| Competent | Filtra por salary ≤ 50% do budget. Pega o melhor skill dentro do filtro. |
| Average | Filtra salary ≤ 30% budget. Ranqueia por primaryAttr do papel necessário. |
| Good | Ranqueia por (primaryAttr × 0.6 + determination × 0.2 + experience × 0.2) / salary. |
| Very Good | Idem Good + avalia secondary attrs (motivating, peopleManagement). Projeta ROI de 3 meses. |
| Outstanding | Idem VG + compara com staff atual, só contrata se upgrade real. Negocia salary -10%. |
| Elite | Full market scan. Identifica NPCs undervalued (alto attr, baixo salary). Timing de contratação (espera queda de preço). |

#### Tarefa: Demitir NPC
**Primary attribute:** Financial Acumen
**Context:** staff atual, performance, budget pressure

| Label | Behavior |
|-------|----------|
| Unsuited | Nunca demite, mesmo em crise. |
| Reasonable | Demite só em crise financeira (debt ≥ crisis). Escolhe o mais caro. |
| Competent | Demite se ROI negativo 3+ meses. Escolhe pior ROI. |
| Average | Idem + avalia se cargo fica vazio ou tem substituto. |
| Good | Projeta impacto de demissão nos próximos 2 meses antes de decidir. |
| Very Good | Compara custo de manter vs contratar substituto melhor e mais barato. |
| Outstanding | Planeja demissão + contratação como pacote (sai um, entra outro na mesma semana). |
| Elite | Antecipa necessidade de demissão 1 mês antes. Já tem replacement identificado. |

#### Tarefa: Atribuir NPC a Cargo
**Primary attribute:** Industry Knowledge
**Context:** staff contratado, cargos e seus assignees, attrs de cada NPC

| Label | Behavior |
|-------|----------|
| Unsuited | Alocação aleatória. NPCs podem estar em cargos completamente errados. |
| Reasonable | Preenche vazios com quem está disponível, sem avaliar fit. |
| Competent | Aloca NPC ao cargo onde seu primaryAttr é mais alto. |
| Average | Idem + identifica mismatches (NPC com Vocal Technique 18 fazendo PR). |
| Good | Otimiza alocação global: melhor NPC → cargo de maior impacto. Minimiza multi-role. |
| Very Good | Idem + considera secondary attrs (motivating para coaches, authority para show dir). |
| Outstanding | Re-avalia alocação mensalmente. Propõe swaps quando novo staff entra. |
| Elite | Antecipa necessidades futuras (show em 3 semanas = priorizar Stage Presence). |

#### Tarefa: Auto-atribuir-se a Cargo
**Primary attribute:** (usa o attr do cargo que vai cobrir)
**Context:** cargos vazios, PRODUCER_TIME_BUDGET restante, producer profile

| Label | Behavior |
|-------|----------|
| Unsuited | Não se auto-atribui. Cargos ficam vazios. |
| Reasonable | Cobre o primeiro cargo vazio da lista, sem priorizar. |
| Competent | Prioriza cargo com consequência mais grave se vazio (wellness > scheduling). |
| Average | Idem + verifica se tem budget de tempo antes de aceitar. |
| Good | Prioriza cargos onde o producer profile dá bônus (background × style × trait). |
| Very Good | Idem + calcula se é melhor cobrir ou contratar NPC na próxima semana. |
| Outstanding | Planeja: "cubro esta semana, contrato NPC na próxima" — bridge temporário. |
| Elite | Sempre avalia: "sou melhor que qualquer NPC disponível neste cargo?" Se sim, mantém-se. |

### Cargo 1.2: Direção Estratégica

#### Tarefa: Ajustar Estratégia
**Primary attribute:** Industry Knowledge
**Context:** strategy atual, resultados 3 meses, roster, economy

| Label | Behavior |
|-------|----------|
| Unsuited | Nunca muda estratégia. Mantém defaults eternamente. |
| Reasonable | Muda só em crise óbvia (receita caindo 3+ meses → commercial). |
| Competent | Avalia receita trend. Se caindo, muda focus. Respeita cooldowns. |
| Average | Avalia receita + fame trends. Ajusta focus e agenda posture. |
| Good | Idem + avalia roster composition. Muitas novatas → scouting focus. |
| Very Good | Cross-analysis: economy + fame + roster + fan mood → strategy holística. |
| Outstanding | Projeta 3 meses: "se mantiver organic, fame estagna. Switch to aggressive." |
| Elite | Antecipa market shifts. Ajusta ANTES dos problemas aparecerem nos KPIs. |

### Cargo 1.3: Relações com Board

#### Tarefa: Negociar Orçamento de Staff
**Primary attribute:** Authority
**Context:** budget atual, staff costs, resultados, tier

| Label | Behavior |
|-------|----------|
| Unsuited | Não negocia. Aceita qualquer ratio que o board dá. |
| Reasonable | Pede +10% flat quando tem cargos vazios. Sem justificativa. |
| Competent | Pede ratio necessário para cobrir todos cargos. Justificativa: "precisamos de staff." |
| Average | Inclui lista de cargos vazios e consequências na proposta. |
| Good | Apresenta ROI do staff existente como argumento. |
| Very Good | Projeta retorno do investimento em staff para próximo trimestre. |
| Outstanding | Timing: negocia após boa semana de resultados. Mostra antes/depois do último hire. |
| Elite | Negociação preventiva: pede budget ANTES de precisar. Board confia no track record. |

### Cargo 1.4: Relações com Idols

#### Tarefa: Conversar com Idol
**Primary attribute:** People Management
**Context:** idol com conversa pendente, idol state, afinidade

| Label | Behavior |
|-------|----------|
| Unsuited | Ignora todas conversas pendentes. Idols ficam sem atenção. |
| Reasonable | Conversa só com idol em crise (happiness < 20). Tom neutro, sem promessas. |
| Competent | Conversa com crises + pedidos. Tom neutro. Faz promessas genéricas. |
| Average | Escolhe tom baseado em happiness (baixa → empathetic, alta → friendly). |
| Good | Avalia Temperamento da idol para escolher tom. Promete só o que pode cumprir. |
| Very Good | Idem + adapta tom ao oculto Ambição (alta → motivational, baixa → supportive). |
| Outstanding | Planeja conversas proativas (não espera trigger). Constrói afinidade preventivamente. |
| Elite | Cross-ref com Lealdade + estado de contrato. Conversa estratégica pré-renovação. |

---

## PAPEL 2: VICE-PRODUCER

### Cargo 2.1: Substituição Geral

#### Tarefa: Cobrir Cargo Vazio
**Primary attribute:** (usa o primaryAttr do cargo sendo coberto, × 0.7 generalista)
**Context:** cargos vazios, vice attrs

| Label | Behavior |
|-------|----------|
| (Todos) | Executa o flowchart do cargo coberto, mas com effectiveAttr = viceAttr × 0.7. O label resultante determina o comportamento na tabela daquele cargo. Um vice "Good" (12-14) cobrindo scheduling opera como "Competent" (12 × 0.7 = 8.4 → 7-9). |

### Cargo 2.2: Conselheiro

#### Tarefa: Recomendar Ação
**Primary attribute:** Industry Knowledge
**Context:** KPIs, decisões pendentes do player

| Label | Behavior |
|-------|----------|
| Unsuited | Sem sugestões. |
| Reasonable | Alerta só para crises ativas (budget negativo, idol burnout). |
| Competent | Alerta crises + contratos expirando em 2 semanas. |
| Average | Idem + sugere ações genéricas ("contrate staff", "dê descanso"). |
| Good | Prioriza sugestões por impacto financeiro. Sugere ações específicas. |
| Very Good | Identifica oportunidades (não só problemas): "idol X está pronta para show solo." |
| Outstanding | Sugere planos de ação completos: "contrate vocal coach, mude focus para artistic, renove contrato da Y." |
| Elite | Antecipa problemas 3+ semanas antes. Sugestões são quase sempre corretas. |

---

## PAPEL 3: TALENT DIRECTOR

### Cargo 3.1: Negociação de Contratos

#### Tarefa: Renovar Contrato Expirando
**Primary attribute:** Industry Knowledge
**Context:** contratos ≤4 semanas, idol stats, economy

| Label | Behavior |
|-------|----------|
| Unsuited | Não inicia renovação. Contratos expiram silenciosamente. |
| Reasonable | Renova todos com salary × 1.3 flat. Sem avaliar se vale a pena. |
| Competent | Avalia fame > 500 → renovar. Senão, deixa expirar. Salary × 1.3. |
| Average | Avalia ROI simples (receita vs salary). Salary proporcional ao ROI. |
| Good | Avalia ROI + potencial futuro + archetype gap. Negocia salary otimizado. |
| Very Good | Idem + avalia fame trend (crescendo = vale mais, caindo = negociar para baixo). |
| Outstanding | Inicia renovação 8 semanas antes (não espera 4). Melhores termos com tempo. |
| Elite | Planeja renovações em batch. Sincroniza com budget cycle. Nunca pego de surpresa. |

#### Tarefa: Responder a Buyout
**Primary attribute:** Industry Knowledge
**Context:** proposta (agencyId, idolId, offerYen)

| Label | Behavior |
|-------|----------|
| Unsuited | Ignora proposta (timeout → idol pode sair). |
| Reasonable | Aceita se oferta > marketValue. Rejeita se menor. |
| Competent | Aceita se oferta > marketValue × 1.2. Rejeita se < 0.8. |
| Average | Idem + counter-propose se entre 0.8 e 1.2 (pede marketValue × 1.1). |
| Good | Avalia importância da idol (archetype coverage, revenue share, fan impact). |
| Very Good | Idem + avalia replacement cost (quanto custa encontrar e treinar substituta). |
| Outstanding | Usa buyout como leverage: "aceito se me dão idol X em troca + dinheiro." |
| Elite | Avalia timing: "rival precisa mais de nós agora — pedimos premium de 50%." |

#### Tarefa: Rescindir Contrato
**Primary attribute:** Financial Acumen
**Context:** ROI por idol, budget, roster

| Label | Behavior |
|-------|----------|
| Unsuited | Nunca rescinde. Mantém todos mesmo com prejuízo. |
| Reasonable | Rescinde só se agência em crise. O mais caro sai. |
| Competent | Rescinde se ROI negativo 3+ meses. O pior ROI sai. |
| Average | Idem + verifica se archetype fica coberto após rescisão. |
| Good | Projeta custo de manter vs rescisão fee. Escolhe o mais económico. |
| Very Good | Idem + avalia se idol tem potencial de recovery (stats subindo?). |
| Outstanding | Planeja rescisão + replacement como operação conjunta. |
| Elite | Antecipa: lista idol para transferência ANTES de rescindir (receita em vez de custo). |

### Cargo 3.2: Gestão de Roster

#### Tarefa: Avaliar Composição do Roster
**Primary attribute:** Judging Idol Ability
**Context:** roster atual, archetypes, age, revenue

| Label | Behavior |
|-------|----------|
| Unsuited | Sem avaliação. Não sabe o que tem. |
| Reasonable | Conta idols. "Temos 8." Sem análise. |
| Competent | Identifica archetypes com 0 idols (gaps óbvios). |
| Average | Idem + identifica archetypes com apenas 1 idol (risco). |
| Good | Analisa distribuição de idade: flag se >50% na mesma faixa. |
| Very Good | Calcula star dependency (% receita do top-1). Flag se >40%. |
| Outstanding | Projeta roster needs 6 meses à frente (contratos expirando, idols aging). |
| Elite | Full portfolio analysis: diversificação, risk, growth pipeline, succession plan. |

### Cargo 3.3: Transferências

#### Tarefa: Listar Idol para Venda
**Primary attribute:** Financial Acumen
**Context:** roster assessment, budget, tier limits

| Label | Behavior |
|-------|----------|
| Unsuited | Nunca lista. |
| Reasonable | Lista só se roster acima do limite do tier. A mais barata sai. |
| Competent | Lista idols com ROI negativo 3+ meses. Asking price = marketValue × 0.9. |
| Average | Idem + verifica archetype coverage antes de listar. |
| Good | Asking price = marketValue × 1.1. Timing: lista quando mercado está ativo. |
| Very Good | Avalia quais rivais precisam deste archetype → lista quando há demand. |
| Outstanding | Cria "shop window": lista 2-3 idols dispensáveis para gerar propostas. |
| Elite | Orchestrated sales: vende antes do contrato expirar para maximizar fee. |

---

## PAPEL 4: CHIEF SCOUT

### Cargo 4.1: Gestão de Olheiros

#### Tarefa: Enviar Scout em Missão
**Primary attribute:** Judging Idol Potential
**Context:** scouts ociosos, roster gaps, regiões

| Label | Behavior |
|-------|----------|
| Unsuited | Scouts ficam ociosos indefinidamente. |
| Reasonable | Envia scout mais barato para região aleatória. 2 semanas. Sem foco. |
| Competent | Envia para região com mais idols. 2 semanas. Foco genérico. |
| Average | Cruza roster gaps com regiões. 2 semanas. Foco no archetype em falta. |
| Good | Idem + 4 semanas (deep search). Prioriza regiões com histórico de bons finds. |
| Very Good | Planeja rede: cada scout numa região diferente para máxima cobertura. |
| Outstanding | Timing: envia antes de janela de transfer (novas idols entram no mercado). |
| Elite | Scouting pipeline: missões sobrepostas para fluxo contínuo de candidates. |

### Cargo 4.2: Avaliação de Candidatos

#### Tarefa: Avaliar e Shortlist
**Primary attribute:** Judging Idol Ability
**Context:** scout reports com candidatos

| Label | Behavior |
|-------|----------|
| Unsuited | Não lê reports. Candidatos ignorados. |
| Reasonable | Shortlist: top-1 por tier (a melhor tier disponível). |
| Competent | Filtra: tier ≥ mínimo da agência. Shortlist top-3. |
| Average | Idem + filtra por idade e affordability. |
| Good | Ranqueia por: potential × affordability × archetype_need. Top-5. |
| Very Good | Idem + avalia personality traits (Ambição, Temperamento) para fit cultural. |
| Outstanding | Identifica "hidden gems": tier baixo mas potential alto (PT ≥ 70 com stats baixos). |
| Elite | Cross-ref com rival scouting: "3 rivais estão de olho nesta — agir rápido." |

---

## PAPEL 5: DEVELOPMENT DIRECTOR

### Cargo 5.1: Planos de Desenvolvimento

#### Tarefa: Criar Plano
**Primary attribute:** Judging Idol Potential
**Context:** idols sem plano, stats vs ceiling, archetype

| Label | Behavior |
|-------|----------|
| Unsuited | Não cria planos. Idols crescem sem direção. |
| Reasonable | Cria plano para idol com menor tier. Foco: stat mais baixo. 12 semanas, normal. |
| Competent | Idem + respeita ceiling (não treina stat já no máximo). |
| Average | Foco no stat mais fraco para o archetype da idol. Intensidade baseada em stress. |
| Good | Prioriza idol com maior gap stats/ceiling E menor idade (mais retorno). |
| Very Good | Plano com 3 metas complementares (não só 1 stat). Ajusta intensidade por wellness. |
| Outstanding | Coordena com coaches: "vocal coach foca X, dance coach foca Y, ambos alinhados." |
| Elite | Pipeline de desenvolvimento: plan A → plan B → debut timeline. Projeção completa. |

### Cargo 5.2: Mentoria

#### Tarefa: Atribuir Mentor
**Primary attribute:** Mental Coaching
**Context:** juniors (F-C), seniors (A+), afinidade

| Label | Behavior |
|-------|----------|
| Unsuited | Não atribui mentores. |
| Reasonable | Senior com maior overall → junior com menor overall. |
| Competent | Match por stat complementarity (senior forte onde junior é fraco). |
| Average | Idem + verifica que mentor tem workload < 80%. |
| Good | Match por afinidade × stat complementarity × personalidade compatível. |
| Very Good | Planeja rotation: "mês 1 com mentor A (vocal), mês 2 com mentor B (dance)." |
| Outstanding | Cross-group mentoring: senior de outro grupo mentora junior para diversificar skills. |
| Elite | Identifica "natural mentors" (idols com peopleSkills oculto alto) que ninguém pensaria. |

### Cargo 5.3: Avaliação de Potencial

#### Tarefa: Projetar Timeline de Idol
**Primary attribute:** Judging Idol Potential
**Context:** idol stats, PT, age, growth rate

| Label | Behavior |
|-------|----------|
| Unsuited | Sem avaliação. "Não sei o potencial dela." |
| Reasonable | Binário: "tem potencial" (PT > 60) ou "não tem" (PT ≤ 60). |
| Competent | Estima peak: "stats atuais + growth rate × semanas até ceiling." |
| Average | Idem + flag idols estagnados (growth ≈ 0 há 8+ semanas). |
| Good | Projeta curva de crescimento: quando atinge cada milestone (tier B, A, S). |
| Very Good | Compara com idols similares que já cresceram: "Yui tinha stats parecidos aos 16 e virou S." |
| Outstanding | Identifica limiting factors: "ela tem potencial S mas mental coaching vai limitar se não treinar." |
| Elite | Full career projection: "peak aos 22, plateau aos 26, decline aos 30. Invest window: 2 anos." |

---

## PAPEL 6: VOCAL COACH

### Cargo 6.1: Treino Vocal

#### Tarefa: Conduzir Sessão
**Primary attribute:** Vocal Technique
**Context:** idol no slot, stats, wellness, devPlan

| Label | Behavior |
|-------|----------|
| Unsuited | Sessão ineficaz. Crescimento = 10% do normal. Pode treinar stat errado. |
| Reasonable | Treina stat aleatório do domínio vocal. Intensidade normal. Ignora stress. |
| Competent | Treina stat mais baixo do domínio. Skips se stress > 80. |
| Average | Segue DevPlan se existe. Senão, stat mais fraco. Ajusta intensidade por stress. |
| Good | Stat mais fraco PARA O ARCHETYPE da idol. Intensive se stress < 40 E gap > 15. |
| Very Good | Idem + adapta exercício ao learning style da idol (oculto). Melhor growth rate. |
| Outstanding | Micro-targets: "esta semana foca range alto, próxima foca breath control." Compound growth. |
| Elite | Sessions personalizadas. Growth rate máximo possível dentro do ceiling. |

*Secondary: motivating → idol motivation delta. peopleManagement → idol happiness delta.*

#### Tarefa: Avaliar Progresso
**Primary attribute:** Vocal Technique
**Context:** idol com 4+ semanas de treino, growth history

| Label | Behavior |
|-------|----------|
| Unsuited | Sem avaliação. |
| Reasonable | "Melhorando" ou "estagnado" (binário). |
| Competent | Compara growth rate com baseline. Flag se abaixo. |
| Average | Identifica causa provável (stress? treino errado? ceiling?). |
| Good | Recomenda mudança de foco se estagnado. |
| Very Good | Projeta quando idol atinge next tier baseado na curva atual. |
| Outstanding | Identifica se stagnation é temporária (age plateau) ou permanente (ceiling). |
| Elite | Full vocal assessment: "ponto forte em X, fraco em Y, ceiling em Z. Recomendo mudar para..." |

---

## PAPEL 7: DANCE COACH

### Cargo 7.1: Treino de Dança

#### Tarefa: Conduzir Sessão
**Primary attribute:** Dance Technique
*(Mesma estrutura do Vocal Coach, adaptada para stats de dança)*

| Label | Behavior |
|-------|----------|
| Unsuited | Crescimento 10% do normal. Stat aleatório. Risco de lesão +5%. |
| Reasonable | Stat aleatório de dança. Normal intensity. Ignora stress e físico. |
| Competent | Stat mais baixo de dança. Skips se stress > 80 OU health < 30. |
| Average | Segue DevPlan. Ajusta intensidade. Verifica physical readiness. |
| Good | Stat por archetype. Intensive se idol aguenta. Inclui stamina em sessions. |
| Very Good | Coordena com coreografia: treina moves que a idol precisa para shows próximos. |
| Outstanding | Periodização: semana pesada → semana leve → recovery. Compound growth. |
| Elite | Full body awareness. Previne lesão via técnica. Growth rate máximo. |

#### Tarefa: Preparar Coreografia de Grupo
**Primary attribute:** Dance Technique
**Context:** idol em grupo com show em ≤2 semanas

| Label | Behavior |
|-------|----------|
| Unsuited | Não prepara. Grupo vai com coreografia genérica. |
| Reasonable | Identifica músicas com mastery < 30. "Ensaiem mais." |
| Competent | Identifica músicas fracas. Recomenda rehearsal slots. |
| Average | Prioriza por posição na setlist (opener/closer primeiro). |
| Good | Planeja rehearsal schedule: 1 música por dia, focando nas mais fracas. |
| Very Good | Adapta coreografia à capacidade do membro mais fraco (não exige além do possível). |
| Outstanding | Cria variações simplificadas para membros fracos, mantendo visual do grupo. |
| Elite | Full group choreography direction. Cada membro tem moves adaptados ao seu nível. |

---

## PAPEL 8: ACTING/VARIETY COACH

### Cargo 8.1: Treino de Atuação

#### Tarefa: Conduzir Sessão
**Primary attribute:** Acting/Variety
*(Mesma estrutura dos outros coaches)*

| Label | Behavior |
|-------|----------|
| Unsuited | Crescimento 10%. Stat aleatório. Sessão sem estrutura. |
| Reasonable | Stat mais baixo de atuação. Normal. Ignora contexto. |
| Competent | Stat mais baixo. Skips se stress > 80. |
| Average | Segue DevPlan. Ajusta intensidade. |
| Good | Foco baseado em jobs vindouros: TV → communication, drama → acting. |
| Very Good | Simula cenários de programa: "finja que o apresentador te pergunta X." |
| Outstanding | Treino adaptado à personalidade da idol (introvertida → diferente de extrovertida). |
| Elite | Masterclass personalizada. Idols saem prontas para qualquer formato de TV. |

#### Tarefa: Preparar para Programa de TV
**Primary attribute:** Acting/Variety
**Context:** idol com job TV em ≤3 dias

| Label | Behavior |
|-------|----------|
| Unsuited | Sem preparação. Idol vai "fria". |
| Reasonable | "Boa sorte." (sem efeito mecânico) |
| Competent | Foco genérico em communication. +5% performance no job. |
| Average | Foco por tipo: variety → charisma, talk → communication, drama → acting. |
| Good | Idem + simula perguntas difíceis. +10% performance. |
| Very Good | Analisa formato do programa + apresentador. Preparação targeted. +15%. |
| Outstanding | Identifica "moments" que a idol pode criar (viral potential). +20%. |
| Elite | Full prep: roteiro de pontos a mencionar, reações a cenários, outfit advice. +25%. |

---

## PAPEL 9: MUSIC DIRECTOR (A&R)

### Cargo 9.1: Produção Musical

#### Tarefa: Encomendar Música Nova
**Primary attribute:** Musical Knowledge
**Context:** projetos ativos, compositores, roster, strategy, budget

| Label | Behavior |
|-------|----------|
| Unsuited | Nunca encomenda. Agência fica sem músicas novas. |
| Reasonable | Encomenda do compositor mais barato. Género aleatório. |
| Competent | Compositor mais barato dentro do tier C+. Género padrão do roster. |
| Average | Melhor tier disponível dentro do budget. Género match com strategy focus. |
| Good | Avalia compositor tier × custo × estilo. Match com pontos fortes da idol/grupo alvo. |
| Very Good | Idem + analisa chart trends (que géneros estão a subir). Timing estratégico. |
| Outstanding | Planeja pipeline: "single agora, B-side em 4 semanas, album em 12." |
| Elite | Full A&R vision: compositor + género + producer + target audience tudo alinhado. |

#### Tarefa: Resolver Pipeline Stalled
**Primary attribute:** Musical Knowledge
**Context:** projetos stalled, stall reason

| Label | Behavior |
|-------|----------|
| Unsuited | Ignora stall. Projeto fica parado indefinidamente. |
| Reasonable | Espera (return null para tudo). |
| Competent | Se 'composer_unavailable': espera. Se 'no_studio': sinaliza para Operations. |
| Average | Busca compositor alternativo se primary indisponível. |
| Good | Resolve proativamente: busca alternativa + coordena com scheduling para slots. |
| Very Good | Prioriza projetos stalled por urgência (release date próxima = prioridade). |
| Outstanding | Previne stalls: reserva compositor e estúdio ANTES de iniciar projeto. |
| Elite | Zero stalls: pipeline nunca para porque recursos são pré-alocados. |

### Cargo 9.2: Gestão de Compositores

#### Tarefa: Reservar Compositor
**Primary attribute:** Musical Knowledge
**Context:** compositor, projeto, capacidade

| Label | Behavior |
|-------|----------|
| Unsuited | Não reserva. Projetos stall em composição. |
| Reasonable | Reserva o primeiro disponível. |
| Competent | Reserva o disponível com melhor tier. |
| Average | Verifica fee dentro do budget antes de reservar. |
| Good | Avalia fit: compositor pop para música pop, ballad para ballad. |
| Very Good | Mantém relações: usa compositores que já deram bons resultados. |
| Outstanding | Network: conhece availability de compositores 2+ semanas à frente. |
| Elite | Exclusive deals: negocia prioridade com compositores top para a agência. |

### Cargo 9.3: Planeamento de Lançamento

#### Tarefa: Planear Release
**Primary attribute:** Musical Knowledge
**Context:** projeto com gravação completa, charts, calendar

| Label | Behavior |
|-------|----------|
| Unsuited | Não planeia. Música gravada fica em stock indefinidamente. |
| Reasonable | Lança próxima semana. Sem marketing. Tracklist por ordem de gravação. |
| Competent | Lança em 2 semanas. Marketing mínimo. Lead single primeiro. |
| Average | Evita semanas com feriados. Marketing 10% budget. Tracklist com lead single + ballad close. |
| Good | Analisa calendar: evita conflito com rivals. Marketing por diminishing returns. Hype: 1 atividade. |
| Very Good | Timing: lança em semana com boost sazonal. Marketing otimizado. Hype: 2 atividades (teaser + MV). |
| Outstanding | Full campaign: 3 hype activities, staggered rollout, coordena com show para release concert. |
| Elite | Creates "moments": release alinhado com aniversário da idol, award season, ou cultural event. |

---

## PAPEL 10: SHOW DIRECTOR

### Cargo 10.1: Planeamento de Shows

#### Tarefa: Planear Show
**Primary attribute:** Stage Presence
**Context:** roster fame, venues, calendar, budget, strategy

| Label | Behavior |
|-------|----------|
| Unsuited | Nunca planeia shows. Oportunidades perdidas. |
| Reasonable | Planeia só se strategy diz "aggressive". Venue mínimo. |
| Competent | Planeia por milestone (nova música, fame goal). Venue por fame bracket. |
| Average | Idem + verifica calendar (evita conflitos). Lineup: top idols. |
| Good | Venue stretch: fame crescendo → tenta venue 1 size acima. Budget detalhado. |
| Very Good | Planeja season de shows: "3 shows este trimestre, escalating venues." |
| Outstanding | Cross-promo: show coincide com release. Collab shows com aliados. |
| Elite | Full season planning: tour dates, venue progression, story arc (debut → arena). |

### Cargo 10.2: Gestão de Palco

#### Tarefa: Selecionar Pacotes de Produção
**Primary attribute:** Stage Presence
**Context:** show planeado, venue, budget

| Label | Behavior |
|-------|----------|
| Unsuited | Tudo no básico. Mesmo arena com som básico (−30% penalty). |
| Reasonable | Tudo no mínimo do venue. Sem otimização. |
| Competent | Mínimo do venue. Se sobra budget: upgrade som (maior impacto). |
| Average | Prioriza som + iluminação (ROI mais alto). Outros no mínimo. |
| Good | Otimiza por impacto/custo. Desconto −5% (negociação). |
| Very Good | Full production plan. Desconto −10%. Cada pacote complementa os outros. |
| Outstanding | Desconto −15%. Coordena pacotes para momentos específicos do setlist. |
| Elite | Desconto −20%. Production design: cada música tem lighting cue + cenografia sync. |

#### Tarefa: Substituição Mid-Show
**Primary attribute:** Stage Presence
**Context:** show em execução, performance de idols, backups

| Label | Behavior |
|-------|----------|
| Unsuited | Nunca substitui. Idol com 0.2 performance continua até o fim. |
| Reasonable | Substitui só se idol colapsa (performance = 0). |
| Competent | Substitui se performance < 0.3 em 2+ músicas. Backup aleatório. |
| Average | Idem + escolhe backup com melhor stat match para o role. |
| Good | Substitui preventivamente se percebe tendência de queda. Timing ótimo. |
| Very Good | Planeja backup strategy pré-show: "se X cair, Y entra no role Z." |
| Outstanding | Mid-show adjustment: além de substituir, ajusta formações dos restantes. |
| Elite | Transforma crise em momento: substituição planejada como "surprise appearance." |

### Cargo 10.3: Coreografia e Formações

#### Tarefa: Atribuir Formações por Música
**Primary attribute:** Dance Technique (cross-papel com Dance Coach)
**Context:** setlist, idols do grupo, stats

| Label | Behavior |
|-------|----------|
| Unsuited | Posição fixa para todas músicas. Sem role assignment. |
| Reasonable | Center = idol com mais fame. Resto aleatório. |
| Competent | Center = melhor overall. Roles por stat mais alto de cada idol. |
| Average | Greedy per-music: melhor idol disponível para cada role. |
| Good | Otimiza role_fit por música. Considera chemistry entre pares adjacentes. |
| Very Good | Global optimization: atribuições que maximizam score total do setlist. |
| Outstanding | Variação: center rota entre músicas para showcase de membros diferentes. |
| Elite | Storytelling via formações: progressão visual que complementa a narrativa do setlist. |

### Cargo 10.4: Setlist

#### Tarefa: Montar Setlist
**Primary attribute:** Musical Knowledge
**Context:** repertório, mastery, audience expectations

| Label | Behavior |
|-------|----------|
| Unsuited | Músicas aleatórias até preencher slots. Sem MC. |
| Reasonable | Sort por mastery descending. Sem MC. Sem encore. |
| Competent | Lead single primeiro. Sort resto por mastery. 1 MC slot. |
| Average | Opener energético → build → peak → cool → close. Sem encore planeado. |
| Good | Pacing otimizado. Varia géneros. 2 MC slots. Encore com hit #1. |
| Very Good | Setlist conta uma "história": abertura impactante, clímax no meio, emotional close. |
| Outstanding | Adapta setlist ao venue + audience demo. Festival ≠ intimate show. |
| Elite | Every transition is intentional. Keys, BPM, energy all considered. Encore = peak moment. |

### Cargo 10.5: Figurino e Wardrobe

#### Tarefa: Atribuir Figurinos para Show
**Primary attribute:** Stage Presence
**Context:** inventário, idols, setlist

| Label | Behavior |
|-------|----------|
| Unsuited | Roupa default. Sem costume assignment. Penalidade visual. |
| Reasonable | Melhor tier disponível para cada idol. Sem match com música. |
| Competent | Match tipo de figurino com genre do show (pop = colorido, ballad = elegante). |
| Average | Idem + prioriza tier alto para opener e closer. |
| Good | Theme coordination: grupo todo com visual coerente. |
| Very Good | Costume changes mid-show: 1 change no MC slot. Visual contrast. |
| Outstanding | Cada bloco do setlist tem visual diferente. 2 changes. Story through costume. |
| Elite | Full costume design: cada música tem visual complementar. Lighting sync. Iconic looks. |

#### Tarefa: Comprar Figurinos
**Primary attribute:** Stage Presence
**Context:** inventário, capacidade, budget, shows próximos

| Label | Behavior |
|-------|----------|
| Unsuited | Nunca compra. Usa o que tem até degradar. |
| Reasonable | Compra o mais barato quando inventário < 30%. |
| Competent | Compra quando inventário < 50% E show próximo. Tipo versátil. |
| Average | Identifica gaps (theme sem figurino, degradados). Tier médio. |
| Good | Planeja compras para shows específicos. Match theme + tier. |
| Very Good | Antecipa: encomenda custom 3 semanas antes de show grande. |
| Outstanding | Wardrobe rotation: nunca repete look em shows consecutivos. |
| Elite | Signature looks: cria identidade visual por idol/grupo. Iconic. |

---

## PAPEL 11: COMMUNICATIONS DIRECTOR

### Cargo 11.1: PR e Gestão de Crise

#### Tarefa: Responder a Escândalo
**Primary attribute:** Media Savvy
**Context:** escândalo (type, severity, idol), idol personality, fan state

| Label | Behavior |
|-------|----------|
| Unsuited | Ignora escândalo. Impacto total. Pode piorar (declaração aleatória). |
| Reasonable | 'Silence' em tudo (ignora e espera passar). Funciona para leves, desastroso para graves. |
| Competent | Leve→silence, Médio→apologize, Grave→apologize. Sem nuance. |
| Average | Leve→spin, Médio→apologize, Grave→apologize + damage control basic. |
| Good | Avalia Temperamento da idol: sincera→apologize, defensiva→deny. |
| Very Good | Idem + avalia fan mood. Fãs leais→spin funciona. Fãs irritados→apologize necessário. |
| Outstanding | Multi-step response: immediate statement + follow-up campaign + idol appearance strategy. |
| Elite | Transforma crise em oportunidade. "Escândalo de namoro → campanha de humanização." |

#### Tarefa: Campanha PR Proativa
**Primary attribute:** Media Savvy
**Context:** roster fame, fan moods, resultados recentes

| Label | Behavior |
|-------|----------|
| Unsuited | Sem campanhas proativas. |
| Reasonable | Só reage a crises (fan mood < 40 → damage control). |
| Competent | Reage a crises + capitaliza S-grade jobs (viral push). |
| Average | Idem + image boost para idols com release próximo. |
| Good | Identifica todas oportunidades. Budget proporcional ao potencial ROI. |
| Very Good | Planeja calendar de PR: 1 campanha por semana, rotação entre idols. |
| Outstanding | Coordena PR com releases, shows, e events para amplificação mútua. |
| Elite | Creates narratives: "idol X's journey from trainee to star" — long-term storytelling. |

### Cargo 11.2: Social Media

#### Tarefa: Gerir Presença Online
**Primary attribute:** Media Savvy
**Context:** roster, fan moods, trending, social state

| Label | Behavior |
|-------|----------|
| Unsuited | Nenhuma gestão. Fama online cresce organicamente. |
| Reasonable | Manage negative trending apenas (damage control reactivo). |
| Competent | Manage negatives + engage fans para top-3 idols. |
| Average | Top-5 idols geridas. Post regular. Engagement com fãs ativos. |
| Good | Todas idols geridas. Conteúdo adaptado ao personality de cada idol. |
| Very Good | Planeja content calendar. Cada post tem objetivo (engagement, hype, damage control). |
| Outstanding | Cross-platform strategy: content adaptado a cada "canal" (fotos vs texto vs video). |
| Elite | Viral engineering: identifica moments e amplifica em real-time para máximo impacto. |

### Cargo 11.3: Fan Club Management

#### Tarefa: Analisar Estado dos Fãs
**Primary attribute:** Fan Psychology
**Context:** fan clubs, moods, demandas

| Label | Behavior |
|-------|----------|
| Unsuited | Sem análise. Fan state é invisível para a agência. |
| Reasonable | Flag crises (mood < 40 em algum fan club). |
| Competent | Idem + flag toxicidade > 60. |
| Average | Prioriza demandas pendentes por impacto (hardcore > casual). |
| Good | Segmenta análise: identifica o que cada segmento quer (hardcore, dedicated, casual). |
| Very Good | Projeta trends: "mood caindo 5/semana, em 3 semanas atinge crise." |
| Outstanding | Identifica causas root: "mood caiu porque cancelamos fan meeting, não pelo escândalo." |
| Elite | Predictive: antecipa mudanças de mood baseado em schedule e events futuros. |

#### Tarefa: Gerir Toxicidade
**Primary attribute:** Fan Psychology
**Context:** fan clubs com toxicidade alta

| Label | Behavior |
|-------|----------|
| Unsuited | Não detecta toxicidade. Problemas escalam. |
| Reasonable | Detecta só quando toxicidade > 80. Ação genérica. |
| Competent | Detecta > 60. Engagement campaign genérica. |
| Average | Detecta > 50. Identifica fonte (anti-fans vs inter-fan conflict). |
| Good | Ação targeted: anti-fans → moderation. Inter-fan → mediação. |
| Very Good | Preventivo: engagement campaigns regulares para manter toxicidade baixa. |
| Outstanding | Root cause: muda condições que geram toxicidade (ex: "mais screen time para idol Z"). |
| Elite | Community culture: constrói normas positivas que se auto-regulam. Toxicidade raramente sobe. |

---

## PAPEL 12: OPERATIONS DIRECTOR

### Cargo 12.1: Gestão Financeira

#### Tarefa: Rever e Ajustar Budget
**Primary attribute:** Financial Acumen
**Context:** income/expense, projections, debt state

| Label | Behavior |
|-------|----------|
| Unsuited | Nunca ajusta. Budget fica como estava no início. |
| Reasonable | Corta 10% flat em tudo se balance negativo. |
| Competent | Identifica maior custo. Corta ali primeiro. |
| Average | Avalia ROI por categoria. Corta piores. |
| Good | Realoca de baixo-ROI para alto-ROI. |
| Very Good | Projeta 3 meses. Ajusta preventivamente. |
| Outstanding | Full budget optimization: cada yen alocado onde gera mais retorno. |
| Elite | Strategic budgeting: investe em perdas agora para ganhos futuros (ex: scouting heavy para pipeline). |

### Cargo 12.2: Gestão de Facilities

#### Tarefa: Recomendar Upgrade
**Primary attribute:** Financial Acumen
**Context:** facilities, roster needs, budget

| Label | Behavior |
|-------|----------|
| Unsuited | Sem recomendações. Facilities estagnadas. |
| Reasonable | Recomenda só se alguém reclamar (idol burnout → "talvez um psicólogo"). |
| Competent | Checa facilities críticas em falta (psicólogo, estúdio). Recomenda se budget permite. |
| Average | Avalia ROI: custo vs benefício mensal. |
| Good | Prioriza por impacto no roster (facility que ajuda mais idols = prioridade). |
| Very Good | Planeja upgrade path: "psicólogo nível 1 agora, nível 2 em 3 meses." |
| Outstanding | Coordena com strategy: aggressive growth → marketing facilities. Artistic → studios. |
| Elite | Full infrastructure plan: todas facilities com timeline de upgrade alinhado ao milestone da agência. |

### Cargo 12.3: Merchandising

#### Tarefa: Decidir Produção de Merch
**Primary attribute:** Financial Acumen
**Context:** roster fame, fan clubs, shows, inventory

| Label | Behavior |
|-------|----------|
| Unsuited | Sem merch. Receita perdida. |
| Reasonable | Produz camiseta genérica quando show se aproxima. Print-run mínimo. |
| Competent | Camiseta + photocard para shows. Preço padrão. Print-run médio. |
| Average | Match tipo com fan segment. Preço por tier. Print-run por fan club size. |
| Good | Special editions para milestones. Timing com releases. Desconto em stock antigo. |
| Very Good | Full product line: vários tipos + seasonal editions. Demanda projetada por formula. |
| Outstanding | Coordena com shows e releases. Merch exclusive per-event. |
| Elite | Merch as brand: cria identidade visual de merch por grupo. Collectors querem tudo. |

### Cargo 12.4: Marketing

#### Tarefa: Lançar Campanha
**Primary attribute:** Media Savvy (cross-papel com Communications)
**Context:** releases, shows, trending, budget

| Label | Behavior |
|-------|----------|
| Unsuited | Sem campanhas. Tudo orgânico. |
| Reasonable | Campanha só para releases. Budget mínimo. |
| Competent | Release + shows. Budget 5% receita mensal. |
| Average | Idem + momentum boost para idols trending. Budget por diminishing returns. |
| Good | Full campaign calendar. Budget otimizado por ROI. |
| Very Good | Multi-channel: cada campanha tem online + offline components. |
| Outstanding | Coordena com PR e Social Media para amplificação total. |
| Elite | Creates buzz: campanhas que geram media coverage orgânico além do pago. |

### Cargo 12.5: Planeamento de Eventos

#### Tarefa: Planear Evento Custom
**Primary attribute:** Industry Knowledge
**Context:** calendar, budget, roster, strategy, rivals

| Label | Behavior |
|-------|----------|
| Unsuited | Sem eventos custom. |
| Reasonable | Evento só se board pede. Formato básico. Budget mínimo. |
| Competent | 1 evento por temporada (charity padrão). Budget conservador. |
| Average | Escolhe tipo baseado em strategy. Budget adequado. |
| Good | Timing: charity pós-escândalo (reputation recovery). Collab com ally rival. |
| Very Good | Eventos como strategy tool: fan meeting para morale, charity para reputation. |
| Outstanding | Convida artistas externos para cross-promotion. Multi-day events. |
| Elite | Creates cultural moments: evento anual que vira tradição. "O festival da [agência]." |

---

## PAPEL 13: WELLNESS DIRECTOR

### Cargo 13.1: Monitoramento de Wellness

#### Tarefa: Scan Semanal
**Primary attribute:** Mental Coaching
**Context:** todas idols, wellness bars, schedule, history

| Label | Behavior |
|-------|----------|
| Unsuited | Sem monitoring. Burnout é surpresa. |
| Reasonable | Flag só burnout (stress = 100). Tarde demais. |
| Competent | Flag stress > 85. Recomenda descanso. |
| Average | Flag stress > 70. Flag happiness < 30 (2+ semanas). Recomenda psicólogo. |
| Good | Flag stress > 60. Track trends de 2 semanas. Preventivo. |
| Very Good | Track trends de 4 semanas. Prevê burnout 2-3 semanas antes de acontecer. |
| Outstanding | Cross-system: "stress subiu porque agenda pesada + escândalo + renovação pendente." |
| Elite | Predictive wellness model: projeta estado de cada idol nas próximas 4 semanas baseado em schedule. |

#### Tarefa: Conduzir Sessão de Wellness
**Primary attribute:** Mental Coaching
**Context:** idol com wellness preocupante

| Label | Behavior |
|-------|----------|
| Unsuited | Sessão ineficaz. −2 stress (mínimo). |
| Reasonable | Sessão genérica. −5 stress. |
| Competent | Foco por problema: stress alto → relaxamento (−10 stress). Happiness baixa → moral boost (+5 happiness). |
| Average | Idem + efeito depende de peopleManagement do wellness dir (+bonus). |
| Good | Sessão personalizada: adapta à personalidade da idol. −15 stress ou +10 happiness. |
| Very Good | Ongoing relationship: sessões regulares com a mesma idol criam confiança → efeito crescente. |
| Outstanding | Group sessions para idols de um grupo com tensão interna. Resolve conflitos. |
| Elite | Transformative: idol sai da sessão com motivação renovada. −20 stress, +15 happiness, +5 motivation. |

### Cargo 13.2: Gestão de Lesões

#### Tarefa: Avaliar Risco de Lesão
**Primary attribute:** Physical Training
**Context:** idol schedule, work days, age, health, history

| Label | Behavior |
|-------|----------|
| Unsuited | Sem avaliação. Lesões são surpresa. |
| Reasonable | Flag se health < 20. |
| Competent | Flag se 5+ dias consecutivos de trabalho OU health < 30. |
| Average | Idem + age > 25 com health declining = flag. |
| Good | Analisa combinação: dias consecutivos × age × health × injury history. |
| Very Good | Track re-injury window (2 semanas pós-recovery). Flag proativamente. |
| Outstanding | Preventive schedule: recomenda rest days ANTES de risk subir. |
| Elite | Zero preventable injuries: risk model tão bom que lesões só acontecem por azar, não por negligência. |

### Cargo 13.3: Cuidado Pós-crise

#### Tarefa: Plano de Recovery de Burnout
**Primary attribute:** Mental Coaching
**Context:** idol recuperada de burnout

| Label | Behavior |
|-------|----------|
| Unsuited | Return direto à normalidade. Alto risco de re-burnout. |
| Reasonable | 1 semana light schedule. Depois normal. |
| Competent | 2 semanas: semana 1 = 1 job, semana 2 = 2 jobs. |
| Average | Gradual: 1 → 2 → 3 jobs ao longo de 3 semanas. |
| Good | Idem + sessões de wellness integradas no recovery schedule. |
| Very Good | Personalizado: idol com mental coaching alto recupera mais rápido. Adapta timeline. |
| Outstanding | Coordena com coach: "treino leve para manter skills, sem pressão de performance." |
| Elite | Full recovery program: physical + mental + social reintegration. Idol volta melhor que antes. |

---

## PAPEL 14: INTELLIGENCE ANALYST

### Cargo 14.1: Analytics de Performance

#### Tarefa: Análise Pós-Mortem
**Primary attribute:** Judging Idol Ability
**Context:** resultados da semana

| Label | Behavior |
|-------|----------|
| Unsuited | Sem análise. Dados brutos apenas. |
| Reasonable | "Bom" ou "mau" por job (binário). |
| Competent | Top-1 fator positivo e top-1 negativo por job. |
| Average | Top-3 positivos e top-3 negativos. Key factor identificado. |
| Good | Idem + correlation: "falhou porque stress era 75, não por falta de skill." |
| Very Good | Trend analysis: "3ª semana seguida com queda em TV jobs — padrão." |
| Outstanding | Prescriptive: "recomendo foco em communication + 2 dias rest antes do próximo TV." |
| Elite | Full performance model: prediz nota do próximo job com ±0.05 de accuracy. |

### Cargo 14.2: Inteligência Competitiva

#### Tarefa: Monitorar Rivais
**Primary attribute:** Industry Knowledge
**Context:** rivals visíveis, market, news

| Label | Behavior |
|-------|----------|
| Unsuited | Sem intel. Rivais são caixa preta. |
| Reasonable | Nota movimentos óbvios (contratação de idol famosa). |
| Competent | Monitora top-3 rivais. Flag contratações e lançamentos. |
| Average | Monitora top-5. Identifica threats (buyout potential nos nossos idols). |
| Good | Monitora top-10. Prevê movimentos baseado em padrões (rival sempre contrata em janeiro). |
| Very Good | Estima budget rival. Identifica windows de oportunidade (rival gastou muito → vulnerável). |
| Outstanding | Network: "rival X está interessado na nossa idol Y — fonte: mercado de staff." |
| Elite | Full competitive model: projeta top-5 decisions de cada rival. Quase nunca surpreendido. |

### Cargo 14.3: Relatórios

#### Tarefa: Gerar Relatório Semanal
**Primary attribute:** Judging Idol Ability
**Context:** KPIs, comparativo semanal

| Label | Behavior |
|-------|----------|
| Unsuited | Sem relatório. Dados brutos se o player quiser ver. |
| Reasonable | KPIs básicos: receita, despesa, balance. Sem trends. |
| Competent | Idem + comparativo com semana anterior. Flag quedas > 20%. |
| Average | Trends de 4 semanas. Alertas automáticos para KPIs críticos. |
| Good | Segment analysis: KPIs por idol, por grupo, por revenue source. |
| Very Good | Projections: "se manter este ritmo, balance em 3 meses será X." |
| Outstanding | Insights: "receita subiu 15% mas 80% veio de uma idol — risco alto." |
| Elite | Executive dashboard: 1-page summary com os 3 insights mais importantes e recomendações. |

---

## Summary

### Total Inventory

| Papel | Cargos | Tarefas | Behavior Tables |
|-------|--------|---------|----------------|
| 1. Head Producer | 4 | 7 | 7 |
| 2. Vice-Producer | 2 | 2 | 2 |
| 3. Talent Director | 3 | 5 | 5 |
| 4. Chief Scout | 2 | 2 | 2 |
| 5. Development Director | 3 | 3 | 3 |
| 6. Vocal Coach | 1 | 2 | 2 |
| 7. Dance Coach | 1 | 2 | 2 |
| 8. Acting/Variety Coach | 1 | 2 | 2 |
| 9. Music Director | 3 | 4 | 4 |
| 10. Show Director | 5 | 7 | 7 |
| 11. Communications Director | 3 | 5 | 5 |
| 12. Operations Director | 5 | 5 | 5 |
| 13. Wellness Director | 3 | 4 | 4 |
| 14. Intelligence Analyst | 3 | 3 | 3 |
| **Total** | **39 cargos** | **53 tarefas** | **53 tabelas × 8 behaviors = 424 behaviors** |

### Attribute Labels (reference)

| Label | Range | Color | Behavior Pattern |
|-------|-------|-------|-----------------|
| Elite | 20 | Roxo | Perfect within possibility space. Anticipates. Creates opportunities. |
| Outstanding | 18-19 | Dourado | Near-perfect. Multi-step plans. Cross-system awareness. |
| Very Good | 15-17 | Verde escuro | Expert. Proactive. Trend analysis. Preventive. |
| Good | 12-14 | Verde | Skilled. Optimizes. ROI-aware. Plans 2+ weeks ahead. |
| Average | 10-11 | Verde claro | Solid. Strategy-aware. Handles most situations competently. |
| Competent | 7-9 | Amarelo | Reliable basics. Reacts to problems. Safe defaults. |
| Reasonable | 4-6 | Cinza | Minimal. Handles crises. Misses opportunities. |
| Unsuited | 1-3 | Vermelho | Ineffective. May make things worse. Better than nobody (barely). |

### Multi-Role Rules

Cargos do mesmo papel: sem penalidade.
Cargos de papéis diferentes: effectiveAttr recalculado com penalty.
Penalidade faz o label DROP — um NPC "Good" (14) cobrindo 2 papéis
opera como "Average" (14 × 0.7 = 9.8 → Competent na verdade).

| Workload | Penalty | Example: attr 14 ("Good") |
|----------|---------|---------------------------|
| 1 papel | ×1.0 | 14 → Good |
| 2 papéis | ×0.7 | 9.8 → Competent |
| 3 papéis | ×0.5 | 7.0 → Competent (low end) |
| 4+ papéis | ×0.3 | 4.2 → Reasonable |

## GDD Requirements Addressed

| GDD | Requirement | Coverage |
|-----|------------|----------|
| staff-functional.md | 12 funções operacionais | Expandido para 14 papéis, 39 cargos, 53 tarefas |
| staff-functional.md | NPC quality by skill | 8-level behavior table per task (424 distinct behaviors) |
| staff-functional.md | Multi-role penalty | effectiveAttr drops label level(s) |
| staff-functional.md | PRODUCER_TIME_BUDGET | Head Producer self-assign checks budget |
| agency-staff-operations.md | 19 attributes in 3 categories | Each task maps to primary attribute + secondary modifiers |
| agency-staff-operations.md | FM26 label system | All attributes shown as labels, never numbers |
| rival-agency-ai.md | 50 agencies with decisions | Same behavior tables for all 51 agencies |
| wireframe-21 | Staff profile with qualitative labels | Labels (Elite→Unsuited) with color coding |
| wireframe-22 | Quick profile: top-3 pros, cons | Primary attrs visible, label colors match behavior |
| wireframe-14 | Delegation with dropdowns | Each cargo is a delegatable unit in the UI |

## Related Decisions

- [ADR-002](adr-002-simulation-pipeline.md) — unified pipeline consumes ActionLists
- [ADR-003](adr-003-game-state-schema.md) — state slices feed TaskContext
- [ADR-004](adr-004-event-system.md) — events trigger reactive tasks
- [ADR-005](adr-005-performance-budgets.md) — decision phase budget
- [ADR-011](adr-011-multiplayer-ready.md) — same behaviors for local and remote
- [draft-action-catalog.md](draft-action-catalog.md) — papel/cargo structure reference
- design/gdd/agency-staff-operations.md — 19 attributes definition
- design/wireframes/21-staff-profile.md — FM26 label UI
- design/wireframes/14-responsibilities.md — delegation UI
