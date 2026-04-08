# Agency Staff & Operations

> **Status**: Designed (v2 — ver também staff-functional.md)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulacao com Profundidade Real, Pilar 3 — Multiplos Caminhos ao Topo
> **Related**: staff-functional.md (define O QUE cada função faz mecanicamente, produtor como substituto, stage staff híbrido)

## Overview

O Agency Staff & Operations gerencia **fichas de staff, contratação, mercado,
atributos e delegação**. Define QUEM o staff é e como contratar/gerenciar.

Para O QUE cada função faz mecanicamente — incluindo produtor como substituto,
qualidade de execução por função, stage staff híbrido (NPC + pacotes de
produção), e progressão de agência via staff — ver **`staff-functional.md`**.

Este GDD e `staff-functional.md` são complementares: este define a estrutura
de dados e mercado; aquele define o impacto mecânico no gameplay.

## Player Fantasy

A fantasia e de **construir uma maquina organizacional**. Comecar sozinho,
fazendo tudo na mao. Contratar seu primeiro vocal coach e ver as idols
melhorarem mais rapido. Contratar um PR manager e ter alguem cuidando de
crises. Eventualmente ter uma equipe completa onde voce so toma as decisoes
estrategicas e delega a execucao. E a transicao de "dono de garagem" pra
"CEO de uma operacao profissional".

Serve o **Pilar 1**: staff tem atributos reais que afetam resultados mensuravelmente.
E o **Pilar 3**: voce pode investir pesado em coaches (agencia de formacao),
em PR (agencia de imagem), em scouts (agencia de draft), ou equilibrar -- cada
estilo de staff reflete um estilo de jogo.

## Detailed Design

### Core Rules

#### 1. Tipos de Staff

| Cargo | Categoria | Efeito Principal | Prioridade |
|---|---|---|---|
| **Talent Manager** | Gestao | Gerencia agenda de 1-5 idols. Pode montar agenda preliminar | MVP |
| **PR Manager** | Comunicacao | Mitiga impacto de escandalos. Gerencia resposta a crises | MVP |
| **Scout** | Recrutamento | Busca idols por perfil especifico. Melhora estimativa de tier | MVP |
| **Vocal Coach** | Treinamento | Acelera crescimento de Vocal e Comunicacao | MVP |
| **Dance Coach** | Treinamento | Acelera crescimento de Danca e Aura | MVP |
| **Acting Coach** | Treinamento | Acelera crescimento de Atuacao e Variedade | Vertical Slice |
| **Wellness Advisor** | Suporte | Reduz acumulo de stress. Alerta burnout antecipado | Vertical Slice |
| **Legal Counsel** | Juridico | Melhora negociacao de contratos. Reduz custo de rescisoes | Vertical Slice |
| **Music Producer / A&R** | Producao | Melhora qualidade de gravacoes. Sugere composicoes/lancamentos | Alpha |
| **Social Media Manager** | Comunicacao | Automatiza posts. Acelera crescimento de fama online | Alpha |
| **Event Planner** | Operacoes | Melhora qualidade de eventos criados pelo jogador. Reduz custo | Alpha |
| **Stage Manager** | Producao | Coordena producao tecnica de shows ao vivo. Ver staff-functional.md | Alpha |
| **Coreografo** | Treinamento | Cria e ensaia coreografias. Afeta visual do show | Alpha |

#### 2. Ficha de Staff

