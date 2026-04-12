# Wireframe 24 — Roster Development Hub (Centro de Desenvolvimento)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Development Centre
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/roster/development`
> **GDDs**: training-development, agency-growth, talent-development-plans, staff-functional

---

## Conceito

No FM, o "Development Centre" é o paraíso de quem gosta de formar base. É lá que o Manager avalia os garotos da base (Sub-18, Sub-20) e decide quem sobe pro time principal ou vai pra empréstimo.

No **Star Idol Agency**, esta tela é o **Centro de Trainees**. É onde a Agência avalia o pipeline de futuros talentos. Idols que ainda não debutaram (não foram alocadas num Grupo Principal ou projeto Solo ativo) ficam aqui, treinando atributos básicos.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | PLANTEL (Ativo) | Recrutamento | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | Centro de Trainees (Ativo) | Grupos | Relatórios | Inscrição           |
|-------------------------------------------------------------------------------------------------|
| Plantel > Centro de Trainees > Visão Geral                                                      |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - AVALIAÇÃO DO HEAD MENTOR ]                                                  |
|                                                                                                 |
| "A nossa atual geração de trainees possui um grande potencial vocal, mas estamos deficientes    |
| em talentos focados em dança (Choreography). Recomendo focar o recrutamento nisso."             |
| [Avatar do Head Mentor]                                                                         |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - DESTAQUES DA BASE ]           | [ CENTRO/DIR - TABELA DO PIPELINE ]              |
|                                              |                                                  |
| CANDIDATAS AO DEBUT (PRONTAS)                | FILTROS: [X] Esconder Idols já no Time Principal |
|                                              |                                                  |
| [Avatar] Miku (17)                           | NOME         | IDADE | FUNÇÃO | POTENCIAL | PROG.|
| Papel: Center / Visual                       |--------------------------------------------------|
| Potencial: 5.0* | Atual: 3.0*                | Miku         | 17    | Center | 5.0*      | +++  |
| "Pronta para um grupo principal."            | Haruka       | 16    | Vocal  | 4.5*      | ++   |
| [ Botão: Promover para Debut ]               | Rina         | 15    | Dança  | 4.0*      | +    |
|                                              | Kaho         | 18    | Varied.| 3.5*      | -    |
|                                              |                                                  |
| ESTAGNADAS (RISCO DE CORTE)                  |--------------------------------------------------|
| [Avatar] Kaho (18)                           |                                                  |
| "Não evoluiu fisicamente nos últimos 3 meses."                                                  |
| [ Botão: Sugerir Dispensa ]                  | [ GRÁFICO DE PROGRESSÃO DE TALENTOS ]            |
|                                              | (Gráfico de barras mostrando a distribuição de   |
|                                              | estrelas de potencial do centro atual)           |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Painel do Head Mentor (Topo)
O FM26 sempre coloca a opinião de um membro sênior do staff no topo dessas telas gerenciais ("Head of Youth Development" no FM). Aqui o "Head Mentor" ou "Diretor de Trainees" lê a sua base de trainees e te dá um feedback mastigado sobre o que está sobrando ou faltando.

### 2. Destaques Visuais (Esquerda)
O "Candidates for First Team" do FM. O sistema aponta autonomamente as trainees que já bateram o nível mínimo para participar de um grupo de debut (estrelas de Capacidade Atual boas o suficiente). Também aponta quem está "encostada" (não sobe de nível e está desperdiçando salário/bolsa).

### 3. Pipeline Limpo e Focado em Potencial (Centro)
A tabela foca apenas na evolução (`Prog.`: se os atributos estão subindo ou descendo com os treinos) e nas estrelas de Potencial (estrelas douradas vs pretas do FM). 

---

## Aba: Atribuição de Staff de Treino (Merged from WF-15)

> Esta aba é acessada dentro do Development Hub como uma das abas da navegação secundária (e.g. "Atribuições de Staff"). O conteúdo abaixo foi consolidado do [Wireframe 15 — Training Assignments](15-assignments-training.md).

### Conceito

Aba onde o Produtor distribui as responsabilidades de treinamento entre o **Staff Técnico** (Instrutores de Dança, Treinadores Vocais, Mentores de Mídia, etc.).

Usa uma matriz densa de seleção (Staff × Categoria) e um painel de contexto à direita, com edição in-line (sem pop-ups) para minimizar cliques.

### Estrutura da Aba (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Eventos | Clube | Carreira         [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Calendário | Programação | Atribuições de Staff (Ativo) | Relatórios              |
|-------------------------------------------------------------------------------------------------|
| Clube > Treino > Atribuições de Staff                                                           |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - VISÃO GERAL ] | [ CENTRO - MATRIZ DE ATRIBUIÇÕES (GRID) ]| [ DIREITA - CONTEXT ] |
|                              |                                          |                       |
| CARGA DE TREINO (WORKLOAD)   | STAFF                 | VOCAL | DANÇA |  | STAFF SELECIONADO     |
|                              |-----------------------+-------+-------|  |                       |
| Vocal:   [★★★☆☆] Leve    | [Avatar] John Doe     | [X]   | [ ]   |  | [Avatar] John Doe     |
| Dança:   [★★★★☆] Média   | (Vocal Coach)         |       |       |  |                       |
| Carisma: [★★☆☆☆] Pesada! |                       |       |       |  | Cargo: Vocal Coach    |
| Atuação: [★★★☆☆] Leve    | [Avatar] Jane Smith   | [ ]   | [X]   |  | Idade: 34 anos        |
|                              | (Dance Instructor)    |       |       |  |                       |
| [ Botão: Auto-Assign ]       |                       |       |       |  | ATRIBUTOS CHAVE       |
|                              | [Avatar] Akane Tendo  | [X]   | [X]   |  | Técnica Vocal:   18   |
| FILTROS                      | (Trainee Mentor)      |       |       |  | Poder Vocal:     15   |
| [X] Mostrar Produtor         |                       |       |       |  | Motivação:       16   |
| [ ] Ocultar Sobrecarga       | [Avatar] Você (Prod)  | [ ]   | [ ]   |  | Disciplina:      12   |
|                              | (Producer)            |       |       |  |                       |
|                              |-----------------------+-------+-------|  | CARGA (WORKLOAD)      |
|                              | AVALIAÇÃO             | 4.5*  | 4.0*  |  | Nível: Médio          |
|                              | CARGA                 | LGT   | AVG   |  | Eventos: 2/semana     |
+-------------------------------------------------------------------------------------------------+
```

