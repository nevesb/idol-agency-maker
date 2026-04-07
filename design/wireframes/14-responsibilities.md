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
| [ ] Camadas Jovens (Trainees)   |                                         |                       |
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

## Acceptance Criteria

1. Utiliza a nova estrutura de 3 colunas para navegação contínua sem modais desnecessários.
2. Permite a delegação de tarefas críticas com apenas um dropdown por linha.
3. Coluna da direita atualiza reativamente ao clicar em uma tarefa, mostrando quão bom o staff atual é para aquela função.
4. Distingue claramente tarefas sob controle manual ("Você") de tarefas delegadas ("Staff").
5. Suporta edição de regras condicionais (ex: "Olheiro procura, mas Produtor aprova oferta final").