```
Staff {
  id:             uint32
  name:           string
  role:           enum (ver tabela acima)
  region:         enum (sede, pode afetar scouting)

  // --- COACHING (técnica de treinamento) --- escala 1-20 cada
  vocalTechnique:     1-20   // Treino vocal (Vocal Coach)
  danceTechnique:     1-20   // Treino de dança (Dance Coach)
  actingVariety:      1-20   // Treino de atuação/variety (Acting Coach)
  stagePresence:      1-20   // Preparação de palco (Show Dir, Coaches)
  mentalCoaching:     1-20   // Desenvolvimento mental (Dev Dir, Wellness)
  physicalTraining:   1-20   // Treino físico/stamina (Dance Coach, Wellness)

  // --- MENTAL (personalidade do NPC) --- escala 1-20 cada
  determination:      1-20   // Consistência, drive pessoal
  discipline:         1-20   // Rigor, qualidade mínima garantida
  motivating:         1-20   // Impacto na motivação das idols
  peopleManagement:   1-20   // Impacto na felicidade das idols
  adaptability:       1-20   // Performance em situações imprevistas
  authority:          1-20   // Gestão de conflitos, decisões sob pressão

  // --- KNOWLEDGE (expertise) --- escala 1-20 cada
  judgingIdolAbility:   1-20 // Precisão de avaliação de stats atuais
  judgingIdolPotential: 1-20 // Identificar ceiling real (PT)
  musicalKnowledge:     1-20 // Decisões musicais (compositor, género, timing)
  industryKnowledge:    1-20 // Negociações, market intel, relações com mídia
  mediaSavvy:           1-20 // PR, social media, gestão de escândalos
  financialAcumen:      1-20 // Decisões financeiras, ROI, projeções
  fanPsychology:        1-20 // Gestão de fan clubs, engagement, toxicidade

  // --- META ---
  salary:         yen/mes
  contract_end:   date
  workload:       0-100  // % da capacidade em uso
  morale:         0-100  // Satisfação do staff

  // Especialização (opcional)
  specialty:      string? // ex: "vocal pop", "dança contemporânea", "crise de mídia"
}
```

**Visualização ao jogador (FM26 standard):** O jogador NUNCA vê os números 1-20.
Todos atributos são mostrados como **labels qualitativos** com cor:

| Label | Cor | Range Interno |
|---|---|---|
| **Elite** | Roxo | 20 |
| **Outstanding** | Dourado | 18-19 |
| **Very Good** | Verde escuro | 15-17 |
| **Good** | Verde | 12-14 |
| **Average** | Verde claro | 10-11 |
| **Competent** | Amarelo | 7-9 |
| **Reasonable** | Cinza | 4-6 |
| **Unsuited** | Vermelho | 1-3 |

Referência visual: Wireframe 21 (Staff Profile), Wireframe 22 (Staff Quick Profile Modal).

#### 3. Atributos de Staff — Impacto por Categoria

**COACHING (6 atributos):**

| Atributo | Quem Usa | Impacto |
|---|---|---|
| **Vocal Technique** | Vocal Coach | Crescimento de stats vocais (vocal, communication) |
| **Dance Technique** | Dance Coach | Crescimento de stats de dança (dance, expression) |
| **Acting/Variety** | Acting Coach | Crescimento de atuação, variety, comunicação para TV |
| **Stage Presence** | Show Director, Coaches | Qualidade de preparação de palco, presença cénica das idols |
| **Mental Coaching** | Development Dir, Wellness | Crescimento de stats mentais (mentality, focus, discipline) |
| **Physical Training** | Dance Coach, Wellness | Crescimento de stamina, resistência, saúde física |

**MENTAL (6 atributos):**

| Atributo | Quem Usa | Impacto |
|---|---|---|
| **Determination** | Todos | Consistência do trabalho. Staff com baixa determination tem "dias maus" onde qualidade cai 50% |
| **Discipline** | Todos | Rigor na rotina. Afeta qualidade mínima — staff disciplinado nunca entrega abaixo de um limiar |
| **Motivating** | Coaches, Dev Dir | Impacto na motivação das idols ao interagir. Coach motivador = +motivation nas idols |
| **People Management** | Todos com contato | Impacto na felicidade. Staff com people_management baixo pode treinar bem mas desmotivar |
| **Adaptability** | Todos | Performance em situações não-rotineiras (crise, idol difícil, multi-role). Reduz penalidade de multi-role |
| **Authority** | Show Dir, Head Producer | Gestão de conflitos entre idols, decisões mid-show, respeito do roster |

**KNOWLEDGE (7 atributos):**

| Atributo | Quem Usa | Impacto |
|---|---|---|
| **Judging Idol Ability** | Scout, Talent Dir | Precisão de scout reports. Elite = margem ±2. Unsuited = margem ±15 |
| **Judging Idol Potential** | Scout, Dev Dir | Identificar ceiling real vs aparente. Afeta DevPlan quality |
| **Musical Knowledge** | Music Director | Qualidade de decisões: escolha de compositor, género, timing de lançamento |
| **Industry Knowledge** | PR Dir, Operations Dir | Resposta a crises, negociações de contrato, market intelligence |
| **Media Savvy** | Communications Dir | Eficácia de PR, social media, gestão de escândalos. Elite = spin master |
| **Financial Acumen** | Operations Dir | Qualidade de decisões financeiras, ROI analysis, projeções, budget |
| **Fan Psychology** | Communications Dir | Gestão de fan clubs, engagement campaigns, detecção de toxicidade |

