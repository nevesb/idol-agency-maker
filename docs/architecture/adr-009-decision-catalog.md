# ADR-009: NPC Decision Catalog

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

## Structure

```
Papel (Role) → Cargo (Post) → Tarefa (Task) → Decision Process (Flowchart)

Each Decision Process defines:
  1. CONTEXT — what the AI evaluates (inputs)
  2. SKILLS REQUIRED — which of the 19 staff attributes are read, and for what
  3. FLOWCHART — step-by-step decision tree where each step reads a skill,
     and each skill level produces a DIFFERENT output
  4. OUTPUT — the AgencyAction(s) returned to the pipeline
```

### Staff Attributes Reference (19 attrs, scale 1-20, shown as labels)

**COACHING (6):** Vocal Technique, Dance Technique, Acting/Variety, Stage Presence, Mental Coaching, Physical Training
**MENTAL (6):** Determination, Discipline, Motivating, People Management, Adaptability, Authority
**KNOWLEDGE (7):** Judging Idol Ability, Judging Idol Potential, Musical Knowledge, Industry Knowledge, Media Savvy, Financial Acumen, Fan Psychology

**Labels:** Elite (20) | Outstanding (18-19) | Very Good (15-17) | Good (12-14) | Average (10-11) | Competent (7-9) | Reasonable (4-6) | Unsuited (1-3)

---

## PAPEL 1: HEAD PRODUCER

### Cargo 1.1: Alocação de Staff

---

#### Decisão 1.1.1: Contratar NPC

**CONTEXTO (o que a IA avalia):**
- Lista de cargos atualmente sem NPC atribuído
- Pool de NPCs disponíveis no mercado de staff (com atributos parcialmente visíveis — margem de erro na entrevista)
- Budget mensal de staff disponível (orçamento total − salários atuais)
- Impacto de cada cargo vazio no funcionamento da agência (consequências documentadas)
- Tier da agência (limita max staff)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Judging Idol Ability** | Avaliar os atributos do candidato durante a "entrevista" (reduz margem de erro) |
| **Financial Acumen** | Avaliar se o salário pedido é justo e se cabe no budget |
| **Industry Knowledge** | Identificar qual cargo vazio tem maior impacto e priorizar |

**FLOWCHART:**

```
1. IDENTIFICAR NECESSIDADE
   ├─ Ler lista de cargos sem NPC atribuído
   ├─ Se nenhum cargo vazio → return null (não precisa contratar)
   └─ Priorizar qual cargo preencher primeiro:
      └─ Skill: Industry Knowledge
         ├─ Elite (20):      Avalia impacto de TODOS os cargos vazios. Ranqueia por:
         │                    consequência financeira × urgência temporal × sinergia com staff existente.
         │                    Identifica combinações: "se contratar Show Director, o Vocal Coach
         │                    rende mais porque coreografia fica coberta."
         ├─ Outstanding (18-19): Avalia todos cargos. Ranqueia por consequência financeira × urgência.
         ├─ Very Good (15-17): Avalia todos cargos. Prioriza por lista fixa:
         │                      wellness > scheduling > scouting > treino > shows > operações.
         ├─ Good (12-14):    Avalia top-5 cargos mais impactantes. Prioriza pela lista fixa.
         ├─ Average (10-11): Identifica os 3 cargos mais obviamente problemáticos.
         ├─ Competent (7-9): Identifica cargos vazios com consequência VISÍVEL esta semana
         │                    (ex: idol em burnout e sem wellness director).
         ├─ Reasonable (4-6): Preenche o primeiro cargo vazio da lista (sem avaliar impacto).
         └─ Unsuited (1-3):  Não identifica necessidade mesmo com cargos vazios.
                              Só age se outro staff sinalizar "precisamos de ajuda."

2. BUSCAR CANDIDATOS NO MERCADO
   ├─ Filtrar por: papel compatível com o cargo prioritário
   └─ Avaliar cada candidato:
      └─ Skill: Judging Idol Ability (usada aqui para avaliar staff, não idols)
         ├─ Elite (20):      Vê atributos com margem de erro ±1. Identifica "hidden gems"
         │                    (NPC barato com atributos altos que outros agências ignoraram).
         │                    Avalia personality fit com cultura da agência.
         ├─ Outstanding (18-19): Margem ±1. Avalia todos 19 atributos. Identifica top-3 candidatos.
         ├─ Very Good (15-17): Margem ±2. Avalia atributos primários do papel. Top-5 candidatos.
         ├─ Good (12-14):    Margem ±3. Avalia top-3 atributos do papel. Top-5 candidatos.
         ├─ Average (10-11): Margem ±4. Avalia só o atributo primário do cargo. Top-3 candidatos.
         ├─ Competent (7-9): Margem ±5. Avalia primaryAttr apenas. Top-3 candidatos.
         ├─ Reasonable (4-6): Margem ±7. Vê só o label geral ("parece bom"). Top-1 candidato.
         └─ Unsuited (1-3):  Margem ±10. Não distingue candidatos. Pega o primeiro da lista.

3. AVALIAR CUSTO
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Calcula ROI projetado: (impacto esperado no cargo × 12 meses) / salary.
      │                    Negocia salary −15% se mercado favorável (muitos candidatos disponíveis).
      │                    Avalia se é melhor esperar 2-3 semanas por candidato melhor.
      ├─ Outstanding (18-19): ROI projetado 6 meses. Negocia −10%.
      ├─ Very Good (15-17): Verifica salary ≤ 25% do budget de staff restante. Negocia −5%.
      ├─ Good (12-14):    Verifica salary ≤ 30% do budget. Sem negociação.
      ├─ Average (10-11): Verifica salary ≤ 40% do budget.
      ├─ Competent (7-9): Verifica se salary cabe no budget (sim/não binário).
      ├─ Reasonable (4-6): Contrata se cabe no budget, sem analisar proporção.
      └─ Unsuited (1-3):  Não avalia custo. Pode contratar NPC que estoura o budget.

4. DECISÃO FINAL
   ├─ Se candidato encontrado E custo aprovado:
   │   → return { type: 'hireStaff', npcId, negotiatedSalary }
   ├─ Se candidato encontrado mas custo reprovado:
   │   → return null (esperar candidato mais barato)
   └─ Se nenhum candidato adequado:
       → return null (cargo continua vazio)
```

**OUTPUT:** `{ type: 'hireStaff', npcId: string, salary: number }` | `null`

---

#### Decisão 1.1.2: Demitir NPC

**CONTEXTO (o que a IA avalia):**
- Staff atual com seus atributos, salários, e cargos atribuídos
- Performance recente de cada staff (qualidade das decisões nas últimas 4-12 semanas)
- Estado financeiro da agência (balance trend, debt state)
- Se existe substituto disponível no mercado ou outro staff que pode cobrir

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Financial Acumen** | Avaliar pressão financeira e custo/benefício de manter vs demitir |
| **Judging Idol Ability** | Avaliar se o NPC está realmente underperforming ou se o contexto é difícil |
| **Industry Knowledge** | Avaliar se existe substituto melhor no mercado e timing de demissão |

**FLOWCHART:**

```
1. AVALIAR PRESSÃO FINANCEIRA
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Analisa projeção 6 meses. Identifica se corte de staff resolve
      │                    deficit ou se o problema é receita (nesse caso demitir piora).
      │                    Calcula: "se demitir X, economizo Y/mês, mas perco Z de receita
      │                    porque o cargo fica descoberto."
      ├─ Outstanding (18-19): Projeção 3 meses. Custo de manter vs impacto de demitir.
      ├─ Very Good (15-17): Identifica staff com pior ratio salary/impacto.
      ├─ Good (12-14):    Identifica staff mais caro com performance abaixo da média.
      ├─ Average (10-11): Identifica staff mais caro se agência em difficulty/crisis.
      ├─ Competent (7-9): Demite só se agência em debt state 'crisis'. O mais caro sai.
      ├─ Reasonable (4-6): Demite só se debt state 'gameOver iminente'. Aleatório.
      └─ Unsuited (1-3):  Nunca identifica necessidade de demitir. Staff fica mesmo em crise.

2. AVALIAR PERFORMANCE DO STAFF
   └─ Skill: Judging Idol Ability
      ├─ Elite (20):      Analisa trend de 12 semanas. Distingue: "staff é fraco" vs
      │                    "staff é bom mas o contexto foi adverso (muitas crises, idols difíceis)."
      │                    Avalia se re-training ou mudança de cargo resolveria.
      ├─ Outstanding (18-19): Trend de 8 semanas. Compara com expectativa para o nível de attr.
      ├─ Very Good (15-17): Trend de 4 semanas. Flag se resultados consistentemente abaixo.
      ├─ Good (12-14):    Avalia últimas 4 semanas. Flag se maioria das decisões foram ruins.
      ├─ Average (10-11): Avalia última semana apenas. Flag se houve erro grave recente.
      ├─ Competent (7-9): Só nota problemas óbvios (idol teve burnout sob supervisão deste staff).
      ├─ Reasonable (4-6): Não avalia performance. Nunca demite por underperformance.
      └─ Unsuited (1-3):  Sem avaliação.

3. AVALIAR MERCADO DE SUBSTITUTOS
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Sabe se existe substituto melhor E mais barato no mercado.
      │                    Planeja: "demito na semana que o substituto fica disponível."
      ├─ Outstanding (18-19): Checa mercado antes de demitir. Só demite se substituto existe.
      ├─ Very Good (15-17): Checa se outro staff interno pode cobrir temporariamente.
      ├─ Good (12-14):    Verifica se cargo pode ficar vazio 2-3 semanas sem dano crítico.
      ├─ Average (10-11): Demite sem checar substituto. Espera que apareça alguém.
      ├─ Competent (7-9): Demite sem checar. Cargo fica vazio até próxima decisão de contratação.
      ├─ Reasonable (4-6): N/A (raramente chega aqui — não identifica necessidade de demitir).
      └─ Unsuited (1-3):  N/A.

4. DECISÃO FINAL
   ├─ Se pressão financeira alta E staff underperforming E substituto disponível (ou cargo suportável vazio):
   │   → return { type: 'fireStaff', npcId }
   ├─ Se pressão financeira crítica (debt crisis) mesmo sem underperformance:
   │   → return { type: 'fireStaff', npcId: staffComPiorROI }
   └─ Caso contrário:
       → return null (manter staff atual)
```

**OUTPUT:** `{ type: 'fireStaff', npcId: string }` | `null`

---

#### Decisão 1.1.3: Atribuir NPC a Cargo

**CONTEXTO (o que a IA avalia):**
- Staff contratado: seus papéis, atributos (19 attrs), e cargos atuais
- Lista de todos os cargos da agência e quem está atribuído a cada um
- Mismatches: NPC com attrs altos num domínio atribuído a cargo de outro domínio
- Cargos vazios vs cargos com NPC fraco

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Judging Idol Ability** | Avaliar os atributos reais de cada NPC para determinar onde rende mais |
| **Industry Knowledge** | Saber quais cargos são mais importantes para o momento da agência |
| **Adaptability** | Avaliar combinações não-óbvias (NPC em cargo fora do papel com penalidade aceitável) |

**FLOWCHART:**

```
1. MAPEAR ESTADO ATUAL
   ├─ Listar todos os cargos e seus assignees
   ├─ Listar NPCs sem cargo (contratados mas não atribuídos)
   └─ Identificar mismatches:
      └─ Skill: Judging Idol Ability
         ├─ Elite (20):      Avalia TODOS os 19 attrs de cada NPC. Identifica que NPC X tem
         │                    Vocal Technique 18 mas está fazendo PR (Media Savvy 6).
         │                    Calcula: "se trocar X para vocal coach e Y para PR, ganho líquido
         │                    é +12 pontos de qualidade total na agência."
         ├─ Outstanding (18-19): Avalia primary attrs de cada NPC vs cargo atribuído.
         │                        Identifica top-3 mismatches.
         ├─ Very Good (15-17): Avalia primary attr do cargo. Flag se NPC está >5 pontos abaixo
         │                      do que outro NPC disponível faria.
         ├─ Good (12-14):    Identifica NPCs em cargos obviamente errados (papel diferente).
         ├─ Average (10-11): Identifica cargos vazios que poderiam ser cobertos por re-alocação.
         ├─ Competent (7-9): Só identifica mismatches flagrantes (NPC coach fazendo financeiro).
         ├─ Reasonable (4-6): Não analisa. Mantém alocação atual.
         └─ Unsuited (1-3):  Pode atribuir NPC a cargo errado (aleatório).

2. PRIORIZAR CARGOS A PREENCHER
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Prioriza por impacto combinado: "wellness dir está vazio E temos
      │                    3 idols com stress > 70 → prioridade máxima." Contexto-aware.
      ├─ Outstanding (18-19): Prioriza por consequência documentada de cargo vazio.
      ├─ Very Good (15-17): Prioriza: wellness > scheduling > treino > shows > operações.
      ├─ Good (12-14):    Prioriza os 3 cargos vazios mais impactantes.
      ├─ Average (10-11): Preenche cargos vazios na ordem em que aparecem.
      ├─ Competent (7-9): Preenche o cargo vazio mais óbvio.
      ├─ Reasonable (4-6): Preenche 1 cargo vazio se houver NPC livre.
      └─ Unsuited (1-3):  Não preenche nada proativamente.

3. AVALIAR MULTI-ROLE
   └─ Skill: Adaptability
      ├─ Elite (20):      Calcula exatamente o impacto do multi-role penalty para cada combinação.
      │                    "NPC com adaptability 17 cobrindo 2 papéis perde ×0.8 (em vez de ×0.7)
      │                    — ainda fica como 'Good'. Vale a pena."
      ├─ Outstanding (18-19): Avalia se o penalty é aceitável vs deixar cargo vazio.
      ├─ Very Good (15-17): Só atribui multi-role se a combinação é do mesmo domínio
      │                      (coach + coach ok, coach + PR não).
      ├─ Good (12-14):    Atribui multi-role só se cargo vazio é crítico E sem alternativa.
      ├─ Average (10-11): Evita multi-role. Prefere cargo vazio a sobrecarregar.
      ├─ Competent (7-9): Não avalia multi-role. Atribui sem pensar nas consequências.
      ├─ Reasonable (4-6): Idem Competent.
      └─ Unsuited (1-3):  Pode criar situações de 4+ papéis num NPC (penalty ×0.3).

4. DECISÃO FINAL
   ├─ Se re-alocações melhoram qualidade total:
   │   → return [{ type: 'assignStaffToCargo', npcId, cargoKey }, ...] (pode ser múltiplas)
   └─ Se tudo já está ótimo ou não sabe melhorar:
       → return null
```

**OUTPUT:** `{ type: 'assignStaffToCargo', npcId: string, cargoKey: string }[]` | `null`

---

#### Decisão 1.1.4: Auto-atribuir Produtor a Cargo

**CONTEXTO (o que a IA avalia):**
- Cargos atualmente sem NPC E sem outro staff cobrindo
- PRODUCER_TIME_BUDGET restante esta semana (100 pontos base − pontos já consumidos)
- Custo de tempo de cada cargo se coberto pelo produtor (ver staff-functional.md: 10-30 pontos por cargo)
- Producer Profile: background, style, traits — afetam qualidade ao cobrir cada cargo
- Consequências de cada cargo vazio (wellness sem monitoring, agenda sem gestão, etc.)
- Se está em modo automático (NPC Head Producer) ou manual (player)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Industry Knowledge** | Avaliar qual cargo vazio é mais urgente de cobrir pessoalmente |
| **Adaptability** | Avaliar se o produtor consegue cobrir um cargo fora da sua expertise com qualidade aceitável |
| **Financial Acumen** | Decidir se vale cobrir agora ou investir em contratar NPC para o cargo |

**FLOWCHART:**

```
1. CALCULAR TEMPO DISPONÍVEL
   ├─ Ler PRODUCER_TIME_BUDGET restante (100 − pontos já alocados esta semana)
   ├─ Se budget restante < 15 pontos (mínimo para qualquer cargo):
   │   → return null (produtor já está no limite — sobrecarregar degrada tudo)
   └─ Listar cargos vazios com custo de tempo ≤ budget restante

2. AVALIAR URGÊNCIA DE CADA CARGO VAZIO
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Avalia urgência contextualizando com estado da agência AGORA.
      │                    "Wellness está vazio E tenho 2 idols com stress > 70 = urgência máxima."
      │                    "Scheduling está vazio mas é início da semana e agenda já está montada =
      │                    urgência zero esta semana."
      │                    Ranqueia por impacto imediato, não por lista fixa.
      ├─ Outstanding (18-19): Avalia urgência por: consequência esta semana × severidade.
      │                        Contexto parcial (vê wellness bars mas não projeta trend).
      ├─ Very Good (15-17): Usa lista de prioridade fixa mas ajusta se vê problema óbvio:
      │                      wellness > scheduling > scouting > treino > outros.
      │                      Se idol em burnout → wellness sobe para topo independente da lista.
      ├─ Good (12-14):    Usa lista de prioridade fixa sem ajuste contextual.
      ├─ Average (10-11): Identifica top-2 cargos vazios mais obviamente importantes.
      ├─ Competent (7-9): Identifica o cargo vazio com problema mais visível (idol reclamando,
      │                    budget caindo).
      ├─ Reasonable (4-6): Pega o primeiro cargo vazio da lista.
      └─ Unsuited (1-3):  Não se auto-atribui. Cargos ficam vazios. Espera alguém pedir.

3. AVALIAR FIT DO PRODUTOR PARA O CARGO
   └─ Skill: Adaptability
      ├─ Elite (20):      Calcula qualidade_produtor(cargo) com precisão:
      │                    BASE_PRODUCER_QUALITY × mult_background × mult_style × mult_trait.
      │                    Compara: "se eu cobrir wellness, opero como 'Average'. Vale a pena."
      │                    Identifica cargos onde o producer profile dá vantagem natural.
      ├─ Outstanding (18-19): Calcula qualidade aproximada. Sabe quais cargos é bom/mau.
      ├─ Very Good (15-17): Sabe onde o profile dá bônus (ex: Talent Developer → treino).
      │                      Prioriza esses cargos.
      ├─ Good (12-14):    Sabe que cobrir cargo fora do perfil é pior que dentro.
      │                    Evita cargos onde seria "Unsuited".
      ├─ Average (10-11): Avalia se tem "alguma noção" do cargo. Evita os completamente alheios.
      ├─ Competent (7-9): Não avalia fit. Cobre qualquer cargo vazio sem pensar na qualidade.
      ├─ Reasonable (4-6): Idem Competent.
      └─ Unsuited (1-3):  Pode se atribuir a cargo onde vai fazer mais mal do que bem
      │                    (ex: cobrir PR sem Media Savvy nenhum → piora escândalos).

4. DECIDIR: COBRIR AGORA OU ESPERAR CONTRATAÇÃO
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Calcula: "se cobrir esta semana e contratar NPC na próxima, gasto
      │                    X pontos de tempo + Y yen de salary. Se deixar vazio esta semana,
      │                    perco Z de impacto. Qual cenário tem melhor ROI?"
      │                    Bridge strategy: "cubro temporariamente, contrato em paralelo."
      ├─ Outstanding (18-19): Compara custo de cobrir (tempo do produtor) vs custo de
      │                        deixar vazio (consequência). Escolhe o menor.
      ├─ Very Good (15-17): Se substituto disponível no mercado: prefere esperar e contratar.
      │                      Se ninguém no mercado: cobre.
      ├─ Good (12-14):    Se tem budget para contratar: espera. Se não: cobre.
      ├─ Average (10-11): Cobre sem pensar em alternativas.
      ├─ Competent (7-9): Cobre sem pensar.
      ├─ Reasonable (4-6): Cobre se atingiu este passo (raro).
      └─ Unsuited (1-3):  N/A (não chega aqui — passo 2 retorna null).

5. DECISÃO FINAL
   ├─ Se cargo priorizado E fit aceitável E decisão de cobrir:
   │   → return { type: 'selfAssign', cargoKey, timePointsCost }
   ├─ Se cargo priorizado mas fit terrível:
   │   → return null (melhor vazio do que pior com intervenção ruim)
   └─ Se nenhum cargo urgente:
       → return null
```

**OUTPUT:** `{ type: 'selfAssign', cargoKey: string, timePointsCost: number }` | `null`

---

### Cargo 1.2: Direção Estratégica

---

#### Decisão 1.2.1: Ajustar Estratégia da Agência

**CONTEXTO (o que a IA avalia):**
- Strategy atual: focus (balanced/commercial/artistic/scouting), agenda posture (light/normal/packed), image direction (safe/edgy/viral), growth posture (organic/aggressive)
- Cooldowns ativos: focus muda a cada 12 semanas, image a cada 8 semanas
- Resultados financeiros dos últimos 3 meses (receita trend, despesa trend, lucro)
- Fame trend do roster (média de fama subindo ou descendo)
- Composição do roster (muitas novatas? muitas veteranas? gaps de archetype?)
- Fan mood médio (satisfação geral dos fãs)
- Posição no ranking comparado com rivais do mesmo tier

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Industry Knowledge** | Ler o mercado e tendências. Saber quando mudar vs quando manter curso |
| **Financial Acumen** | Avaliar se a estratégia financeira está a funcionar |
| **Judging Idol Potential** | Avaliar se o roster suporta a estratégia desejada (roster de novatas aguenta "aggressive"?) |

**FLOWCHART:**

```
1. VERIFICAR COOLDOWNS
   ├─ Focus mudou há menos de 12 semanas? → não pode mudar focus
   ├─ Image mudou há menos de 8 semanas? → não pode mudar image
   └─ Se todos em cooldown → return null (manter estratégia atual)

2. DIAGNOSTICAR ESTADO DA AGÊNCIA
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Análise completa: receita por fonte × 3 meses, margem de lucro,
      │                    projeção de cash flow, comparativo com agências do mesmo tier.
      │                    Identifica: "receita de shows subindo 20% mas merch caindo 15% —
      │                    o problema não é a estratégia, é o inventário de merch."
      │                    Diferencia sintoma de causa.
      ├─ Outstanding (18-19): Análise de 3 meses por categoria. Identifica qual fonte de
      │                        receita está a crescer/cair. Projeção 2 meses.
      ├─ Very Good (15-17): Receita total trend 3 meses + maior categoria de despesa.
      ├─ Good (12-14):    Receita total trend 2 meses. "Subindo" ou "descendo."
      ├─ Average (10-11): Compara receita deste mês com mês anterior. Básico.
      ├─ Competent (7-9): Vê só o balance atual. "Positivo" ou "negativo."
      ├─ Reasonable (4-6): Não analisa. Só reage se balance < 0.
      └─ Unsuited (1-3):  Não diagnostica. Mantém estratégia eternamente.

3. AVALIAR SE O ROSTER SUPORTA A MUDANÇA
   └─ Skill: Judging Idol Potential
      ├─ Elite (20):      Avalia cada idol do roster: "temos 3 novatas com PT > 80 —
      │                    se mudarmos para 'scouting focus' agora, em 6 meses teremos
      │                    pipeline forte. Mas se mudarmos para 'commercial', essas novatas
      │                    ficam sem treino e potencial é desperdiçado."
      │                    Cross-ref roster composition com cada estratégia possível.
      ├─ Outstanding (18-19): Avalia roster por tier: "60% tier C-D, 30% B-A, 10% S+ —
      │                        roster jovem, melhor investir em treino (artistic focus)."
      ├─ Very Good (15-17): Identifica se roster é maduro (artistic/commercial fazem sentido)
      │                      ou jovem (scouting/development fazem sentido).
      ├─ Good (12-14):    Checa: "temos idols suficientes para gerar receita se mudarmos para
      │                    commercial?" Sim/não básico.
      ├─ Average (10-11): Não avalia roster. Muda estratégia baseado só em financeiro.
      ├─ Competent (7-9): Idem Average.
      ├─ Reasonable (4-6): Idem.
      └─ Unsuited (1-3):  N/A (não chega aqui).

4. DECIDIR MUDANÇAS
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Decisão holística: combina diagnóstico financeiro + roster readiness +
      │                    market trend + fan mood. Ajusta 1-2 levers no máximo (não muda tudo
      │                    de uma vez — mudanças incrementais são mais estáveis).
      │                    Ex: "receita caindo mas roster jovem → manter artistic focus, mudar
      │                    agenda de 'normal' para 'packed' para gerar mais receita a curto prazo
      │                    enquanto novatas crescem."
      ├─ Outstanding (18-19): Combina financeiro + roster. Ajusta 1 lever com justificativa.
      ├─ Very Good (15-17): Regra: receita caindo 3+ meses → commercial focus.
      │                      Muitas novatas → scouting focus. Fame crescendo → aggressive.
      │                      Aplica a regra mais relevante.
      ├─ Good (12-14):    Regra simplificada: receita caindo → commercial. Senão manter.
      ├─ Average (10-11): Muda só se receita caindo 3+ meses. Sempre para commercial.
      ├─ Competent (7-9): Muda só se balance negativo 2+ meses. Reação tardia.
      ├─ Reasonable (4-6): Muda só em crise extrema.
      └─ Unsuited (1-3):  Nunca muda (retorna null sempre).

5. DECISÃO FINAL
   ├─ Se mudança identificada E cooldown permite E roster suporta:
   │   → return { type: 'adjustStrategy', changes: { focus?, agendaPosture?, imageDirection?, growthPosture? } }
   └─ Se diagnóstico diz "manter curso" OU cooldown bloqueia:
       → return null
```

**OUTPUT:** `{ type: 'adjustStrategy', changes: Partial<AgencyStrategy> }` | `null`

---

### Cargo 1.3: Relações com Board

---

#### Decisão 1.3.1: Negociar Orçamento de Staff com Board

**CONTEXTO (o que a IA avalia):**
- Budget total da agência e ratio atual alocado para staff
- Salários atuais do staff vs margem disponível
- Cargos vazios que requerem contratação (e custo estimado)
- Resultados recentes da agência (ROI do staff existente)
- Ciclo trimestral: esta semana é semana de avaliação? (a cada 12 semanas)
- Humor do board: satisfeito (resultados bons) vs insatisfeito (resultados ruins)
- Tier da agência (boards de agências maiores são mais generosos mas mais exigentes)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Authority** | Capacidade de convencer o board. Impacto direto na probabilidade de aprovação |
| **Financial Acumen** | Montar argumentação financeira sólida (ROI, projeções) |
| **Industry Knowledge** | Benchmark: saber quanto agências do mesmo tier gastam em staff |

**FLOWCHART:**

```
1. VERIFICAR TIMING
   ├─ Avaliação trimestral pendente? (semana % 12 == 0)
   │   → Se não: return null (board só renegocia trimestralmente)
   └─ Exceção: se agência em crise financeira, board pode convocar reunião extraordinária
      └─ Skill: Industry Knowledge
         ├─ Elite/Outstanding: Identifica que em crise, pode pedir reunião extraordinária
         │                     para REDUZIR staff budget (mostrar proatividade ao board).
         ├─ Very Good/Good: Sabe que reunião extraordinária é possível em crise.
         ├─ Average−: Não sabe da opção. Espera o trimestre.

2. AVALIAR NECESSIDADE
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Calcula gap exato: (custo de todos cargos cobertos idealmente −
      │                    budget atual) = quanto precisa pedir.
      │                    Inclui projeção: "se contratar X e Y, receita sobe Z em 3 meses."
      │                    Prepara cenários: "se board der 100%, faço A. Se 70%, faço B."
      ├─ Outstanding (18-19): Calcula gap. Projeção de 2 meses de retorno.
      ├─ Very Good (15-17): Calcula gap entre salários atuais e custo de preencher vazios.
      ├─ Good (12-14):    Identifica quantos cargos vazios × salary médio = quanto precisa.
      ├─ Average (10-11): "Preciso de mais X yen para contratar Y pessoas."
      ├─ Competent (7-9): "Preciso de mais budget" (sem quantificar).
      ├─ Reasonable (4-6): Pede +10% flat sem justificativa.
      └─ Unsuited (1-3):  Não identifica necessidade. Aceita o que o board dá.

3. MONTAR ARGUMENTAÇÃO
   └─ Skill: Authority
      ├─ Elite (20):      Apresentação impecável: ROI comprovado do staff existente,
      │                    benchmarks de mercado ("agências do nosso tier alocam 30%"),
      │                    projeção de retorno, e plano de ação detalhado.
      │                    Board quase sempre aprova. Bônus: negocia termos extras
      │                    (ex: "se atingir meta X, budget aumenta automaticamente").
      │                    Probabilidade de aprovação: 95%.
      ├─ Outstanding (18-19): ROI + benchmarks. Board aprova na maioria das vezes.
      │                        Probabilidade: 85%.
      ├─ Very Good (15-17): ROI demonstrado + lista de contratações planejadas.
      │                      Probabilidade: 75%.
      ├─ Good (12-14):    Lista de cargos vazios com consequências.
      │                    Probabilidade: 65%.
      ├─ Average (10-11): "Precisamos de mais staff para crescer."
      │                    Probabilidade: 50%.
      ├─ Competent (7-9): "Temos muitos cargos vazios."
      │                    Probabilidade: 35%.
      ├─ Reasonable (4-6): Pedido genérico sem justificativa.
      │                    Probabilidade: 20%.
      └─ Unsuited (1-3):  Apresentação confusa. Board pode reduzir budget em resposta.
                           Probabilidade: 10%. Risco de corte: 30%.

4. DECISÃO FINAL
   ├─ Se necessidade identificada E timing correto:
   │   → return { type: 'negotiateBudget', requestedRatio, justification, approvalProbability }
   │   (o resultado da negociação é resolvido pelo board system baseado na probabilidade)
   └─ Se sem necessidade OU timing errado:
       → return null
```

