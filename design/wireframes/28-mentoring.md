# Wireframe 28 — Mentoring (Grupos de Mentoria)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Mentoring Groups
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/roster/training/mentoring`
> **GDDs**: training-development, idol-archetypes-roles, happiness-wellness

---

## Conceito

No Football Manager, "Mentoring" é o sistema onde você junta jogadores velhos (Líderes de Balneário) com jovens da base para passar atributos mentais e traços de personalidade ("Traits").

No **Star Idol Agency**, esta é a **Cultura e Senpai-Kohai**. É onde as Idols veteranas moldam as novatas. Uma Idol veterana com o trait "Profissional Absoluta" e alta Determinação pode ensinar isso para uma Trainee preguiçosa.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Equipa Principal | Trainees | TREINO (Ativo) | Dinâmica                           |
|-------------------------------------------------------------------------------------------------|
| Planejador de Atividades > Treino > Grupos de Mentoria                                          |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - AVALIAÇÃO DO ASSISTENTE ]     | [ CENTRO/DIR - GRUPOS DE MENTORIA (WIDGETS) ]    |
|                                              |                                                  |
| EFEITO ESTIMADO DA MENTORIA                  | [ GRUPO: LIDERANÇA E PROFISSIONALISMO ]          |
| "Recomendamos que Sakura (Veterana) oriente  | Influência Principal: Sakura (Elevada)           |
| Haruka. A atitude profissional de Sakura vai | Traços ensinados: 'Não cede à pressão da mídia'  |
| corrigir os problemas de foco de Haruka."    |                                                  |
|                                              | MEMBROS DO GRUPO (Arraste para adicionar/remover)|
| [ Botão: Pedir ao Staff para Organizar ]     | [Avatar] Sakura (Líder / Influência: +++)        |
|                                              | [Avatar] Yumi (Kohai / Influência: Baixa)        |
|----------------------------------------------| [Avatar] Haruka (Kohai / Influência: Muito Baixa)|
| IDOLS SEM GRUPO (Arraste para a direita)     |                                                  |
|                                              |--------------------------------------------------|
| [Avatar] Rina (Trainee)                      | [ GRUPO: EXPRESSÃO E CARISMA ]                   |
| Influência: Nenhuma                          | Influência Principal: Aiko (Moderada)            |
| Status: Precisa de orientação                | Traços ensinados: 'Sorriso Cativante Automático' |
|                                              |                                                  |
| [Avatar] Reina (Estrela Solo)                | MEMBROS DO GRUPO                                 |
| Influência: Altíssima                        | [Avatar] Aiko (Líder / Influência: ++)           |
| Status: Solitária, não passará traits.       | (Vazio) + Arraste Idol aqui                      |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. View Baseada em Cards Horizontais
Em vez de listas complexas, o FM26 usa painéis em formato de "caixa/widget" para cada grupo de mentoria. Os grupos ficam empilhados na tela (Centro/Direita).

### 2. Painel de Reserva (Esquerda)
As Idols que não estão em nenhum grupo de mentoria ficam num banco de dados vertical na esquerda. O jogador pode arrastar (*drag-and-drop*) a foto da idol da esquerda para dentro da "caixa" do Grupo na direita.

### 3. Hierarquia de Influência (Senpai-Kohai)
A UI deve deixar visualmente claro quem é o "Mentor" e quem é o "Mentee". O FM usa indicadores de "Influência" (Elevada, Moderada, Baixa). Se você colocar três trainees de Baixa influência sozinhas num grupo, a UI dá um aviso vermelho de que "ninguém vai aprender nada pois não há um líder".

---

## Acceptance Criteria

1. Interface *drag-and-drop* dividida entre pool de Idols (esquerda) e Grupos Ativos (centro/direita).
2. Layout em painéis (widgets) expansíveis para cada grupo de mentoria criado.
3. Exibição explícita do nível de "Influência" (Líder vs Seguinte) e de quais Traits/Personalidades estão sendo repassados.
4. Botão "Auto-Assign" permitindo que o Head Manager forme os grupos ideais automaticamente.