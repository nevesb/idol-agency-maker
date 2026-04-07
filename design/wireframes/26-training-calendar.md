# Wireframe 26 — Training Calendar (Calendário de Treinos)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Training Calendar (Screenshot "Calendário")
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/roster/training/calendar`
> **GDDs**: training-development, schedule-agenda

---

## Conceito

No FM26, o calendário de treinos é uma grade semanal onde o treinador organiza blocos de atividades diárias (Físico, Tático, Descanso). 

No **Star Idol Agency**, esta é a **Programação da Semana** do grupo. O produtor deve equilibrar blocos de ensaio vocal, coreografia, mídia (PR) e descanso. Colocar atividades demais causa fadiga severa (Burnout) e lesões pré-show; colocar de menos estagna a evolução dos atributos.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Equipa Principal | Trainees | TREINO (Ativo) | Dinâmica                           |
|-------------------------------------------------------------------------------------------------|
| Treino > Calendário     [ Filtros: Geral | Treino | Calendário (Ativo) ]                        |
+-------------------------------------------------------------------------------------------------+
| [ BARRA SUPERIOR DO CALENDÁRIO ]                                                                |
| [ < ] Dezembro de 2026 [ > ]   [ Botão: Hoje ]                                                  |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - SESSÕES (DRAG & DROP) ]| [ CENTRO/DIR - GRADE DO CALENDÁRIO (VISÃO MENSAL) ]     |
|                                       |                                                         |
| SESSÕES DISPONÍVEIS                   | SEG        TER        QUA        QUI        SEX       ...
| (Arraste para os blocos da semana)    |---------------------------------------------------------|
|                                       | 09         10         11         12         13        ...
| [Ícone Verde] Físico/Stamina          | [ ]        [ ]        [ ]        [ ]        [ ]       ...
| [Ícone Azul]  Técnica Vocal           |                                                         |
| [Ícone Roxo]  Coreografia             | [ Azul ]   [ Roxo ]   [ Verde ]  [ Amarelo] [ Cinza ]   |
| [Ícone Amarel]Mídia e PR              | Técnica    Coreog.    Físico     Mídia      Descanso    |
| [Ícone Cinza] Descanso/Livre          | Grupo      Grupo      Grupo      Grupo      Livre       |
|                                       |                                                         |
| ROTINAS SALVAS                        | [ Azul ]   [ Roxo ]   [ Verde ]  [ Roxo ]   [ Roxo ]    |
| > "Semana de Debut" (Carregar)        | Harmonia   Dança      Cardio     Dança      Ensaio      |
| > "Recuperação Pós-Show" (Carregar)   | Grupo      Grupo      Grupo      Grupo      Geral       |
|                                       |                                                         |
| INTENSIDADE GERAL                     | [ Cinza ]  [ Cinza ]  [ Amarelo] [ Cinza ]  [ Cinza ]   |
| Carga da Semana: Pesada               | Descanso   Livre      Live       Livre      Livre       |
| [ Botão: Auto-Preencher (Staff) ]     |                                  Stream                 |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Sistema Drag-and-Drop de Cards (Sidebar Esquerda)
A grande sacada do FM26 para o calendário é ter as sessões à esquerda como blocos arrastáveis (cards) que você joga dentro dos "slots" diários (Manhã, Tarde, Noite). 

### 2. Labels Coloridos (Tags Visuais)
Em vez de textos densos que poluem o calendário, usamos os **Tags Coloridos** idênticos ao print do FM26: blocos pequenos coloridos (Azul, Verde, Roxo, Amarelo, Cinza) com o ícone respectivo, permitindo ao produtor olhar a semana inteira e saber que "terça-feira é dia pesado de dança porque tá cheio de roxo".

### 3. Rotinas Pré-Salvas
Como gerenciar bloquinhos o tempo todo cansa, a barra esquerda embute a opção de salvar o layout da semana e recarregar (ex: "Rotina de Semana Pré-Show"). Também inclui o Auto-Preencher para que o *Head Coach* crie a agenda sozinho.

---

## Acceptance Criteria

1. Tela apresenta layout em grade (grid) semanal com slots de Manhã, Tarde e Noite.
2. Interação baseada em arrastar blocos visuais da esquerda para os slots.
3. Uso estrito de cores contrastantes para identificar facilmente a categoria do treino em visão macro.
4. Barra superior com controle rápido de navegação entre os meses.