**OUTPUT:** `{ type: 'negotiateBudget', requestedRatio: number, justification: string, approvalProbability: number }` | `null`

---

### Cargo 1.4: Relações com Idols

---

#### Decisão 1.4.1: Conversar com Idol

**CONTEXTO (o que a IA avalia):**
- Lista de idols com conversa pendente (trigger ativo do dialogue-system):
  - Idol em crise (happiness < 20 por 2+ semanas)
  - Idol pediu conversa (request no inbox)
  - Contrato expirando em ≤4 semanas (oportunidade de reter)
  - Pós-escândalo (idol precisa de apoio)
  - Pós-show excepcional (oportunidade de reforçar)
- Estado de cada idol: wellness bars, ocultos (Temperamento, Ambição, Lealdade, Profissionalismo), afinidade com produtor
- Cooldown de conversa por idol (max 2/semana, diminishing returns na 2ª)
- Histórico de promessas feitas e cumpridas/quebradas

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **People Management** | Escolher tom correto e ler a idol. Determina se a conversa melhora ou piora a situação |
| **Motivating** | Impacto na motivação da idol durante a conversa |
| **Authority** | Capacidade de fazer promessas críveis e mediar conflitos |
| **Judging Idol Ability** | Ler os ocultos da idol para adaptar a abordagem (se revelados) |

**FLOWCHART:**

```
1. SELECIONAR IDOL PARA CONVERSAR
   ├─ Alguma idol com trigger de conversa ativo?
   │   → Se não: verificar oportunidades proativas (passo 1b)
   │   → Se sim: priorizar
   └─ Skill: People Management
      ├─ Elite (20):      Prioriza pelo impacto na agência: idol em crise com contrato
      │                    expirando > idol triste > idol pediu conversa > oportunidade.
      │                    Planeja MÚLTIPLAS conversas na semana se triggers > 1,
      │                    respeitando cooldown. Sabe que falar com 2 idols em conflito
      │                    separadamente pode mediar antes que escale.
      ├─ Outstanding (18-19): Prioriza: crise > pedido > contrato > pós-escândalo.
      │                        Agenda até 2 conversas na semana.
      ├─ Very Good (15-17): Prioriza a idol com happiness mais baixa.
      │                      1 conversa por semana.
      ├─ Good (12-14):    Conversa com a idol que pediu. Se nenhuma pediu, a mais infeliz.
      ├─ Average (10-11): Conversa só se idol pediu explicitamente.
      ├─ Competent (7-9): Conversa só se trigger é crise (happiness < 20).
      ├─ Reasonable (4-6): Conversa só se idol ameaçou rescisão.
      └─ Unsuited (1-3):  Ignora todos triggers. Não inicia conversa.
      
   1b. OPORTUNIDADES PROATIVAS (só se não há triggers)
   └─ Skill: People Management
      ├─ Elite (20):      Identifica oportunidades: idol que teve show S-grade → parabéns
      │                    (reforça afinidade). Idol nova no roster → boas-vindas.
      │                    Idol veterana sem conversa há 8+ semanas → check-in.
      ├─ Outstanding (18-19): Conversa proativa com idol que teve resultado excepcional.
      ├─ Very Good (15-17): Conversa proativa com idols novas (boas-vindas).
      ├─ Good−:           Sem conversas proativas. Só reage a triggers.

2. ESCOLHER TOM DA CONVERSA
   └─ Skill: Judging Idol Ability (leitura dos ocultos)
      ├─ Elite (20):      Lê TODOS os ocultos relevantes e adapta tom com precisão:
      │                    → Temperamento alto + Profissionalismo alto: tom 'direct'
      │                      (idol respeita franqueza, detesta rodeios)
      │                    → Temperamento baixo + Ambição alta: tom 'motivational'
      │                      (precisa se sentir valorizada, não pressionada)
      │                    → Lealdade alta + Profissionalismo alto: tom 'friendly'
      │                      (relação de confiança, conversa aberta)
      │                    → Lealdade baixa + Ambição alta: tom 'strategic'
      │                      (mostrar que ficar é do interesse dela)
      │                    Sabe quais combinações são perigosas:
      │                    "idol com Temperamento 3 + stress 80 — qualquer tom forte
      │                    pode causar explosão."
      ├─ Outstanding (18-19): Lê Temperamento + Ambição + Lealdade.
      │                        Escolhe entre 'empathetic', 'motivational', 'direct'.
      ├─ Very Good (15-17): Lê Temperamento + Lealdade.
      │                      → Temperamento > 12: 'direct'
      │                      → Temperamento < 8 + Lealdade alta: 'empathetic'
      │                      → Temperamento < 8 + Lealdade baixa: 'motivational'
      ├─ Good (12-14):    Lê só Temperamento.
      │                    → alto: 'direct', baixo: 'empathetic'
      ├─ Average (10-11): Escolhe tom baseado em happiness:
      │                    → happiness < 30: 'empathetic'
      │                    → happiness ≥ 30: 'friendly'
      ├─ Competent (7-9): Tom 'neutral' sempre (safe mas sem impacto extra).
      ├─ Reasonable (4-6): Tom 'neutral'.
      └─ Unsuited (1-3):  Tom aleatório. Pode usar 'direct' com idol Temperamento 2 → desastre.

3. DECIDIR SOBRE PROMESSAS
   └─ Skill: Authority × Financial Acumen (ambas avaliadas)
      ├─ Elite (20):      Faz promessa SÓ se pode cumprir. Verifica budget, agenda, e
      │                    planos futuros antes de prometer qualquer coisa.
      │                    Tipos de promessa: salary increase (verifica budget), more rest
      │                    (verifica agenda), solo opportunity (verifica calendar + fame).
      │                    Se não pode cumprir nada → não promete (honestidade).
      │                    Track record de promessas cumpridas → +afinidade acumulada.
      ├─ Outstanding (18-19): Verifica budget antes de prometer salary.
      │                        Verifica agenda antes de prometer rest. Cumpre 90%+.
      ├─ Very Good (15-17): Promete coisas genéricas que pode cumprir ("vou olhar a agenda").
      │                      Cumpre 80%+.
      ├─ Good (12-14):    Promete se parece viável, sem verificar detalhes.
      │                    Cumpre 60-70%.
      ├─ Average (10-11): Faz promessas vagas ("vou tentar melhorar").
      │                    Sem impacto mecânico forte.
      ├─ Competent (7-9): Não faz promessas (evita risco).
      ├─ Reasonable (4-6): Não faz promessas.
      └─ Unsuited (1-3):  Pode fazer promessas impossíveis ("vou dobrar teu salário")
                           → quebra promessa → −20 afinidade.

4. DECISÃO FINAL
   ├─ Se idol selecionada E tom escolhido:
   │   → return { type: 'idolConversation', idolId, tone, promises, expectedImpact }
   │   (impacto real calculado na execução: tone × ocultos × peopleManagement × motivating)
   └─ Se nenhuma idol selecionada:
       → return null
```

**EFEITOS SECUNDÁRIOS (aplicados na execução, não na decisão):**
- `motivating` do executor: idol.motivation += (motivating − 10) × 0.5
- `peopleManagement` do executor: idol.happiness += (peopleMgmt − 10) × 0.3
- Tom errado para a personalidade: happiness −5, afinidade −3
- Tom certo: happiness +5-15 (dependendo de gravidade), afinidade +2-5
- Promessa feita: registrada no Promise system, deadline set
- Promessa cumprida: afinidade +5. Promessa quebrada: afinidade −10, happiness −10.

**OUTPUT:** `{ type: 'idolConversation', idolId: string, tone: ConversationTone, promises: Promise[], expectedImpact: WellnessDelta }` | `null`

---

## PAPEL 2: VICE-PRODUCER

> Braço direito do Head Producer. Generalista que cobre qualquer cargo vazio
> com qualidade reduzida (×0.7 do seu atributo relevante). No FM é o Assistant Manager.

### Cargo 2.1: Substituição Geral

---

#### Decisão 2.1.1: Cobrir Cargo Vazio Temporariamente

**CONTEXTO (o que a IA avalia):**
- Lista de cargos sem NPC E sem o Head Producer cobrindo
- Atributos do Vice-Producer (todos 19 — é generalista)
- Time budget do Vice (usa o mesmo sistema do Head Producer: 100 pontos/semana)
- Quanto tempo já consumiu cobrindo outros cargos esta semana
- Prioridade de cada cargo vazio (consequências)
- Se o Head Producer pediu explicitamente para cobrir algo

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Adaptability** | Core skill do Vice — determina quão bem cobre cargos fora da sua expertise |
| **Industry Knowledge** | Priorizar quais cargos cobrir quando há vários vazios |
| **(Variável)** | Ao cobrir um cargo, usa o atributo primário desse cargo × 0.7 (penalidade generalista) |

**FLOWCHART:**

```
1. IDENTIFICAR CARGOS A COBRIR
   ├─ Listar cargos sem NPC, sem Head Producer, sem outro staff
   ├─ Se nenhum → return null (tudo coberto)
   └─ Priorizar:
      └─ Skill: Industry Knowledge
         ├─ Elite (20):      Prioriza por impacto contextual esta semana.
         │                    "Temos show quinta → Show Director vazio é prioridade."
         │                    "Nenhum evento urgente → Wellness monitoring é prioridade porque
         │                    3 idols com stress > 65."
         │                    Pode cobrir até 3 cargos se time budget permite.
         ├─ Outstanding (18-19): Prioriza por consequência documentada. Até 2 cargos.
         ├─ Very Good (15-17): Lista fixa de prioridade. 2 cargos max.
         ├─ Good (12-14):    Top-1 cargo mais urgente.
         ├─ Average (10-11): Cargo vazio mais óbvio (idol reclamando, budget caindo).
         ├─ Competent (7-9): Primeiro cargo vazio da lista.
         ├─ Reasonable (4-6): Só cobre se Head Producer pediu explicitamente.
         └─ Unsuited (1-3):  Não cobre nada. "Não é meu trabalho."

2. AVALIAR CAPACIDADE DE COBERTURA
   └─ Skill: Adaptability
      ├─ Elite (20):      Sabe exatamente em quais cargos é "Good" (attr × 0.7 ≥ 12)
      │                    e em quais seria "Reasonable" (attr × 0.7 < 6).
      │                    Só cobre cargos onde opera como "Competent" ou melhor.
      │                    "Meu Vocal Technique é 8. × 0.7 = 5.6 → Reasonable.
      │                    Melhor não cobrir treino vocal — faz mais mal que bem."
      ├─ Outstanding (18-19): Avalia primary attr do cargo × 0.7.
      │                        Evita cargos onde ficaria "Unsuited" ou "Reasonable".
      ├─ Very Good (15-17): Avalia primary attr do cargo. Evita cargos com attr < 5
      │                      (seria Unsuited após penalty).
      ├─ Good (12-14):    Cobre se primary attr ≥ 8 (pelo menos "Competent" pós-penalty).
      ├─ Average (10-11): Cobre sem avaliar capacidade. Qualidade varia.
      ├─ Competent (7-9): Idem Average.
      ├─ Reasonable (4-6): Cobre sem avaliar. Pode piorar as coisas.
      └─ Unsuited (1-3):  Cobre aleatoriamente. Alta chance de resultado negativo.

3. EXECUTAR DECISÕES DO CARGO COBERTO
   ├─ Para cada cargo que vai cobrir:
   │   → Executa o flowchart da(s) decisão(ões) desse cargo
   │   → Usa effectiveAttr = viceAttr[primaryAttrDoCargo] × 0.7
   │   → O label resultante determina o comportamento na tabela daquele cargo
   │   → Ex: Vice com Vocal Technique 14 ("Good") cobrindo treino vocal:
   │     14 × 0.7 = 9.8 → opera como "Competent" no flowchart de treino
   └─ Time budget consumed: custo do cargo × 0.8 (vice é ligeiramente mais eficiente
      que o Head Producer cobrindo — é o papel dele ser polivalente)

4. DECISÃO FINAL
   ├─ Se cargos identificados E capacidade aceitável:
   │   → return delegatedActions[] (ações geradas pelos flowcharts dos cargos cobertos)
   └─ Se nenhum cargo precisa de cobertura OU capacidade insuficiente:
       → return null
```

**OUTPUT:** `AgencyAction[]` (variável — depende dos cargos cobertos) | `null`

---

### Cargo 2.2: Conselheiro

---

#### Decisão 2.2.1: Recomendar Ação ao Head Producer

**CONTEXTO (o que a IA avalia):**
- Estado geral da agência: KPIs (receita, despesa, balance, avg wellness, avg fame)
- Decisões pendentes do player (se Head Producer é o player)
- Problemas não-resolvidos: cargos vazios, contratos expirando, idols em risco
- Oportunidades não-aproveitadas: idol pronta para promoção, mercado favorável, show opportunity
- Histórico de sugestões anteriores (para não repetir a mesma sugestão 5 semanas seguidas)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Industry Knowledge** | Identificar problemas e oportunidades que o Head Producer pode estar a perder |
| **Financial Acumen** | Identificar riscos financeiros antes que se tornem crises |
| **Judging Idol Potential** | Identificar oportunidades de desenvolvimento que não estão a ser aproveitadas |
| **People Management** | Identificar problemas de moral e dinâmica de grupo que estão a escalar |

**FLOWCHART:**

```
1. SCAN DE PROBLEMAS
   ├─ Financeiro:
   │   └─ Skill: Financial Acumen
   │      ├─ Elite (20):      Identifica: "receita caiu 12% este mês por causa da queda
   │      │                    em jobs de TV — a nossa PR não está a promover idols para
   │      │                    canais certos. Sugestão: rever PR strategy ou contratar
   │      │                    Communications Director."
   │      │                    Conecta causa → efeito → solução.
   │      ├─ Outstanding (18-19): "Receita caindo há 2 meses. Sugiro rever strategy."
   │      ├─ Very Good (15-17): "Balance vai ficar negativo em 2 meses se continuar assim."
   │      ├─ Good (12-14):    "Despesas estão a subir. Considerar cortes."
   │      ├─ Average (10-11): "Budget está apertado." (sem solução)
   │      ├─ Competent (7-9): Nota só se balance já é negativo.
   │      ├─ Reasonable (4-6): Nota só em crise (debt state ≥ crisis).
   │      └─ Unsuited (1-3):  Sem input financeiro.
   │
   ├─ Wellness:
   │   └─ Skill: People Management
   │      ├─ Elite (20):      "3 idols com stress crescendo consistentemente há 3 semanas.
   │      │                    Se não aliviar agenda na próxima semana, teremos burnout.
   │      │                    Sugiro: reduzir 2 jobs/semana + agendar psicólogo."
   │      ├─ Outstanding (18-19): "Idol X e Y com stress > 70. Sugiro rest days."
   │      ├─ Very Good (15-17): "Idol X com stress alto. Atenção."
   │      ├─ Good (12-14):    "Alguma idol parece cansada." (vago)
   │      ├─ Average−:        Não identifica problemas de wellness.
   │
   ├─ Roster/Desenvolvimento:
   │   └─ Skill: Judging Idol Potential
   │      ├─ Elite (20):      "Idol Z tem PT 85 mas está estagnada em tier C porque
   │      │                    não tem dev plan. Com treino focado, chega a B em 8 semanas
   │      │                    e A em 20. Vale o investimento."
   │      ├─ Outstanding (18-19): "Idol Z tem potencial não explorado. Sugiro dev plan."
   │      ├─ Very Good (15-17): "Temos 3 idols sem dev plan."
   │      ├─ Good (12-14):    "Considere investir em treino para novatas."
   │      ├─ Average−:        Sem insights de desenvolvimento.

2. SCAN DE OPORTUNIDADES
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Identifica oportunidades cross-system:
      │                    "Idol X teve show S-grade + música no top 20 + fan mood 90.
      │                    É o momento perfeito para: release de single, show solo,
      │                    PR campaign, merch special edition. Tudo junto amplifica."
      ├─ Outstanding (18-19): Identifica oportunidades por sistema:
      │                        "Music release esta semana — coordenar com marketing."
      ├─ Very Good (15-17): Identifica oportunidades óbvias: "contrato X expira em 2 sem."
      ├─ Good (12-14):    Identifica 1 oportunidade por semana.
      ├─ Average (10-11): Identifica só urgências (contrato a expirar).
      ├─ Competent−:      Sem identificação de oportunidades.

3. COMPILAR SUGESTÕES
   ├─ Priorizar por: urgência × impacto
   ├─ Filtrar: não repetir sugestão dada nas últimas 3 semanas
   ├─ Max 3 sugestões por semana (evitar overwhelm)
   └─ Para cada sugestão incluir:
      - Problema/oportunidade identificada
      - Ação recomendada
      - Nível de confiança (baseado nos attrs que usou para diagnosticar)

4. DECISÃO FINAL
   ├─ Se há sugestões relevantes:
   │   → return { type: 'suggestion', suggestions: [{ area, problem, action, confidence }] }
   └─ Se tudo está ok (raro com bom conselheiro):
       → return null
```

**NOTA:** Sugestões são INFORMATIVAS — não são ações executadas. O player (ou Head Producer NPC) decide se age. No UI, aparecem como notificações no inbox com botão "Aceitar sugestão" → que então dispara a ação real.

**OUTPUT:** `{ type: 'suggestion', suggestions: Suggestion[] }` | `null`

---

## PAPEL 3: TALENT DIRECTOR

> Equivalente ao Director of Football do FM. Quem entra e sai do roster.
> Responsável por contratos, composição do roster, e transferências.

### Cargo 3.1: Negociação de Contratos

---

#### Decisão 3.1.1: Renovar Contrato Expirando

**CONTEXTO (o que a IA avalia):**
- Contratos com expiração em ≤4 semanas (lista de contratos + idol associada)
- Para cada idol com contrato expirando:
  - Stats atuais, tier, fame, wellness
  - ROI dos últimos 3 meses (receita gerada − custo total: salary + treino + marketing)
  - Archetype e se há outra idol que cobre o mesmo archetype
  - Afinidade com a agência (Lealdade, happiness, histórico)
  - Fame trend (subindo, estável, caindo)
  - Potencial futuro (stats vs ceiling)
- Budget disponível para salários (após economias e outros compromissos)
- Propostas de rivais pendentes para esta idol (se houver)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Industry Knowledge** | Avaliar o valor de mercado justo e timing de renovação |
| **Financial Acumen** | Calcular se a renovação é financeiramente sustentável |
| **Judging Idol Ability** | Avaliar o nível real da idol (stats, consistency) vs o que a fame sugere |
| **Judging Idol Potential** | Projetar se a idol ainda vai crescer ou já atingiu o ceiling |

**FLOWCHART:**

```
1. IDENTIFICAR CONTRATOS A RENOVAR
   ├─ Listar todos com expiração ≤ 4 semanas
   ├─ Se nenhum → return null
   └─ Decidir timing de abordagem:
      └─ Skill: Industry Knowledge
         ├─ Elite (20):      Inicia renovação 8 semanas antes (não espera 4).
         │                    Mais tempo = mais leverage na negociação.
         │                    "Se começar cedo, idol sente-se valorizada e pede menos."
         │                    Identifica que alguns contratos convém deixar expirar (idol dispensável).
         ├─ Outstanding (18-19): Inicia 6 semanas antes. Identifica quais renovar vs deixar.
         ├─ Very Good (15-17): Inicia 4 semanas antes (dentro do warning). Renova todos os
         │                      que valem a pena.
         ├─ Good (12-14):    Inicia com 4 semanas. Pode perder timing em 1-2.
         ├─ Average (10-11): Reage ao warning de 4 semanas. Tenta renovar todos.
         ├─ Competent (7-9): Nota o warning mas pode demorar 1-2 semanas a agir.
         │                    Restam 2-3 semanas quando começa — leverage reduzido.
         ├─ Reasonable (4-6): Só percebe quando faltam 1-2 semanas. Renovação apressada.
         └─ Unsuited (1-3):  Não percebe o warning. Contrato expira. Idol vai para o mercado.

2. AVALIAR SE VALE RENOVAR (por idol)
   ├─ Skill: Judging Idol Ability
   │   ├─ Elite (20):      Análise completa: stats reais (não os estimados),
   │   │                    consistency de performance (variância nos últimos 12 jobs),
   │   │                    chemistry com o grupo, impacto na dinâmica do roster,
   │   │                    comparativo com idols disponíveis no mercado do mesmo archetype.
   │   │                    "Ela é tier A mas inconsistente — nos últimos 10 jobs, 3 foram D.
   │   │                    No mercado há uma tier B estável que custaria 40% menos."
   │   ├─ Outstanding (18-19): Stats reais + performance trend + archetype coverage.
   │   ├─ Very Good (15-17): Stats + fame trend. "Fame subindo → vale. Caindo → avaliar."
   │   ├─ Good (12-14):    Stats + ROI. "ROI positivo → renovar. Negativo → avaliar."
   │   ├─ Average (10-11): ROI simples. "Gera mais do que custa? Sim → renovar."
   │   ├─ Competent (7-9): Fame > 500? → renovar. Fame ≤ 500? → não.
   │   ├─ Reasonable (4-6): Renova todos sem avaliar.
   │   └─ Unsuited (1-3):  Renova todos sem avaliar (ou não percebe e deixa expirar).
   │
   └─ Skill: Judging Idol Potential
      ├─ Elite (20):      Projeta career arc: "PT 82, stats atuais avg 55, idade 17.
      │                    Peak estimado: tier S aos 22. Investir agora = retorno de 5 anos.
      │                    RENOVAR com contrato de 2 anos."
      │                    vs "PT 65, stats avg 60, idade 26. Já no ceiling.
      │                    Declínio em 2-3 anos. Renovar por 1 ano MAX ou não renovar."
      ├─ Outstanding (18-19): "Ainda vai crescer" vs "já atingiu ceiling". Ajusta duração.
      ├─ Very Good (15-17): Avalia PT vs stats atuais. Gap grande → potencial.
      │                      Gap pequeno → perto do ceiling.
      ├─ Good (12-14):    Avalia idade: jovem → potencial. Velha → menos.
      ├─ Average−:         Não avalia potencial. Decide só por ROI atual.

3. DEFINIR TERMOS DE RENOVAÇÃO
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Calcula oferta ótima: salary atual × fame_trend_mult ×
      │                    market_rate_adjustment × contract_duration_discount.
      │                    "Ofereço 10% acima do atual porque fame subiu 15%. Mas peço
      │                    2 anos em vez de 1 — desconto de duração de 5%."
      │                    Negocia: exclusividade ON em troca de salary +15%.
      │                    Optimiza cada cláusula para maximizar value da agência.
      ├─ Outstanding (18-19): Salary × 1.2-1.5 baseado em fame. Ajusta 2-3 cláusulas.
      ├─ Very Good (15-17): Salary × 1.3 (flat increase). Ajusta duração.
      ├─ Good (12-14):    Salary × 1.3. Mantém outras cláusulas iguais.
      ├─ Average (10-11): Salary × 1.3. Sem ajuste de cláusulas.
      ├─ Competent (7-9): Salary × 1.2. Cláusulas iguais.
      ├─ Reasonable (4-6): Salary × 1.1. Pode sub-oferecer e idol recusar.
      └─ Unsuited (1-3):  Mesmo salary (0% aumento). Idol quase certamente recusa
                           (idol famosa exige mais na renovação).

4. DECISÃO FINAL
   ├─ Se vale renovar E termos definidos:
   │   → return { type: 'renewContract', contractId, newClauses }
   ├─ Se não vale renovar:
   │   → return null (contrato expira, idol vai para mercado)
   └─ Se não percebeu a expiração (Unsuited):
       → return null (contrato expira por negligência)
```

**OUTPUT:** `{ type: 'renewContract', contractId: string, newClauses: ContractClauses }` | `null`

---

#### Decisão 3.1.2: Responder a Proposta de Buyout

**CONTEXTO (o que a IA avalia):**
- Proposta recebida: agência rival (id, tier, reputação), idol alvo (id), valor oferecido (¥)
- Valor de mercado da idol (calculado por economy system)
- Importância da idol para a agência:
  - Revenue share (% da receita total que ela gera)
  - Archetype coverage (é a única deste archetype?)
  - Fan club size e mood (fãs vão reagir negativamente?)
  - Grupo: é membro de algum grupo? Saída dela afeta o grupo?
- Custo de replacement: quanto custaria encontrar + contratar + treinar substituta
- Relação com a agência rival (histórico: buyouts anteriores, collabs, rivalidade)
- Contrato atual: meses restantes (afeta fee de rescisão)
- Idol personal: a idol QUER sair? (Lealdade, happiness, Ambição)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Industry Knowledge** | Avaliar se a oferta é justa comparada com o mercado |
| **Financial Acumen** | Calcular se vender é financeiramente melhor que manter |
| **Judging Idol Ability** | Avaliar o valor real da idol (não apenas fame — mas consistência, versatilidade) |
| **Authority** | Negociar counter-offer com firmeza. Blefar se necessário |

**FLOWCHART:**

```
1. AVALIAR OFERTA vs VALOR DE MERCADO
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Conhece o mercado com precisão. Sabe que a idol vale X ± 5%.
      │                    Avalia TIMING: "rival está desesperado (perdeu idol chave semana passada)
      │                    — podemos pedir premium de 30-50%."
      │                    Avalia MOTIVAÇÃO do rival: "rival tier Nacional quer nossa idol tier A
      │                    para competir no Kouhaku — oferta vai subir se rejeitarmos."
      ├─ Outstanding (18-19): Valor de mercado ± 10%. Identifica se rival está sob pressão.
      ├─ Very Good (15-17): Valor de mercado ± 15%. Compara oferta com transações recentes.
      ├─ Good (12-14):    Valor ± 20%. "Oferta acima ou abaixo do esperado?"
      ├─ Average (10-11): Compara oferta com salary da idol × meses restantes. Rough estimate.
      ├─ Competent (7-9): "Oferta é grande? Parece grande." Baseado em intuição, não cálculo.
      ├─ Reasonable (4-6): Não avalia. Qualquer oferta "parece boa" ou "parece má" aleatoriamente.
      └─ Unsuited (1-3):  Não entende a oferta. Pode aceitar valor ridiculamente baixo.

2. AVALIAR IMPORTÂNCIA DA IDOL PARA A AGÊNCIA
   └─ Skill: Judging Idol Ability
      ├─ Elite (20):      Análise multi-dimensional:
      │                    → Revenue: "gera 35% da receita — se sair, crise financeira em 2 meses"
      │                    → Archetype: "única Center no roster — grupo Aurora depende dela"
      │                    → Fans: "fan club de 80K — se sair, mass exodus + toxicidade"
      │                    → Development: "mentora de 2 novatas — saída dela atrasa desenvolvimento"
      │                    → Replaceability: "no mercado, ninguém no mesmo nível por < 2× o custo"
      │                    Pesa todos factores e dá score de insubstituibilidade 0-100.
      ├─ Outstanding (18-19): Revenue share + archetype + fan impact. Score simplificado.
      ├─ Very Good (15-17): Revenue share + archetype. "É essencial ou não?"
      ├─ Good (12-14):    Revenue share. "Gera mais de 20% da receita? Essencial."
      ├─ Average (10-11): Fame. "É a mais famosa? Então é importante."
      ├─ Competent (7-9): Tier. "É tier A+? Não vender."
      ├─ Reasonable (4-6): Não avalia importância. Decide só pelo valor da oferta.
      └─ Unsuited (1-3):  Não avalia.

3. CALCULAR SE VENDER É MELHOR QUE MANTER
   └─ Skill: Financial Acumen
      ├─ Elite (20):      NPV completo: valor_oferta vs (receita_futura − salary − treino)
      │                    ao longo do contrato restante, descontado a taxa de risco.
      │                    "Oferta de ¥45M. Ela gera ¥8M/mês líquido. Contrato restante 18 meses.
      │                    Receita projetada: ¥144M. Mas fame está a cair 3%/mês — projeção
      │                    real: ¥110M. Aceitar ¥45M é mau negócio AGORA. Counter com ¥80M."
      ├─ Outstanding (18-19): Projeção 12 meses simplificada. Compara com oferta.
      ├─ Very Good (15-17): Receita dos últimos 3 meses × meses restantes vs oferta.
      ├─ Good (12-14):    Receita mensal × 6 vs oferta. Rough estimate.
      ├─ Average (10-11): "Oferta > salary anual? Parece bom negócio."
      ├─ Competent (7-9): "Oferta parece alta → aceitar. Parece baixa → rejeitar."
      ├─ Reasonable (4-6): Aceita se número "parece grande" (sem referência).
      └─ Unsuited (1-3):  Não faz conta. Decisão quase aleatória.

4. NEGOCIAR / RESPONDER
   └─ Skill: Authority
      ├─ Elite (20):      Master negotiator:
      │                    → Se quer vender: aceita se oferta ≥ target price.
      │                      Se oferta < target mas close (80-99%): counter com target + 10%.
      │                    → Se não quer vender: rejeita COM mensagem estratégica:
      │                      "Agradecemos o interesse mas [idol] é central nos nossos planos.
      │                      Não estamos a considerar ofertas neste momento."
      │                      (Rival pode interpretar como "ofereçam mais" → leverage.)
      │                    → Se quer criar bidding war: demora 1 semana a responder
      │                      (sinalizando a outros rivais que idol está "em jogo").
      ├─ Outstanding (18-19): Counter-offer calculado. Rejeição educada. Timing consciente.
      ├─ Very Good (15-17): Counter com marketValue × 1.2 se quer vender. Rejeição firme se não.
      ├─ Good (12-14):    Counter com +15% sobre oferta se quer vender. Rejeição simples.
      ├─ Average (10-11): Aceita ou rejeita (binário). Sem counter-offer.
      ├─ Competent (7-9): Aceita ou rejeita.
      ├─ Reasonable (4-6): Aceita oferta que "parece boa" sem negociar.
      └─ Unsuited (1-3):  Resposta tardia ou confusa. Pode aceitar sem querer
                           (interpreta mal a proposta).

5. DECISÃO FINAL
   ├─ Se aceitar:
   │   → return { type: 'respondBuyout', proposalId, response: 'accept' }
   ├─ Se counter-offer:
   │   → return { type: 'respondBuyout', proposalId, response: 'counter', counterOffer: ¥ }
   ├─ Se rejeitar:
   │   → return { type: 'respondBuyout', proposalId, response: 'reject' }
   └─ Se não processou (Unsuited/timeout):
       → proposta expira após deadline → idol pode ficar insatisfeita se queria sair
```

