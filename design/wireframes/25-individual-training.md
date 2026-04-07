# Wireframe 25 — Individual Training (Treino Individual)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Individual Training (Screenshot "Treino Individual")
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/roster/training/individual`
> **GDDs**: training-development, idol-archetypes-roles

---

## Conceito

No FM26, o Treino Individual é onde o Manager pega o jogador pela mão, define sua "Função" (Role), o atributo específico que ele precisa focar, e a intensidade. 

No **Star Idol Agency**, esta é a tela mais importante para moldar uma Trainee ou lapidar uma Idol. Você decide se ela será uma "Main Vocal" (foco em Técnica Vocal), uma "Center" (foco em Carisma e Dança) ou uma "Variety Idol" (foco em Mental/Expressão), e define o quão pesado ela vai treinar.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Equipa Principal | Trainees | TREINO (Ativo) | Dinâmica                           |
|-------------------------------------------------------------------------------------------------|
| Planejador de Atividades > Treino > Treino Individual                                           |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - LISTA DE IDOLS ] | [ CENTRO - PAINEL DO INDIVÍDUO ]        | [ COL DIR - AÇÕES ] |
|                                 |                                         |                     |
| DROPDOWNS                       | [Avatar] Yumi (18 anos)                 | RESPONSABILIDADE    |
| [ Visão: Detalhada v ]          | Papel Atual: Lead Dancer                |                     |
|                                 | Capacidade: [★★★☆☆] Potencial: [★★★★☆]  | [Avatar] Nakamura   |
| [ ] [Avatar] Sakura             |                                         | Cargo: Head Coach   |
| [ ] [Avatar] Aiko               | WIDGETS DE TREINO                       |                     |
| [X] [Avatar] Yumi (Selecionada) | [ Foco de Função (Role) ]               | AÇÕES DIRETAS       |
| [ ] [Avatar] Haruka             | (Dropdown: Center, Main Vocal, Dancer)  |                     |
| [ ] [Avatar] Kaho               | * Selecionado: Main Dancer              | > Elogiar Treino    |
| [ ] [Avatar] Rina               |                                         | > Criticar Treino   |
| [ ] [Avatar] Reina              | [ Foco Específico (Atributo) ]          | > Descansar (1 dia) |
|                                 | (Dropdown: Nenhum, Resistência, Agudos) | > Descansar (1 sem.)|
|                                 | * Selecionado: Resistência (Stamina)    |                     |
|                                 |                                         | WIDGET DE PROGRESSO |
|                                 | [ Intensidade do Treino ]               | "A idol está tendo  |
|                                 | (Automático, Leve, Normal, Dupla)       | uma boa evolução."  |
|                                 | * Selecionado: Dupla Intensidade        | [Mini Gráfico Linha]|
|                                 |                                         |                     |
|                                 |---------------------------------------------------------------|
|                                 | GRADE DE ATRIBUTOS (COM HIGHLIGHTS DO ROLE)                   |
|                                 | (As bolinhas amarelas/verdes indicam o que o Role exige)      |
|                                 |                                                               |
|                                 | ARTÍSTICOS        MENTAIS/MÍDIA        FÍSICOS                |
|                                 | Técnica Vocal: 8  (o) Carisma: 12      (x) Stamina: 11        |
|                                 | (x) Dança: 14     Expressão: 10        Agilidade: 13          |
|                                 | Ritmo: 13         Compostura: 9        Aparência: 12          |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Layout Clássico de 3 Colunas Interligadas
- **Esquerda**: Uma lista simples da qual o produtor nunca sai. Clicou em um nome, o centro e a direita mudam instantaneamente.
- **Centro**: Os *widgets* focados. A seleção de "Role" (Função), Foco Adicional e Intensidade. A parte inferior possui a Grade de Atributos, onde os campos exigidos pela função escolhida recebem highlights visuais (bolinhas coloridas ao lado do atributo), idêntico ao FM26.
- **Direita**: Onde fica o staff responsável por aquele treino e as **Ações de Interação** (pedir descanso, elogiar, criticar).

### 2. Micro-Gestão da Fadiga
A opção de **Intensidade** (Leve, Normal, Dupla) atua diretamente sobre o risco de Burnout (a "Condição Física"). Se a idol está com fadiga alta na tela `23-roster-main-table`, é aqui na tela `25` que o produtor coloca a intensidade no "Leve" ou clica no botão rápido da direita "Descansar (1 dia)".

### 3. Widget de Progresso
O mini-gráfico de linha na barra lateral é retirado diretamente dos prints do FM26. Mostra de forma puramente visual se as notas da Idol estão subindo nas últimas semanas ou se estagnaram.

---

## Acceptance Criteria

1. Implementa o sistema de 3 colunas fluídas de leitura-edição do FM26.
2. Contém Dropdown para selecionar a Função/Role desejada (Main Vocal, Dancer, Variety, etc).
3. Tabela de Atributos reage à escolha da Função (highlight dos stats necessários).
4. Fornece opções de feedback rápido (Elogiar/Criticar) atrelados à motivação da Idol.