**Perfil típico por papel:**

Cada papel tem 3-5 atributos "primários" (os que mais importam) e os restantes
são secundários. O jogador avalia staff pelo perfil completo, não por um número único.

| Papel | Atributos Primários |
|---|---|
| Head Producer | Authority, Industry Knowledge, People Management, Determination |
| Vice-Producer | Adaptability, People Management, Motivating, Industry Knowledge |
| Talent Director | Judging Idol Ability, Industry Knowledge, Financial Acumen, Authority |
| Chief Scout | Judging Idol Ability, Judging Idol Potential, Adaptability, Determination |
| Development Director | Judging Idol Potential, Mental Coaching, Motivating, People Management |
| Vocal Coach | Vocal Technique, Motivating, Discipline, People Management |
| Dance Coach | Dance Technique, Physical Training, Stage Presence, Discipline |
| Acting/Variety Coach | Acting/Variety, Motivating, People Management, Adaptability |
| Music Director | Musical Knowledge, Industry Knowledge, Judging Idol Ability, Financial Acumen |
| Show Director | Stage Presence, Authority, Adaptability, Musical Knowledge |
| Communications Director | Media Savvy, Fan Psychology, People Management, Adaptability |
| Operations Director | Financial Acumen, Industry Knowledge, Discipline, Determination |
| Wellness Director | Mental Coaching, People Management, Motivating, Physical Training |
| Intelligence Analyst | Judging Idol Ability, Judging Idol Potential, Financial Acumen, Industry Knowledge |

#### 4. Contratacao de Staff

- Staff aparece no mercado similar a idols (pool por cargo)
- Custo proporcional a skill: staff skill 15+ e caro
- Entrevista mostra atributos com margem de erro (similar a scout de idols)
- Staff de alta qualidade pode receber propostas de agencias rivais
- Numero maximo de staff por cargo limitado pelo tier da agencia:

| Tier Agencia | Talent Managers | Coaches | Outros Staff | Total Max |
|---|---|---|---|---|
| Garagem | 1 | 1 | 1 | 3 |
| Pequena | 2 | 2 | 2 | 6 |
| Media | 3 | 3 | 4 | 10 |
| Grande | 5 | 4 | 6 | 15 |
| Elite | 8 | 6 | 8 | 22 |

#### 5. Sistema de Delegacao

O jogador pode delegar decisoes ao staff. Qualidade da decisao depende dos
atributos do staff.

| Delegacao | Staff Responsavel | O que faz | Risco |
|---|---|---|---|
| **Montar agenda semanal** | Talent Manager | Cria agenda preliminar (jogador aprova/edita) | Agenda ruim se skill baixo |
| **Responder a crise/escandalo** | PR Manager | Escolhe estrategia de resposta automaticamente | Pode piorar crise se skill baixo |
| **Buscar idols por perfil** | Scout | Faz scouting automatico por criterios definidos | Traz candidatos piores se skill baixo |
| **Sugerir plano de treino** | Coach (tipo) | Propoe foco de treino por idol | Sugere mal se skill baixo |
| **Sugerir composicao/lancamento** | A&R / Producer | Sugere single/album baseado no roster | Timing ou escolha ruim se skill baixo |
| **Negociar contrato** | Legal Counsel | Negocia em nome do jogador com parametros | Pode aceitar termos piores |
| **Gerenciar redes sociais** | Social Media Manager | Posta e interage automaticamente | Posts ruins danificam imagem |
| **Planejar evento** | Event Planner | Monta evento com orcamento e lineup sugeridos | Evento mal planejado |

**Mecanica de delegacao:**
- Jogador define **parametros** (ex: "buscar idol vocal tier B+, budget max 500k")
- Staff executa e **apresenta resultado/sugestao**
- Jogador pode **aprovar, editar ou rejeitar**
- Se jogador ativar **auto-approve**, staff executa sem confirmacao
- Auto-approve e arriscado com staff de skill baixo mas poupa tempo