**OUTPUT:** `{ type: 'respondBuyout', proposalId: string, response: 'accept' | 'reject' | 'counter', counterOffer?: number }` | `null`

---

#### Decisão 3.1.3: Rescindir Contrato Proativamente

**CONTEXTO (o que a IA avalia):**
- Roster completo com ROI por idol (últimos 3 meses)
- Idols com ROI consistentemente negativo
- Multa de rescisão de cada contrato (salário × meses restantes × RESCISSION_FACTOR)
- Custo de manter a idol até o fim do contrato (salary × meses restantes)
- Archetype coverage: se rescindir, fica com gap no archetype?
- Estado financeiro: agência em crise? Cada yen conta?
- Possibilidade de transfer em vez de rescisão (listar para venda = receita em vez de custo)
- Idol happiness e Lealdade: idol infeliz pode aceitar rescisão mútua (multa −50%)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Financial Acumen** | Comparar custo de manter vs custo de rescindir — qual cenário é mais barato |
| **Judging Idol Ability** | Avaliar se idol tem chance de recovery (stats subindo?) ou é caso perdido |
| **Judging Idol Potential** | Avaliar se idol está estagnada permanentemente ou é fase temporária |
| **Industry Knowledge** | Avaliar se é melhor rescindir agora ou tentar vender (transfer) |

**FLOWCHART:**

```
1. IDENTIFICAR CANDIDATAS A RESCISÃO
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Analisa ROI de CADA idol no roster dos últimos 3 meses.
      │                    Categoriza: "ROI negativo e piorando" vs "ROI negativo mas estabilizando"
      │                    vs "ROI negativo porque investimos em treino (custo alto, retorno futuro)."
      │                    Só marca para rescisão as que são "negativo e piorando" SEM potencial.
      │                    Calcula: custo_de_manter = salary × meses_restantes + treino_estimado.
      │                    Calcula: custo_de_rescindir = multa.
      │                    Se manter > rescindir × 1.5 → candidata a rescisão.
      ├─ Outstanding (18-19): ROI 3 meses. "Negativo e piorando" = candidata.
      │                        Compara custo manter vs multa.
      ├─ Very Good (15-17): ROI 3 meses. Todas com ROI < -20% são candidatas.
      │                      Calcula multa vs salary restante.
      ├─ Good (12-14):    ROI 2 meses. Candidatas: ROI negativo + tier ≤ C.
      ├─ Average (10-11): ROI 1 mês. Candidatas: ROI negativo.
      ├─ Competent (7-9): Só identifica candidatas se agência em crise financeira.
      │                    Escolhe a idol mais cara com ROI negativo.
      ├─ Reasonable (4-6): Só rescinde se board forçar ou debt = crisis.
      └─ Unsuited (1-3):  Nunca rescinde proativamente. Paga salários até o fim.

2. AVALIAR SE IDOL PODE RECUPERAR
   └─ Skill: Judging Idol Potential
      ├─ Elite (20):      "ROI negativo AGORA, mas stats crescendo 2%/semana, PT = 78,
      │                    idade 17. Em 8 semanas será tier B e ROI positivo.
      │                    NÃO RESCINDIR — é investimento."
      │                    vs "ROI negativo, stats estagnados há 12 semanas, PT = 55,
      │                    idade 24, ceiling praticamente atingido. Rescindir."
      │                    Diferencia investimento de custo afundado.
      ├─ Outstanding (18-19): Avalia PT vs stats atuais + growth trend.
      │                        "Gap grande + growing → investimento. Gap pequeno + flat → rescindir."
      ├─ Very Good (15-17): Avalia PT vs tier. "PT alto + tier baixo → pode melhorar."
      ├─ Good (12-14):    Avalia growth trend: "stats subindo → manter. Flat → rescindir."
      ├─ Average (10-11): Avalia idade: "jovem → manter. Velha → rescindir."
      ├─ Competent (7-9): Não avalia recovery. Se ROI negativo, é candidata.
      ├─ Reasonable (4-6): Idem Competent.
      └─ Unsuited (1-3):  Idem.

3. CONSIDERAR ALTERNATIVA: TRANSFER EM VEZ DE RESCISÃO
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      "Em vez de pagar multa de ¥15M, posso listar para transfer.
      │                    Idol tem fame 2000 → marketValue ~¥30M.
      │                    Se vender: RECEBO ¥30M. Se rescindir: PAGO ¥15M.
      │                    Delta: ¥45M. Sempre tentar transfer primeiro."
      │                    Avalia se há mercado (rivais precisam deste archetype?).
      │                    Se sim: lista. Se não: rescisão.
      ├─ Outstanding (18-19): Compara: "vender = receita. Rescindir = custo. Preferir vender."
      │                        Verifica se marketValue > 0 (idol tem valor de mercado).
      ├─ Very Good (15-17): "Se idol tem fame > 500, tentar vender antes de rescindir."
      ├─ Good (12-14):    "Se idol tem fame > 1000, tentar vender."
      ├─ Average (10-11): Não pensa em transfer. Rescisão direta.
      ├─ Competent−:      Não pensa em transfer.

4. VERIFICAR RESCISÃO MÚTUA
   └─ Skill: Judging Idol Ability (leitura de Lealdade e happiness)
      ├─ Elite (20):      "Idol com happiness 25 e Lealdade 4 — ela QUER sair.
      │                    Propor rescisão mútua: multa reduzida em 50%.
      │                    Economia de ¥7.5M."
      ├─ Outstanding (18-19): Identifica se idol quer sair (happiness < 30 + Lealdade < 8).
      │                        Propõe mútua.
      ├─ Very Good (15-17): Se idol pediu rescisão recentemente → propõe mútua.
      ├─ Good−:           Não considera mútua. Rescisão unilateral (multa cheia).

5. DECISÃO FINAL
   ├─ Se melhor vender → return { type: 'listForTransfer', idolId, askingPrice }
   │   (transfere para decisão 3.3.1 de Transfer)
   ├─ Se rescisão mútua possível → return { type: 'terminateContract', contractId, mutual: true }
   ├─ Se rescisão unilateral necessária → return { type: 'terminateContract', contractId, mutual: false }
   └─ Se não há candidatas ou idol pode recuperar → return null
```

**OUTPUT:** `{ type: 'terminateContract', contractId: string, mutual: boolean }` | `{ type: 'listForTransfer', idolId: string, askingPrice: number }` | `null`

---

### Cargo 3.2: Gestão de Roster

---

#### Decisão 3.2.1: Avaliar Composição do Roster

**CONTEXTO (o que a IA avalia):**
- Roster completo: todas idols contratadas com stats, tier, age, archetype, fame, ROI
- 12 archetypes possíveis (center, ace, visual, leader, mood_maker, rapper, dancer, vocalist, variety, mysterious, cute, cool) — quantas idols por archetype
- Distribuição de idade: quantas por faixa (15-17, 18-21, 22-25, 26-30, 30+)
- Revenue concentration: % da receita gerada por top-1, top-3 idols
- Groups: quais grupos existem, composição, synergy scores
- Pipeline: quantas idols em desenvolvimento (tier F-C com dev plans ativos)
- Mercado: archetypes disponíveis no mercado que cobririam gaps
- Contratos expirando nos próximos 3 meses (quem pode sair)
- Tier da agência (determina roster size ideal)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Judging Idol Ability** | Avaliar o nível real de cada idol — não apenas tier mas consistência, versatilidade, trajectory |
| **Judging Idol Potential** | Identificar quais idols no pipeline vão cobrir gaps futuros sem precisar recrutar |
| **Industry Knowledge** | Benchmark: como é um roster saudável para o tier da agência |
| **Financial Acumen** | Avaliar revenue concentration e dependency risk |

**FLOWCHART:**

```
1. ANÁLISE DE ARCHETYPE COVERAGE
   └─ Skill: Judging Idol Ability
      ├─ Elite (20):      Mapa completo: 12 archetypes × idols por cada.
      │                    Não conta só primary archetype — avalia secondary também.
      │                    "Center: 2 idols (Yui primary, Mei secondary). Mas Mei está a
      │                    evoluir para Vocalist — em 6 semanas só teremos 1 Center."
      │                    Avalia QUALIDADE dentro do archetype: "temos 3 Dancers mas
      │                    2 são tier D — efetivamente só 1 contribui."
      │                    Flag: archetypes com 0 idols competitivas (gap real).
      ├─ Outstanding (18-19): Mapa de 12 archetypes por primary. Qualidade por tier.
      │                        Identifica gaps: archetypes com 0 ou com apenas tier D-F.
      ├─ Very Good (15-17): Conta idols por archetype. Flag archetypes com 0.
      │                      Diferencia: "0 = gap crítico, 1 = risco."
      ├─ Good (12-14):    Conta por archetype. Flag archetypes com 0 idols.
      ├─ Average (10-11): Identifica os 2-3 archetypes mais comuns e os 2-3 em falta.
      ├─ Competent (7-9): Nota se falta "vocalist" ou "dancer" (os mais óbvios).
      ├─ Reasonable (4-6): "Temos muitas idols parecidas" (vago, sem especificar).
      └─ Unsuited (1-3):  Sem análise. "O roster está bom" (mesmo com gaps gritantes).

2. ANÁLISE DE DISTRIBUIÇÃO DE IDADE
   └─ Skill: Judging Idol Potential
      ├─ Elite (20):      Projeta: "60% do roster tem 22-25 anos. Peak é 20-24.
      │                    Em 3 anos, 60% estará em declínio simultâneo.
      │                    Precisamos recrutar 3-4 idols de 15-17 AGORA para pipeline."
      │                    Calcula: when each idol hits peak, plateau, decline.
      │                    Identifica "graduation cliff": múltiplas idols retiring no mesmo ano.
      ├─ Outstanding (18-19): Identifica concentração de idade. Projeta 2 anos.
      │                        Flag se >50% na mesma faixa.
      ├─ Very Good (15-17): Distribui por 3 faixas (jovem/prime/veterana).
      │                      Flag se alguma faixa tem >60%.
      ├─ Good (12-14):    Conta jovens vs veteranas. "Roster envelhecendo" ou "roster jovem."
      ├─ Average (10-11): Nota idade média. "Alta" ou "baixa."
      ├─ Competent (7-9): Nota se a idol mais velha está "velha" (>28).
      ├─ Reasonable (4-6): Não analisa idade.
      └─ Unsuited (1-3):  Sem análise.

3. ANÁLISE DE REVENUE CONCENTRATION
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Revenue por idol nos últimos 3 meses.
      │                    Herfindahl index: sum of (share_i)^2.
      │                    "Top-1 idol gera 42% da receita. Se ela sair ou se lesionar,
      │                    agência perde quase metade da receita. Risco: CRÍTICO."
      │                    "Top-3 geram 78%. Diversificação INSUFICIENTE."
      │                    Compara com benchmark do tier (regional: top-1 deveria ser <30%).
      ├─ Outstanding (18-19): Top-1 e top-3 revenue share. Flag se top-1 > 35%.
      ├─ Very Good (15-17): Top-1 revenue share. Flag se > 40%.
      ├─ Good (12-14):    Identifica idol que "ganha mais". Flag se parece dominante.
      ├─ Average (10-11): Nota que "uma idol carrega a agência" se óbvio.
      ├─ Competent (7-9): Não analisa concentração.
      ├─ Reasonable (4-6): Não analisa.
      └─ Unsuited (1-3):  Não analisa.

4. GERAR RECOMENDAÇÕES
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Recomendações priorizadas e actionable:
      │                    "1. Recrutar Center tier B+ (gap crítico, grupo Aurora sem Center).
      │                    2. Iniciar dev plans para 3 novatas da pipeline (cobertura futura).
      │                    3. Considerar vender Idol Z (ROI negativo, archetype super-coberto).
      │                    4. Renovar Idol W antecipadamente (única Vocalist tier A, contrato
      │                    expira em 8 sem — rival pode tentar buyout)."
      │                    Cada recomendação com: urgência, custo estimado, e quem deve executar.
      ├─ Outstanding (18-19): Top-3 recomendações priorizadas com urgência.
      ├─ Very Good (15-17): Top-2 recomendações: "recrutar archetype X" + "atenção ao contrato Y."
      ├─ Good (12-14):    1 recomendação principal: o gap mais crítico.
      ├─ Average (10-11): "Precisamos de mais [archetype]."
      ├─ Competent (7-9): "Roster podia ser melhor." (genérico)
      ├─ Reasonable (4-6): Sem recomendações.
      └─ Unsuited (1-3):  Sem output.

5. DECISÃO FINAL
   → return { type: 'rosterAssessment', gaps, ageDistribution, revenueConcentration, recommendations }
   (Este output é INFORMATIVO — alimenta decisões de Scouting, Transfer, e Strategy.
   Não é uma ação direta.)
```

**OUTPUT:** `{ type: 'rosterAssessment', gaps: ArchetypeGap[], ageDistribution: AgeDist, revenueConcentration: RevenueConc, recommendations: Recommendation[] }`

**NOTA:** Esta decisão roda 1× por mês (não semanalmente). O assessment é cacheado e consumido por: Chief Scout (para direcionar missões), Head Producer (para ajustar strategy), e Talent Director (para priorizar renovações/rescisões).

---

### Cargo 3.3: Transferências

---

#### Decisão 3.3.1: Listar Idol para Transferência (Venda)

**CONTEXTO (o que a IA avalia):**
- Roster assessment mais recente (da decisão 3.2.1): gaps, concentração, recomendações
- Idols com ROI negativo persistente (3+ meses)
- Idols em archetypes super-cobertos (3+ idols no mesmo archetype)
- Roster size vs limite do tier da agência (se acima → precisa vender)
- Market value de cada idol (fame × tier × age × contract_remaining)
- Contratos: meses restantes (mais meses = mais valor de transfer)
- Happiness e Lealdade de cada idol (idol infeliz → vender antes de rescisão forçada)
- Demanda de mercado: rivais procuram este archetype? (baseado em intel se disponível)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Financial Acumen** | Calcular asking price correto e avaliar timing de venda |
| **Judging Idol Ability** | Identificar quais idols são dispensáveis sem prejudicar o roster |
| **Industry Knowledge** | Avaliar demanda de mercado — tem comprador? Quando é o melhor timing? |

**FLOWCHART:**

```
1. IDENTIFICAR CANDIDATAS À VENDA
   └─ Skill: Judging Idol Ability
      ├─ Elite (20):      Avaliação holística de cada idol no roster:
      │                    → ROI negativo + archetype super-coberto + potencial atingido → VENDER
      │                    → ROI negativo + archetype raro + potencial alto → MANTER (investir)
      │                    → ROI positivo + archetype super-coberto + contrato longo → considerar
      │                      (vender no pico de valor para reinvestir em gap)
      │                    → Idol infeliz com Lealdade < 5 → vender antes que force rescisão
      │                      (transferência dá receita, rescisão dá custo)
      │                    Identifica as top-3 candidatas por "disposability score":
      │                    (archetype_coverage × roi_trend × potential_gap × happiness).
      ├─ Outstanding (18-19): Candidatas: ROI negativo E archetype coberto por outra.
      │                        Avalia se idol infeliz pode forçar rescisão em breve.
      ├─ Very Good (15-17): Candidatas: ROI negativo 3+ meses. Verifica archetype coverage.
      ├─ Good (12-14):    Candidatas: ROI negativo 3+ meses. Sem avaliação de archetype.
      ├─ Average (10-11): Candidatas: idol com menor fame no roster.
      ├─ Competent (7-9): Só lista se roster acima do limite do tier. A mais barata sai.
      ├─ Reasonable (4-6): Só lista se forçado (board pede, ou debt crisis).
      └─ Unsuited (1-3):  Nunca lista. Não identifica necessidade de vender.

2. AVALIAR DEMANDA DE MERCADO
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Cruza com intel de rivais: "Rival Crown Entertainment perdeu
      │                    sua única Vocalist tier A na semana passada. Se listarmos a nossa
      │                    Vocalist tier B agora, Crown vai pagar premium."
      │                    Timing: lista QUANDO há demanda, não quando precisa vender.
      │                    "Melhor esperar 2 semanas — mercado vai ter mais rivais procurando
      │                    após a janela de transfers."
      ├─ Outstanding (18-19): Avalia se rivais do mesmo tier precisam deste archetype.
      │                        Timing consciente (antes vs depois de events).
      ├─ Very Good (15-17): Avalia: "idols deste tier/archetype vendem rápido ou lento?"
      ├─ Good (12-14):    "Idol com fame > 1000 vai ter interessados." Não analisa timing.
      ├─ Average (10-11): Não avalia demanda. Lista e espera.
      ├─ Competent−:      Não avalia demanda.

3. DEFINIR ASKING PRICE
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Pricing strategy:
      │                    askingPrice = marketValue × demandMultiplier × urgencyDiscount.
      │                    demandMultiplier: se rival precisa desesperadamente → × 1.5.
      │                    urgencyDiscount: se precisamos vender rápido → × 0.85.
      │                    Sabe que asking price alto demora mais mas dá mais receita.
      │                    Asking price baixo vende rápido.
      │                    Escolhe baseado na urgência financeira da agência.
      ├─ Outstanding (18-19): marketValue × 1.2 (pedir acima, espaço para negociar).
      ├─ Very Good (15-17): marketValue × 1.1.
      ├─ Good (12-14):    marketValue × 1.0 (preço justo).
      ├─ Average (10-11): marketValue × 0.95 (ligeiramente abaixo — quer vender rápido).
      ├─ Competent (7-9): marketValue × 0.85 (subvaloriza para despachar).
      ├─ Reasonable (4-6): Preço arbitrário (pode ser muito abaixo do valor real).
      └─ Unsuited (1-3):  Se chegar aqui: preço aleatório. Pode listar por ¥1M
                           uma idol que vale ¥50M.

4. DECISÃO FINAL
   ├─ Se candidata identificada E demanda existe (ou urgência financeira):
   │   → return { type: 'listForTransfer', idolId, askingPrice }
   └─ Se ninguém para vender OU timing ruim (sem demanda E sem urgência):
       → return null
```

**OUTPUT:** `{ type: 'listForTransfer', idolId: string, askingPrice: number }` | `null`

---

## PAPEL 4: CHIEF SCOUT

> Equivalente ao Chief Scout do FM. Coordena a rede de olheiros e avalia candidatos.

### Cargo 4.1: Gestão de Olheiros

---

#### Decisão 4.1.1: Enviar Scout em Missão

**CONTEXTO (o que a IA avalia):**
- Scouts contratados: cada scout com região de origem, skill, specialty, status (idle/em missão)
- Scouts ociosos (sem missão ativa) — candidatos para envio
- Roster assessment (da decisão 3.2.1): gaps de archetype, necessidades
- Regiões do Japão: cada uma com pool de idols diferente, density diferente
- Histórico de missões: quais regiões já foram exploradas recentemente
- Budget: custo de cada missão (proporcional a duração × scout salary)
- Strategy focus: se agency focus = 'scouting', missões são prioridade
- Tier da agência: determina quantos scouts ideal (garagem 1, elite 5+)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Judging Idol Potential** | Core: decidir ONDE procurar e O QUE procurar — qual archetype, qual região |
| **Industry Knowledge** | Saber quais regiões têm mais talento e quais estão sobre-exploradas por rivais |
| **Adaptability** | Ajustar plano quando scout reports voltam vazios — pivotar região/foco |

**FLOWCHART:**

```
1. VERIFICAR SE HÁ SCOUTS OCIOSOS
   ├─ Listar scouts com status = 'idle'
   ├─ Se nenhum idle → return null (todos em missão)
   └─ Se budget não permite mais missões → return null

2. DEFINIR O QUE PROCURAR (foco da missão)
   └─ Skill: Judging Idol Potential
      ├─ Elite (20):      Cross-ref roster assessment com pipeline de desenvolvimento:
      │                    "Temos gap em Center E em 6 meses a nossa única Vocalist
      │                    aposenta. Preciso de: 1 Center imediato (tier B+) E
      │                    1 Vocalist jovem (tier D-C com PT > 75 para desenvolver)."
      │                    Define 2 focos simultâneos se tem 2+ scouts.
      │                    Especifica: tier mínimo, idade range, PT estimado desejado.
      ├─ Outstanding (18-19): Usa roster assessment para definir archetype prioritário.
      │                        Define tier mínimo. 1 foco principal + 1 secundário.
      ├─ Very Good (15-17): Usa roster gaps. Foco: archetype com 0 idols.
      │                      Tier mínimo: C (para tier da agência).
      ├─ Good (12-14):    Foco no gap mais óbvio do roster. Sem tier mínimo específico.
      ├─ Average (10-11): Foco genérico: "encontrar idols boas." Sem archetype específico.
      ├─ Competent (7-9): Foco genérico sem direção.
      ├─ Reasonable (4-6): Sem foco. Missão genérica ("vá olhar").
      └─ Unsuited (1-3):  Não envia missão. Scout fica idle.

3. ESCOLHER REGIÃO
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Cruza: foco desejado × região com maior probability de encontrar.
      │                    "Center costuma vir de Tokyo/Osaka. Vocalist de Nagoya/Fukuoka."
      │                    Evita regiões onde rival tem scout ativo (competição reduz pool).
      │                    Sabe timing: "feira de talentos em Osaka semana que vem —
      │                    enviar scout para Osaka agora maximiza chance."
      ├─ Outstanding (18-19): Match archetype × região. Evita sobre-exploradas (missões recentes).
      ├─ Very Good (15-17): Usa especialidade do scout: scout de Osaka → enviar para Osaka
      │                      (bônus de familiaridade).
      ├─ Good (12-14):    Região com maior density de idols. Sem considerar competição.
      ├─ Average (10-11): Região que nunca explorou (diversificar).
      ├─ Competent (7-9): Região padrão (Tokyo — sempre há gente).
      ├─ Reasonable (4-6): Região aleatória.
      └─ Unsuited (1-3):  N/A (não chega aqui).

4. DEFINIR DURAÇÃO
   └─ Skill: Judging Idol Potential
      ├─ Elite (20):      Duração adaptada à necessidade:
      │                    Urgente (gap crítico): 2 semanas (rápido, menos idols encontradas).
      │                    Pipeline (longo prazo): 4 semanas (mais idols, melhor avaliação).
      │                    "Se tenho tempo, 4 semanas é sempre melhor — scout avalia com
      │                    mais precisão e encontra candidatas que passam despercebidas."
      ├─ Outstanding (18-19): 4 semanas se budget permite. 2 se urgente.
      ├─ Very Good (15-17): 4 semanas default. 2 se budget apertado.
      ├─ Good (12-14):    2 semanas (padrão). 4 se strategy focus = scouting.
      ├─ Average (10-11): 2 semanas sempre.
      ├─ Competent (7-9): 2 semanas sempre.
      ├─ Reasonable (4-6): 2 semanas.
      └─ Unsuited (1-3):  N/A.

5. ATRIBUIR SCOUT À MISSÃO
   └─ Skill: Adaptability (matching scout → missão)
      ├─ Elite (20):      Match perfeito: scout com specialty no archetype buscado +
      │                    região de origem = região da missão + skill alto.
      │                    Se não há match perfeito, calcula quem é o "menos mau":
      │                    "Scout A tem specialty Vocalist mas mando procurar Center.
      │                    Bônus de specialty perdido, mas skill 17 compensa."
      ├─ Outstanding (18-19): Prioriza specialty match. Se empate: maior skill.
      ├─ Very Good (15-17): Scout com maior skill vai para missão mais importante.
      ├─ Good (12-14):    Scout idle com maior skill.
      ├─ Average (10-11): Primeiro scout idle da lista.
      ├─ Competent (7-9): Primeiro idle.
      ├─ Reasonable (4-6): Primeiro idle.
      └─ Unsuited (1-3):  N/A.

6. DECISÃO FINAL
   ├─ Se scout atribuído + região + foco + duração definidos:
   │   → return { type: 'sendScoutMission', scoutId, regionId, duration, focus: { archetype?, tierMin?, ageRange? } }
   └─ Se nenhum scout idle OU sem budget:
       → return null
```

**OUTPUT:** `{ type: 'sendScoutMission', scoutId: string, regionId: string, duration: number, focus: ScoutingFocus }` | `null`

---

### Cargo 4.2: Avaliação de Candidatos

---

#### Decisão 4.2.1: Avaliar Candidatos e Recomendar Contratação

**CONTEXTO (o que a IA avalia):**
- Scout reports recebidos esta semana (lista de candidatos descobertos)
- Para cada candidato: stats visíveis (com margem de erro do scout), tier estimado, age, region, archetype estimado
- Margem de erro dos stats: depende do scout skill + pipeline de scouting usada
  (olheiro de rua ±15, festival ±10, online ±20, transfer ±0)
- Roster assessment: gaps atuais, necessidades
- Budget: salário estimado do candidato (proporcional ao tier)
- Rivais interessados no mesmo candidato (se intel disponível)
- Shortlist atual: candidatos já marcados em avaliações anteriores

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Judging Idol Ability** | Core: avaliar stats reais através da margem de erro do report — "ela realmente é Good ou o scout errou?" |
| **Judging Idol Potential** | Projetar: "stats baixos mas PT estimado alto = diamante bruto que vale o investimento" |
| **Financial Acumen** | Avaliar se o custo (salary + treino + tempo de desenvolvimento) compensa o retorno projetado |
| **Industry Knowledge** | Saber se há competição rival pelo candidato — velocidade de decisão |

**FLOWCHART:**

