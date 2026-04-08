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