#### 6. Workload e Moral do Staff

- Cada tarefa delegada consome **workload** do staff
- Staff com workload > 80% perde eficiencia (×0.7 na skill efetiva)
- Staff com workload = 100% recusa novas tarefas
- **Moral** cai com: salario abaixo do mercado, overwork, idols/jogador tratando mal
- **Moral** sobe com: salario justo, workload equilibrado, sucesso da agencia
- Staff com moral < 30 pode pedir demissao ou aceitar proposta de rival

#### 7. Especializacao de Staff

Coaches e Scouts podem ter **especialidade** que da bonus em areas especificas:

- **Vocal Coach** especializado em "enka" da +30% a crescimento de Vocal pra idols
  que fazem jobs de enka, mas sem bonus pra pop
- **Scout** especializado em "Kansai" encontra idols melhores em Osaka/Kyoto
- **PR Manager** especializado em "crisis management" e melhor em escandalos graves
  mas pior em PR proativo dia-a-dia

Especializacao cria trade-offs: generalista vs. especialista no staff tambem.

### States and Transitions

| Estado do Staff | Descricao | Transicao |
|---|---|---|
| **Disponivel** | No mercado, pode ser contratado | -> Contratado |
| **Contratado** | Trabalhando na agencia | -> Disponivel (demitido/saiu), -> Em Licenca |
| **Em Licenca** | Temporariamente indisponivel (doenca, pessoal) | -> Contratado (volta) |
| **Demitido** | Saiu da agencia | -> Disponivel (volta ao mercado apos cooldown) |

### Interactions with Other Systems

| Sistema | Direcao | O que flui |
|---|---|---|
| **Idol Attribute/Stats** | <- Coach afeta | Coaches aceleram crescimento de atributos especificos |
| **Job Assignment** | <- Talent Manager sugere | Manager pode montar escalacao preliminar |
| **Schedule/Agenda** | <- Manager cria | Manager monta agenda semanal (jogador aprova) |
| **Happiness & Wellness** | <- Wellness Advisor | Advisor reduz stress, alerta burnout |
| **Scouting & Recruitment** | <- Scout busca | Scout executa buscas por perfil definido |
| **Event/Scandal Generator** | <- PR Manager responde | PR Manager mitiga impacto de escandalos |
| **Contract System** | <- Legal Counsel negocia | Counsel melhora termos de contratos |
| **Music Charts** | <- A&R sugere | Producer sugere composicoes e lancamentos |
| **Agency Economy** | -> consome | Salarios de staff sao despesa mensal |
| **Fan Club System** | <- Social Media Manager | SMM gerencia presenca online, afeta fama |
| **Player-Created Events** | <- Event Planner | Planner melhora qualidade de eventos |
| **Agency Intelligence** | -> alimenta | Staff gera dados e insights pro sistema de reports |
| **Week Simulation** | <- processado por | Trabalho delegado do staff e processado no tick semanal |

## Formulas

#### Eficacia do Staff

```
eficacia = skill × mult_dedication × mult_workload × mult_morale × mult_specialty

onde:
  skill           = 1-20 (base)
  mult_dedication = dedication / 10  (range 0.1-2.0)
  mult_workload   = 1.0 (workload < 80%), 0.7 (workload 80-99%), 0.5 (100%)
  mult_morale     = morale / 100 (range 0.0-1.0)
  mult_specialty  = 1.3 (tarefa dentro da especializacao), 1.0 (fora)
```

#### Impacto do Coach no Crescimento

```
// Adiciona ao crescimento base do atributo (do idol-attribute-stats.md)
bonus_coach = eficacia_coach × COACH_GROWTH_FACTOR

COACH_GROWTH_FACTOR = 0.15 (MVP, ajustavel)

// Resultado: coach skill 15, dedication 14, morale 80, sem especializacao
// eficacia = 15 × 1.4 × 1.0 × 0.8 × 1.0 = 16.8
// bonus = 16.8 × 0.15 = 2.52 pontos extras/semana (sobre base de ~0.5)
// Coach bom quintuplica a velocidade de crescimento
```

#### Mitigacao de Escandalo pelo PR Manager