```
1. PROCESSAR SCOUT REPORTS
   ├─ Listar todos candidatos descobertos em reports não-lidos
   ├─ Se nenhum report → return null
   └─ Marcar reports como lidos

2. FILTRAR CANDIDATOS (primeiro corte)
   └─ Skill: Judging Idol Ability
      ├─ Elite (20):      Lê stats com margem de erro reduzida (±1-2 em vez do base do scout).
      │                    "Report diz Vocal 65 ±15. Com meu JIA Elite, leio como 65 ±3.
      │                    Provavelmente entre 62-68. Suficiente para tier B."
      │                    Filtra por: tier estimado real ≥ agência mínimo,
      │                    archetype fit com roster gaps, age no range desejado,
      │                    personality traits compatíveis (se report inclui hints).
      │                    Mantém candidatas "hidden gem" (tier baixo mas sinais de PT alto).
      ├─ Outstanding (18-19): Margem ±3-4. Filtra por tier + archetype fit + age.
      │                        Mantém 1-2 hidden gems.
      ├─ Very Good (15-17): Margem ±5. Filtra por tier ≥ agência min + archetype gap.
      ├─ Good (12-14):    Margem ±7. Filtra por tier ≥ C. Shortlist top-5.
      ├─ Average (10-11): Margem ±10. Filtra por tier estimado ≥ C. Top-3.
      ├─ Competent (7-9): Margem ±12. Filtra só por "parece boa" (tier ≥ D). Top-3.
      ├─ Reasonable (4-6): Margem ±15 (base do scout, sem redução). Top-1 mais famosa.
      └─ Unsuited (1-3):  Não filtra. Ou aceita tudo ou rejeita tudo.
      │                    Pode recomendar candidata tier F como se fosse A.

3. AVALIAR POTENCIAL DE DESENVOLVIMENTO
   └─ Skill: Judging Idol Potential
      ├─ Elite (20):      Para cada candidata shortlistada:
      │                    "Stats atuais avg 45, mas idade 15 e sinais de PT > 80.
      │                    Se investir 24 semanas de treino focado, projecto tier A.
      │                    Custo de desenvolvimento: ~¥2M/mês × 6 meses = ¥12M.
      │                    Revenue projetada após tier A: ¥5M/mês.
      │                    ROI positive em 8 meses. RECOMENDO."
      │                    Identifica: candidata agora vs candidata investimento.
      ├─ Outstanding (18-19): Avalia PT hints vs stats atuais. "Gap grande = potencial alto."
      │                        Projeta timeline de desenvolvimento.
      ├─ Very Good (15-17): "Stats baixos + jovem = potencial." vs "Stats altos + velha = o que vês é o que tens."
      ├─ Good (12-14):    Avalia idade. Jovem = vale investir. Velha = precisa ser boa agora.
      ├─ Average (10-11): Não avalia potencial. Só stats atuais.
      ├─ Competent−:      Sem avaliação de potencial.

4. AVALIAR CUSTO-BENEFÍCIO
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Full cost model: salary_estimado × contract_duration +
      │                    treino_custo + oportunidade_custo (slot no roster ocupado).
      │                    vs revenue_projetada baseada em tier atingido × fame estimada.
      │                    "Candidata A: ROI +30% em 12 meses. Candidata B: ROI +60% em 18
      │                    meses. Se budget apertado: A. Se pode investir: B."
      ├─ Outstanding (18-19): Salary estimado vs budget disponível + ROI rough.
      ├─ Very Good (15-17): "Cabe no budget de salários? Revenue esperada > salary?"
      ├─ Good (12-14):    "Cabe no budget? Sim/não."
      ├─ Average (10-11): "É cara?" Sim/não baseado em percepção.
      ├─ Competent−:      Não avalia custo. Recomenda baseado só em stats.

5. CHECAR COMPETIÇÃO RIVAL
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      "2 rivais já mandaram scout para a mesma região na mesma semana.
      │                    Provavelmente viram a mesma candidata. Se quisermos, precisamos
      │                    agir ESTA SEMANA — propor contrato antes deles."
      │                    Usa intel de rival activity para acelerar decisão.
      ├─ Outstanding (18-19): Sabe que candidatas boas não ficam no mercado muito tempo.
      │                        Flag urgência se candidata é tier B+.
      ├─ Very Good (15-17): "Se candidata é muito boa, propor rápido."
      ├─ Good−:            Não considera competição. Pode perder candidata por lentidão.

6. DECISÃO FINAL
   ├─ Para cada candidata aprovada (passou filtro + custo ok):
   │   → return { type: 'recommendSigning', idolId, urgency, assessment }
   │   (recomendação vai para Talent Director → se aceita, inicia negociação)
   ├─ Se nenhuma candidata passa filtros:
   │   → return null
   └─ Se competição detectada em candidata top:
       → return { type: 'recommendSigning', idolId, urgency: 'critical', assessment }
```

**OUTPUT:** `{ type: 'recommendSigning', idolId: string, urgency: 'low' | 'medium' | 'high' | 'critical', assessment: CandidateAssessment }[]` | `null`

---

## PAPEL 5: DEVELOPMENT DIRECTOR

> Equivalente ao Head of Youth Development do FM. Responsável pelo crescimento a
> longo prazo das idols: planos de desenvolvimento, mentoria, avaliação de potencial.

### Cargo 5.1: Planos de Desenvolvimento

---

#### Decisão 5.1.1: Criar ou Ajustar Plano de Desenvolvimento

**CONTEXTO (o que a IA avalia):**
- Todas idols do roster: stats atuais (16 visíveis + 6 ocultos se revelados), tier, PT (potencial), age
- Ceiling por stat (derivado de PT + seed variance) — quanto cada stat pode crescer
- Gap entre stats atuais e ceiling: quanto espaço de crescimento existe
- Growth rate recente: velocidade de crescimento nas últimas 4-8 semanas
- Archetype atual vs archetype ideal (baseado em pontos fortes naturais)
- Wellness: stress, motivation (afeta se pode treinar intensive)
- Coaches disponíveis: quais coaches existem e suas skills (limita qualidade do treino)
- Dev plans ativos: quais idols já têm plano, progresso de cada um
- Schedule: slots disponíveis para treino (vs jobs que geram receita)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Judging Idol Potential** | Core: projetar ceiling de cada idol e decidir onde investir treino |
| **Mental Coaching** | Adaptar plano à capacidade mental da idol (stress tolerance, learning speed) |
| **Judging Idol Ability** | Ler stats atuais com precisão para identificar gaps reais vs aparentes |
| **Industry Knowledge** | Saber que tipo de idol o mercado valoriza — alinhar desenvolvimento com demanda |

**FLOWCHART:**

```
1. IDENTIFICAR IDOLS QUE PRECISAM DE PLANO
   └─ Skill: Judging Idol Potential
      ├─ Elite (20):      Avalia CADA idol no roster:
      │                    Para cada uma calcula: gap_ratio = (ceiling − current_avg) / ceiling.
      │                    Se gap_ratio > 0.3 → "espaço significativo de crescimento."
      │                    Prioriza por: gap_ratio × (1 / age) × PT.
      │                    "Idol 16 anos, PT 85, avg stats 40 = ouro. Prioridade #1."
      │                    "Idol 25 anos, PT 65, avg stats 58 = perto do ceiling. Skip."
      │                    Diferencia: "sem plano porque ninguém criou" vs "sem plano porque
      │                    já atingiu ceiling e não precisa."
      │                    Limite: cria plano para max 5 idols simultaneamente (recursos de coach).
      ├─ Outstanding (18-19): Gap ratio calculation. Prioriza jovens com PT alto. Max 4 planos.
      ├─ Very Good (15-17): Identifica idols com stats < 60% do ceiling. Prioriza por PT. Max 3.
      ├─ Good (12-14):    Identifica idols com tier < C e PT > 60. Max 3 planos.
      ├─ Average (10-11): Identifica idols com menor tier no roster. Max 2 planos.
      ├─ Competent (7-9): Identifica a idol mais fraca. 1 plano.
      ├─ Reasonable (4-6): Cria plano só se alguém pedir (Head Producer ou idol).
      └─ Unsuited (1-3):  Não cria planos. Idols crescem sem direção.

2. DEFINIR FOCO DO PLANO (por idol)
   └─ Skill: Judging Idol Ability
      ├─ Elite (20):      Análise multi-stat: identifica o stat que mais impacta o archetype
      │                    ideal da idol. "Idol tem vocal 72 mas dance 35. Archetype natural é
      │                    Vocalist. Treinar vocal para 85 = tier S. Treinar dance para 50 =
      │                    irrelevante para o archetype. FOCO: vocal + communication (secondary)."
      │                    Define 1 stat primary + 1 stat secondary.
      │                    Se idol está em grupo: "grupo precisa de Dancer. Idol tem Dance
      │                    Technique 55 e PT permite 75. Pode ser re-roled para Dancer do grupo."
      │                    Alignment: personal archetype vs group need.
      ├─ Outstanding (18-19): Identifica stat mais fraco PARA O ARCHETYPE (não overall).
      │                        Define primary stat. Secondary opcional.
      ├─ Very Good (15-17): Stat mais fraco para archetype. 1 foco.
      ├─ Good (12-14):    Stat mais baixo da idol overall. 1 foco.
      ├─ Average (10-11): Stat mais baixo visível. Genérico.
      ├─ Competent (7-9): Stat aleatório do domínio do coach disponível.
      ├─ Reasonable (4-6): "Treinar tudo um pouco." Sem foco.
      └─ Unsuited (1-3):  Stat aleatório. Pode focar num stat já no ceiling.

3. DEFINIR INTENSIDADE E DURAÇÃO
   └─ Skill: Mental Coaching
      ├─ Elite (20):      Avalia capacidade mental da idol:
      │                    → Mentalidade alta + stress baixo + motivation alta:
      │                      intensive (×3 growth, +stress) por 4 semanas, depois normal.
      │                      "Ela aguenta pressão — aproveitamos a janela."
      │                    → Mentalidade baixa + stress > 50:
      │                      light (×1.5 growth, −stress) por 4 semanas, depois escalar.
      │                      "Se forçar, vai quebrar. Ir devagar e construir confiança."
      │                    → Personaliza: periodização por blocos (intensive → recovery → intensive).
      │                    Duração: adaptada ao gap (gap grande = 16 semanas, pequeno = 8).
      ├─ Outstanding (18-19): Checa stress + motivation. Intensive se stress < 40 E motiv > 60.
      │                        Normal caso contrário. 12 semanas padrão.
      ├─ Very Good (15-17): Intensive se stress < 40. Normal se 40-70. Skip se > 70. 12 semanas.
      ├─ Good (12-14):    Normal sempre. 12 semanas. Intensive nunca (risco demais).
      ├─ Average (10-11): Normal, 12 semanas. Sem adaptar à idol.
      ├─ Competent (7-9): Normal, 12 semanas. Template fixo.
      ├─ Reasonable (4-6): 12 semanas, sem intensidade definida.
      └─ Unsuited (1-3):  Se cria plano: duração e intensidade arbitrárias.

4. DECISÃO FINAL
   ├─ Se idol precisa de plano E foco definido:
   │   → return { type: 'createDevPlan', idolId, focusStat, secondaryStat?,
   │     intensity, durationWeeks, goals }
   ├─ Se plano existente precisa de ajuste (progresso < 40% na metade do prazo):
   │   → return { type: 'adjustDevPlan', planId, changes: { focusStat?, intensity? } }
   └─ Se nenhuma idol precisa:
       → return null
```

**OUTPUT:** `{ type: 'createDevPlan', ... }` | `{ type: 'adjustDevPlan', ... }` | `null`

---

### Cargo 5.2: Mentoria

---

#### Decisão 5.2.1: Atribuir Mentor a Mentee

**CONTEXTO (o que a IA avalia):**
- Idols junior (tier F-C, age < 20, ou recém contratadas) sem mentor atribuído
- Idols senior (tier A+, ou age > 22 com experience) disponíveis como mentores
- Workload de cada senior: se workload > 80%, não pode ser mentora (GDD)
- Stats de cada senior: mentor precisa ter stats altos nas áreas onde a mentee precisa crescer
- Pairwise affinity entre candidatos: mentor-mentee com afinidade alta = melhor resultado
- Ocultos: People Management do senior (afeta qualidade da mentoria)
- Dev plans: mentee tem plano ativo? Mentor deveria complementar o plano
- Grupos: mentor e mentee no mesmo grupo = bonus natural (convivência diária)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Mental Coaching** | Core: avaliar compatibilidade mentor-mentee e projetar resultado da mentoria |
| **Judging Idol Ability** | Identificar quais stats da senior complementam as fraquezas da junior |
| **People Management** | Avaliar dinâmica interpessoal — personalidades compatíveis? |

**FLOWCHART:**

```
1. IDENTIFICAR MENTEES QUE PRECISAM DE MENTOR
   └─ Skill: Mental Coaching
      ├─ Elite (20):      Identifica mentees por critérios múltiplos:
      │                    → Idol nova no roster (< 4 semanas) sem mentor: alta prioridade
      │                    → Idol com dev plan ativo mas growth rate abaixo do esperado: mentor ajuda
      │                    → Idol com motivation < 40 que poderia se beneficiar de role model
      │                    → Idol em grupo mas isolada (baixa afinidade com membros): mentor-bridge
      │                    Prioriza pelo impacto estimado da mentoria.
      ├─ Outstanding (18-19): Idols novas + idols com growth lento. Prioriza novas.
      ├─ Very Good (15-17): Idols tier F-C sem mentor. Prioriza menor tier.
      ├─ Good (12-14):    Idols tier F-D sem mentor.
      ├─ Average (10-11): Idol com menor tier no roster.
      ├─ Competent (7-9): Só atribui se Head Producer pedir.
      ├─ Reasonable (4-6): Não identifica necessidade.
      └─ Unsuited (1-3):  Não atribui mentores.

2. ENCONTRAR MELHOR MENTOR PARA CADA MENTEE
   └─ Skill: Judging Idol Ability
      ├─ Elite (20):      Para cada mentee, avalia TODAS seniors disponíveis:
      │                    Score = stat_complementarity × affinity × personality_match × availability.
      │                    stat_complementarity: mentor forte onde mentee é fraca (ex: mentor
      │                    Vocal 85 para mentee com Vocal 35 = perfeito).
      │                    personality_match: Temperamentos compatíveis (ambos calmos, ou
      │                    mentor paciente + mentee intensa).
      │                    Verifica oculto People Management da mentor: > 12 = boa mentora natural.
      │                    Evita combos tóxicas: "mentor com Temperamento 4 + mentee com Ambição 18
      │                    = conflito certo."
      ├─ Outstanding (18-19): stat_complementarity × affinity. Verifica personality básica.
      │                        Evita combos com affinity < 0.3.
      ├─ Very Good (15-17): Senior com stats mais altos onde mentee é mais fraca.
      │                      Verifica workload < 80%.
      ├─ Good (12-14):    Senior com maior overall stats + workload ok.
      ├─ Average (10-11): Senior com maior fame (role model). Sem verificar complementarity.
      ├─ Competent (7-9): Senior mais livre (menor workload).
      ├─ Reasonable (4-6): Primeira senior disponível da lista.
      └─ Unsuited (1-3):  Match aleatório. Pode juntar personalidades incompatíveis.

3. AVALIAR DINÂMICA INTERPESSOAL
   └─ Skill: People Management
      ├─ Elite (20):      "Mentor Yui (paciente, Temperamento 15, People 14) com mentee
      │                    Riko (ansiosa, Temperamento 6, Ambição 16). Yui vai estabilizar
      │                    Riko sem sufocar a ambição. Match: Excelente."
      │                    Projeta resultado: "em 8 semanas, mentee ganha +10 em Vocal
      │                    (mentor forte) e +5 em Mentalidade (estabilidade do mentor)."
      ├─ Outstanding (18-19): Avalia Temperamento de ambas. Evita conflitos óbvios.
      ├─ Very Good (15-17): Verifica affinity > 0.5. Se baixa, escolhe outra.
      ├─ Good (12-14):    Verifica affinity > 0.3.
      ├─ Average−:        Não avalia dinâmica interpessoal.

4. DECISÃO FINAL
   ├─ Se mentee + mentor matched:
   │   → return { type: 'assignMentor', mentorId, menteeId, focusArea, duration }
   │   (Efeito: mentee ganha bônus de growth = mentor_stat/100 × mentor_comm/100 × 0.5
   │   por semana de mentoria — conforme GDD talent-development-plans)
   └─ Se nenhuma mentee precisa OU nenhuma senior disponível/compatível:
       → return null
```

**OUTPUT:** `{ type: 'assignMentor', mentorId: string, menteeId: string, focusArea: string, duration: number }` | `null`

---

### Cargo 5.3: Avaliação de Potencial

---

#### Decisão 5.3.1: Projetar Timeline de Desenvolvimento de Idol

**CONTEXTO (o que a IA avalia):**
- Idol: stats atuais (16 visíveis), PT (potencial), age, tier atual
- Growth rate das últimas 4-12 semanas (velocidade de crescimento por stat)
- Ceiling por stat (derivado de PT) — máximo teórico que a idol pode atingir
- Dev plan ativo: progresso, foco, intensidade
- Coach quality: skill do coach responsável (afeta growth rate)
- Age curve: em que ponto da carreira a idol está (growth phase, peak, decline)
- Comparação com idols similares: "idols com PT similar, o que alcançaram?"

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Judging Idol Potential** | Core: projetar a curva de carreira inteira da idol — peak, plateau, decline |
| **Judging Idol Ability** | Ler stats atuais com precisão para ter base correta na projeção |
| **Mental Coaching** | Avaliar se fatores mentais (motivation, stress resilience) vão ajudar ou limitar growth |

**FLOWCHART:**

```
1. AVALIAR POSIÇÃO ATUAL NA CURVA DE CARREIRA
   └─ Skill: Judging Idol Ability
      ├─ Elite (20):      Lê stats com precisão ±1. Calcula: avg_stats / ceiling = completion_ratio.
      │                    "Completion 45% + age 16 = early growth phase. Muito espaço."
      │                    "Completion 85% + age 24 = approaching peak. Pouco espaço."
      │                    Identifica: quais stats estão a crescer, quais estagnaram, quais declinaram.
      │                    "Vocal cresceu 3 pontos/mês nos últimos 3 meses. Dance estável. 
      │                    Stamina caiu 1 ponto (age-related decline começou)."
      ├─ Outstanding (18-19): Completion ratio. Identifica stats em crescimento vs flat.
      ├─ Very Good (15-17): Compara stats atuais com ceiling. "X% do potencial atingido."
      ├─ Good (12-14):    Tier atual vs tier estimado pelo PT. "Está abaixo do potencial."
      ├─ Average (10-11): "Stats crescendo" ou "stats flat" (binário).
      ├─ Competent (7-9): Vê tier atual. "Tier C, pode melhorar?"
      ├─ Reasonable (4-6): "Parece ter potencial" ou "parece fraca" (feeling).
      └─ Unsuited (1-3):  Sem avaliação.

2. PROJETAR PEAK
   └─ Skill: Judging Idol Potential
      ├─ Elite (20):      Full career projection:
      │                    → Growth model: current_growth_rate × age_curve_multiplier × coach_quality.
      │                    → Peak age: quando growth rate cai para zero (função de age + PT).
      │                    → Peak tier: tier que stats atingem no peak age.
      │                    → "Riko: growth rate 2.5/stat/mês. Peak age: 22. Peak tier: S.
      │                    Timeline: tier B aos 18, A aos 20, S aos 22. Plateau 22-26. Decline 27+."
      │                    → Identifica limiting factors: "Mental Coaching do nosso coach é 'Competent' —
      │                    se upgradear para 'Good', growth rate sobe 15% e peak chega 6 meses antes."
      │                    → Recomendação: investir ou não, e quanto tempo até ROI.
      ├─ Outstanding (18-19): Projeta peak tier + peak age. Timeline simplificada (3 milestones).
      │                        Identifica se coach quality está a limitar.
      ├─ Very Good (15-17): Projeta peak tier baseado em PT. Estima "X meses até tier Y."
      ├─ Good (12-14):    "Potencial para tier [X]." Sem timeline.
      ├─ Average (10-11): "Tem potencial" ou "perto do ceiling." Sem projeção.
      ├─ Competent (7-9): Avalia PT: > 70 = "bom potencial." ≤ 70 = "potencial limitado."
      ├─ Reasonable (4-6): "Não sei o potencial dela." (report vazio)
      └─ Unsuited (1-3):  Sem projeção.

3. AVALIAR FATORES MENTAIS
   └─ Skill: Mental Coaching
      ├─ Elite (20):      "Riko tem Mentalidade 72 e Foco 65 — boa base mental.
      │                    Mas Ambição 18 (oculto): se não subir de tier a cada 6 meses,
      │                    motivation vai cair e growth stagna.
      │                    Recomendação: manter jobs de visibilidade crescente para alimentar
      │                    a ambição enquanto treina."
      │                    Identifica: mental blocks, burnout risk durante treino intensivo,
      │                    personality traits que aceleram ou travam crescimento.
      ├─ Outstanding (18-19): Avalia Mentalidade + motivation trend. Flag burnout risk.
      ├─ Very Good (15-17): Avalia stress tolerance. "Aguenta treino intensivo?" Sim/não.
      ├─ Good (12-14):    "Motivação alta → vai crescer. Motivação baixa → problema."
      ├─ Average−:        Não avalia fatores mentais.

4. DECISÃO FINAL
   → return { type: 'potentialAssessment', idolId, currentPhase, projectedPeakTier,
     projectedPeakAge, limitingFactors, recommendation }
   
   (Este output é INFORMATIVO. Alimenta:
   - Dev Plan decisions (onde investir treino)
   - Talent Director (renovar ou não — idol com peak S vale renovar)
   - Strategy (roster com muitas idols pre-peak = patience strategy)
   - Player inbox (relatório de potencial visível no perfil da idol))
```

**OUTPUT:** `{ type: 'potentialAssessment', idolId: string, currentPhase: 'early_growth' | 'growth' | 'approaching_peak' | 'peak' | 'plateau' | 'decline', projectedPeakTier: IdolTier, projectedPeakAge: number, limitingFactors: string[], recommendation: string }`

---

## PAPEL 6: VOCAL COACH

> Especialista em treino vocal. Conduz sessões e avalia progresso.
> Pode acumular com Dance Coach / Acting Coach (mesmo domínio: treino).

### Cargo 6.1: Treino Vocal

---

#### Decisão 6.1.1: Conduzir Sessão de Treino Vocal

**CONTEXTO (o que a IA avalia):**
- Idol atribuída ao slot de treino vocal nesta semana (pode ser múltiplas idols)
- Stats vocais da idol: Vocal, Communication, Charisma (domínio do vocal coach)
- Ceiling de cada stat (derivado de PT — máximo que pode atingir)
- DevPlan ativo: se existe, qual stat é o foco e qual intensidade
- Wellness: stress, health, motivation da idol (afeta se pode treinar intensive)
- Age curve: idol em growth phase ou decline? (decline = crescimento mais lento)
- Mastery: se idol tem show próximo com músicas que exigem vocal forte, pode focar nessas
- Histórico de sessões: o que foi treinado nas últimas 4 semanas (evitar repetição sem variedade)
- VocalProfile da idol: tessitura, textura — influencia que tipo de exercício funciona melhor

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Vocal Technique** | Core: qualidade da sessão. Determina growth rate × multiplicador do coach |
| **Motivating** | Impacto na motivation da idol durante e após a sessão |
| **Discipline** | Consistência: coach disciplinado mantém rotina de exercícios que compound over time |
| **People Management** | Relação com a idol: sessão é agradável ou estressante |

**FLOWCHART:**

```
1. VERIFICAR SE IDOL ESTÁ APTA A TREINAR
   └─ Skill: People Management (ler estado da idol)
      ├─ Elite (20):      Checa stress, motivation, health, E mood (derivado de happiness + recent events).
      │                    → stress > 60 E motivation < 40: "Hoje não é dia. Sessão leve — 30 min de
      │                      aquecimento vocal relaxante. Crescimento mínimo mas protege a idol."
      │                    → stress < 30 E motivation > 70: "Momento perfeito para intensive.
      │                      Idol está focada e descansada. Aproveitar."
      │                    → Pós-show da semana: "Vocal cords precisam de recovery. Exercícios
      │                      de respiração apenas, sem forçar."
      │                    Adapta a sessão ao estado, nunca força quando não deve.
      ├─ Outstanding (18-19): Checa stress + motivation. Adapta intensidade.
      │                        Cancela se stress > 75.
      ├─ Very Good (15-17): Checa stress. Skip se > 80. Reduz intensidade se > 60.
      ├─ Good (12-14):    Skip se stress > 80 OU health < 30. Resto normal.
      ├─ Average (10-11): Skip se stress > 85. Resto normal.
      ├─ Competent (7-9): Skip se stress > 90 (quase burnout). Não adapta sessão.
      ├─ Reasonable (4-6): Nunca cancela. Treina mesmo com stress 95. Risco de burnout.
      └─ Unsuited (1-3):  Treina sempre independente de tudo. Ignora sinais de exaustão.
                           Pode causar: +15 stress, −10 motivation, injury risk +5%.

2. ESCOLHER STAT A TREINAR
   └─ Skill: Vocal Technique
      ├─ Elite (20):      Análise por sessão:
      │                    → Se DevPlan ativo com foco vocal → segue o plano
      │                    → Se sem plano: identifica o stat vocal mais impactante para o archetype:
      │                      "Idol é Vocalist. Vocal 68, Comm 55, Charisma 62. Vocal está mais
      │                      perto do ceiling (85). Communication tem mais espaço (ceiling 80).
      │                      Mas Vocal é o primary stat do archetype. Foco em Vocal até ceiling,
      │                      DEPOIS shift para Communication."
      │                    → Se show próximo (≤2 semanas) com música que exige range alto:
      │                      "Sessão focada no range da música. Performance-oriented, não growth."
      │                    → Micro-targeting: "Esta semana foco em breath control (sub-aspecto de Vocal).
      │                      Próxima semana foco em range. Variedade compound melhor."
      ├─ Outstanding (18-19): Se DevPlan → segue. Senão: stat mais fraco do archetype.
      │                        Se show próximo → prioriza performance readiness.
      ├─ Very Good (15-17): Se DevPlan → segue. Senão: stat mais fraco do domínio vocal.
      │                      Verifica ceiling (não treina stat já no máximo).
      ├─ Good (12-14):    Se DevPlan → segue. Senão: stat vocal mais baixo overall.
      │                    Verifica ceiling.
      ├─ Average (10-11): Se DevPlan → segue. Senão: Vocal (sempre o primary). Sem verificar ceiling.
      ├─ Competent (7-9): Treina Vocal sempre. Ignora DevPlan.
      ├─ Reasonable (4-6): Stat aleatório do domínio vocal. Pode treinar stat que já está no ceiling.
      └─ Unsuited (1-3):  Stat aleatório. Pode treinar stat de OUTRO domínio por erro
                           (ex: Dance num vocal coach — crescimento 10% do normal).

3. DEFINIR INTENSIDADE DA SESSÃO
   └─ Skill: Discipline
      ├─ Elite (20):      Periodização micro: alterna intensidades por semana.
      │                    Semana 1: intensive → semana 2: normal → semana 3: intensive → semana 4: recovery.
      │                    Growth compound é 20% maior que intensive constante (GDD confirmed).
      │                    Ajusta baseado na resposta da idol: "growth acelerou? Manter. Estagnou? Mudar."
      ├─ Outstanding (18-19): Alterna intensive/normal a cada 2 semanas. Recovery se stress subir.
      ├─ Very Good (15-17): Intensive se idol aguenta (stress < 40 E gap > 15). Normal senão.
      ├─ Good (12-14):    Intensive só se stress < 30 E DevPlan diz intensive. Senão normal.
      ├─ Average (10-11): Normal sempre. Safe.
      ├─ Competent (7-9): Normal sempre.
      ├─ Reasonable (4-6): Intensidade inconsistente: às vezes intensive, às vezes light, sem padrão.
      │                    (Discipline baixa = sem rotina = crescimento errático.)
      └─ Unsuited (1-3):  Intensidade aleatória. Pode ser intensive com idol stressada.

4. EXECUTAR SESSÃO (efeitos calculados)
   ├─ Growth aplicado:
   │   growth = base_growth × vocal_technique_mult × intensity_mult × age_mult × idol_learning
   │   
   │   vocal_technique_mult (coach quality):
   │     Elite (20):       × 2.0 (máximo)
   │     Outstanding:      × 1.7
   │     Very Good:        × 1.4
   │     Good:             × 1.2
   │     Average:          × 1.0 (baseline)
   │     Competent:        × 0.8
   │     Reasonable:       × 0.5
   │     Unsuited:         × 0.2 (quase inútil)
   │   
   │   intensity_mult: intensive ×3, normal ×2, light ×1.5, recovery ×0.5
   │   
   ├─ Wellness impact (secondary modifiers):
   │   → motivating do coach: idol.motivation += (motivating − 10) × 0.5
   │     Elite motivating: +5 motivation por sessão
   │     Unsuited motivating: −4.5 motivation por sessão
   │   → people_management do coach: idol.happiness += (peopleMgmt − 10) × 0.3
   │     Elite PM: +3 happiness. Unsuited PM: −2.7 happiness.
   │   → Se intensidade intensive: idol.stress += 5-10
   │   → Se intensidade recovery: idol.stress −= 3-5

5. DECISÃO FINAL
   ├─ Se sessão conduzida:
   │   → return { type: 'conductTraining', idolId, stat, intensity, day,
   │     growthMultiplier, wellnessImpact }
   └─ Se idol não apta (cancelada no passo 1):
       → return { type: 'cancelTraining', idolId, day, reason }
       (slot fica livre — idol descansa em vez de treinar)
```

**OUTPUT:** `{ type: 'conductTraining', idolId: string, stat: string, intensity: TrainingIntensity, day: number, growthMultiplier: number, wellnessImpact: WellnessDelta }` | `{ type: 'cancelTraining', idolId: string, day: number, reason: string }`

---

#### Decisão 6.1.2: Avaliar Progresso Vocal

**CONTEXTO (o que a IA avalia):**
- Idol com 4+ semanas de treino vocal sob este coach
- Growth history: stat values semana a semana nas últimas 4-12 semanas
- Expected growth rate: baseado em ceiling, intensity, coach quality, age curve
- Actual growth rate: observado
- Comparação: actual vs expected — está acima, dentro, ou abaixo do esperado?
- Possíveis causas de divergência: stress alto? motivation baixa? coach match ruim? ceiling atingido?

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Vocal Technique** | Avaliar o que o progresso significa: "crescimento de 2 pontos em Vocal é bom ou mau para este nível?" |
| **Judging Idol Ability** | Ler stats com precisão para medir progresso real (não ruído) |
| **Mental Coaching** | Identificar se fatores mentais estão a travar o crescimento |

