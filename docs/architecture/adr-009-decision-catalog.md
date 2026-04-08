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