```
reducao_impacto = eficacia_pr × SCANDAL_MITIGATION_FACTOR

SCANDAL_MITIGATION_FACTOR = 0.05
// PR skill 18, tudo otimo: eficacia ~28 × 0.05 = 1.4 = reduz impacto em ~140%
// Na pratica capped em MAX_MITIGATION = 0.7 (reduz no maximo 70% do impacto)

// PR Manager ruim (skill 5, moral baixa): eficacia ~2 × 0.05 = 0.1
// Reduz apenas 10% do impacto -- quase inutil
```

## Systemic Friction — Trade-offs Sujos

Staff nao e so "contratar bom = resultado bom". O sistema gera friccao real:

### 1. Staff Toxico mas Competente

```
Staff com skill > 15 mas people_skills < 5:
  - Idol treinada por esse coach cresce RAPIDO
  - Mas: felicidade da idol -3/mes, motivacao -2/mes
  - Se idol tem Mentalidade < 40: risco de crise emocional por abuso
  - Idols podem RECUSAR trabalhar com staff especifico (afinidade < 20)
  - Dilema: demitir o melhor coach ou perder idols?
```

### 2. PR que Salva mas Corrói

```
PR Manager mitiga escandalo com spin mediatico:
  - Sucesso: impacto do escandalo reduzido em ate 70%
  - Custo oculto: cada spin bem-sucedido reduz "autenticidade" da idol
  - autenticidade = 0-100 (comeca em 80, cai -5 por spin)
  - Se autenticidade < 30: fas percebem ("tudo parece fabricado")
    → loyalty -10, toxicidade +5, mood -5
  - Idol com imagem "edgy" perde menos autenticidade (-2 por spin)
  - Idol com imagem "pure" perde mais (-8 por spin)
  - Decisao: deixar o escandalo bater ou corroer confianca dos fas?
```

### 3. Veterana Mentora que Bloqueia Ascensao

```
Veterana como mentora:
  - Novata ganha +30% crescimento mental (excelente)
  - Mas: veterana OCUPA slot de roster e centro de atencao
  - Novata pode desenvolver "sindrome de sombra" se:
    veterana_fama > novata_fama × 3 POR 6+ meses
    → novata Ambicao baixa: se acomoda (crescimento -20%)
    → novata Ambicao alta: conflito interno, ressentimento
  - Veterana pode resistir a graduation se ainda e util/querida
  - Dilema: a mentora e necessaria, mas quando mandar embora?
```

### 4. Manager que Protege Demais

```
Talent Manager com dedication > 16 + people_skills > 14:
  - Monta agendas conservadoras (sempre verde)
  - Idols ficam saudaveis e felizes
  - Mas: agencia perde jobs premium por falta de agressividade
  - Receita -10-20% comparado com gestao manual
  - Se jogador forca agenda pesada contra sugestao do manager:
    → manager moral -5
    → se repetido 3x: manager pede demissao ("nao concordo com a direcao")
  - Dilema: manter o protetor ou trocar por alguem que empurra mais?
```

### 5. Scout que Encontra Problemas

```
Scout skill alto encontra idols melhores. Mas tambem:
  - Tem PREFERENCIAS baseadas na personality (seed fixa)
  - Scout com specialty "visual" negligencia vocal talents
  - Scout com adaptability baixa traz sempre o MESMO perfil
  - Jogador pode nao perceber o vies por meses
  - Resultado: roster desequilibrado sem o jogador entender por que
  - Correcao: contratar segundo scout com perfil diferente
            ou fazer scouting manual periodicamente
```

### 6. Conflito entre Staff

```
Se 2+ staff com dedication > 14 trabalham no mesmo subsistema:
  - Chance de conflito: 15%/mes
  - Conflito: cada um sugere direcao oposta
  - Ex: Vocal Coach quer treino intensivo, Wellness Advisor quer folga
  - Jogador precisa arbitrar (nao resolve sozinho)
  - Se jogador ignora: staff com moral mais baixa pede demissao em 2 meses
  - Se jogador arbitra: lado perdedor moral -5
  - Bom staff nao significa equipe harmonica
```

## Edge Cases

- **Agencia sem staff nenhum**: Funciona -- jogador faz tudo manualmente. Sem
  bonus de coach, sem delegacao, sem mitigacao de PR. Viavel pra garagem