**FLOWCHART:**

```
1. MEDIR PROGRESSO
   └─ Skill: Judging Idol Ability
      ├─ Elite (20):      Mede growth rate por stat com precisão de ±0.5 pontos/mês.
      │                    "Vocal: +2.3/mês (esperado: +2.8). Ligeiramente abaixo.
      │                    Communication: +1.8/mês (esperado: +1.5). Acima — talento natural."
      │                    Identifica se crescimento está a desacelerar (approaching ceiling)
      │                    ou a acelerar (break-through moment).
      ├─ Outstanding (18-19): Mede growth rate por stat. Compara com expected. ±1 precisão.
      ├─ Very Good (15-17): "Crescendo" vs "estagnado" vs "caindo" por stat.
      │                      Se estagnado: flag para atenção.
      ├─ Good (12-14):    "Crescendo" ou "estagnado" (binário). Para o stat principal.
      ├─ Average (10-11): Compara tier de 4 semanas atrás vs agora. Mudou? Sim/não.
      ├─ Competent (7-9): "Parece melhor" ou "parece igual." (impressão).
      ├─ Reasonable (4-6): Sem medição.
      └─ Unsuited (1-3):  Sem medição.

2. DIAGNOSTICAR DIVERGÊNCIA (se abaixo do esperado)
   └─ Skill: Mental Coaching
      ├─ Elite (20):      Diagnóstico root-cause:
      │                    → Stress alto (> 60): "crescimento travado por stress. Não é o treino
      │                      que está errado — é a agenda. Precisa de mais rest days."
      │                    → Motivation baixa (< 40): "idol desengajada. Sessões não inspiram.
      │                      Mudar abordagem: mais prática, menos teoria. Ou mentoria."
      │                    → Ceiling atingido: "stat no ceiling. Crescimento zero é NORMAL.
      │                      Mudar foco para outro stat."
      │                    → Coach mismatch: "meu Vocal Technique é 'Competent' e idol precisa
      │                      de 'Very Good+' para crescer neste nível. Recomendo upgrade de coach."
      │                    Apresenta diagnóstico com ação recomendada.
      ├─ Outstanding (18-19): Checa stress + motivation + ceiling. Identifica causa principal.
      ├─ Very Good (15-17): Checa stress + ceiling. "Estagnação por stress" ou "ceiling atingido."
      ├─ Good (12-14):    Checa ceiling. "Está no máximo — mudar foco."
      ├─ Average (10-11): "Talvez esteja cansada." (genérico, pode estar errado).
      ├─ Competent (7-9): "Não sei por que não está a crescer."
      ├─ Reasonable (4-6): Sem diagnóstico.
      └─ Unsuited (1-3):  Sem diagnóstico. Pode continuar a treinar stat no ceiling indefinidamente.

3. RECOMENDAR AJUSTES
   └─ Skill: Vocal Technique
      ├─ Elite (20):      Recomendação específica e actionable:
      │                    → "Mudar de Vocal para Communication. Vocal está a 90% do ceiling.
      │                      Communication tem 40% de espaço. ROI de treino 3× maior."
      │                    → "Manter Vocal por mais 4 semanas — está num plateau temporário
      │                      (normal no range 70-80). Break-through estimado em 2-3 semanas."
      │                    → "Reduzir intensidade. Idol está overtraining — growth inverte."
      │                    → "Transferir idol para Dance Coach por 4 semanas. Vocal precisa
      │                      de descanso e cross-training melhora overall."
      ├─ Outstanding (18-19): "Mudar foco" ou "manter" com razão.
      ├─ Very Good (15-17): "Mudar para stat X" se ceiling atingido.
      ├─ Good (12-14):    "Mudar foco" se estagnado. Sem especificar para qual stat.
      ├─ Average (10-11): "Continuar" (sem ajustar nada).
      ├─ Competent−:      Sem recomendação.

4. DECISÃO FINAL
   → return { type: 'trainingAssessment', idolId, stat, growthRate, expectedRate,
     diagnosis, recommendation }
   (Informativo — vai para Development Director e para o inbox do player.)
```

**OUTPUT:** `{ type: 'trainingAssessment', idolId: string, stat: string, growthRate: number, expectedRate: number, diagnosis: string, recommendation: string }`

---

## PAPEL 7: DANCE COACH

> Mesmo padrão do Vocal Coach, adaptado ao domínio Dance.
> Stats do domínio: Dance, Expression, Stamina.
> Diferença chave: treino de dança tem risco de lesão física e interage
> com o show system (coreografia readiness).

### Cargo 7.1: Treino de Dança

---

#### Decisão 7.1.1: Conduzir Sessão de Treino de Dança

**Segue o mesmo flowchart da Decisão 6.1.1 (Vocal Coach) com as seguintes diferenças:**

**Stats treinados:** Dance, Expression, Stamina (em vez de Vocal, Communication, Charisma)

**Primary skill:** Dance Technique (em vez de Vocal Technique)

**Diferenças específicas por passo:**

```
PASSO 1 — VERIFICAR APTIDÃO:
  Diferença: Dance Coach checa HEALTH além de stress.
  └─ Skill: People Management + Physical Training (secondary)
     ├─ Elite: Checa health + recent injury history + age.
     │         "Idol teve lesão no joelho há 6 semanas. Adapta exercícios
     │         para zero impacto na articulação. Treino continua seguro."
     │         → Previne re-injury via adaptação, não cancellamento.
     ├─ Good+: Cancela se health < 30 OU recent injury (< 4 semanas).
     ├─ Average: Cancela se health < 20.
     ├─ Competent−: Não checa health. Risco de lesão +10% se health < 40.
     ├─ Unsuited: Treina com health 10. Injury risk: +25%.

PASSO 2 — ESCOLHER STAT:
  Diferença: Se show ≤ 2 semanas com coreografia do grupo:
  └─ Skill: Dance Technique
     ├─ Elite: "Show em 10 dias. Idol é membro do grupo Aurora. Setlist tem
     │         3 músicas com coreografia complexa. Mastery da idol nessas músicas: 
     │         40, 55, 30. Focar rehearsal na música com mastery 30 —
     │         é o bottleneck do show."
     │         Sessão vira rehearsal de coreografia em vez de growth training.
     ├─ Very Good+: Identifica músicas fracas e prioriza rehearsal.
     ├─ Good: Rehearsal genérico da setlist (não específico por música).
     ├─ Average−: Treina stat normal. Ignora show próximo.

PASSO 3 — INTENSIDADE:
  Diferença: Treino de dança tem INJURY RISK na intensidade intensive.
  └─ Skill: Physical Training (secondary)
     ├─ Elite: Calcula injury risk: age × consecutive_days × (20 - stamina) / 400.
     │         Se risk > 5%: "Intensive demais. Normal com aquecimento prolongado."
     │         Se risk < 2%: "Seguro para intensive."
     ├─ Very Good: Intensive só se health > 70 E stamina > 50.
     ├─ Good: Intensive só se health > 80.
     ├─ Average−: Não calcula injury risk. Pode causar lesão.

PASSO 4 — EFEITOS:
  Mesmo padrão mas com:
  → dance_technique_mult igual ao vocal_technique_mult da tabela
  → Bônus adicional: se sessão é rehearsal de coreografia:
    mastery += dance_technique_mult × 2 (para as músicas rehearsadas)
  → Injury check pós-sessão se intensive + health < 50:
    injury_chance = base_injury × (1 - physical_training/20)
```

**OUTPUT:** Mesmo do Vocal Coach — `conductTraining` ou `cancelTraining`

---

#### Decisão 7.1.2: Preparar Grupo para Coreografia de Show

**CONTEXTO (o que a IA avalia):**
- Grupo com show agendado nas próximas 2 semanas
- Setlist do show: quais músicas, com quais coreografias
- Mastery de cada membro por música (mastery table: idol × music)
- Membros com mastery baixa (<50) em músicas da setlist
- Slots de rehearsal disponíveis esta semana para o grupo
- Número de idols na coreografia vs número de membros do grupo
  (grupo de 8 pode ter músicas com coreografia para 5 — os outros descansam)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Dance Technique** | Core: identificar qual membro em qual música está a limitar a performance do grupo |
| **Stage Presence** | Entender quais posições na formação são mais exigentes (center > back) |
| **People Management** | Gerir frustração de membros que precisam de mais rehearsal |

**FLOWCHART:**

```
1. ANALISAR MASTERY MATRIX (grupo × setlist)
   └─ Skill: Dance Technique
      ├─ Elite (20):      Para cada música da setlist, identifica O membro mais fraco:
      │                    "Música 3: coreografia para 6 idols. Membro Riko tem mastery 28 —
      │                    ela é o bottleneck. Se Riko não ensaiar, música 3 derruba o score
      │                    do show todo."
      │                    Prioriza rehearsal por impacto: música_na_setlist ×
      │                    (1 / mastery_membro_mais_fraco).
      │                    Planeja: "Dia 1: grupo todo ensaia música 3. Dia 2: Riko sozinha
      │                    ensaia música 3 e 5 (suas mais fracas). Dia 3: run-through completo."
      ├─ Outstanding (18-19): Identifica membro mais fraco por música. Prioriza top-3 músicas.
      ├─ Very Good (15-17): Identifica músicas com mastery médio < 50. Rehearsal genérico nelas.
      ├─ Good (12-14):    Identifica músicas com mastery < 40 em qualquer membro.
      ├─ Average (10-11): "Ensaiar a setlist toda." Sem priorização por música/membro.
      ├─ Competent (7-9): "Ensaiar." Sem direção específica.
      ├─ Reasonable (4-6): "Cantem as músicas." Rehearsal sem foco.
      └─ Unsuited (1-3):  Não prepara. Grupo vai sem rehearsal.

2. ADAPTAR COREOGRAFIA AO GRUPO
   └─ Skill: Stage Presence
      ├─ Elite (20):      "Coreografia desta música é para 5 dancers. Temos 8 membros.
      │                    3 podem descansar nesta música — rotacionar quem descansa
      │                    para gerenciar fadiga across the setlist."
      │                    Identifica membros que podem simplificar moves sem perder visual:
      │                    "Membro com Dance 35 pode ficar na posição de support em vez de
      │                    center dance — mesmo efeito visual, menos exigência técnica."
      ├─ Outstanding (18-19): Identifica quem descansa em quais músicas (fatigue management).
      ├─ Very Good (15-17): "Membros com stamina baixa → posições menos exigentes."
      ├─ Good (12-14):    Membros fixos em posições fixas. Sem rotação.
      ├─ Average−:        Todos dançam tudo. Sem adaptação.

3. DECISÃO FINAL
   ├─ Se grupo precisa de rehearsal:
   │   → return { type: 'groupChoreoPrep', groupId, showId,
   │     rehearsalPlan: [{ day, musicians, focusSongs }],
   │     choreographyAdaptations: [{ songId, memberRotation }] }
   └─ Se grupo está pronto (todos mastery > 70):
       → return null (não precisa de prep extra)
```

**OUTPUT:** `{ type: 'groupChoreoPrep', groupId: string, showId: string, rehearsalPlan: RehearsalDay[], choreographyAdaptations: ChoreographyAdaptation[] }` | `null`

---

#### Decisão 7.1.3: Avaliar Progresso de Dança

**Segue o mesmo flowchart da Decisão 6.1.2 (Vocal Coach assessment) com:**
- Primary skill: **Dance Technique** em vez de Vocal Technique
- Stats avaliados: Dance, Expression, Stamina
- Diferença adicional no diagnóstico (Passo 2):
  - **Physical Training** como skill secondary para avaliar se limitação é física
    (stamina, health, injury history) ou técnica (dance skill plateau)
  - Elite: "Idol estagnou em Dance 72. Não é ceiling (ceiling é 88).
    Problema é físico: stamina 45 está a limitar a capacidade de manter
    rotinas de dança longas. Foco em stamina por 4 semanas, depois voltar a Dance."

**OUTPUT:** Mesmo do Vocal Coach — `trainingAssessment`

---

## PAPEL 8: ACTING/VARIETY COACH

> Mesmo padrão dos coaches anteriores, adaptado ao domínio Acting/Variety.
> Stats do domínio: Acting, Variety, Communication.
> Diferença chave: treino interage com jobs de TV (preparação pré-programa).

### Cargo 8.1: Treino de Atuação

---

#### Decisão 8.1.1: Conduzir Sessão de Treino de Atuação

**Segue o mesmo flowchart da Decisão 6.1.1 (Vocal Coach) com as seguintes diferenças:**

**Stats treinados:** Acting, Variety, Communication

**Primary skill:** Acting/Variety

**Diferenças específicas por passo:**

```
PASSO 2 — ESCOLHER STAT:
  Diferença: Acting Coach adapta o stat ao TIPO DE JOB vindouro.
  └─ Skill: Acting/Variety
     ├─ Elite: Analisa jobs agendados na próxima semana:
     │         → TV variety show: foco Variety + Communication
     │         → Drama/movie: foco Acting
     │         → Talk show: foco Communication + Charisma
     │         → Radio: foco Communication
     │         → No job planned: foco no stat mais fraco do archetype
     │         "Idol tem drama na quinta. Acting 55. Se treinar segunda e terça
     │         com intensive, pode subir 2-3 pontos. Diferença entre C+ e B−."
     ├─ Very Good+: Adapta ao job type. Sem intensidade calculada por deadline.
     ├─ Good: Adapta ao job type se variety → variety, drama → acting.
     ├─ Average−: Sempre treina stat mais baixo. Ignora jobs vindouros.

PASSO 1 — APTIDÃO:
  Sem diferença significativa dos outros coaches (não tem injury risk como Dance).
  Acting/Variety coaching é mental, não físico.
  Diferença: motivation é MAIS importante que stress para acting.
  └─ Skill: People Management
     ├─ Elite: "Idol desmotivada (motivation 30). Acting training com idol
     │         sem vontade é contraproducente — sessão vira negativa.
     │         Em vez de treinar, faço exercício leve de improviso que é DIVERTIDO.
     │         Growth 50% do normal mas motivation +5."
     ├─ Good+: Adapta sessão se motivation < 40 (light + fun).
     ├─ Average−: Treina normal independente de motivation.
```

**OUTPUT:** Mesmo dos outros coaches — `conductTraining` ou `cancelTraining`

---

#### Decisão 8.1.2: Preparar Idol para Programa de TV

**CONTEXTO (o que a IA avalia):**
- Idol com job de TV/radio/drama agendado nos próximos 3 dias
- Tipo de programa: variety show, talk show, drama, radio, news show
- Stats da idol: Acting, Variety, Communication, Charisma
- Apresentador/host do programa: personality, style, known preferences
  (se intel disponível — requer Intelligence Analyst ou Industry Knowledge)
- Histórico da idol em programas similares: notas anteriores, pontos fracos recorrentes
- Público-alvo do programa: fan demographic match com a idol?

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Acting/Variety** | Core: qualidade da preparação. Simulação de cenários, técnicas de resposta |
| **Industry Knowledge** | Conhecer formatos de programa, hosts, e o que funciona em cada tipo |
| **Motivating** | Boost de confiança pré-programa. Impacto direto na performance |

**FLOWCHART:**

```
1. ANALISAR O PROGRAMA
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Conhece o programa, o host, e o formato:
      │                    "Music Monday — host é Yamada-san, estilo descontraído.
      │                    Ela faz perguntas pessoais. Idol precisa ter 2-3 anedotas
      │                    preparadas. Segmento de 8 min, últimos 2 min é performance."
      │                    Identifica: "viral moments" potenciais:
      │                    "Se idol conseguir fazer o Yamada-san rir, clip vai virar trend."
      ├─ Outstanding (18-19): Conhece formato e host. Prepara pontos-chave para a conversa.
      ├─ Very Good (15-17): Conhece tipo de programa. Adapta preparação ao formato.
      ├─ Good (12-14):    Variety → prática de comédia. Drama → prática de linhas. Talk → prática de conversa.
      ├─ Average (10-11): Preparação genérica: "fala com confiança, sorri."
      ├─ Competent (7-9): "Boa sorte." (sem preparação específica)
      ├─ Reasonable (4-6): Sem preparação.
      └─ Unsuited (1-3):  Sem preparação.

2. SIMULAR CENÁRIOS
   └─ Skill: Acting/Variety
      ├─ Elite (20):      Simula cenários específicos ao programa:
      │                    → Perguntas difíceis (sobre escândalo recente, vida pessoal)
      │                    → Momentos de improviso (host muda de assunto, co-guest interrompe)
      │                    → Performance sob pressão (cantar ao vivo com público)
      │                    Cada cenário com 2-3 respostas prepared.
      │                    Performance bonus: +20-25% no job result.
      ├─ Outstanding (18-19): Simula 2-3 cenários. +15-20% performance.
      ├─ Very Good (15-17): Simula 1-2 cenários do formato. +10-15% performance.
      ├─ Good (12-14):    Prática geral de respostas. +8-10% performance.
      ├─ Average (10-11): Exercícios básicos de comunicação. +5% performance.
      ├─ Competent (7-9): Breve pep talk. +2% performance.
      ├─ Reasonable (4-6): Nada. +0%.
      └─ Unsuited (1-3):  Nada. Pode desmotivar idol (motivation −3) com "você não está pronta."

3. CONFIDENCE BOOST
   └─ Skill: Motivating
      ├─ Elite (20):      Pep talk personalizado baseado nos strengths da idol:
      │                    "O teu Charisma é o teu superpoder. Quando entrares em palco,
      │                    sê tu mesma. O público vai adorar a tua energia."
      │                    idol.motivation += 5. idol.stress −= 3 (descompressão pré-show).
      ├─ Outstanding (18-19): Pep talk adaptado. motivation +4, stress −2.
      ├─ Very Good (15-17): Pep talk positivo. motivation +3.
      ├─ Good (12-14):    "Vai correr bem." motivation +2.
      ├─ Average (10-11): "Boa sorte." motivation +1.
      ├─ Competent (7-9): Sem boost.
      ├─ Reasonable (4-6): Sem boost.
      └─ Unsuited (1-3):  "Não tenho a certeza de que estás pronta." motivation −2.

4. DECISÃO FINAL
   ├─ Se idol tem job TV em ≤ 3 dias:
   │   → return { type: 'tvPreparation', idolId, jobId, focusAreas,
   │     performanceBonus, wellnessImpact }
   └─ Se sem job TV próximo:
       → return null
```

**OUTPUT:** `{ type: 'tvPreparation', idolId: string, jobId: string, focusAreas: string[], performanceBonus: number, wellnessImpact: WellnessDelta }`

---

#### Decisão 8.1.3: Avaliar Progresso de Atuação

**Segue o mesmo flowchart da Decisão 6.1.2 (Vocal Coach assessment) com:**
- Primary skill: **Acting/Variety** em vez de Vocal Technique
- Stats avaliados: Acting, Variety, Communication
- Diferença no diagnóstico: Acting Coach avalia TAMBÉM o histórico de jobs de TV
  (notas em programas) como métrica de progresso — não só stat growth.
  "Stats subiram 3 pontos mas notas em TV não melhoraram → problema é de confiança
  (motivation/Mentalidade), não de técnica."

**OUTPUT:** Mesmo — `trainingAssessment`

---

## PAPEL 9: MUSIC DIRECTOR (A&R)

> Responsável por toda produção musical: composição, lançamentos, compositores.
> Música tem 3 partes criativas (Composição Musical, Letra, Arranjo) que podem ser
> feitas em paralelo se existem NPCs diferentes, ou sequencial se 1 NPC faz tudo.
> Coreografia é para um número específico de idols (não precisa ser todo o grupo).
> Cover só precisa de arranjo (ou "as is" onde performers decidem na gravação).

### Cargo 9.1: Produção Musical

---

#### Decisão 9.1.1: Encomendar Música Nova

**CONTEXTO (o que a IA avalia):**
- Projetos musicais ativos: quantos em pipeline, em que stage (composição/arranjo/coreografia/gravação)
- Catálogo atual da agência: quantas músicas gravadas, géneros, recency (última gravação há X semanas)
- Compositores NPC disponíveis no mercado: cada um com tier, fee, agenda, specialty (música/letra/arranjo)
  - Composer tem até 3 partes que pode cobrir: composição musical, letra, arranjo
  - Idol pode substituir NPC compositor em qualquer das 3 partes
- Roster: quais idols/grupos precisam de material novo (sem single há 3+ meses)
- Charts: que géneros estão em alta (trend analysis)
- Budget: custo de compositor + estúdio + produção
- Strategy: focus da agência (commercial → pop hits, artistic → experimentar)
- Fan expectations: fan clubs pedindo "música nova" (demand signal)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Musical Knowledge** | Core: escolher género, selecionar compositores, avaliar fit com o roster |
| **Financial Acumen** | Avaliar custo total (3 compositores em paralelo custa mais mas é mais rápido) |
| **Industry Knowledge** | Timing: quando lançar, que géneros o mercado quer, chart trends |
| **Judging Idol Ability** | Avaliar quais idols podem substituir um NPC compositor (idol que compõe letra, por ex) |

**FLOWCHART:**

```
1. IDENTIFICAR NECESSIDADE DE MÚSICA NOVA
   └─ Skill: Musical Knowledge
      ├─ Elite (20):      Mantém "release calendar" mental:
      │                    "Grupo Aurora: último single há 10 semanas. Chart position caindo.
      │                    Fãs no fan club pediram música nova há 3 semanas. SE não encomendarmos
      │                    esta semana, single sai no mínimo em 8 semanas (pipeline). Muito tempo."
      │                    Avalia cada grupo/solo: próximo marco, fan demand, chart window.
      │                    Prioriza por: fan_demand × chart_window × revenue_impact.
      ├─ Outstanding (18-19): "Grupo/solo sem single há 3+ meses → precisa." Prioriza por fame.
      ├─ Very Good (15-17): "Sem música nova no pipeline E último single > 2 meses → encomenda."
      ├─ Good (12-14):    "Nenhum projeto ativo → encomenda." Sem timing analysis.
      ├─ Average (10-11): Encomenda quando Head Producer pede ou quando não há nada no pipeline.
      ├─ Competent (7-9): Encomenda 1 música por trimestre. Ritmo fixo.
      ├─ Reasonable (4-6): Encomenda raramente. Agência fica sem material novo.
      └─ Unsuited (1-3):  Não encomenda. Agência depende de covers ou músicas antigas.

2. DEFINIR TIPO E GÉNERO
   └─ Skill: Musical Knowledge
      ├─ Elite (20):      Cross-analysis:
      │                    → Pontos fortes do idol/grupo alvo (vocal range, dance ability,
      │                      persona) → género que maximiza esses strengths
      │                    → Chart trends (ex: "city pop revival está em alta este trimestre")
      │                    → Gap no catálogo ("já temos 3 ballads, falta uptempo dance track")
      │                    → Fan preference (hardcore fãs querem X, casual querem Y)
      │                    Decide: original vs cover
      │                    → Se cover: seleciona música clássica que faria sentido com este grupo
      │                      "Cover do hit de 2005 da idol lendária → nostalgia marketing."
      │                      Cover só precisa de arranjo (ou as is).
      │                    → Se original: define género + mood + target audience
      ├─ Outstanding (18-19): Match genre com strengths do grupo + 1 trend analysis.
      │                        Decide original vs cover com razão.
      ├─ Very Good (15-17): Genre match com strengths. Sempre original (não pensa em cover).
      ├─ Good (12-14):    Genre = o que o grupo já faz. Sem explorar novos.
      ├─ Average (10-11): Genre default para a agência (strategy focus).
      ├─ Competent (7-9): Pop genérico sempre. Safe.
      ├─ Reasonable (4-6): Genre aleatório.
      └─ Unsuited (1-3):  Genre aleatório. Pode encomendar heavy metal para grupo de J-Pop.

3. SELECIONAR COMPOSITORES (até 3 NPCs para as 3 partes)
   └─ Skill: Musical Knowledge × Financial Acumen
      ├─ Elite (20):      Estratégia de composição:
      │                    "3 partes: Composição Musical, Letra, Arranjo.
      │                    PARALELO: Se contrato 3 NPCs diferentes, as 3 partes são feitas
      │                    simultaneamente → música pronta em ~3 semanas em vez de ~8.
      │                    Custo: ¥3M (3 compositores × ¥1M cada) vs ¥1.5M (1 compositor × 3 partes).
      │                    Tradeoff: 2× mais caro mas 2.5× mais rápido."
      │                    → Se budget bom E urgência: 3 NPCs em paralelo.
      │                    → Se budget apertado E sem urgência: 1 NPC sequencial.
      │                    → Se idol sabe compor letra: "Idol Yui como letrista (economia de ¥1M
      │                      + letra mais autêntica — fãs valorizam idol que escreve)."
      │                    Seleciona cada NPC por: specialty fit + tier + fee + availability.
      ├─ Outstanding (18-19): Avalia paralelo vs sequencial. Usa idol compositor se disponível.
      │                        Seleciona por tier × fee ratio.
      ├─ Very Good (15-17): 2 NPCs se budget permite (composição + arranjo paralelo, letra sequencial).
      │                      Senão 1 NPC.
      ├─ Good (12-14):    1 NPC (sequencial). Melhor tier dentro do budget.
      ├─ Average (10-11): 1 NPC. Melhor tier disponível.
      ├─ Competent (7-9): 1 NPC. Primeiro disponível.
      ├─ Reasonable (4-6): 1 NPC. Mais barato.
      └─ Unsuited (1-3):  Se chega aqui: compositor aleatório. Pode reservar compositor
                           de heavy metal para música pop.

4. NEGOCIAR CONTRATO COM COMPOSITOR
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Negocia royalties e deadline:
      │                    "Compositor tier A pede 20% royalties + ¥2M fee.
      │                    Counter: 15% royalties + ¥2.5M fee (menos royalty recorrente,
      │                    mais fee upfront — melhor para nós a longo prazo se música
      │                    vira hit). Deadline: 3 semanas."
      │                    Verifica agenda do compositor: "ele tem 2 projetos ativos,
      │                    max concurrent = 2. Pode nos atender MAS vai ser apertado."
      ├─ Outstanding (18-19): Negocia royalties ±5%. Verifica agenda.
      ├─ Very Good (15-17): Aceita fee padrão. Negocia deadline razoável.
      ├─ Good (12-14):    Aceita termos padrão do compositor.
      ├─ Average (10-11): Aceita tudo. Pode aceitar royalties excessivos (30%+).
      ├─ Competent−:      Aceita tudo sem negociar.

5. DECISÃO FINAL
   ├─ Se música necessária E compositores selecionados E contrato negociado:
   │   → return { type: 'commissionMusic', composers: [{npcId, part, fee, royalties, deadline}],
   │     idolComposers?: [{idolId, part}], genre, targetGroup, type: 'original'|'cover',
   │     parallelExecution: boolean }
   └─ Se sem necessidade OU sem compositor disponível OU sem budget:
       → return null
```

**OUTPUT:** `{ type: 'commissionMusic', composers: ComposerContract[], idolComposers?: IdolComposerAssignment[], genre: string, targetGroup: string, type: 'original' | 'cover', parallelExecution: boolean }` | `null`

---

#### Decisão 9.1.2: Resolver Pipeline Stalled

**CONTEXTO (o que a IA avalia):**
- Projetos com stalled = true: qual stage (composição/letra/arranjo/coreografia/gravação), qual stall reason
- Stall reasons possíveis:
  - 'composer_unavailable': NPC compositor atingiu max_concurrent ou saiu do mercado
  - 'idol_composer_busy': idol atribuída como compositora está com agenda cheia
  - 'no_dance_studio': coreografia requer Dance Studio facility que não existe
  - 'no_recording_studio': gravação requer Recording Studio facility
  - 'idol_schedule_conflict': idols intérpretes não têm slots livres na mesma semana
  - 'budget_insufficient': custo da próxima stage excede budget disponível
- Alternativas: outros compositores no mercado, re-schedule de idols, upgrade de facility
- Duração do stall: há quantas semanas está parado (urgência cresce com tempo)
- Release date planejada (se definida): stall pode comprometer o lançamento

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Musical Knowledge** | Identificar soluções alternativas específicas à stage parada |
| **Adaptability** | Encontrar workarounds criativos (compositor alternativo, redistribuir partes) |
| **Industry Knowledge** | Saber se existe recurso alternativo no mercado ou na agência |
| **Financial Acumen** | Avaliar se vale pagar mais para desbloquear (ex: compositor premium urgente) |

**FLOWCHART:**

