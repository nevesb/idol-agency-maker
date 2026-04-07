# Wireframe 44 — Weekly Agenda (Agenda da Semana)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Schedule / Calendar Overview
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/operations/agenda`
> **GDDs**: schedule-agenda

---

## Conceito

A Agenda da Semana no FM é aquele sumário que aparece e você só clica em "Continue". No **Star Idol Agency**, a tela de **Agenda da Semana** é o hub central de visualização de tudo que está acontecendo na agência. Não apenas os treinos (que têm o Wireframe 26 exclusivo), mas Shows, Sessões de Estúdio para gravar Músicas (Singles), Férias, e os Jobs comerciais que você acabou de aceitar.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | Planejamento | Grupos | OPERAÇÕES (Ativo) | Relatórios               |
|-------------------------------------------------------------------------------------------------|
| Clube > Operações > Agenda da Semana                                                            |
+-------------------------------------------------------------------------------------------------+
| [ BARRA SUPERIOR DO CALENDÁRIO DA AGÊNCIA ]                                                     |
| [ < ] Semana de 12/04 a 18/04 de 2026 [ > ]   [ Botão: Visão Mensal ]                           |
|-------------------------------------------------------------------------------------------------|
|                                                                                                 |
| SEG 12 | TER 13 | QUA 14 | QUI 15 | SEX 16 | SÁB 17 | DOM 18 |                                  |
|--------+--------+--------+--------+--------+--------+--------|                                  |
| [Job]  | [Job]  | [Trei] | [Trei] | [SHOW] | [Folga]| [Folga]| [ GRUPO ] Celestial Nine       |
| TV:    | TV:    | Ensaio | Ensaio | TOKYO  | Recup. | Livre  |                                  |
| Spark  | Spark  | Dança  | Geral  | DOME   | Pós-   |        |                                  |
| (Sakura) (Sakura)| Grupo  | Palco  | 18:00  | Show   |        |                                  |
|--------+--------+--------+--------+--------+--------+--------|----------------------------------|
| [Trei] | [Trei] | [Job]  | [Job]  | [Trei] | [Folga]| [Trei] | [ SOLO ] Reina                 |
| Estúdio| Estúdio| Entrev.| Entrev.| Tático | Livre  | Cardio |                                  |
| Voz    | Voz    | Rádio  | Rádio  | Mídia  |        |        |                                  |
|--------+--------+--------+--------+--------+--------+--------|----------------------------------|
| [Livre]| [Livre]| [Livre]| [Livre]| [Livre]| [Livre]| [Livre]| [ BASE ] Trainees (Sub-16)     |
| (Férias Semanais - Acordo firmado após o último concerto)    |                                  |
|                                                              |                                  |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. View Horizontal (Swimlanes)
O calendário geral no FM26 agora usa faixas horizontais de rolagem se houver muita informação. No topo ficam as datas, e cada "linha" da tabela é um Grupo ativo da sua agência (incluindo Solistas ou Trainees). Assim o produtor consegue ver que na Sexta, as meninas do Grupo A estão cantando no Dome, enquanto a Trainee tá jogando videogame na Base.

### 2. Tags Visuais Mistas
Os mesmos bloquinhos do calendário de treino (Azul, Roxo, Cinza), mas agora misturados com os Jobs comerciais (Amarelo ou Dourado) e Shows (Rosa Choque / Vermelho com aviso sonoro visual).

### 3. Click-to-Edit Contextual
Clicar em qualquer dia vazio do "Celestial Nine" na Quarta-Feira abre um mini-pop-up perguntando se você quer engatar um Ensaio Extra de Vocal ali. O FM abandonou menus profundos para essas ações rápidas de calendário.

---

## Acceptance Criteria

1. Tela apresenta layout em grade semanal, dividindo o eixo Y por Grupos/Entidades da agência e o eixo X por dias da semana.
2. Uso estrito de cores contrastantes para identificar a categoria da atividade (Treino vs Job vs Show vs Férias).
3. Ações rápidas de inserção ou deleção de blocos ao clicar em slots vazios do calendário.