# Wireframe 41 — Operations Overview (Visão Geral de Operações)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Club Info / Portal Overview
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/operations`
> **GDDs**: schedule-agenda, agency-staff-operations

---

## Conceito

No FM, "Operações" seria o equivalente a gerir a rotina comercial e não-esportiva do clube.
No **Star Idol Agency**, Operações é a alma logística. É onde você aprova Jobs comerciais (comerciais de TV, revistas, lives na Twitch), gerencia a logística dos grupos e vê o cronograma imediato da agência. Esta tela é o **Dashboard de Operações**.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | Planejamento | Grupos | OPERAÇÕES (Ativo) | Relatórios               |
|-------------------------------------------------------------------------------------------------|
| Clube > Operações > Visão Geral                                                                 |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - JOBS PENDENTES (INBOX) ]    | [ COLUNA CENTRO/DIR - DASHBOARD DE LOGÍSTICA ]     |
|                                            |                                                    |
| OFERTAS COMERCIAIS (3 Novas)               | CAPACIDADE LOGÍSTICA ATUAL                         |
|                                            | Managers (Motoristas): 2/3 Ocupados nesta semana.  |
| [Ícone TV] Comercial de Refrigerante       | Estúdios de Gravação:  1/1 Ocupado (Até Sexta)     |
| Custo de Tempo: 2 Dias                     | [ Botão: Expandir Frota de Vans ]                  |
| Pagamento: ¥ 2.000.000                     |                                                    |
| Exigência: Idol com Carisma > 15           |----------------------------------------------------|
| [ Alocar Idol ]   [ Rejeitar Job ]         | AGENDA GLOBAL DA AGÊNCIA (Próximos 7 Dias)         |
|                                            |                                                    |
| [Ícone Rádio] Programa de Entrevistas      | HOJE (Segunda-Feira)                               |
| Custo de Tempo: 1 Dia (Tarde)              | [14:00] Grupo A: Gravação de Clipe (Estúdio 1)     |
| Pagamento: ¥ 500.000 + Exposição (Fama)    | [16:00] Yumi: Sessão de Fotos para Revista         |
| Exigência: Qualquer Grupo                  |                                                    |
| [ Aceitar e Agendar ]   [ Rejeitar ]       | AMANHÃ (Terça-Feira)                               |
|                                            | [09:00] Grupo B: Ensaio Geral (Sala de Dança)      |
|--------------------------------------------| [18:00] LIVE SHOW: Tokyo Dome (Grupo A)            |
|                                            |                                                    |
| JOBS EM ANDAMENTO                          | QUARTA-FEIRA                                       |
| [Ícone Revista] Sakura: Ensaio Fotográfico | [Livre] Nenhuma atividade marcada.                 |
| (1 Dia Restante)                           |                                                    |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Dashboard em Blocos (Widget System)
Ao invés de abas escondidas, a visão geral de Operações joga na cara do produtor o "Gargalo Logístico" (Capacidade Logística) e a "Agenda Global" nos widgets centrais. Se você tem 4 shows marcados e só 2 vans (Managers), a barra de ocupação ficará vermelha.

### 2. Inbox de Ofertas (Painel Esquerdo)
Semelhante à caixa de entrada do FM, mas filtrada apenas para oportunidades comerciais (Jobs). O Diretor Comercial envia a oferta da marca de refrigerante, e o jogador decide se vale a pena sacrificar 2 dias de treino da sua melhor cantora por 2 milhões de Ienes.

---

## Acceptance Criteria

1. Tela dividida entre Ofertas/Ações Pendentes (Esquerda) e Resumo Logístico/Agenda (Centro/Direita).
2. Capacidade logística (Vans, Estúdios, Managers) visualmente representada com indicadores de lotação (cores).
3. "Agenda Global" exibe eventos imediatos (próximos 7 dias) de forma resumida, interligando todas as Idols.