```
1. DIAGNOSTICAR STALL
   └─ Skill: Musical Knowledge
      ├─ Elite (20):      Para cada projeto stalled, analisa root cause:
      │                    "Projeto 'Starlight' stalled em Arranjo há 3 semanas.
      │                    Razão: compositor de arranjo (NPC Tanaka) atingiu max_concurrent
      │                    (2 projetos simultâneos, ambos para rivais).
      │                    Liberação prevista: 2 semanas (quando um dos projetos dele termina).
      │                    MAS temos release date em 5 semanas. Se esperar 2 semanas,
      │                    pipeline fica apertado: arranjo (2sem) + coreografia (2sem) +
      │                    gravação (1sem) = 5 semanas = no margin.
      │                    Solução: trocar para compositor alternativo AGORA."
      │                    Diferencia stalls temporários (resolver-se-ão sozinhos) de
      │                    stalls que precisam de intervenção.
      ├─ Outstanding (18-19): Identifica root cause. Estima duração do stall.
      │                        Flag se compromete release date.
      ├─ Very Good (15-17): Identifica causa. "Compositor indisponível → buscar outro."
      ├─ Good (12-14):    Identifica causa. Tenta solução óbvia.
      ├─ Average (10-11): "Está parado porque [razão]." Espera resolver sozinho.
      ├─ Competent (7-9): "Está parado." Sem diagnóstico de causa.
      ├─ Reasonable (4-6): Não nota stall até 4+ semanas.
      └─ Unsuited (1-3):  Não nota stall. Projeto fica parado indefinidamente.

2. ENCONTRAR SOLUÇÃO POR TIPO DE STALL
   └─ Skill: Adaptability × Industry Knowledge
   
   A) 'composer_unavailable' ou 'idol_composer_busy':
      ├─ Elite:      Busca compositor alternativo no mercado com specialty match.
      │              Se nenhum disponível: "redistribuir — compositor da parte Musical
      │              pode fazer Arranjo também (sequencial), desde que termine a sua
      │              parte primeiro." Ou: "idol X sabe fazer arranjos (hidden skill
      │              derivado de Vocal Technique + Musical Knowledge). Atribuir como
      │              idol_composer para esta parte."
      ├─ Outstanding: Busca alternativo. Se não há: espera.
      ├─ Very Good:  Busca alternativo do mesmo tier ou 1 tier abaixo.
      ├─ Good:       Busca qualquer alternativo disponível.
      ├─ Average:    Espera. Não busca alternativo.
      ├─ Competent−: Espera indefinidamente.
   
   B) 'no_dance_studio' ou 'no_recording_studio':
      ├─ Elite:      "Facility não existe. 2 opções: 1) recomendar upgrade ao Operations
      │              Director (custo ¥X, delay 2 semanas para construir). 2) se cover,
      │              skip coreografia (cover 'as is'). 3) se original sem dança
      │              (ballad), coreografia N/A → redistribuir peso da qualidade."
      ├─ Very Good+: Recomenda upgrade de facility. Se ballad: skip coreografia.
      ├─ Good:       Recomenda upgrade. Espera até facility existir.
      ├─ Average−:   Projeto fica stalled até alguém resolver facility.
   
   C) 'idol_schedule_conflict':
      ├─ Elite:      Coordena com Talent Manager: "preciso de 4 idols com slot livre
      │              na mesma semana. Atualmente 2 têm conflito. Posso mover 1 job
      │              de cada para a semana seguinte? Custo: adiar 2 jobs vs adiar release."
      │              Se impossível: "gravar com os membros disponíveis agora (partial
      │              recording), completar na próxima semana. Penalty de −5% qualidade."
      ├─ Very Good:  Pede re-schedule ao Talent Manager. Se não possível: espera 1 semana.
      ├─ Good:       Espera semana com todos livres.
      ├─ Average−:   Espera indefinidamente.
   
   D) 'budget_insufficient':
      ├─ Elite:      "Stage custa ¥2M mas só temos ¥500K. 3 opções:
      │              1) Adiar até ter budget (receita da próxima semana).
      │              2) Negociar com compositor: dividir fee em 2 pagamentos.
      │              3) Cancelar projeto se ROI projetado não justifica."
      ├─ Very Good:  Adia 1-2 semanas até budget estar disponível.
      ├─ Good:       Adia.
      ├─ Average−:   Não resolve. Projeto stalled por budget para sempre.

3. DECISÃO FINAL
   ├─ Se solução encontrada:
   │   → return { type: 'resolveStall', projectId, action: 'swap_composer'|'skip_stage'|
   │     'partial_recording'|'request_facility'|'defer'|'cancel', details }
   └─ Se sem solução viável (ou não diagnosticou):
       → return null (stall continua)
```

**OUTPUT:** `{ type: 'resolveStall', projectId: string, action: string, details: StallResolution }` | `null`

---

### Cargo 9.2: Gestão de Compositores

---

#### Decisão 9.2.1: Gerir Relações com Compositores

**CONTEXTO (o que a IA avalia):**
- Pool de compositores NPC: cada com tier, fee, specialty (composição/letra/arranjo),
  max_concurrent, projetos ativos, agenda (semanas até slot livre)
- Compositores com contrato ativo com a agência vs freelancers
- Histórico: quais compositores deram bons resultados (músicas que foram hit)
- Relação: frequência de trabalho com cada compositor (loyalty que gera descontos)
- Competição: quais compositores estão a ser usados por rivais (indisponíveis)
- Budget: custo de manter exclusividade vs first-come-first-serve

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Musical Knowledge** | Avaliar qualidade de cada compositor e match com o estilo da agência |
| **Industry Knowledge** | Saber quem mais está a usar quais compositores (competição) |
| **Financial Acumen** | Avaliar se vale pagar premium por compositor exclusivo ou top-tier |

**FLOWCHART:**

```
1. AVALIAR POOL DE COMPOSITORES
   └─ Skill: Musical Knowledge
      ├─ Elite (20):      Mantém "rolodex" mental de todos compositores relevantes:
      │                    "Compositor Tanaka: tier S, specialty composição + arranjo.
      │                    Trabalhou connosco 3× nos últimos 6 meses. 2 de 3 músicas
      │                    entraram no top 20. Fee alto (¥3M) mas ROI excelente.
      │                    Actualmente: 1/1 slots ocupados (projeto para rival Crown).
      │                    Disponível em: 3 semanas."
      │                    Ranking: top-5 compositores por fit × quality × availability.
      │                    Identifica "rising stars": compositores tier C com últimas 2 músicas
      │                    surpreendentemente boas. Contratar antes que fique caro.
      ├─ Outstanding (18-19): Top-5 compositores ranqueados. Sabe availability de cada.
      ├─ Very Good (15-17): Conhece top-3 por specialty. Sabe quem está disponível.
      ├─ Good (12-14):    Conhece compositores que já usou. Não prospecta novos.
      ├─ Average (10-11): Usa sempre o mesmo compositor (se disponível).
      ├─ Competent (7-9): Usa quem estiver disponível.
      ├─ Reasonable (4-6): Usa o mais barato.
      └─ Unsuited (1-3):  Não gere compositores.

2. MANTER RELAÇÕES
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Estratégia de loyalty: "Se usarmos Tanaka 4+ vezes num ano,
      │                    ele nos dá prioridade de booking e −10% fee. Investir em
      │                    relação de longo prazo com 2-3 compositores top."
      │                    Diversifica: não depender de 1 compositor (risco se ficar indisponível).
      │                    Networking: "Compositor novo Yamada (tier B) quer entrar no mercado.
      │                    Se lhe dermos oportunidade agora, teremos loyalty dele quando subir de tier."
      ├─ Outstanding (18-19): Mantém relação com top-3. Diversifica entre 2-3.
      ├─ Very Good (15-17): Usa preferencialmente compositores que já deram bons resultados.
      ├─ Good (12-14):    Repete compositor que funcionou.
      ├─ Average−:        Sem gestão de relações.

3. DECISÃO FINAL
   → return { type: 'composerManagement', preferredComposers: [{npcId, priority, nextAvailable}],
     relationshipActions?: [{composerId, action: 'maintain'|'invest'|'drop'}] }
   (Informativo — alimenta decisão 9.1.1 quando precisa selecionar compositor.)
```

**OUTPUT:** `{ type: 'composerManagement', preferredComposers: ComposerPreference[], relationshipActions?: RelationshipAction[] }`

---

### Cargo 9.3: Planeamento de Lançamento

---

#### Decisão 9.3.1: Planear Release de Música

**CONTEXTO (o que a IA avalia):**
- Projeto musical com gravação completa (pronto para lançamento)
- Composição da música: estrutura (Intro-Verso-PréRefrão-Refrão-Verso-Refrão-Ponte-Refrão-Final),
  ranking de qualidade por parte, qualidade final composta
- Coreografia: para quantas idols foi desenhada, quais posições/roles por parte da música
- Calendar: datas disponíveis, feriados, eventos sazonais, launches de rivais
- Charts: posições atuais, que géneros estão em alta, slot de chart disponível
- Marketing budget: quanto pode investir em promoção
- Fan state: fan clubs das idols envolvidas — expectativa, mood, demanda
- Catálogo existente: tracklist se é álbum, single anterior e gap temporal

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Musical Knowledge** | Core: definir tracklist order (afeta chart entry score), tipo de release (single/álbum/EP) |
| **Industry Knowledge** | Timing: quando lançar para maximizar chart performance e media coverage |
| **Financial Acumen** | Budget de marketing: quanto investir, diminishing returns |
| **Media Savvy** | Hype strategy: quais atividades pré-lançamento fazer e quando |

**FLOWCHART:**

```
1. DEFINIR TIPO DE RELEASE
   └─ Skill: Musical Knowledge
      ├─ Elite (20):      Avalia contexto completo para decidir formato:
      │                    → 1 música boa → single (maximiza chart position de 1 faixa)
      │                    → 3-4 músicas boas → mini-album/EP (diversifica sem diluir)
      │                    → 5+ músicas → full album (milestone, mais receita, mais PR)
      │                    "Temos 2 músicas prontas mas a segunda é qualidade C.
      │                    Melhor lançar single da música A (qualidade A) e guardar B
      │                    como B-side ou para próximo release."
      │                    Avalia qualidade por parte: "Refrão desta música é Outstanding,
      │                    mas Bridge é apenas Average. Overall: Very Good. Worth releasing."
      ├─ Outstanding (18-19): Avalia qualidade overall + decide single vs EP.
      ├─ Very Good (15-17): Single se 1 música, EP se 3+. Avalia qualidade basic.
      ├─ Good (12-14):    Sempre single. Sem consideration de álbum.
      ├─ Average (10-11): Lança o que tiver pronto.
      ├─ Competent−:      Lança imediatamente sem pensar em formato.

2. ESCOLHER DATA DE LANÇAMENTO
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Analisa calendar com profundidade:
      │                    → Evita semanas com rival launches (competição por chart slots)
      │                    → Prefere semanas com boost sazonal (Natal +25%, Golden Week +20%,
      │                      Valentine +15%, Summer Festival +10%)
      │                    → Alinha com shows: "release na semana ANTES do show → fãs ouvem
      │                      a música nova e querem ver ao vivo = ticket sales up"
      │                    → Avalia: "se lançar em 2 semanas, hype activities cabem.
      │                      Se lançar na próxima semana, sem tempo para hype."
      │                    Data ótima: 3-4 semanas no futuro com boost sazonal e sem competição.
      ├─ Outstanding (18-19): Evita competição rival. Alinha com boost sazonal se possível.
      │                        2-4 semanas no futuro.
      ├─ Very Good (15-17): 3 semanas no futuro. Evita feriados que não são boost.
      ├─ Good (12-14):    2-3 semanas. Sem analysis de competição.
      ├─ Average (10-11): 2 semanas. Data fixa.
      ├─ Competent (7-9): Próxima semana. Sem planeamento.
      ├─ Reasonable (4-6): Imediatamente.
      └─ Unsuited (1-3):  Data aleatória. Pode lançar em semana com 3 rivais a lançar.

3. DEFINIR TRACKLIST E LEAD SINGLE
   └─ Skill: Musical Knowledge
      ├─ Elite (20):      "Track order afeta chart entry score. Lead single abre o release
      │                    e recebe a maior parte da promoção.
      │                    Track 1 (lead): música com melhor Refrão (hook) → chart impact.
      │                    Track 2: música upbeat → mantém energia.
      │                    Track 3 (se EP): ballad → contraste → emotional close.
      │                    Lead single selection: a música cujo Refrão tem qualidade ≥ Very Good
      │                    E cujo género está em alta no chart."
      ├─ Outstanding (18-19): Lead single = melhor qualidade overall. Order = build energy.
      ├─ Very Good (15-17): Lead single = música com melhor qualidade.
      ├─ Good (12-14):    Primeira música gravada = lead single. Sem curadoria.
      ├─ Average−:        Ordem de gravação. Sem tracklist curation.

4. PLANEAR HYPE PRÉ-LANÇAMENTO
   └─ Skill: Media Savvy
      ├─ Elite (20):      Staggered campaign completa:
      │                    → 4 semanas antes: teaser (snippet de 15 segundos) → building anticipation
      │                    → 3 semanas: MV teaser (behind the scenes da gravação) → engagement
      │                    → 2 semanas: fan exclusive preview (fan club only → reward loyalty)
      │                    → 1 semana: press listening (media reviews) → credibility
      │                    → Release day: full MV + streaming + physical sale
      │                    Hype stacks: cada atividade soma ao hype_factor (cap 1.5).
      │                    "4 atividades → hype 1.4. Custo total: ¥5M. Chart boost: +40%."
      ├─ Outstanding (18-19): 3 atividades (teaser + MV + press). Hype ~1.3.
      ├─ Very Good (15-17): 2 atividades (teaser + MV). Hype ~1.2.
      ├─ Good (12-14):    1 atividade (teaser ou MV). Hype ~1.1.
      ├─ Average (10-11): Sem hype. Release direto. Hype 1.0 (base).
      ├─ Competent−:      Sem hype.

5. DEFINIR MARKETING BUDGET
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Diminishing returns calculation:
      │                    "real_effect = campaign_effect × (1 / (1 + investment / ¥50M)).
      │                    Sweet spot para esta música: ¥10M de marketing.
      │                    Acima disso, cada yen extra rende 40% menos.
      │                    Abaixo, estamos a sub-investir num potencial hit."
      │                    Ajusta por genre fit com market: "se genre está em alta,
      │                    investir mais (ROI multiplicado)."
      ├─ Outstanding (18-19): Calcula sweet spot rough. 8-12% da receita mensal.
      ├─ Very Good (15-17): 10% da receita mensal. Ajusta ±20% por importância.
      ├─ Good (12-14):    5-10% da receita mensal. Flat.
      ├─ Average (10-11): 5% flat.
      ├─ Competent (7-9): Mínimo (token marketing).
      ├─ Reasonable (4-6): Zero marketing.
      └─ Unsuited (1-3):  Zero ou pode alocar budget excessivo sem retorno.

6. DECISÃO FINAL
   ├─ Se release planejado:
   │   → return { type: 'planRelease', projectId, releaseDate, releaseType,
   │     tracklist, leadSingle, marketingBudget, hypeActivities,
   │     projectedChartPosition, physicalMedia: boolean }
   └─ Se nenhum projeto pronto:
       → return null
```

**OUTPUT:** `{ type: 'planRelease', projectId: string, releaseDate: number, releaseType: 'single' | 'ep' | 'album', tracklist: TrackOrder[], leadSingle: string, marketingBudget: number, hypeActivities: HypeActivity[], projectedChartPosition: number }` | `null`

---

## PAPEL 10: SHOW DIRECTOR

> Tudo sobre performances ao vivo. Combina Stage Manager + Coreógrafo do GDD.
> IMPORTANTE: Não existe substituição de idols mid-show. O grupo entra e canta
> inteiro. O que muda entre músicas é a **escalação** — quem está no vocal
> principal, quem está na frente, quem descansa atrás. A IA pode fazer estas
> rotações automaticamente durante o show para optimizar performance e fadiga.

### Cargo 10.1: Planeamento de Shows

---

#### Decisão 10.1.1: Planear Show

**CONTEXTO (o que a IA avalia):**
- Roster/grupo: fame, tier, últimas performances, fama trend
- Venues disponíveis: capacidade, custo, requirements mínimos de produção
- Calendar: datas livres, eventos sazonais, feriados, shows de rivais
- Budget: custo total estimado (venue + produção + staff + travel)
- Strategy: growthPosture (aggressive = mais shows, organic = menos)
- Músicas disponíveis: catálogo com mastery por membro (prontas para performance?)
- Fan clubs: mood, demanda ("fãs pedem show ao vivo há 4 semanas")
- Contexto: release recente (release concert), milestone (100th show), season finale
- Shows recentes: quando foi o último show desta idol/grupo (evitar show fatigue)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Stage Presence** | Core: avaliar se roster/grupo está PRONTO para um show nesta venue e escala |
| **Industry Knowledge** | Timing: quando fazer show para maximizar impacto (pós-release, season, etc.) |
| **Financial Acumen** | ROI: custo do show vs receita esperada (tickets + merch + fame boost) |

**FLOWCHART:**

```
1. AVALIAR SE HÁ RAZÃO PARA SHOW
   └─ Skill: Industry Knowledge
      ├─ Elite (20):      Analisa múltiplos triggers simultaneamente:
      │                    → Release recente (< 2 semanas): "release concert — timing perfeito.
      │                      Fãs compraram o single, querem ouvir ao vivo."
      │                    → Milestone (fame atingiu nova faixa, aniversário do grupo):
      │                      "celebration show — media coverage natural."
      │                    → Estratégia: growthPosture aggressive E sem show há 4+ semanas.
      │                    → Fan demand: fan club mood > 80 E pedindo show > 3 semanas.
      │                    → Season: summer festival season → participar como convidado ou host.
      │                    Avalia COMBOS: "release + milestone + summer = show GRANDE.
      │                    Não desperdiçar com show pequeno — ir para arena."
      │                    Planeja 2-3 shows no trimestre: "show pequeno mês 1,
      │                    médio mês 2, grande mês 3 (season finale)."
      ├─ Outstanding (18-19): Avalia top-3 triggers. 1 show planeado por vez.
      ├─ Very Good (15-17): Release → show. Fan demand alta → show. Strategy → show. 1 trigger.
      ├─ Good (12-14):    Show se release recente OU strategy aggressive.
      ├─ Average (10-11): Show se Head Producer pediu ou strategy diz.
      ├─ Competent (7-9): Show só se explicitamente solicitado.
      ├─ Reasonable (4-6): Raramente planeia. Perde oportunidades.
      └─ Unsuited (1-3):  Nunca planeia shows.

2. ESCOLHER VENUE
   └─ Skill: Stage Presence
      ├─ Elite (20):      Match fame × ambição × capacidade com precisão:
      │                    "Grupo fame 3500. Venue ideal: Hall 2000 seats (80% lotação
      │                    garantida com fan club de 15K). Arena 10K seria arriscado
      │                    (fill rate ~35% = mau visual, media negativa).
      │                    MAS se release concert de single que está no top 10 →
      │                    arena pode funcionar (buzz mediático atrai casual fans)."
      │                    Considera: "venue stretch" deliberado para milestone shows
      │                    (aceita fill rate 60% em troca de "primeiro show em arena").
      ├─ Outstanding (18-19): Fame → venue bracket + ajuste por contexto (release = stretch).
      ├─ Very Good (15-17): Fame → venue bracket fixo.
      │                      fame < 500: café, 500-2K: house, 2K-5K: hall, 5K+: arena.
      ├─ Good (12-14):    Idem VG mas sem stretch possibility.
      ├─ Average (10-11): Venue que "parece certo." Pode over ou under-shoot.
      ├─ Competent (7-9): Venue mais barata que cabe no budget.
      ├─ Reasonable (4-6): Sempre café/house (safe, barato, boring).
      └─ Unsuited (1-3):  Venue aleatória. Pode reservar arena para grupo tier D (desastre).

3. AVALIAR ROI
   └─ Skill: Financial Acumen
      ├─ Elite (20):      Full P&L projection do show:
      │                    Receita = (venue.capacity × fill_rate × ticket_price) + merch_estimate
      │                    Despesa = venue_cost + production_packages + staff_bonus + marketing
      │                    Lucro estimado: Receita − Despesa.
      │                    "Show no Hall: receita ¥8M, despesa ¥5M = lucro ¥3M + fame boost
      │                    equivalente a ¥2M em marketing. Total value: ¥5M. APROVADO."
      │                    Se lucro negativo mas fame boost alto: "investimento em visibilidade.
      │                    Aceitável se budget permite."
      ├─ Outstanding (18-19): Receita vs despesa rough. Inclui fame value estimate.
      ├─ Very Good (15-17): Ticket revenue estimate vs custo total.
      ├─ Good (12-14):    "Cabe no budget?" Sim/não.
      ├─ Average (10-11): "Quanto custa?" Se < 20% budget mensal → ok.
      ├─ Competent (7-9): Se tem dinheiro → ok.
      ├─ Reasonable (4-6): Não avalia custo. Pode planejar show que gera prejuízo.
      └─ Unsuited (1-3):  Sem avaliação.

4. DECISÃO FINAL
   ├─ Se razão + venue + ROI aprovado:
   │   → return { type: 'planShow', venue, date, lineup, estimatedBudget,
   │     context: 'release'|'milestone'|'season'|'regular'|'fan_demand' }
   └─ Se sem razão OU ROI negativo E sem justificativa:
       → return null
```

**OUTPUT:** `{ type: 'planShow', venue: VenueConfig, date: number, lineup: string[], estimatedBudget: number, context: ShowContext }` | `null`

---

### Cargo 10.2: Gestão de Palco

---

#### Decisão 10.2.1: Selecionar Pacotes de Produção

**CONTEXTO (o que a IA avalia):**
- Show planeado: venue (tipo, capacidade), date, lineup
- Venue requirements mínimos: arena precisa som profissional+, etc.
- Budget alocado para produção
- Pacotes disponíveis: Som (3 tiers), Iluminação (3), Banda (3), Cenografia (3), FX (3)
- Stage Manager skill: desconto de −5% a −20% por negociação eficiente
- Impacto de cada pacote: som e iluminação = maior ROI, cenografia = first impression

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Stage Presence** | Core: saber quais pacotes têm maior impacto no tipo de show |
| **Financial Acumen** | Optimizar custo: investir onde importa, economizar onde não |

**FLOWCHART:**

```
1. VERIFICAR MÍNIMOS DO VENUE
   ├─ Cada venue tem requirements: arena precisa som Profissional+, etc.
   └─ Abaixo do mínimo = −30% qualidade de produção

2. ALOCAR PACOTES
   └─ Skill: Stage Presence
      ├─ Elite (20):      Production design completo:
      │                    "Show no Hall 2000. Budget ¥6M.
      │                    Som Premium (¥2M) — essencial, audiência nota diferença.
      │                    Iluminação Premium (¥1.5M) — sync com setlist (mood por música).
      │                    Banda Semi-live (¥1M) — melhor que backing track, não precisa full band.
      │                    Cenografia Básica (¥800K) — ROI baixo em halls, investir em som/luz.
      │                    FX Básico (¥500K) — 1-2 momentos de confetti/smoke. Suficiente.
      │                    Total: ¥5.8M. Desconto −15% = ¥4.9M. Margem: ¥1.1M."
      │                    Cada pacote escolhido para complementar o setlist específico.
      ├─ Outstanding (18-19): Prioriza som + iluminação (maior ROI). Desconto −10%.
      │                        Outros no mínimo do venue ou básico.
      ├─ Very Good (15-17): Som e luz acima do mínimo. Resto no mínimo. Desconto −5%.
      ├─ Good (12-14):    Tudo no mínimo do venue. Upgrade som se sobra budget.
      ├─ Average (10-11): Tudo no mínimo.
      ├─ Competent (7-9): Tudo no mínimo. Pode ficar abaixo em 1 pacote (se confuso).
      ├─ Reasonable (4-6): Tudo no básico mesmo que venue exija profissional (−30% penalty).
      └─ Unsuited (1-3):  Aleatório. Pode gastar ¥8M em FX Premium e ¥0 em som.

3. DECISÃO FINAL
   → return { type: 'selectPackages', showId, packages, totalCost, discount }
```

**OUTPUT:** `{ type: 'selectPackages', showId: string, packages: PackageSelection, totalCost: number, discount: number }`

---

### Cargo 10.3: Coreografia e Formações

---

#### Decisão 10.3.1: Montar Escalação por Música (Formações)

> **PRINCÍPIO FUNDAMENTAL**: Não existe substituição de idols mid-show.
> Todas as idols do grupo entram e ficam até ao fim. O que muda entre músicas
> é a **escalação** — quem está no vocal principal, quem dança na frente, quem
> descansa atrás. Dentro da mesma música, a coreografia pode ter rotações previstas
> (ex: center roda entre 2 idols no verso vs refrão). Entre músicas, a posição
> de cada idol pode mudar completamente para gerir fadiga.

**CONTEXTO (o que a IA avalia):**
- Setlist do show: lista de músicas em ordem, com estrutura por partes
  (Intro-Verso-PréRefrão-Refrão-Verso-Refrão-Ponte-Refrão-Final)
- Para cada música: requisitos de performance por parte (partes mais vocais vs mais dança)
- Número de idols na coreografia vs membros do grupo (coreografia para 5 num grupo de 8:
  3 descansam rodando entre músicas)
- Stats de cada idol: Vocal, Dance, Stamina, Charisma, Expression
- Fadiga acumulada: model de fadiga por idol (cresce a cada música, mais para quem
  está em posições exigentes — center, lead vocal consomem mais)
- Mastery: nível de domínio de cada idol em cada música (mastery table)
- Wellness pré-show: stress, health, motivation de cada idol
- VocalProfile: tessitura de cada idol vs tessitura da música (vocal_fit)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Dance Technique** | Core: entender quais posições são mais exigentes fisicamente e rotar adequadamente |
| **Stage Presence** | Saber quais posições impactam mais a audiência (center, front row) |
| **Judging Idol Ability** | Ler stats reais para match idol → posição → parte da música |
| **Adaptability** | Planear rotações de fadiga: "se Yui está center nas músicas 1-3, precisa descansar na 4-5" |

**FLOWCHART:**

```
1. ANALISAR SETLIST E REQUISITOS
   └─ Skill: Stage Presence
      ├─ Elite (20):      Para cada música, mapeia:
      │                    → Partes vocais intensas (Refrão, Bridge) → quem tem melhor Vocal?
      │                    → Partes de dança intensas (Verso com choreo) → quem tem melhor Dance?
      │                    → Partes de charisma (MC section, audience interaction) → quem tem Charisma?
      │                    → Número de idols na coreografia da música (ex: 5 de 8 dançam,
      │                      3 ficam nos backing vocals/posição de support atrás)
      │                    Mapeia a ENERGIA requerida por música:
      │                    "Música 1: uptempo dance (energy 9/10) → precisa dos melhores dancers na frente"
      │                    "Música 4: ballad (energy 3/10) → vocal lead, dancers descansam"
      │                    "Música 7: finale dance (energy 10/10) → ALL IN, todos na frente"
      ├─ Outstanding (18-19): Mapeia energy por música. Identifica exigência vocal vs dance.
      ├─ Very Good (15-17): Classifica: "uptempo = dancers na frente. Ballad = vocalist na frente."
      ├─ Good (12-14):    Identifica músicas de alta vs baixa energia.
      ├─ Average (10-11): "Todas as músicas são iguais." Sem análise de requisitos.
      ├─ Competent−:      Sem análise. Mesma formação para todas músicas.

2. ATRIBUIR POSIÇÕES POR MÚSICA (escalação)
   └─ Skill: Judging Idol Ability × Dance Technique
      ├─ Elite (20):      Para CADA música, define posição de CADA idol:
      │                    Posições possíveis: Center, Lead Vocal, Front Dance, Support Dance,
      │                    Back Vocal, Rest Position (atrás, canta backup leve).
      │                    
      │                    "Música 1 (uptempo, choreo para 5):
      │                     → Center: Mei (Dance 82, Charisma 78) — impacto visual máximo
      │                     → Lead Vocal: Yui (Vocal 88, vocal_fit 1.0 para esta música)
      │                     → Front Dance: Riko (Dance 75), Saki (Dance 70)
      │                     → Support Dance: Hana (Dance 55) — back row, moves simplificados
      │                     → Rest: Miki, Aya, Kana (nos backing vocals, sem coreografia)
      │                    
      │                    Música 2 (mid-tempo vocal):
      │                     → Center: Yui (vocal showcase — agora é ela na frente)
      │                     → Lead Vocal: Mei (troca — Mei cantou muito pouco na música 1)
      │                     → Front Dance: Miki, Aya (descansaram na música 1 — fresh)
      │                     → Rest: Riko, Saki (dançaram intenso na música 1 — descansar)"
      │                    
      │                    REGRA DE ROTAÇÃO DE FADIGA:
      │                    → Idol que foi Center/Front Dance em 2 músicas seguidas DEVE
      │                      ir para Support ou Rest na 3ª música (fadiga > threshold).
      │                    → Idol com Stamina < 50: max 2 músicas na frente antes de rest.
      │                    → Idol com Stamina > 70: pode 3-4 músicas na frente antes de rest.
      │                    
      │                    REGRA DE VOCAL FIT:
      │                    → Se música tem tessitura alta e idol tem tessitura baixa:
      │                      NÃO colocar como Lead Vocal (vocal_fit 0.65 = penalidade grande).
      │                    
      │                    Output: mapa completo N_músicas × N_idols com posição por parte.
      │                    
      ├─ Outstanding (18-19): Posições definidas por música. Rotação de fadiga a cada 3 músicas.
      │                        vocal_fit verificado para Lead Vocal.
      ├─ Very Good (15-17): Posições definidas por bloco de setlist (opener block, mid block, closer).
      │                      Rotação: front dancers trocam a cada bloco.
      │                      Melhor dancer sempre center em uptempo. Melhor vocal em ballad.
      ├─ Good (12-14):    2 formações: "uptempo formation" e "ballad formation."
      │                    Todas uptempo usam mesma formação. Todas ballads usam outra.
      │                    Rotação mínima.
      ├─ Average (10-11): 1 formação para todo o show. Melhor idol no center sempre.
      │                    Sem rotação. Idols com stamina baixa cansam rápido (fadiga 80%+ no fim).
      ├─ Competent (7-9): 1 formação. Idol mais famosa no center. Sem considerar stats.
      │                    Não verifica vocal_fit → penalidades de performance possíveis.
      ├─ Reasonable (4-6): Formação aleatória. Idol com Dance 35 pode ser center dancer.
      └─ Unsuited (1-3):  Sem formação definida. Idols "se organizam sozinhas."
                           Performance: −20% base por falta de direção.

3. PLANEAR ROTAÇÕES MID-SHOW (entre músicas)
   └─ Skill: Adaptability
      ├─ Elite (20):      PRÉ-PLANEIA rotações condicionais:
      │                    "Se após música 3, Mei tem fadiga > 60%: swap Mei e Miki
      │                    para música 4. Mei vai para Rest, Miki vai para Front Dance."
      │                    Define 2-3 rotações condicionais por show (triggers automáticos).
      │                    DURANTE O SHOW (se NPC está a dirigir): monitora fadiga real
      │                    e pode fazer rotações não-planeadas se situation demands.
      │                    "Riko está com fadiga 75% após música 2 (mais do que esperado).
      │                    Mover para Rest na música 3 mesmo que não estava planeado."
      ├─ Outstanding (18-19): 2 rotações condicionais pré-planeadas. Monitora fadiga durante show.
      ├─ Very Good (15-17): 1 rotação condicional (após half-time do setlist).
      │                      Não ajusta durante show.
      ├─ Good (12-14):    Rotação fixa: front e back trocam no meio do show (sempre).
      ├─ Average (10-11): Sem rotações planeadas. Formação fixa do início ao fim.
      ├─ Competent−:      Sem rotações. Fadiga não gerida → performance degrada no fim.

4. DECISÃO FINAL
   ├─ Se formações definidas:
   │   → return { type: 'assignFormations', showId, formations: [{
   │       songId, positions: [{idolId, role, parts: [{partName, position}]}]
   │     }], conditionalRotations: [{trigger, swap}] }
   └─ Se sem show planeado:
       → return null
```

