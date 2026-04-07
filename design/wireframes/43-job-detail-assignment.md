# Wireframe 43 — Job Detail & Assignment (Atribuição do Job)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Offer Contract / Squad Selection Modal
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/operations/jobs/:id/assign`
> **GDDs**: schedule-agenda

---

## Conceito

Quando o produtor clica em "Aceitar e Agendar Idol" (Wireframe 42), ele precisa alocar uma pessoa física para o comercial e achar 2 dias livres na agenda dessa garota.

No **Star Idol Agency**, esta é a tela (ou modal full-screen) de **Match & Booking**. É aqui que o conflito logístico (FM-like) acontece: "Puxa, a Sakura é perfeita pro comercial de 2 milhões, mas ela tem ensaio geral do show do Tokyo Dome nesses exatos 2 dias. Sacrifico o ensaio ou recuso o comercial?"

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | Planejamento | Grupos | OPERAÇÕES (Ativo) | Relatórios               |
|-------------------------------------------------------------------------------------------------|
| Clube > Operações > Quadro de Jobs > Comercial de Refrigerante "Spark" > AGENDAR                |
+-------------------------------------------------------------------------------------------------+
| [ CABEÇALHO DO JOB ]                                                                            |
| [Ícone TV] COMERCIAL DE REFRIGERANTE "SPARK" | Spark Soda Co.                                   |
| Requisitos: Carisma >= 15, Aparência >= 14 | Duração: 2 Dias | Pagamento: ¥ 2.000.000         |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - ESCOLHER IDOL ]               | [ COLUNA CENTRO/DIR - CONFLITOS DE AGENDA ]      |
|                                              |                                                  |
| FILTRO DE CANDIDATAS                         | [Avatar] SAKURA (Selecionada)                    |
| [ ] Ocultar Idols com Conflitos de Agenda    | Carisma: 18 | Aparência: 15                      |
|                                              | Fadiga Atual: [♥♥♥♥♡] Baixa                      |
| [Avatar] SAKURA                              |                                                  |
| Adequação: 100%                              | ESCOLHER DATA DO JOB (Spark Soda)                |
| Status: Conflito Crítico Detectado [!]       | O cliente aceita a gravação entre os dias 12/04  |
|                                              | e 20/04. Duração: 2 dias consecutivos.           |
| [Avatar] REINA                               |                                                  |
| Adequação: 90%                               | AGENDA DE SAKURA (Próximos Dias)                 |
| Status: Agenda Livre                         |                                                  |
|                                              | 12/04 [Seg] - Livre                              |
| [Avatar] YUMI                                | 13/04 [Ter] - Livre                              |
| Adequação: 60% (Requisitos não atendidos)    | 14/04 [Qua] - Treino de Dança (Grupo A)          |
| Status: Não recomendada pela diretoria.      | 15/04 [Qui] - [!] ENSAIO GERAL TOKYO DOME        |
|                                              | 16/04 [Sex] - [!] SHOW: TOKYO DOME LIVE          |
|                                              | 17/04 [Sáb] - Recuperação Pós-Show               |
|                                              | 18/04 [Dom] - Livre                              |
|                                              |                                                  |
|                                              | DATAS SELECIONADAS:                              |
|                                              | [ Dropdown: 12/04 e 13/04 v ] -> Status: OK      |
|                                              |                                                  |
|                                              | [ Botão: Confirmar Agendamento de Sakura ]       |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Match & Conflict Resolution (Squad Registration)
A clássica tela de seleção onde o FM26 te avisa que um jogador já jogou pelo Sub-20 ontem e está morto de cansaço. Aqui, a Sakura tem o show da vida dela na sexta-feira. Se você for ganancioso e colocar o comercial de refrigerante na quinta e sexta, o jogo barra (Conflito Crítico).

### 2. Seletor de Datas Dinâmico
Você não joga as Idols num limbo abstrato. A coluna da direita lista os próximos 7 a 10 dias daquela Idol. Você seleciona o bloquinho de "Segunda e Terça" que estavam livres, o sistema diz "Status OK" e o botão de Confirmar acende em Verde/Rosa choque.

### 3. Filtro de Ocultação
O produtor pode marcar "Ocultar Idols com Conflito", sumindo com a Sakura da lista da esquerda e forçando-o a dar o comercial rentável para a Reina (que estava ociosa) ao invés de destruir a agenda da vocalista principal do grupo.

---

## Acceptance Criteria

1. Tela apresenta lista de Idols avaliadas contra os requisitos do Job na coluna da esquerda.
2. Coluna direita exibe a agenda individual da Idol selecionada de forma vertical e temporal.
3. Alertas de conflito de agenda (Shows, Ensaios ou Férias) bloqueiam agendamentos de jobs concorrentes.
4. Botão de "Confirmar Agendamento" apenas se habilita se uma data de duração contínua (ex: 2 dias) for válida.