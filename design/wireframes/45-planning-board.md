# Wireframe 45 — Planning Board (Quadro de Planejamento Logístico)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Pre-Season Planning / Logistics
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/operations/planning`
> **GDDs**: schedule-agenda, agency-staff-operations

---

## Conceito

No Football Manager, você tem telas de pré-temporada onde define viagens, estágios de treinamento e amistosos (Tours). 
No **Star Idol Agency**, esta é a tela de **Quadro de Planejamento Logístico**. Uma Idol não se teletransporta do estúdio de gravação para a gravação da rádio: ela usa vans, estúdios físicos (capacidade do seu prédio), maquiadores (tempo deles), e managers (motoristas). É aqui que o produtor resolve *Gargalos*.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | PLANEJAMENTO (Ativo) | Grupos | Operações | Relatórios               |
|-------------------------------------------------------------------------------------------------|
| Clube > Planejamento Logístico                                                                  |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - VISÃO DOS RECURSOS FÍSICOS ] | [ CENTRO/DIR - TIMELINE DE GARGALOS LOGÍSTICOS ]  |
|                                             |                                                   |
| CAPACIDADE DA AGÊNCIA (Hoje)                | SEMANA: 12 A 18 DE ABRIL                          |
|                                             |                                                   |
| VANS (TRANSPORTE)                   [1/2]   | SEG 12 (Sem Conflitos)                            |
| > Van A: Disponível (Estacionada)           | - [Job] Spark Soda usa: Van B, Kenji (Road Mgr.)  |
| > Van B: Em Uso (Job: Sakura)               |                                                   |
|                                             | TER 13 (Sem Conflitos)                            |
| ROAD MANAGERS                       [1/2]   | - [Job] Spark Soda usa: Van B, Kenji (Road Mgr.)  |
| > Kenji: Acompanhando Sakura                |                                                   |
| > Takeda: Livre na Agência                  | QUA 14 (Conflito de Estúdio)                      |
|                                             | [!] Estúdio de Gravação A lotado.                 |
| ESTÚDIOS DE GRAVAÇÃO                [1/1]   | Reina marcou gravação Solo às 14h, mas o Celestial|
| > Estúdio A: Ocupado (Reina / Celestial 9)  | Nine tentou marcar Ensaio Vocal às 15h.           |
|                                             |                                                   |
| SALAS DE DANÇA                      [0/2]   | AÇÕES DE RESOLUÇÃO (Para Quarta-feira):           |
| > Sala 1: Livre                             | [ Botão: Remarcar Ensaio do Celestial Nine ]      |
| > Sala 2: Livre                             | [ Botão: Remarcar Gravação Solo da Reina ]        |
|                                             | [ Botão: Alugar Estúdio Terceirizado (¥50k) ]     |
| [ Botão: Solicitar Expansão ao Board ]      |                                                   |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Indicadores de Status Binários (Esquerda)
FM26 tem menus suspensos rápidos que avisam se o seu time reserva está usando o campo de treino 2. Aqui a esquerda mostra os "Recursos Físicos" (Instalações, Veículos, Pessoal de Apoio). Se você tiver 3 compromissos fora do prédio ao mesmo tempo e apenas 2 vans, a tela pisca em vermelho na timeline da direita.

### 2. Timeline de Conflitos e Ações de Resolução (Direita)
A tela não é só um aviso visual. Ela, semelhante ao FM moderno, embute a solução do problema logo abaixo do aviso de conflito. Se o estúdio de som tem apenas 1 sala e Reina cruzou agenda com as 9 meninas do grupo principal, o jogador pode *Alugar um Estúdio de Terceiros* (pagando dinheiro) ou remarcar uma das duas.

---

## Acceptance Criteria

1. Tela apresenta lista interativa dos recursos logísticos da Agência (Instalações, Veículos, Staff Auxiliar).
2. A coluna direita age como um validador da "Agenda da Semana" (Wireframe 44), identificando "Double Booking".
3. Ações rápidas de resolução de conflitos (pagar aluguel ou remarcar) integradas diretamente no relatório do dia afetado.