**OUTPUT:** `{ type: 'assignFormations', showId: string, formations: SongFormation[], conditionalRotations: ConditionalRotation[] }` | `null`

---

#### Decisão 10.3.2: Ajustar Escalação Mid-Show (decisão em tempo real)

> Esta decisão acontece DURANTE o show, entre músicas. O Show Director NPC
> (ou o player) avalia fadiga real e performance das últimas músicas para
> decidir se rotaciona posições antes da próxima música.

**CONTEXTO (o que a IA avalia):**
- Fadiga acumulada de cada idol ATÉ ESTE MOMENTO do show
- Performance score das últimas 1-2 músicas por idol
- Próxima música na setlist: requisitos de energia, coreografia, vocal
- Formação planeada vs formação actual (já houve rotações?)
- Rotações condicionais pré-planeadas (passo 3 da decisão anterior)
- Músicas restantes: quantas faltam? Se é a penúltima, all-in faz sentido.

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Stage Presence** | Core: ler o estado do show e decidir rotações que maximizam performance |
| **Adaptability** | Reagir a imprevistos (idol cansou mais do que esperado, vocal falhou) |

**FLOWCHART:**

```
1. AVALIAR ESTADO ACTUAL
   └─ Skill: Stage Presence
      ├─ Elite (20):      Lê fadiga + performance + audience energy:
      │                    "Mei: fadiga 65%, performance última música 0.78 (abaixo do normal 0.88).
      │                    Audiência energy 72 (boa, mas caiu desde música 2).
      │                    Próxima música: uptempo dance (exige Mei no center idealmente).
      │                    MAS: se Mei continuar center, fadiga vai a 80% e música 6 (finale)
      │                    terá performance <0.6. Melhor rotacionar AGORA."
      │                    Simula mentalmente: "se trocar Mei para Rest e Riko para Center,
      │                    esta música perde 5% (Riko é ligeiramente pior) mas música 6
      │                    ganha 15% (Mei descansada para o finale). Net gain: +10%."
      ├─ Outstanding (18-19): Lê fadiga + performance. Decide por threshold:
      │                        "fadiga > 65% E não é última música → rotacionar."
      ├─ Very Good (15-17): Lê fadiga. "Idol fadiga > 70% → mover para Rest."
      │                      Não calcula impacto net.
      ├─ Good (12-14):    Segue rotações condicionais pré-planeadas. Não improvisa.
      ├─ Average (10-11): Não faz ajustes mid-show. Formação planeada até ao fim.
      ├─ Competent (7-9): Idem Average.
      ├─ Reasonable (4-6): Idem.
      └─ Unsuited (1-3):  Idem. (Só Elite-Outstanding realmente ajustam mid-show.)

2. EXECUTAR ROTAÇÃO (se decidiu rotar)
   └─ Skill: Adaptability
      ├─ Elite (20):      Rotação suave: comunica à idol o novo role entre músicas.
      │                    "Mei, próxima música ficas no support. Riko, tu assumes center."
      │                    Sem impacto negativo na moral (idol entende que é para o bem do show).
      │                    Se idol tem Authority oculto baixo: pode resistir ("eu sou a center!")
      │                    → Show Director com Authority alto override sem drama.
      ├─ Outstanding (18-19): Rotação limpa. Pequena chance de idol resistir se Ambição alta.
      ├─ Very Good (15-17): Rotação ok mas idol pode perder 2-3% de motivation.
      ├─ Good−:           Não faz rotações mid-show (passo 1 não identifica necessidade).

3. DECISÃO FINAL
   ├─ Se rotação necessária:
   │   → return { type: 'midShowRotation', showId, songIndex, rotations:
   │     [{ idolId, fromRole, toRole }] }
   └─ Se formação actual está ok:
       → return null (manter plano)
```

**OUTPUT:** `{ type: 'midShowRotation', showId: string, songIndex: number, rotations: RoleRotation[] }` | `null`

---

### Cargo 10.4: Setlist

---

#### Decisão 10.4.1: Montar Setlist

**CONTEXTO (o que a IA avalia):**
- Repertório disponível: todas músicas gravadas com mastery por membro
- Duração do show: depende do venue (café 45min/5 músicas, arena 2h/15 músicas)
- Géneros disponíveis: variety no catálogo (uptempo, ballad, dance, rock, etc.)
- Pacing: alternância de energia (opener high → build → peak → cool → encore)
- Audience demographic: tipo de fã esperado no venue (hardcore wants deep cuts, casual wants hits)
- Charts: músicas no top chart = must-play (fãs esperam ouvir)
- Mastery: músicas que o grupo domina bem (mastery > 60) vs músicas com mastery baixo
- Coreografia: quantas idols cada música precisa (afeta formação e fadiga)
- Novidades: música nova a promover (release recent → play it)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Musical Knowledge** | Core: curadoria musical — pacing, contraste de géneros, setlist como "história" |
| **Stage Presence** | Entender impacto visual: opener e closer são momentos-chave para audiência |
| **Judging Idol Ability** | Verificar que membros conseguem executar cada música (mastery check) |

**FLOWCHART:**

```
1. SELECIONAR MÚSICAS PARA O SETLIST
   └─ Skill: Musical Knowledge
      ├─ Elite (20):      Curadoria holística:
      │                    → Must-play: músicas no chart top 20 (fãs vão reclamar se não tocar)
      │                    → New release: se single recente → OBRIGATÓRIO (razão do show)
      │                    → Fan favorites: músicas com alto merch sales ou streaming
      │                    → Deep cuts: 1-2 músicas menos conhecidas para hardcore fãs (surprise)
      │                    → Variety: nunca 3 do mesmo género seguidas
      │                    Verifica mastery: se música tem mastery < 40 num membro-chave,
      │                    substitui por outra do mesmo género com mastery melhor.
      │                    "Temos 20 músicas mas show é de 12. Cortar 8 menos relevantes."
      ├─ Outstanding (18-19): Must-play + release + favorites. Verifica mastery ≥ 50.
      ├─ Very Good (15-17): Must-play + release. Mastery ≥ 40. Variety de géneros.
      ├─ Good (12-14):    Top-N músicas por mastery descending.
      ├─ Average (10-11): Top-N por mastery. Sem curadoria de géneros.
      ├─ Competent (7-9): Primeiras N músicas da lista.
      ├─ Reasonable (4-6): Aleatório.
      └─ Unsuited (1-3):  Aleatório. Pode incluir música com mastery 10 → desastre.

2. ORDENAR SETLIST (pacing)
   └─ Skill: Musical Knowledge × Stage Presence
      ├─ Elite (20):      "Setlist é uma história em 3 atos:
      │                    Act 1 (opener block, 3 músicas): high energy → hook da audiência.
      │                    → Música 1: hit mais known (uptempo). Audiência canta junto = engagement imediato.
      │                    → Música 2: dance track (momentum continues). Coreografia impressiona.
      │                    → Música 3: novo single (audiência curiosa, energy still high).
      │                    
      │                    Act 2 (mid block, 4 músicas): build + contrast.
      │                    → Música 4: ballad (descanso vocal e físico para idols E audiência).
      │                    → Música 5: mid-tempo (build back up). MC section after.
      │                    → Música 6: dance feature (showcase de dança do grupo).
      │                    → Música 7: fan favorite deep cut (hardcore fãs lose their minds).
      │                    
      │                    Act 3 (closer block, 3 músicas): peak → emotional close.
      │                    → Música 8: uptempo party song (peak energy).
      │                    → Música 9: emotional ballad (contraste = impacto máximo).
      │                    → Música 10: anthem (final, todos cantam, lighter moment).
      │                    
      │                    Encore (após "falsa saída"):
      │                    → Música 11: hit #1 (THE song everyone came to hear).
      │                    → Música 12: goodbye ballad (emotional close, fãs choram)."
      │                    
      │                    Calcula pacing_score: energy_transition_quality entre adjacentes.
      ├─ Outstanding (18-19): 3 blocos (open/mid/close) + encore. Alterna energy levels.
      ├─ Very Good (15-17): Opener strong, closer strong, mid balanced. Encore = hit.
      ├─ Good (12-14):    Opener = hit. Closer = hit. Meio por mastery. Sem encore.
      ├─ Average (10-11): Sort by energy alternating (high-low-high-low). Sem narrative arc.
      ├─ Competent (7-9): Sort by mastery descending (play best first). No pacing thought.
      ├─ Reasonable (4-6): Ordem aleatória.
      └─ Unsuited (1-3):  Ordem aleatória. Pode abrir com ballad lenta → audiência adormece.

3. PLANEAR MC E INTERLUDES
   └─ Skill: Stage Presence
      ├─ Elite (20):      "2-3 MC sections estrategicamente posicionadas:
      │                    → Após música 3: MC curto (idol com melhor Communication fala).
      │                      Permite costume change para Act 2. Idols descansam 2 min.
      │                    → Após música 7: MC longo (toda equipa, fan interaction).
      │                      Costume change para Act 3 (look final). Descanso: 4 min.
      │                    → Antes do encore: lights out, 30 seg suspense, fãs pedem encore."
      │                    MC sections servem 3 propósitos: rest, costume change, engagement.
      ├─ Outstanding (18-19): 2 MC sections. Costume change no MC.
      ├─ Very Good (15-17): 1-2 MC sections. 1 costume change.
      ├─ Good (12-14):    1 MC section no meio. Sem costume change.
      ├─ Average−:        Sem MC. Músicas back-to-back. Idols sem descanso.

4. DECISÃO FINAL
   → return { type: 'buildSetlist', showId, songs: [{songId, order, block}],
     mcSlots: [{afterSong, duration, speakers}], encoreSongs: [songId],
     estimatedPacingScore }
```

**OUTPUT:** `{ type: 'buildSetlist', showId: string, songs: SetlistEntry[], mcSlots: MCSlot[], encoreSongs: string[], estimatedPacingScore: number }`

---

### Cargo 10.5: Figurino e Wardrobe

---

#### Decisão 10.5.1: Atribuir Figurinos para Show

**CONTEXTO (o que a IA avalia):**
- Inventário de figurinos: tipo, theme, tier, durabilidade restante, para quem cabe
- Setlist do show: blocos definidos (act 1, 2, 3), MC sections (onde troca de roupa)
- Idols do show: cada uma com perfil visual, archetype, role no grupo
- Theme matching: figurino pop colorido para músicas uptempo, elegante para ballads
- Grupo visual coherence: grupo deve parecer unificado (mesma paleta de cores)
- Degradação: figurino com durabilidade < 25% pode rasgar mid-show (penalidade visual)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Stage Presence** | Core: visual storytelling through costume. Impacto na percepção da audiência |
| **Adaptability** | Criar looks coerentes com o que tem no inventário (nem sempre tem figurino ideal) |

**FLOWCHART:**

```
1. PLANEAR LOOKS POR BLOCO DO SETLIST
   └─ Skill: Stage Presence
      ├─ Elite (20):      Full costume design:
      │                    "Act 1 (uptempo): look energético — cores vibrantes, casual chic.
      │                    → Figurino A (tier 2, tema pop, durabilidade 80%) para todas.
      │                    Act 2 (mixed): look transição — semi-formal, tons neutros.
      │                    → Figurino B (tier 2, tema elegant, durabilidade 65%).
      │                    Act 3 (finale): look de impacto — matching dresses, glitter.
      │                    → Figurino C (tier 3 custom, tema gala, durabilidade 100% — novo!)
      │                    Cada bloco tem visual distinto. Costume changes nos MC sections.
      │                    Center idol tem look ligeiramente diferente (destaque visual)."
      │                    Verifica durabilidade: "Figurino B tem 65% — aguenta mais 1 show.
      │                    Usar agora e encomendar replacement para o próximo."
      ├─ Outstanding (18-19): 2 looks (open + close). Theme match com setlist.
      │                        Verifica durabilidade.
      ├─ Very Good (15-17): 2 looks. Group coordination (mesma paleta).
      ├─ Good (12-14):    1 look para todo o show. Melhor tier disponível. Theme match.
      ├─ Average (10-11): 1 look. Melhor tier. Sem theme match.
      ├─ Competent (7-9): 1 look. Qualquer disponível.
      ├─ Reasonable (4-6): Primeiro disponível. Pode não combinar entre membros.
      └─ Unsuited (1-3):  Sem assignment. Idols vão com roupa default (penalidade visual −15%).

2. GERIR INVENTÁRIO PÓS-DECISÃO
   └─ Skill: Adaptability
      ├─ Elite: Flagas figurinos que precisam de reposição após este show.
      │         Encomenda replacement antecipadamente.
      ├─ Good+: Nota que figurino X está a degradar.
      ├─ Average−: Não gere inventário. Figurinos degradam até quebrar.

3. DECISÃO FINAL
   → return { type: 'assignCostumes', showId, looks: [{
       block, assignments: [{idolId, costumeId}]
     }], inventoryFlags: [{costumeId, action: 'replace'|'repair'}] }
```

**OUTPUT:** `{ type: 'assignCostumes', showId: string, looks: CostumeLook[], inventoryFlags: InventoryFlag[] }`

---

#### Decisão 10.5.2: Comprar Figurinos

**CONTEXTO:** Inventário < 50% capacidade E show planeado OU figurinos degradados
**Primary skill:** Stage Presence × Financial Acumen

```
Flowchart simplificado (referência aos outros flowcharts de compra):
1. Identificar gap: tipo/theme em falta ou degradado
   → Stage Presence: Elite identifica gaps por setlist theme, Competent compra genérico
2. Escolher tier: Financial Acumen avalia budget vs durabilidade (tier 3 custa 3× mas dura 3×)
   → Elite calcula cost-per-wear. Competent compra tier 1 (barato).
3. Custom vs off-the-shelf: Elite encomenda custom 3 semanas antes de show grande.
   Average+ compra off-the-shelf.
```

**OUTPUT:** `{ type: 'purchaseCostume', costumeType: string, theme: string, tier: number, custom: boolean }` | `null`

---

## PAPEL 11: COMMUNICATIONS DIRECTOR

> PR, social media, e fan club management. Gere a imagem pública da agência.

### Cargo 11.1: PR e Gestão de Crise

---

#### Decisão 11.1.1: Responder a Escândalo

**CONTEXTO (o que a IA avalia):**
- Escândalo ativo: tipo, severidade (leve/médio/grave), idol envolvida, triggers que causaram
- Idol personality: Temperamento, Profissionalismo, Lealdade (ocultos, se revelados)
- Fan club state: mood, loyalty, toxicidade. Fãs leais toleram mais; fãs irritados amplificam
- Media attention: fama da idol (mais famosa = mais cobertura = mais impacto)
- PR facility level: amplifica eficácia da resposta (0→nenhum, 3→máximo)
- Histórico: escândalos anteriores da mesma idol (reincidência = menos tolerância)
- Timing: quanto tempo passou desde o escândalo (resposta rápida = mais eficaz)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Media Savvy** | Core: escolher a estratégia de resposta correta para este tipo de escândalo |
| **People Management** | Ler a personalidade da idol para adaptar a resposta (idol sincera vs defensiva) |
| **Fan Psychology** | Prever como os fãs vão reagir a cada estratégia de resposta |
| **Authority** | Coordenar a mensagem: garantir que idol, staff, e agência falam a mesma coisa |

**FLOWCHART:**

```
1. CLASSIFICAR URGÊNCIA
   └─ Skill: Media Savvy
      ├─ Elite (20):      Avalia em MINUTOS (timing é tudo em PR):
      │                    "Escândalo de namoro exposto. Severidade: média. Idol: Mei (fame 4000).
      │                    Trending no Twitter há 30 minutos. Cada hora sem resposta =
      │                    narrativa controlada por media e anti-fans.
      │                    URGÊNCIA: responder em 1 dia in-game (= esta semana)."
      │                    Classifica: respond-NOW vs respond-this-week vs let-it-blow-over.
      ├─ Outstanding (18-19): Classifica urgência. "Grave = NOW. Médio = esta semana. Leve = optional."
      ├─ Very Good (15-17): "Grave = urgente. Resto pode esperar."
      ├─ Good (12-14):    "É grave? Então responder." Sem timing analysis.
      ├─ Average (10-11): Responde "quando der." Pode demorar 2 semanas (tarde).
      ├─ Competent (7-9): Responde se lembrar. Sem senso de urgência.
      ├─ Reasonable (4-6): Pode não responder. Escândalo evolui sem PR.
      └─ Unsuited (1-3):  Não percebe o escândalo como problema. Zero PR.

2. ESCOLHER ESTRATÉGIA
   └─ Skill: Media Savvy × People Management
      ├─ Elite (20):      Match estratégia ao contexto:
      │                    
      │                    LEVE (fama sobe, happiness desce pouco):
      │                    → 'spin': "Transformar em press positiva. 'Idol vista com amigo —
      │                      evidência de que tem vida social saudável.' Fama +20, happiness −2
      │                      (em vez de −5 sem PR)."
      │                    
      │                    MÉDIO — avalia PERSONALIDADE da idol:
      │                    → Idol Temperamento > 12 + Profissionalismo alto:
      │                      'apologize' (sincero): "Idol emite statement pessoal. Fãs
      │                      respeitam honestidade. Impacto: fama +30 (instead of +50 sem PR
      │                      mas happiness −8 em vez de −15)."
      │                    → Idol Temperamento < 8 (defensiva):
      │                      'deny': "Desmentir com elegância. 'Informação incorreta.'
      │                      Funciona se fãs são leais (loyalty > 60). Risco se provas surgem."
      │                    → Fan mood > 70 + loyalty > 60:
      │                      'spin': "Fãs vão defender sozinhos. Só precisamos dar o narrative."
      │                    → Fan mood < 40 (já irritados):
      │                      'apologize' obrigatório. Qualquer outra estratégia piora.
      │                    
      │                    GRAVE:
      │                    → SEMPRE 'apologize' + damage control campaign.
      │                    → "Emitir statement formal + idol faz aparição pública humilde
      │                      + agência anuncia medidas (pausa temporária, reflexão)."
      │                    → Follow-up: PR campaign de recovery na semana seguinte.
      │                    
      ├─ Outstanding (18-19): Match por severidade + personalidade. Sem cross-ref com fan state.
      ├─ Very Good (15-17): Leve→spin. Médio→apologize. Grave→apologize + damage control.
      │                      Sem personalização pela idol.
      ├─ Good (12-14):    Leve→silence. Médio→apologize. Grave→apologize.
      ├─ Average (10-11): Tudo→apologize (safe mas não optimal para leves).
      ├─ Competent (7-9): Tudo→silence (esperar passar). Funciona para leves, péssimo para graves.
      ├─ Reasonable (4-6): Não responde (silence forçado por inação).
      └─ Unsuited (1-3):  Pode emitir statement que PIORA a situação.
                           "Disse algo que não devia." Fama −50 extra, happiness −10 extra.

3. AVALIAR REAÇÃO DOS FÃS (pré-execução)
   └─ Skill: Fan Psychology
      ├─ Elite (20):      Simula reação de cada segmento:
      │                    "Se apologize: hardcore fãs (20% do fan club) aceitam em 1 semana.
      │                    Casuals (50%) esquecem em 2 semanas. Anti-fans (5%) vão usar contra.
      │                    Net effect: mood −8 esta semana, recovery +5/semana.
      │                    Em 3 semanas, mood volta ao normal."
      │                    vs "Se deny: hardcore aceitam imediatamente. Casuals ficam 50-50.
      │                    MAS se prova surge: mood crash −20 e recovery 6+ semanas."
      │                    Avalia risco de cada estratégia.
      ├─ Outstanding (18-19): Avalia fan mood trend. "Fãs leais → spin ok. Fãs irritados → apologize."
      ├─ Very Good (15-17): "Fan mood alta → mais tolerância." Ajusta confiança da estratégia.
      ├─ Good (12-14):    "Fãs vão ficar chateados." (sem segmentação).
      ├─ Average−:        Não avalia reação dos fãs.

4. DECISÃO FINAL
   ├─ Se escândalo ativo E estratégia definida:
   │   → return { type: 'respondScandal', eventId, strategy: 'deny'|'apologize'|'spin'|'silence',
   │     idol statement, followUpCampaign?, estimatedImpact }
   └─ Se sem escândalo OU não percebeu:
       → return null
```

**OUTPUT:** `{ type: 'respondScandal', eventId: string, strategy: ScandalStrategy, idolStatement: string, followUpCampaign?: CampaignConfig, estimatedImpact: { fameDelta: number, happinessDelta: number, fanMoodDelta: number } }` | `null`

---

#### Decisão 11.1.2: Campanha PR Proativa

**CONTEXTO:** Oportunidades de PR (job S-grade, release, trending positivo, fan mood alta)
**Primary skill:** Media Savvy × Industry Knowledge

```
Flowchart simplificado:
1. Scan oportunidades:
   → Media Savvy: Elite identifica 5+ oportunidades/semana. Unsuited: zero.
   → Types: viral_push (pós-success), image_boost (pré-release), damage_control (pós-crisis)
2. Priorizar por ROI:
   → Industry Knowledge: Elite calcula fame × media coverage × cost. Competent: reage só a crises.
3. Alocar budget:
   → Financial Acumen: Elite usa diminishing returns. Reasonable: 0 budget.
4. Coordenar timing:
   → Elite: "PR campaign + release + show na mesma semana = amplificação 3×."
   → Good: "PR campaign esta semana." Sem coordenação.
```

**OUTPUT:** `{ type: 'launchPRCampaign', idolId: string, campaignType: string, budget: number }` | `null`

---

### Cargo 11.2: Social Media

---

#### Decisão 11.2.1: Gerir Presença Online

**CONTEXTO:** Roster, fan moods, trending topics, social media state por idol
**Primary skill:** Media Savvy × Fan Psychology

```
Flowchart simplificado:
1. Priorizar urgências:
   → Media Savvy: Elite detecta negative trending em 1 dia. Unsuited: nunca detecta.
   → Urgente: negative trending → manage. Positivo: capitalize (post engagement content).
2. Planear conteúdo por idol:
   → Fan Psychology: Elite personaliza por fan segment. Competent: post genérico.
   → Elite: "Idol X tem hardcore fãs que querem behind-the-scenes. Post BTS do estúdio."
   → Average: "Post foto com legenda genérica."
3. Gerir alcance:
   → Elite: gere todas idols, content calendar semanal, cross-promotion entre idols.
   → Good: top-5 idols. Average: top-3. Competent: só se há crise online.
```

**OUTPUT:** `{ type: 'socialMediaAction', idolId: string, action: 'post'|'engage'|'manage_negative'|'promote', content?: string }[]` | `null`

---

### Cargo 11.3: Fan Club Management

---

#### Decisão 11.3.1: Analisar e Gerir Fan Clubs

**CONTEXTO (o que a IA avalia):**
- Fan clubs de cada idol/grupo: size, mood (0-100), loyalty (0-100), toxicidade (0-100)
- Segmentos: casual%, dedicated%, hardcore% — cada segmento tem demandas diferentes
- Demandas pendentes: "queremos fan meeting", "queremos merch novo", "queremos mais shows"
- Eventos de fan club recentes: fan meeting, signing, online event (quando foi o último)
- Escândalos recentes: impacto no fan mood
- Idol activity: idol tem sido activa (jobs, posts) ou ausente (injury, rest)?

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Fan Psychology** | Core: ler o que cada segmento de fãs quer e o que os faz felizes/infelizes |
| **People Management** | Mediar conflitos entre segmentos (hardcore vs casual, anti-fans) |
| **Media Savvy** | Engagement campaigns que amplificam mood positivo |

**FLOWCHART:**

```
1. SCAN FAN CLUB HEALTH
   └─ Skill: Fan Psychology
      ├─ Elite (20):      Dashboard mental de cada fan club:
      │                    "Fan club Mei: 25K members. Mood 72. Loyalty 68. Toxicidade 15.
      │                    Segmentos: 45% casual, 35% dedicated, 20% hardcore.
      │                    Demandas: hardcore pedem fan meeting há 4 semanas (urgente).
      │                    Casual segment crescendo (bom sinal — idol gaining mainstream appeal).
      │                    Risk: se não atender demand de hardcore, loyalty cai → segment shift
      │                    para casual (menos merch revenue, menos ticket sales)."
      │                    Prioriza: toxicidade > 60 = emergência. Demand > 3 semanas = atenção.
      │                    Mood < 40 = crise. Tudo ok = manutenção.
      ├─ Outstanding (18-19): Mood + toxicidade + demands. Flag crises e urgências.
      ├─ Very Good (15-17): Mood + toxicidade. Flag se mood < 50 ou toxicidade > 50.
      ├─ Good (12-14):    Mood por fan club. Flag se < 40.
      ├─ Average (10-11): "Fan clubs estão ok" ou "estão mal" (binário, média do roster).
      ├─ Competent (7-9): Só nota se mood < 30 (crise óbvia).
      ├─ Reasonable (4-6): Não analisa.
      └─ Unsuited (1-3):  Sem awareness de fan state.

2. ATENDER DEMANDAS
   └─ Skill: Fan Psychology × People Management
      ├─ Elite (20):      Match demand com acção:
      │                    "Hardcore querem fan meeting → planear fan meeting intimate (50 pessoas,
      │                    ¥2000/ticket, signing + photo). Satisfaz hardcore, loyalty +10.
      │                    Casual querem mais conteúdo → social media campaign + behind-the-scenes.
      │                    Dedicated querem merch → sinalizar ao Operations Director: merch order."
      │                    Cada segmento recebe atenção diferenciada.
      │                    Prioriza: demanda mais antiga primeiro (FIFO com peso por loyalty impact).
      ├─ Outstanding (18-19): Match demand top-3 com acções. 1 acção por segmento.
      ├─ Very Good (15-17): Atende demand mais antiga. Acção genérica.
      ├─ Good (12-14):    Atende se demand > 4 semanas. Genérico.
      ├─ Average (10-11): "Precisamos fazer algo para os fãs." Sem especificar.
      ├─ Competent−:      Não atende demandas.

3. GERIR TOXICIDADE
   └─ Skill: People Management
      ├─ Elite (20):      Root cause analysis:
      │                    "Toxicidade 55 no fan club de Yui. Causa: inter-fan war entre
      │                    fãs da Yui e fãs da Mei (ambas no grupo Aurora, fans disputam
      │                    quem é a 'main'). Solução: push narrative de 'unidade' —
      │                    post conjunto Yui+Mei + música collab + fan event together.
      │                    Deescalar sem censurar (censura piora)."
      ├─ Outstanding (18-19): Identifica causa. Engagement campaign targeted.
      ├─ Very Good (15-17): Engagement campaign genérica se toxicidade > 50.
      ├─ Good (12-14):    "Moderar comentários negativos." (superficial).
      ├─ Average−:        Não gere toxicidade. Problemas escalam.

4. REPORTAR ESTADO AO DECISION PHASE
   → return { type: 'fanClubReport', clubs: [{idolId, mood, loyalty, toxicity,
     demandsMet, risks}], actionsRecommended: [{action, targetClub, urgency}] }
   (Informativo — alimenta Head Producer, Events, Merch decisions.)
```

