# Wireframe 32 — Group Profile (Perfil de um Grupo)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Club Profile / Nation Profile
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/roster/group/:id`
> **GDDs**: idol-groups, agency-growth

---

## Conceito

No FM, o Perfil do Clube é onde você vê o resumo da história, lendas, capitão e reputação de um time. 
No **Star Idol Agency**, esta é a tela de **Perfil do Grupo**. Quando a sua agência lança um conjunto de idols (ex: "As Estrelas Cintilantes"), ele ganha uma página própria com estatísticas de popularidade, integrantes atuais, ex-integrantes (Graduated), os maiores hits e a estética/conceito do grupo.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | PLANTEL (Ativo) | Recrutamento | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | Planejamento | GRUPOS (Ativo) | Relatórios | Inscrição               |
|-------------------------------------------------------------------------------------------------|
| Plantel > Grupos > Celestial Nine (Perfil)                                                      |
+-------------------------------------------------------------------------------------------------+
| [ CABEÇALHO DO GRUPO ]                                                                          |
| [Logomarca do Grupo] | CELESTIAL NINE                                                           |
|   (Gigante)          | Conceito: Fantasia / Cute  | Formação: 2024                              |
|                      | Reputação: [★★★★☆] Nacional (Top 5 Oricon)                               |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - MEMBROS E HIERARQUIA ]        | [ CENTRO/DIR - HISTÓRICO E DISCOGRAFIA (GRID) ]  |
|                                              |                                                  |
| MEMBROS ATIVOS (9)                           | ESTATÍSTICAS DO GRUPO                            |
| [Avatar] Sakura (Center)  [ ★★★★★ ]          | Fã-Clube Ativo: 1.250.000 membros                |
| [Avatar] Aiko (Líder)     [ ★★★★☆ ]          | Singles Lançados: 5                              |
| [Avatar] Yumi (Vocal)     [ ★★★☆☆ ]          |                                                  |
| (+ 6 Membros...)                             |--------------------------------------------------|
|                                              | MAIOR SUCESSO                                    |
| [ Botão: Ajustar Formação ]                  | [Capa do Single] "Starlight Melody"              |
|                                              | Lançamento: Ago/2025 | Vendas: 850.000 cópias    |
| ALUMNI / GRADUADOS (Ex-Membros)              |                                                  |
| [Avatar] Mio (Graduou em 2025)               |--------------------------------------------------|
| [Avatar] Nana (Graduou em 2026)              | DISCOGRAFIA E TOURS (WIDGETS EM GRID)            |
|                                              |                                                  |
| STATUS DE RENOVAÇÃO GERAL DO GRUPO           | [ Widget 1: Últimos Lançamentos ]                |
| 3 membros com contrato expirando em 6 meses. | [ Capa ] "Dreaming High" (Single) - #4 Oricon    |
| (Indicador de Alerta: Risco de *Disband*)    | [ Capa ] "Celestial V" (Álbum) - #1 Oricon       |
|                                              |                                                  |
|                                              | [ Widget 2: Última Turnê ]                       |
|                                              | "Galaxy Tour 2026" - 15 Datas, 98% de Lotação    |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Header Heróico
Ao acessar o perfil de um grupo, a identidade visual do jogo muda as cores de fundo sutilmente para combinar com a "cor oficial" do grupo de idols (como no FM26 que usa as cores principais do clube no cabeçalho). 

### 2. Painéis Modulares (Overview Rápido)
A tela não é sobre editar os treinos das garotas (para isso existe a tela `25`), mas sim para **apreciar o sucesso**. Os widgets de "Maior Sucesso" e "Últimos Lançamentos" dão a sensação de legado que o produtor construiu.

### 3. Dinâmica de Alerta
Um *warning* visual fica na barra da esquerda se múltiplos contratos estiverem perto do fim, o que avisa o jogador de que o grupo corre risco de ser desfeito (Disband).

---

## Acceptance Criteria

1. Interface que sirva como "Museu" interativo para os grupos criados pelo jogador.
2. Cabeçalho com forte impacto visual e adaptação da cor de fundo (Color accent do grupo).
3. Separação clara entre Idols Ativas e "Graduadas" (ex-membros mantêm o legado vivo no painel).