- **Staff com skill 1 + auto-approve**: Decisoes pessimas executadas automaticamente.
  Consequencia merecida -- o jogo avisou ao mostrar o skill baixo
- **Dois coaches do mesmo tipo**: Dividem as idols entre si. Cada coach atende
  no maximo N idols (baseado em workload). Bonus nao empilha na mesma idol
- **Staff recebe proposta de rival**: Evento urgente -- jogador pode contra-oferecer
  (aumento de salario) ou deixar sair. Staff com moral alta e mais dificil de perder
- **Staff demitido volta ao mercado**: Apos cooldown de 2 meses, pode ser
  recontratado (por jogador ou rival). Nao guarda rancor mecanicamente
- **Wellness Advisor alerta burnout mas jogador ignora**: O alerta fica registrado.
  Se a idol entra em burnout, o jogo mostra "Seu advisor alertou sobre isso 3
  semanas atras" -- feedback narrativo sem punicao mecanica adicional
- **Staff workload 100% + nova tarefa urgente**: Tarefa e rejeitada. Jogador
  precisa fazer manualmente ou contratar mais staff
- **Legal Counsel negocia contrato pior que jogador faria**: Possivel se
  skill baixo. Jogador pode rejeitar a proposta e renegociar pessoalmente

## Dependencies

**Hard:**
- Agency Economy -- salarios de staff sao despesa
- Week Simulation -- trabalho delegado processado semanalmente

**Soft:**
- Todos sistemas que recebem delegacao (Stats, Scouting, Contracts, etc.)
- **Producer Profile** (#50): Background (Veterano) e traço (Carismático) afetam staff loyalty. Ver `producer-profile.md` seção 4a/4d.

**Depended on by:**
- Agency Intelligence & Reports (staff gera insights)
- Agency Strategy (staff executa estrategia)
- Schedule/Agenda (manager cria agendas)
- Scouting (scout executa buscas)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `COACH_GROWTH_FACTOR` | 0.15 | 0.05-0.30 | Impacto do coach no crescimento de atributos |
| `SCANDAL_MITIGATION_MAX` | 0.70 | 0.3-0.9 | Reducao maxima de impacto por PR |
| `STAFF_OVERWORK_THRESHOLD` | 80% | 60-90% | Quando staff perde eficiencia |
| `STAFF_MORALE_QUIT_THRESHOLD` | 30 | 10-40 | Moral abaixo da qual staff pede demissao |
| `STAFF_SALARY_RANGE_LOW` | 50k yen | 20k-100k | Salario base staff skill 1 |
| `STAFF_SALARY_RANGE_HIGH` | 500k yen | 200k-1M | Salario base staff skill 20 |
| `MAX_STAFF_PER_TIER` | ver tabela | ajustavel | Limites de contratacao por tier |
| `DELEGATION_AUTO_APPROVE_PENALTY` | 0 | 0 | Sem penalidade -- risco e do jogador |

## Acceptance Criteria

1. 11 cargos de staff com atributos e salarios distintos
2. Delegacao funciona: staff executa tarefas e apresenta resultado
3. Auto-approve executa sem confirmacao do jogador
4. Coaches aceleram crescimento proporcionalmente a skill
5. PR Manager reduz impacto de escandalos proporcionalmente
6. Workload > 80% reduz eficiencia visivelmente
7. Staff com moral < 30 pode pedir demissao
8. Staff rival pode roubar staff do jogador (e vice-versa)
9. Slots de staff limitados por tier da agencia
10. Staff aparece no mercado com atributos e custo proporcionais

## Relationship with staff-functional.md

Este GDD define:
- Ficha de staff (atributos, salário, contrato, workload, moral)
- Tabela de cargos e categorias
- Contratação e mercado de staff
- Sistema de delegação (parâmetros, auto-approve, sugestão/aprovação)
- Workload e moral
- Especialização de staff
- Systemic Friction (trade-offs sujos)

`staff-functional.md` define:
- Funções operacionais e o que cada uma FAZ mecanicamente
- Produtor como executor substituto (qualidade reduzida, orçamento de tempo)
- NPC multi-role (acúmulo de função com penalidade)
- Stage staff híbrido (Stage Manager + pacotes de produção por evento)
- Progressão de agência via staff
- Negociação de orçamento com diretoria

## Open Questions

- Nenhuma pendente
