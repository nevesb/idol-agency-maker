# Wireframe 21 — Staff Profile (Perfil do Funcionário)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Staff Profile
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/staff/profile/:id`
> **GDDs**: staff-functional, operations

---

## Conceito

A tela de perfil detalhado de um funcionário da agência (ex: Treinador Vocal, Stylist, Produtor Musical, Head de Marketing).

**GRANDE MUDANÇA DO FM26 APLICADA:**
No FM26, a Sports Interactive removeu os números crus (1 a 20) dos atributos dos staffs (mantendo apenas para jogadores) e substituiu por rótulos qualitativos (Elite, Outstanding, Very Good, Average, etc.), obrigando o jogador a olhar a capacidade real e não apenas "farmar o número 20". Adotaremos essa lógica visual para o *Star Idol Agency* para trazer a mesma imersão moderna.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Clube > Staff > Treinadores > Yuka Nakamura                                                     |
+-------------------------------------------------------------------------------------------------+
| [ CABEÇALHO DO STAFF ]                                                                          |
| [Avatar Grande] | Yuka Nakamura (34 anos)                                                       |
|   Foto/Rosto    | Head Vocal Coach - Star Idol Agency                                           |
|                 | Salário: ¥ 450.000 / mês (Expira em 1 ano)   [ Botão: Oferecer Novo Contrato ]|
|                 | Reputação: [★★★☆☆] Regional                                                 |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - VISÃO GERAL & TENDÊNCIAS ]    | [ CENTRO/DIR - ATRIBUTOS QUALITATIVOS (GRID) ]   |
|                                              |                                                  |
| CAPACIDADE DE TREINO (Resumo)                | TÉCNICA (COACHING)                               |
| [Gráfico de Radar: Técnica vs Mental vs...]  | Técnica Vocal:     [Outstanding] (roxo/dourado)  |
|                                              | Poder Vocal:       [Very Good]   (verde escuro)  |
| PREFERÊNCIAS DE TRABALHO                     | Expressão/Carisma: [Competent]   (amarelo)       |
| Estilo Musical Preferido: J-Pop / Ballad     | Foco/Dança:        [Poor]        (vermelho)      |
| Tipo de Grupo Preferido: Solistas            |                                                  |
|                                              | MENTAIS & PERSONALIDADE                          |
| PERSONALIDADE                                | Determinação:      [Elite]       (roxo)          |
| "Perfeccionista e Exigente"                  | Nível de Disciplina:[Very Good]  (verde escuro)  |
| (Ícone de Alerta: Pode causar atrito com     | Motivação:         [Average]     (verde claro)   |
| Idols que possuem baixa determinação)        | Adaptabilidade:    [Good]        (verde)         |
|                                              | Gestão de Pessoas: [Competent]   (amarelo)       |
| HISTÓRICO RECENTE                            |                                                  |
| 2024-2026: Star Idol Agency                  | CONHECIMENTO (KNOWLEDGE)                         |
| 2021-2024: Agência Rival (Treinadora)        | Mercado Japonês:   [Elite]                       |
|                                              | Mercado Coreano:   [Reasonable]                  |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Atributos Qualitativos (A grande novidade)
O FM26 escondeu o "1-20" do staff e colocou *Labels* (Elite, Outstanding, Very Good, Good, Average, Competent, Reasonable, Poor). Isso exige muito mais do feeling do produtor. Adotamos o mesmo para os Coaches/Staffs da Agência, representados por texto + cor de fundo da "tag" (ex: roxo para Elite).

### 2. Cabeçalho Compacto e Direto
O Navbar some para staffs, dando lugar a um cabeçalho horizontal rico contendo o básico: Nome, Função, Contrato Atual e Reputação, ao lado do grande avatar do funcionário.

### 3. Painel de Personalidade e Preferências
Crucial no gerenciamento de Idols: se a Vocal Coach prefere "Solistas / Ballad" mas você a coloca para treinar um "Grupo Gótico de 8 integrantes", a moral dela (e o rendimento do treino) cai.

---

## Acceptance Criteria

1. Tela exibe os atributos do staff com *Labels Qualitativos* (estilo FM26) em vez de números.
2. Uso do gráfico de radar (Polígono) na esquerda para visão rápida das qualidades.
3. Seção explícita de "Personalidade" e "Preferências", que impactam a dinâmica com o Roster.