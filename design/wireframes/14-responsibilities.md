# Wireframe 14 — Responsibilities (Delegação & Controle)

> **Status**: Draft (Updated to FM26 UI Standard)
> **Referência visual**: FM26 Responsibilities / Delegation Screens
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/responsibilities`
> **GDDs**: agency-staff-operations, staff-functional, producer-profile

---

## Conceito

Tela de **governança operacional** da agência. Inspirada no novo FM26, esta tela utiliza navegação em camadas e cards detalhados. Aqui o jogador (Produtor) define **quem toma cada decisão** e **quem executa cada rotina**.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Eventos | Clube | Carreira         [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Staff | Responsabilidades (Ativo) | Centro de Treino | Dinâmica                   |
|-------------------------------------------------------------------------------------------------|
| Clube > Responsabilidades > Visão Geral                                                         |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQUERDA - NAVEGAÇÃO ] | [ CENTRO - LISTA DE TAREFAS/DELEGAÇÃO ] | [ DIREITA - CONTEXT ] |
|                                 |                                         |                       |
| CATEGORIAS                      | CONTRATAÇÃO DE STAFF                    | EXECUTOR ATUAL        |
| [ ] Visão Geral                 |                                         |                       |
| [X] Staff                       | > Contratar Produtores Musicais         | [Avatar Circular]     |
| [ ] Treino                      |   [ Dropdown: Diretor de Operações v ]  | Nome: Akane Tendo     |
| [ ] Recrutamento (Scouting)     |                                         | Cargo: Diretor de Op. |
| [ ] Shows & Eventos             | > Renovar Contratos de Staff            | Carga: Normal         |
| [ ] Imprensa                    |   [ Dropdown: Produtor (Você)      v ]  | Atributo Chave: 16    |
| [ ] Camadas Jovens (Trainees)   |
| [ ] Operações                   |                                         |                       |
|                                 | TREINO & DESENVOLVIMENTO                | AÇÕES RÁPIDAS         |
| FILTROS                         |                                         | [ Botão: Retomar ]    |
| [Dropdown: Todas]               | > Definir Focos Individuais             | [ Botão: Mudar ]      |
|                                 |   [ Dropdown: Head Vocal Coach     v ]  |                       |
|                                 |                                         | REGRAS (SE APLICÁVEL) |
|                                 | RECRUTAMENTO DE IDOLS                   | Confirmar comigo se   |
|                                 |                                         | custo > ¥5.000.000    |
|                                 | > Procurar Novos Talentos               |                       |
|                                 |   [ Dropdown: Chefe de Olheiros    v ]  |                       |
|                                 |                                         |                       |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Navegação Horizontal Dupla + Breadcrumb
- Navegação primária no topo com categorias globais.
- Navegação secundária logo abaixo focada em Operações/Staff.
- Breadcrumbs para fácil localização.

### 2. Layout 3-Colunas
- **Esquerda (Sidebar de Filtros/Categorias):** Abas verticais para pular entre os tipos de responsabilidades (Staff, Treino, Recrutamento).
- **Centro (Conteúdo Principal):** Lista agrupada das tarefas e decisões. Cada item possui um dropdown destacando quem é o responsável (ex: "Produtor (Você)", "Diretor de Operações"). O dropdown permite a mudança com 2 cliques.
- **Direita (Contexto Lateral):** Quando o jogador seleciona uma responsabilidade no Centro, a coluna da direita mostra os detalhes de quem está executando aquilo atualmente: a foto (avatar circular), atributos relevantes para a função, a carga de trabalho, e botões para retomar a responsabilidade para si.

### 3. Densidade e Cores
- **Cores Táticas:** Se o atributo de quem está assumindo a tarefa for excelente, fica verde. Se estiver sobrecarregado (Heavy Workload), fica vermelho.
- Fundo escuro padrão FM26, maximizando o foco na legibilidade das opções de delegação.

---

## Categoria: Operações (Merged from WF-48)

> Esta seção descreve o conteúdo exibido quando o jogador seleciona a aba **"Operações"** na sidebar de categorias (coluna esquerda). Conteúdo originado do Wireframe 48.

### Layout da aba Operações

```text
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - VISÃO GERAL DE OPERAÇÕES ]  | [ CENTRO/DIR - ATRIBUIÇÕES ESPECÍFICAS (GRID) ]    |
|                                            |                                                    |
| STATUS DE DELEGAÇÃO                        | MÍDIA E RELAÇÕES PÚBLICAS                          |
| Operações de Mídia: [ Delegado ]           |                                                    |
| Operações de Jobs:  [ Manual ]             | Lidar com a imprensa local e entrevistas em shows  |
| Renovação da Base:  [ Manual ]             | [ Dropdown: Chefe de RP (Kenji) v ]                |
|                                            |                                                    |
| DIRETOR DE OPERAÇÕES                       | Controlar vazamento de escândalos de Idols         |
| [Avatar] Sr. Yorihiro                      | [ Dropdown: Produtor (Você) v ]                    |
| Carga de Trabalho: Normal                  | "Manter sob meu controle para não haver demissão." |
| Avaliação: [★★★★☆]                         |                                                    |
|                                            | Responder coletivas após premiações da Oricon      |
| DIRETOR DE CASTING                         | [ Dropdown: Líder do Grupo Principal (Sakura) v ]  |
| [Avatar] Tanaka                            |                                                    |
| Carga de Trabalho: Alta                    |----------------------------------------------------|
| Avaliação: [★★★☆☆]                         | AGENDA E JOBS COMERCIAIS                           |
|                                            |                                                    |
| CHEFE DE RP (PR)                           | Agendar e aprovar comerciais de TV e Revistas      |
| [Avatar] Kenji                             | [ Dropdown: Produtor (Você) v ]                    |
| Carga de Trabalho: Leve                    |                                                    |
| Avaliação: [★★★★★]                         | Aceitar/Rejeitar Collabs em Redes Sociais          |
|                                            | [ Dropdown: Diretor de Operações v ]               |
|                                            |                                                    |
+-------------------------------------------------------------------------------------------------+
```

### Perfis de Diretores (Coluna Esquerda)

Os três cargos exibidos na coluna esquerda da aba Operações são:

- **Diretor de Operações** — supervisiona logística geral, agendamentos e jobs comerciais. Exibe carga de trabalho e avaliação por estrelas.
- **Diretor de Casting** — gerencia recrutamento e triagem de novos talentos. Pode ter carga elevada em períodos de scouting ativo.
- **Chefe de RP (PR)** — responsável pela gestão de imagem e relações com a imprensa. Pode ser designado para lidar com entrevistas rotineiras.

### Sub-seções de Delegação (Coluna Centro/Direita)

#### Mídia e Relações Públicas

| Tarefa | Opções de Responsável |
|---|---|
| Lidar com a imprensa local e entrevistas em shows | Staff de RP, Produtor (Você) |
| Controlar vazamento de escândalos de Idols | Produtor (Você) recomendado — risco de demissão |
| Responder coletivas após premiações da Oricon | Líder do Grupo, Chefe de RP, Produtor (Você) |

#### Agenda e Jobs Comerciais

| Tarefa | Opções de Responsável |
|---|---|
| Agendar e aprovar comerciais de TV e Revistas | Produtor (Você), Diretor de Operações |
| Aceitar/Rejeitar Collabs em Redes Sociais | Diretor de Operações, Produtor (Você) |

### Idol como Staff de Relações Públicas (Delegação Excepcional)

Inspirado no conceito do capitão de time do FM26, a **Líder do Grupo** (ex.: Sakura) pode ser delegada como a "Face do Grupo":

- Assume entrevistas pós-show quando o Produtor prefere se manter nos bastidores.
- Afeta os atributos de **Estresse** e **Carisma** da idol designada.
- Disponível apenas para idols com a função de papel "Líder" atribuída.
- Aparece como opção nos dropdowns de tarefas de imprensa ao lado do staff regular.

---

## Acceptance Criteria

1. Utiliza a nova estrutura de 3 colunas para navegação contínua sem modais desnecessários.
2. Permite a delegação de tarefas críticas com apenas um dropdown por linha.
3. Coluna da direita atualiza reativamente ao clicar em uma tarefa, mostrando quão bom o staff atual é para aquela função.
4. Distingue claramente tarefas sob controle manual ("Você") de tarefas delegadas ("Staff").
5. Suporta edição de regras condicionais (ex: "Olheiro procura, mas Produtor aprova oferta final").
6. Aba "Operações" listando responsabilidades de logística, agendamento de jobs e controle de mídia/imprensa.
7. Layout vertical em dropdowns com seleção imediata do responsável pela tarefa na aba Operações.
8. Permissão estendida para que Idols com função "Líder" assumam papéis de Relações Públicas nas coletivas de imprensa, afetando o estresse/carisma delas.
9. Indicadores de Carga de Trabalho dos diretores na coluna da esquerda da aba Operações.