### Componentes FM26 Aplicados

#### 1. Grids e Estrelas Integradas
- O painel central usa uma tabela densa (Grid). Cada célula na interseção Staff × Categoria é um checkbox customizado (toggle).
- Na base do painel central, a avaliação (Star Rating) e a carga (LGT/AVG/HVY) atualizam instantaneamente conforme o jogador marca/desmarca os checkboxes.

#### 2. Coluna Esquerda: Overview Holístico (Workload)
- Mostra a situação global da agência em relação às estrelas de cada área de treino. Fica fácil ver que "Carisma" tem só 2 estrelas e carga pesada (vermelho), alertando o jogador a contratar alguém ou realocar.
- O botão `Auto-Assign` (pedir ao Head Coach/Assistant) fica em destaque na coluna esquerda.

#### 3. Coluna Direita: Painel de Contexto de Staff
- Ao invés de abrir o perfil de um instrutor em outra tela, ao passar o mouse ou focar na linha de um staff, a coluna direita carrega a foto e os atributos exatos necessários para o treino daquele membro.
- Valores bons exibidos em verde, medianos em amarelo, fracos em vermelho.

---

## Acceptance Criteria

1. Tela apresenta a opinião textual da IA (Staff) sobre a saúde geral do centro de Trainees.
2. Divide claramente as trainees em listas acionáveis: "Prontas para Promover" e "Estagnadas".
3. Tabela oculta por padrão qualquer Idol que já seja do "Time Principal" (já fez Debut).
4. Mostra o Progresso (setas de evolução de atributos) para guiar o feedback do jogador sobre o treino da base.
5. Aba "Atribuições de Staff" usa modelo 3-colunas de gestão de dados (WF-15 AC1).
6. Interação de clique na matriz central muda as estrelas no bottom instantaneamente (WF-15 AC2).
7. Coluna da direita reage à seleção da linha central exibindo atributos técnicos de treino do staff selecionado (WF-15 AC3).
8. Feedback visual forte (cores verde/amarelo/vermelho) para *Workload* na coluna esquerda e base da matriz (WF-15 AC4).
9. Filtro permite que o Produtor (Você) também seja incluído na matriz caso queira treinar as Idols pessoalmente (WF-15 AC5).