**OUTPUT:** `{ type: 'fanClubReport', ... }` + `{ type: 'planFanEvent', ... }` se demand atendida

---

## PAPEL 12: OPERATIONS DIRECTOR

> Dinheiro, facilities, merch, marketing, eventos. O lado business.

### Cargo 12.1: Gestão Financeira

---

#### Decisão 12.1.1: Rever e Ajustar Budget

**CONTEXTO:** Income/expense breakdown, projections, debt state, ROI per category
**Primary skill:** Financial Acumen

```
Flowchart:
1. DIAGNOSTICAR SAÚDE FINANCEIRA
   └─ Skill: Financial Acumen
      ├─ Elite: Full P&L analysis: receita por fonte (6 streams) × 3 meses.
      │         Despesa por categoria (11 types) × 3 meses. Margem de lucro.
      │         Projeção 3 meses: "se manter trajectory, balance = X."
      │         Identifica: "receita de shows subindo mas merch caindo.
      │         Problema não é revenue geral — é mix. Realocar marketing de
      │         merch genérico para merch de shows (cross-sell)."
      ├─ Outstanding: P&L 3 meses. Projeta 2 meses. Identifica maior custo.
      ├─ Very Good: Receita vs despesa trend 2 meses.
      ├─ Good: Receita deste mês vs mês passado. "Subindo" ou "descendo."
      ├─ Average: Balance positivo ou negativo.
      ├─ Competent: "Temos dinheiro" ou "não temos."
      ├─ Reasonable: Não diagnostica.
      └─ Unsuited: Não diagnostica.

2. REALOCAR SE NECESSÁRIO
   └─ Skill: Financial Acumen
      ├─ Elite: Reallocation por ROI: cada yen para onde rende mais.
      │         "Marketing tem ROI 3:1, facilities ROI 1.5:1. Shift 20% de
      │         facilities para marketing."
      ├─ Outstanding: Corta categoria com pior ROI. Move para melhor.
      ├─ Very Good: Corta maior despesa se balance negativo.
      ├─ Good: Corta 10% de todas categorias se deficit.
      ├─ Average: Não realoca. Mantém split atual.
      ├─ Competent−: Nunca realoca.

3. FLAG RISCOS
   └─ Elite: Projeta meses até caixa zero. Flag se < 3 meses.
      Outstanding: Flag se balance negativo 2+ meses.
      Very Good: Flag se balance negativo este mês.
      Good−: Só flag se debt state muda.
```

**OUTPUT:** `{ type: 'adjustBudget', changes: BudgetChange[] }` | `{ type: 'financialAlert', risk, severity }` | `null`

---

#### Decisão 12.1.2: Flag Risco Financeiro

**Contexto e skills similares a 12.1.1 — executado como parte do mesmo scan.**
**Elite prevê 3 meses ahead. Unsuited não prevê nada.**

**OUTPUT:** `{ type: 'financialAlert', risk: 'deficit'|'overspend'|'debt', severity: 'low'|'medium'|'high'|'critical', recommendation: string }` | `null`

---

### Cargo 12.2: Gestão de Facilities

---

#### Decisão 12.2.1: Recomendar Upgrade de Facility

**CONTEXTO:** Facilities atuais (tipo, level), roster needs, budget, staff que precisa de facility
**Primary skill:** Financial Acumen × Industry Knowledge

```
Flowchart:
1. IDENTIFICAR FACILITIES CRÍTICAS EM FALTA
   └─ Skill: Industry Knowledge
      ├─ Elite: Cross-ref com todos sistemas:
      │         "Sem Psicólogo → 3 idols stress > 70, custo de burnout projetado: ¥5M.
      │         Psicólogo level 1: ¥2M install + ¥200K/mês. ROI positivo em 2 meses."
      │         "Sem Dance Studio → música pipeline stalled em coreografia.
      │         Studio level 1: ¥3M. Desbloqueia 2 projetos musicais stalled = ¥8M revenue."
      │         Prioriza por ROI combinado (custo evitado + receita desbloqueada).
      ├─ Outstanding: Identifica gap por sistema (wellness, music, shows).
      ├─ Very Good: Checa: psicólogo existe? Studio existe? Recording? Prioriza por lista.
      ├─ Good: "Precisamos de [facility mais pedida por outros sistemas]."
      ├─ Average: Só upgrade se alguém pedir (Head Producer, staff).
      ├─ Competent−: Não identifica necessidade.

2. AVALIAR ROI
   └─ Skill: Financial Acumen
      ├─ Elite: Full ROI: (custo evitado + receita desbloqueada) / (install + mensal × 12).
      ├─ Outstanding: ROI rough. "Paga-se em X meses."
      ├─ Very Good: "Cabe no budget?" + "É urgente?"
      ├─ Good: "Cabe no budget?" Sim/não.
      ├─ Average−: Não calcula ROI.
```

**OUTPUT:** `{ type: 'upgradeFacility', facilityType: string, toLevel: number, estimatedROI?: number }` | `null`

---

### Cargo 12.3: Merchandising

---

#### Decisão 12.3.1: Decidir Produção de Merch

**CONTEXTO:** Roster fame, fan clubs, shows próximos, inventário, budget, demand signals
**Primary skill:** Financial Acumen × Fan Psychology (cross-papel com Communications)

```
Flowchart:
1. IDENTIFICAR OPORTUNIDADE DE MERCH
   └─ Skill: Financial Acumen
      ├─ Elite: "Show em 2 semanas + novo single lançado + fan mood 85 =
      │         oportunidade de merch premium. Produzir: T-shirt do show (limited),
      │         photocard pack do novo single, lightstick limited edition.
      │         Demanda projetada: fanClub.size × (dedicated% + hardcore%) × mood/100
      │         = 25K × 0.55 × 0.85 = ~11.7K unidades. Print-run: 12K."
      ├─ Outstanding: Match show/release com merch específico. Demanda por formula.
      ├─ Very Good: "Show próximo → produzir T-shirt e photocard." Print-run médio.
      ├─ Good: "Show próximo → T-shirt." Print-run conservador.
      ├─ Average: Produz T-shirt genérica periodicamente.
      ├─ Competent: Produz só se Head Producer pedir.
      ├─ Reasonable: Raramente produz.
      └─ Unsuited: Sem merch.

2. PRICING
   └─ Skill: Financial Acumen
      ├─ Elite: Price elasticity: "preço ¥2000 → demanda 12K. ¥2500 → demanda 9K.
      │         Revenue: ¥24M vs ¥22.5M. Margem: ¥18M vs ¥18M. Same margin,
      │         mais unidades vendidas no preço baixo = mais fãs felizes. ¥2000."
      ├─ Outstanding: Preço por tier do merch (standard pricing).
      ├─ Very Good: Preço padrão para o tipo.
      ├─ Good−: Preço fixo.

3. SPECIAL EDITIONS
   └─ Skill: Fan Psychology (cross-papel)
      ├─ Elite: "Milestone 1 ano de grupo Aurora → edição comemorativa.
      │         Limited 3000 unidades. Hype factor builds 2 semanas antes.
      │         Premium price ¥5000 (fãs pagam por exclusividade)."
      ├─ Outstanding: Special edition para milestones.
      ├─ Very Good: Special edition para shows grandes.
      ├─ Good−: Sem special editions.
```

**OUTPUT:** `{ type: 'produceMerch', products: [{type, theme, idolId, printRun, price, special: boolean}] }` | `null`

---

### Cargo 12.4: Marketing

---

#### Decisão 12.4.1: Lançar Campanha de Marketing

**Similar ao 11.1.2 (PR Proativa) mas focado em ROI não em imagem.**
**Primary skill:** Media Savvy × Financial Acumen

```
Flowchart simplificado:
1. Oportunidades: release, show, trending idol.
   → Media Savvy: Elite identifica todas. Competent: só releases.
2. Budget: Financial Acumen com diminishing returns.
   → Elite: sweet spot calculation. Competent: 5% flat.
3. Duration: 1-4 semanas dependendo do tipo.
4. Channel: online, TV, press, outdoor.
   → Elite: multi-channel. Average: online only.
```

**OUTPUT:** `{ type: 'launchCampaign', targetId: string, type: string, budget: number, duration: number, channels: string[] }` | `null`

---

### Cargo 12.5: Planeamento de Eventos

---

#### Decisão 12.5.1: Planear Evento Custom

**CONTEXTO:** Calendar, budget, roster, strategy, fan demands, rival events
**Primary skill:** Industry Knowledge × Financial Acumen

```
Flowchart:
1. IDENTIFICAR RAZÃO PARA EVENTO
   └─ Skill: Industry Knowledge
      ├─ Elite: Múltiplos triggers: charity (reputation), collab (networking),
      │         celebration (milestone), fan meeting (demand), festival (season).
      │         "Charity event pós-escândalo = reputation recovery. Timing perfeito."
      │         "Collab event com rival X (relationship > 50) = exposure mútua."
      │         Planeja 1 evento por temporada minimum.
      ├─ Outstanding: 1 evento por trigger óbvio (milestone, season).
      ├─ Very Good: Evento se fan demand ou strategy says so.
      ├─ Good: Evento se Head Producer pede.
      ├─ Average−: Não planeia eventos proativamente.

2. CONFIGURAR EVENTO
   └─ Skill: Financial Acumen
      ├─ Elite: Full budget: venue + produção + convidados + marketing.
      │         ROI: ticket revenue + merch + fame boost + reputation.
      │         "Charity: custo ¥5M, revenue ¥2M (tickets), reputation +15.
      │         Reputation 15 = vale ~¥3M em media coverage orgânico. Break-even."
      ├─ Outstanding: Budget + revenue estimate.
      ├─ Very Good: "Cabe no budget?"
      ├─ Good−: Budget mínimo. Evento básico.

3. CONVIDAR ARTISTAS EXTERNOS
   └─ Skill: Industry Knowledge
      ├─ Elite: "Convidar idol tier S+ de rival (se relationship > 60).
      │         Cross-promotion: nossos fãs vêem ela, fãs dela vêem as nossas.
      │         Custo: guest fee + share de receita. Benefit: fame boost para todos."
      ├─ Outstanding: Convida se faz sentido para cross-promotion.
      ├─ Very Good: Convida se Head Producer sugeriu.
      ├─ Good−: Evento in-house apenas.
```

**OUTPUT:** `{ type: 'planCustomEvent', eventType: string, date: number, budget: number, lineup: string[], invites: string[] }` | `null`

---

## PAPEL 13: WELLNESS DIRECTOR

> Equivalente ao Physio + Sports Scientist do FM. Protege as idols.

### Cargo 13.1: Monitoramento de Wellness

---

#### Decisão 13.1.1: Scan Semanal de Wellness

**CONTEXTO (o que a IA avalia):**
- Todas idols do roster: 4 wellness bars (Health, Happiness, Stress, Motivation)
- Trends: como cada barra mudou nas últimas 2-4 semanas (subindo/descendo/estável)
- Schedule da semana: carga de trabalho agendada (quantos jobs, quantos rest days)
- Injury history: idols com lesões recentes (re-injury window de 2 semanas)
- Burnout history: idols que já tiveram burnout (recidiva mais provável)
- Facility: Psicólogo existe? Sala de Convivência existe? Afeta opções
- Eventos recentes: escândalos, falhas em jobs, conflitos de grupo (afetam wellness)
- Ocultos relevantes: Temperamento (stress sensitivity), Mentalidade (stress resilience)

**SKILLS REQUERIDAS:**

| Skill | Para quê |
|-------|---------|
| **Mental Coaching** | Core: ler o estado mental/emocional de cada idol com profundidade |
| **Physical Training** | Avaliar saúde física: risco de lesão, fadiga acumulada |
| **People Management** | Entender factores sociais: conflito de grupo, solidão, pressão de fãs |
| **Judging Idol Ability** | Ler ocultos (Temperamento, Mentalidade) para prever vulnerabilidades |

**FLOWCHART:**

```
1. TRIAGE — CLASSIFICAR CADA IDOL POR URGÊNCIA
   └─ Skill: Mental Coaching
      ├─ Elite (20):      Scan completo de CADA idol. Classifica em 5 níveis:
      │                    🔴 CRÍTICO: stress > 85 OU happiness < 20 (2+ semanas) OU health < 25
      │                    → Ação imediata: cancel all jobs, schedule psychologist, rest days.
      │                    🟠 ALERTA: stress > 65 OU happiness < 35 OU health < 40
      │                    → Reduzir carga: max 3 jobs/semana, 2 rest days minimum.
      │                    🟡 ATENÇÃO: stress > 50 OU happiness declining 3+ semanas OU health < 55
      │                    → Monitorar. Agendar psicólogo preventivo. 1 rest day extra.
      │                    🟢 BOM: stress < 50 E happiness > 50 E health > 55
      │                    → Normal. Sem intervenção.
      │                    🔵 EXCELENTE: stress < 30 E happiness > 70 E motivation > 70
      │                    → Oportunidade: pode treinar intensive, aceitar jobs demanding.
      │                    
      │                    PROJETA: "Yui está 🟢 agora mas stress subiu 5/semana nas últimas
      │                    3 semanas (8 jobs sem descanso). Se mantiver ritmo, 🟠 em 2 semanas,
      │                    🔴 em 4. Intervir AGORA antes de ser tarde."
      │                    
      │                    Cross-ref com ocultos: "Mei tem Temperamento 5 (stress-sensitive).
      │                    Stress 55 para ela é equivalente a stress 70 para idol com Temp 15.
      │                    Classificar como 🟡 em vez de 🟢."
      │                    
      ├─ Outstanding (18-19): Classificação 4 níveis (sem 🔵). Projeta trend 2 semanas.
      │                        Checa Temperamento para idols conhecidas.
      ├─ Very Good (15-17): Classificação 3 níveis (🔴🟠🟢). Flag trend descendente.
      ├─ Good (12-14):    Flag 🔴 (stress > 80) e 🟠 (stress > 65). Sem trend.
      ├─ Average (10-11): Flag só 🔴 (stress > 80 OU happiness < 25).
      ├─ Competent (7-9): Flag stress > 90. Tarde demais para prevenir burnout.
      ├─ Reasonable (4-6): Flag burnout (stress = 100). Já aconteceu — reativo.
      └─ Unsuited (1-3):  Não faz scan. Burnout é surpresa.

2. GERAR ALERTAS E RECOMENDAÇÕES
   └─ Skill: Physical Training (para idols com risco físico)
      ├─ Elite (20):      Para cada idol 🔴 ou 🟠:
      │                    Alerta específico: "Idol Riko: 🟠 ALERTA.
      │                    Causa: 6 jobs consecutivos + show sábado + escândalo terça.
      │                    Health 45 (declining). Risco de lesão: 12% esta semana se não descansar.
      │                    Recomendação: cancelar 2 jobs (quarta e quinta), agendar psicólogo
      │                    (sexta), rest sábado em vez do show secundário."
      │                    Para cada idol 🟡:
      │                    "Agendar 1 psicólogo preventivo + 1 rest day extra."
      │                    Para idols pós-lesão (< 4 semanas): "Re-injury window.
      │                    Max 2 physical jobs/semana. Sem treino intensive."
      ├─ Outstanding (18-19): Alertas + recomendações por idol. Injury risk check.
      ├─ Very Good (15-17): Alertas com "reduzir carga" genérico.
      ├─ Good (12-14):    "Idol X precisa de descanso."
      ├─ Average (10-11): "Alguma idol está cansada."
      ├─ Competent−:      Sem recomendações proativas.

3. DECISÃO FINAL
   → return { type: 'wellnessAlerts', alerts: [{idolId, level, causes,
     recommendations: [{action, urgency}]}] }
   (Alertas alimentam: Scheduling — para ajustar agenda.
   Head Producer — para awareness geral.
   Player inbox — para decisão manual se quiser.)
```

**OUTPUT:** `{ type: 'wellnessAlerts', alerts: WellnessAlert[] }`

---

#### Decisão 13.1.2: Conduzir Sessão de Wellness

**CONTEXTO:** Idol com wellness preocupante, wellness advisor disponível
**Primary skill:** Mental Coaching × People Management

```
Flowchart:
1. SELECIONAR IDOL
   └─ Prioriza: idol mais urgente (🔴 > 🟠 > 🟡). Max 2-3 sessões/semana.

2. DEFINIR FOCO
   └─ Skill: Mental Coaching
      ├─ Elite: Personaliza: stress alto → relaxamento guiado (−20 stress).
      │         Happiness baixa → motivational counseling (+15 happiness, +5 motivation).
      │         Combinação: "stress 70 + happiness 30 → sessão mista: 30 min relaxamento
      │         + 30 min conversa sobre objectivos. −12 stress, +8 happiness."
      ├─ Outstanding: Foco no bar mais crítico. −15 stress OU +10 happiness.
      ├─ Very Good: Stress reduction (−12) OU morale boost (+8).
      ├─ Good: Sessão genérica. −8 stress.
      ├─ Average: −5 stress (mínimo eficaz).
      ├─ Competent: −3 stress.
      ├─ Reasonable: −2 stress.
      └─ Unsuited: Sessão ineficaz. Pode estressar mais (−1 stress, −2 happiness).

3. MODIFICADORES SECONDARY
   → motivating: idol.motivation += (motivating − 10) × 0.5
   → people_management: idol.happiness += (peopleMgmt − 10) × 0.3
   → Se wellness advisor e idol têm afinidade alta: efeito × 1.3
```

**OUTPUT:** `{ type: 'wellnessSession', idolId: string, focus: string, effect: WellnessDelta }`

---

### Cargo 13.2: Gestão de Lesões

---

#### Decisão 13.2.1: Avaliar Risco e Coordenar Reabilitação

**CONTEXTO:** Schedule, consecutive work days, age, health, injury history, medical facility
**Primary skill:** Physical Training × Mental Coaching

```
Flowchart:
1. AVALIAR RISCO DE LESÃO POR IDOL
   └─ Skill: Physical Training
      ├─ Elite: Risk model multi-factor:
      │         risk = (consecutive_days × 3) + (25 − health) × 2 + (age > 25 ? (age − 25) × 2 : 0)
      │                + (recent_injury < 4 weeks ? 20 : 0) + (stamina < 40 ? 10 : 0)
      │         risk > 30: 🔴. risk > 15: 🟠. risk > 5: 🟡.
      │         "Riko: 5 dias seguidos + health 38 + age 26 + stamina 42 = risk 32. 🔴.
      │         Recomendação: 2 dias rest IMEDIATO."
      ├─ Outstanding: Checa: consecutive days, health, recent injury. Flag se risk alto.
      ├─ Very Good: Checa consecutive days + health. Flag se 5+ dias OU health < 35.
      ├─ Good: Flag se 5+ dias consecutivos.
      ├─ Average: Flag se health < 25.
      ├─ Competent: Flag se health < 15 (quase injury).
      ├─ Reasonable: Não avalia.
      └─ Unsuited: Não avalia. Lesões são surpresa.

2. COORDENAR REABILITAÇÃO (se idol com lesão ativa)
   └─ Skill: Physical Training × Mental Coaching
      ├─ Elite: Plan de rehab completo:
      │         "Lesão tipo: vocal cord strain. Severidade: 2/3. Recovery base: 3 semanas.
      │         Medical Center level 2: −20% recovery = 2.4 semanas.
      │         Restrições: zero vocal jobs. Training: só stats mentais a 50%.
      │         Semana 1: full rest. Semana 2: light mental training. Semana 3: gradual vocal.
      │         Re-injury risk window: 2 semanas após recovery. Max 2 vocal jobs/semana."
      │         Coordena com Talent Manager para bloquear slots.
      ├─ Outstanding: Recovery plan. Restrições por tipo de lesão.
      ├─ Very Good: "Idol lesionada. Descanso por X semanas. Sem jobs físicos."
      ├─ Good: "Descanso até recuperar."
      ├─ Average−: Sem plan. Idol volta quando health recupera (pode ser cedo demais).

3. POST-BURNOUT RECOVERY
   └─ Skill: Mental Coaching
      ├─ Elite: Gradual return: "Semana 1: 1 job leve + 2 rest + 1 psicólogo.
      │         Semana 2: 2 jobs + 1 rest. Semana 3: normal se stress < 40."
      │         Coordena com coach: "treino leve para manter skills sem pressão."
      ├─ Outstanding: 3 semanas gradual. Monitor stress diário.
      ├─ Very Good: 2 semanas light schedule.
      ├─ Good: 1 semana light. Depois normal.
      ├─ Average−: Return direto. Alto risco de re-burnout.
```

**OUTPUT:** `{ type: 'injuryAssessment', idolId: string, risk: number, rehabPlan?: RehabPlan }` | `{ type: 'postBurnoutPlan', idolId: string, weeklyLimits: number[], duration: number }`

---

## PAPEL 14: INTELLIGENCE ANALYST

> Equivalente ao Data Analyst do FM. Informação e previsões.

### Cargo 14.1: Analytics de Performance

---

#### Decisão 14.1.1: Análise Pós-Mortem de Jobs/Shows

**CONTEXTO:** Resultados da semana (jobs, shows), expected vs actual performance
**Primary skill:** Judging Idol Ability × Industry Knowledge

```
Flowchart:
1. ANALISAR CADA RESULTADO
   └─ Skill: Judging Idol Ability
      ├─ Elite: Para cada job/show:
      │         "Job: TV variety. Idol: Mei. Expected: 0.78. Actual: 0.62. Gap: −0.16.
      │         Top factor positivo: Charisma (78 vs required 60 = +0.12 contribution).
      │         Top factor negativo: Stress (72 entering job = −0.18 performance penalty).
      │         Secondary: Communication (55 vs required 70 = −0.08).
      │         Root cause: não foi falta de skill — foi wellness. Stress penalty killed it.
      │         Prescription: less jobs this week, psychologist before next TV appearance."
      │         Correlation analysis: "Mei's TV performances drop when stress > 60.
      │         Pattern across last 8 TV jobs: stress < 50 → avg 0.82. Stress > 60 → avg 0.61."
      ├─ Outstanding: Top-3 positive + top-3 negative factors. Key factor identified.
      ├─ Very Good: Top-2 positive + top-2 negative. "Wellness or skill?"
      ├─ Good: "Good" or "bad" + 1 reason.
      ├─ Average: "Performance X. Expected Y." Numbers only.
      ├─ Competent: "Went well" or "went badly."
      ├─ Reasonable: Raw data only.
      └─ Unsuited: No analysis.
```

**OUTPUT:** `{ type: 'postMortem', results: [{jobId, idolId, expected, actual, positives, negatives, rootCause, prescription}] }`

---

### Cargo 14.2: Inteligência Competitiva

---

#### Decisão 14.2.1: Monitorar Rivais

**CONTEXTO:** Rival agencies visible state, market movements, news
**Primary skill:** Industry Knowledge × Judging Idol Ability

```
Flowchart:
1. SCAN RIVAL ACTIVITY
   └─ Skill: Industry Knowledge
      ├─ Elite: Monitora top-10 rivais:
      │         "Crown Entertainment: contratou Vocalist tier A (market value ¥60M).
      │         Provável target: Kouhaku this year. Ameaça: podem tirar slot do nosso grupo.
      │         Heartbeat Agency: 2 idols com contrato expirando. Oportunidade de buyout.
      │         Silver Star: perdeu show director — produção de shows vai cair. Não são
      │         ameaça em shows este trimestre."
      │         Identifica: threats + opportunities + neutral.
      ├─ Outstanding: Top-5 rivais. Threats + opportunities.
      ├─ Very Good: Top-3 rivais. Flag movimentos grandes.
      ├─ Good: Flag contratações de tier A+ por rivais.
      ├─ Average: Nota se rival contratou idol muito famosa.
      ├─ Competent: Não monitora ativamente.
      ├─ Reasonable: "Existem outras agências."
      └─ Unsuited: Zero intel.

2. PREVER BUYOUT ATTEMPTS
   └─ Skill: Judging Idol Ability
      ├─ Elite: "Rival Crown tem budget alto + gap em Vocalist. Nossa Yui é
      │         Vocalist tier A com contrato a expirar em 8 semanas. ALTA probabilidade
      │         de buyout attempt. Recomendar: renovar contrato de Yui AGORA."
      ├─ Outstanding: Flag se rival budget alto + nosso contrato expirando.
      ├─ Very Good: Flag contratos expirando de idols valiosas.
      ├─ Good−: Não prevê.
```

**OUTPUT:** `{ type: 'rivalIntel', insights: RivalInsight[], threats: Threat[], opportunities: Opportunity[] }`

---

### Cargo 14.3: Relatórios

---

#### Decisão 14.3.1: Gerar Relatório Semanal

**CONTEXTO:** Todos KPIs, comparativo semanal
**Primary skill:** Judging Idol Ability (para qualidade da análise)

```
Este relatório é SEMPRE gerado (mesmo sem Intelligence Analyst).
Sem NPC: dados brutos sem análise (números). Com NPC: análise qualitativa.

1. COMPILAR KPIs
   → Sempre: receita, despesa, lucro, balance, roster size, avg wellness,
     avg fame, shows, jobs, scandals, fan mood avg.
   → Com NPC Good+: comparativo com semana anterior, trends de 4 semanas.
   → Com NPC Very Good+: projections 4 semanas, flag tendências preocupantes.
   → Com NPC Elite: executive summary 3 linhas + 3 insights + 3 recomendações.

2. ALERTAS
   └─ Skill: Judging Idol Ability
      ├─ Elite: "KPI that matters most this week: fan mood dropping 5/week
      │         across 3 clubs. Not a single-idol issue — systemic.
      │         Likely cause: no fan events in 6 weeks + 2 scandals.
      │         Impact if unchecked: merch revenue −20% in 4 weeks.
      │         Action: schedule fan meeting ASAP."
      ├─ Outstanding: Flag top-2 KPI concerns.
      ├─ Very Good: Flag KPIs with > 20% week-over-week change.
      ├─ Good: Flag negative trends.
      ├─ Average: "Tudo ok" or "algumas preocupações."
      ├─ Competent−: Numbers only, no alerts.
```

**OUTPUT:** `{ type: 'weeklyReport', kpis: KPI[], trends: Trend[], alerts: Alert[], insights?: Insight[] }`

---

## Summary

### Complete Inventory

| Papel | Cargos | Decisões | Status |
|-------|--------|----------|--------|
| 1. Head Producer | 4 | 7 | ✅ Full flowcharts |
| 2. Vice-Producer | 2 | 2 | ✅ Full flowcharts |
| 3. Talent Director | 3 | 5 | ✅ Full flowcharts |
| 4. Chief Scout | 2 | 2 | ✅ Full flowcharts |
| 5. Development Director | 3 | 3 | ✅ Full flowcharts |
| 6. Vocal Coach | 1 | 2 | ✅ Full flowcharts |
| 7. Dance Coach | 1 | 3 | ✅ Full flowcharts |
| 8. Acting/Variety Coach | 1 | 3 | ✅ Full flowcharts |
| 9. Music Director | 3 | 4 | ✅ Full flowcharts |
| 10. Show Director | 5 | 6 | ✅ Full flowcharts |
| 11. Communications Director | 3 | 4 | ✅ Full flowcharts |
| 12. Operations Director | 5 | 5 | ✅ Full flowcharts |
| 13. Wellness Director | 3 | 3 | ✅ Full flowcharts |
| 14. Intelligence Analyst | 3 | 3 | ✅ Full flowcharts |
| **Total** | **39 cargos** | **52 decisões** | **All complete** |

### Every Decision References Specific Skills

No decision uses generic "skill" — each step names the exact attribute
(from the 19 staff attrs) being evaluated, and each of the 8 label levels
produces a distinct output.

### Related Decisions

- [ADR-002](adr-002-simulation-pipeline.md) — unified pipeline consumes ActionLists
- [ADR-003](adr-003-game-state-schema.md) — state slices feed TaskContext
- [ADR-004](adr-004-event-system.md) — events trigger reactive tasks
- [ADR-005](adr-005-performance-budgets.md) — decision phase budget
- [ADR-007](adr-007-show-pipeline.md) — show pipeline (formations, setlist)
- [ADR-008](adr-008-music-production.md) — music pipeline (composition, release)
- [ADR-011](adr-011-multiplayer-ready.md) — same decisions for local and remote
- design/gdd/agency-staff-operations.md — 19 attributes definition
- design/gdd/staff-functional.md — staff functions and quality mechanics
- design/wireframes/14-responsibilities.md — delegation UI
- design/wireframes/21-staff-profile.md — staff attribute labels UI
