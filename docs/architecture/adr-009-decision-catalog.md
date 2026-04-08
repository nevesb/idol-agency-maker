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
