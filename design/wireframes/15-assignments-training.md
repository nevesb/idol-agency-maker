# Wireframe 15 — Training Assignments (Atribuição de Treinos)

> **Status**: Draft (Updated to FM26 UI Standard)
> **Referência visual**: FM26 Individual Training / Coach Assignments
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/training/assignments`
> **GDDs**: training-development, staff-roles

---

## Conceito

Tela onde o Produtor distribui as responsabilidades de treinamento entre o **Staff Técnico** (Instrutores de Dança, Treinadores Vocais, Mentores de Mídia, etc.). 

Usando a interface do FM26, esta tela foca em uma matriz densa de seleção e um painel de contexto à direita, abandonando pop-ups em favor de edição in-line para otimizar os cliques.

---

## Estrutura da Tela (Layout FM26)

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

## Componentes FM26 Aplicados

### 1. Grids e Estrelas Integradas
- O painel central usa uma tabela densa (Grid). Cada célula na interseção Staff x Categoria é um checkbox customizado (toggle).
- Na base do painel central, a avaliação (Star Rating) e a carga (LGT/AVG/HVY) atualizam instantaneamente conforme você marca/desmarca os checkboxes.

### 2. Coluna Esquerda: Overview Holístico
- Mostra a situação global da agência em relação às estrelas de cada área. Fica fácil ver que "Carisma" tem só 2 estrelas e carga pesada (vermelho), alertando o jogador a contratar alguém ou realocar.
- O botão `Auto-Assign` (pedir ao Head Coach/Assistant) fica em destaque.

### 3. Coluna Direita: Contexto de Ação Rápida
- Ao invés de abrir o perfil de um instrutor em outra tela, ao passar o mouse ou focar na linha de "John Doe", a coluna direita já carrega a foto dele e os atributos exatos necessários para o treino. Valores bons em verde, medianos em amarelo.

---

## Acceptance Criteria

1. Tela usa modelo 3-colunas de gestão de dados.
2. Interação de clique na matriz central muda as estrelas no bottom instantaneamente.
3. Coluna da direita reage à seleção da linha central exibindo atributos técnicos de treino.
4. Feedback visual forte (cores verde/amarelo/vermelho) para *Workload* na coluna esquerda e base da matriz.
5. Filtro para permitir que o Produtor (Você) também possa ser incluído na matriz caso queira treinar as Idols pessoalmente.