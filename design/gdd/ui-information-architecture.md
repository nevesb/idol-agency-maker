# UI Information Architecture

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-02
> **Implements Pillar**: Todos — este documento define como o jogador acessa TUDO

## Overview

Este documento define a **arquitetura de informacao** de todo o jogo:
navegacao principal, hierarquia de telas, principios de design, e como
cada sistema se manifesta na UI. Inspirado na estrutura do FM26 (Portal,
navbar por dominio, tiles/cards, bookmarks, search) mas corrigindo os
erros que a comunidade FM apontou (perda de densidade, console-first,
informacao escondida atras de cliques).

**Plataforma primaria: PC (1920×1080 minimo).**
Port pra mobile e secundario e, se implementado, tera layouts dedicados (nao so escala).

## Design Principles

### 1. Overview First, Density On Demand
Toda tela comeca com resumo scanavel (tiles/cards). Mas a um clique de
distancia, o jogador hardcore encontra **tabelas densas e configuraveis**.
Cards para entrada. Tabelas para operacao.

### 2. Never Hide What Was Visible
Se um dado era visivel em uma tela, nao pode ir pra submenu sem motivo.
Informacao critica pra decisao nunca esta a mais de 2 cliques do Portal.

### 3. PC-First
Projetado pra mouse + teclado. Hover, tooltips, right-click, atalhos.
Se houver port mobile futuro, layouts serao versoes dedicadas, nao simplificacoes do PC.

### 4. Predictable Navigation
O jogador sempre sabe: onde estou, como volto, e onde encontrar X.
Mesma estrutura em toda tela. Submenu sempre no mesmo lugar.

### 5. Information Budget
Max 3 alertas no Portal. Max 5 headlines no Week Results. Max 12 bookmarks.
Disciplina brutal sobre o que ganha espaco visual.

### 6. Visual Identity — Rostos e Marcas Sempre Visíveis

O jogo é sobre **pessoas e marcas**. Sem visuais, vira planilha.
Estas regras são invioláveis:

**Idols:**
- **Toda menção a uma idol inclui seu avatar.** Não importa o contexto —
  tabela, card, headline, alerta, tooltip, dropdown. Se o nome da idol
  aparece, o rosto aparece ao lado.
- Tamanhos padronizados: 24×24px (inline em tabelas), 40×40px (cards/listas),
  80×80px (destaque), 160×200px (perfil completo).
- Avatar circular com borda colorida indicando tier (F=cinza, D=bronze,
  C=prata, B=azul, A=roxo, S=dourado, SS=diamante, SSS=prisma).
- Se a idol não foi scouted com precisão: avatar com leve blur ou silhueta
  com "?" (margem de erro visual).

**Agências:**
- **Toda menção a uma agência inclui seu logo/emblema.** Sua agência, rivais,
  agência de uma idol — sempre com logo.
- Tamanhos: 20×20px (inline), 32×32px (cards), 64×64px (destaque).
- Sua agência tem cor accent diferenciada das rivais.
- Na nav bar: logo da sua agência ao lado do nome no canto esquerdo.

**Jobs:**
- Ícone de tipo sempre visível (🎤 show, 📺 TV, 📸 foto, etc.)
- Se o job tem fonte (emissora, marca), mostrar logo da fonte quando disponível.

**Staff:**
- Avatar do staff (estilo simplificado) ao lado do nome em toda menção.

**Regra geral:** Se uma entidade tem identidade visual (avatar, logo, ícone),
ela NUNCA aparece como texto puro. O visual é parte da informação, não
decoração.

---

## Navigation Structure

### Top Navigation Bar (Sempre Visivel)

Barra superior fixa com 6 macrodominios + ferramentas:

```
┌──────────────────────────────────────────────────────────────────────┐
│ [★ Logo]  Portal | Roster | Mercado | Operacoes | Agencia | Produtor│
│                                          [🔍 Search] [📑 Bookmarks] │
└──────────────────────────────────────────────────────────────────────┘
```

Cada dominio tem **submenu dropdown** que aparece ao hover (ou click):

### 1. Portal (Tecla: `1`)
Hub central — onde o jogador comeca e volta.
**Papel: "o que importa AGORA"**
**Layout: 3 colunas** (25% mensagens / 45% noticias+calendario / 30% agenda+rankings)

| Submenu | Conteudo |
|---|---|
| **Visão Geral** | Dashboard 3 colunas: mensagens, noticias carrossel + calendario, agenda + rankings (3 abas: Hits, Idols, Grupos) |
| **Mensagens** | Inbox completo (2 paineis: lista 30% + mensagem aberta 70%). 57 tipos em 11 categorias (ver message-types-catalog.md) |
| **Calendario** | Proximas 4 semanas + eventos sazonais |
| **Site de Noticias** | News Feed completo com filtros (noticias ≠ mensagens) |
| **Relatorios** | Intelligence reports e analises |

### 2. Roster (Tecla: `2`)
Tudo sobre "quem eu tenho".

| Submenu | Conteudo |
|---|---|
| **Visao Geral** | Tabela do roster com stats, wellness, contrato, arquetipo. Filtravel, ordenavel |
| **Grupos** | Grupos formados, composicao por arquetipo, sinergia |
| **Desenvolvimento** | Planos trimestrais ativos, estagios, foco de treino |
| **Roster Balance** | Cobertura por arquetipo, curva etaria, concentracao de receita, pipeline |
| **Contratos** | Todos contratos, vencimentos, renovacoes pendentes |

### 3. Mercado (Tecla: `3`)
Tudo sobre "quem eu posso trazer".

| Submenu | Conteudo |
|---|---|
| **Scouting** | Scouts ativos, regioes, resultados, filtro por arquetipo |
| **Mercado** | Idols disponiveis, busca por stats/tier/regiao/arquetipo |
| **Shortlist** | Lista de alvos salvos pelo jogador |
| **Transferencias** | Buyouts ativos, propostas pendentes, historico |
| **Rivais** | Perfis de agencias rivais, roster estimado, movimentos recentes |

### 4. Operacoes (Tecla: `4`)
Tudo sobre "o que acontece e como executo".

| Submenu | Conteudo |
|---|---|
| **Job Board** | Jobs disponiveis com requisitos, match, prazo. Filtros e ordenacao |
| **Agenda Semanal** | Grade 7 dias × idols com slots de atividade. Drag-and-drop |
| **Planejamento** | Planning Board: metas trimestrais, roadmap anual, riscos |
| **Resultados** | Week Results com headlines, post-mortem, moment summaries |

### 5. Agencia (Tecla: `5`)
Tudo sobre a organizacao e sua identidade.

| Submenu | Conteudo |
|---|---|
| **Financas** | Dashboard financeiro, receita/despesa, ROI por idol, projecoes |
| **Estrategia** | Agency Strategy: foco de mercado, postura de agenda/imagem/crescimento |
| **Staff** | Staff contratado, mercado de staff, delegacao, workload |
| **Intelligence** | Agency Intelligence: reports, comparacoes, alertas, predicoes |
| **Midia** | Relacoes com midia, PR strategy, historico de cobertura |
| **Fas** | Fan analytics: segmentacao, mood, toxicidade, merch conversion |
| **Metas** | Metas do dono, progresso, historico |

### 6. Produtor (Tecla: `6`)
Tudo sobre a carreira do jogador.

| Submenu | Conteudo |
|---|---|
| **Perfil** | Reputacao, titulos de legado, estilo de gestao |
| **Afinidade** | Relacao com cada idol (atual e ex), memorias |
| **Historico** | Agencias onde trabalhou, conquistas, timeline |
| **Propostas** | Ofertas de outras agencias (se houver) |

---

## Smart Navigation Tools

### Search (Tecla: `Ctrl+K`)
Busca universal que cruza:
- Idols (nome, arquetipo, stats)
- Staff (nome, cargo)
- Jobs (tipo, nome)
- Noticias (titulo, conteudo)
- Telas e menus ("financas", "scouting", "contrato")
- Termos do glossario

Resultado aparece em dropdown com categorias. Enter = navega direto.

### Bookmarks (Tecla: `Shift+1` a `Shift+12`)
- Ate 12 atalhos configuraveis
- Defaults sugeridos: Portal, Roster, Job Board, Financas, Scouting, Week Results
- Jogador customiza arrastando ou via menu
- Sempre visiveis na barra superior (icones pequenos)
- Tooltip ao hover mostra nome da tela

### Glossario (IdolPedia)
Equivalente ao FMPedia:
- Icone de livro ao lado do Search
- Glossario de termos do jogo (arquetipos, stats, mecanicas)
- Cada entrada linka pra tela relevante
- 10+ categorias: Stats, Contratos, Jobs, Fama, Wellness, Economia, etc.
- Util pra onboarding sem sair do jogo

---

## Screen Architecture — 3 Camadas

### Camada 1: Portal (Command Center)
Uma unica tela com tudo que precisa de atencao AGORA.
Tiles compactos, scanavel em 5 segundos.

### Camada 2: Domain Overview
Cada dominio (Roster, Mercado, Agenda, Agencia, Produtor) tem
uma tela overview com tiles/cards resumindo o estado.
Scanavel em 10 segundos.

### Camada 3: Detail / Operational Screens
Telas densas com tabelas, comparacoes, editores.
Aqui vive a profundidade. Sem limite de complexidade.

```
Portal (hub)
  ├── Roster Overview → Idol Profile (detail) → Development Plan (editor)
  ├── Mercado Overview → Idol no Mercado (detail) → Negociacao (editor)
  ├── Agenda Overview → Job Board (operational) → Escalacao (editor)
  ├── Agencia Overview → Financas (detail) → Intelligence (operational)
  └── Produtor Overview → Historico (detail)
```

---

## Internal Screen Template

Toda tela interna segue a mesma estrutura:

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Nav Bar]                                                           │
├─────────────────────────────────────────────────────────────────────┤
│ [Breadcrumb: Portal > Roster > Suzuki Mei]                          │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ HEADER: Contexto + Entidade + Status + Acoes Rapidas            │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│ │ Tile 1   │ │ Tile 2   │ │ Tile 3   │ │ Tile 4   │  ← Overview   │
│ │ (resumo) │ │ (resumo) │ │ (resumo) │ │ (resumo) │    Cards      │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                     │
│ ┌─── Submenu tabs ─────────────────────────────────────────────┐   │
│ │ [Overview] [Stats] [Development] [Jobs] [Contract] [History] │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ CONTENT AREA (tab selecionada)                                  │ │
│ │                                                                 │ │
│ │ Pode ser: tabela densa, cards expandidos, editor, grafico,     │ │
│ │ comparacao, formulario.                                        │ │
│ │                                                                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Elementos obrigatorios em toda tela:**
1. **Breadcrumb** — onde estou, como volto
2. **Header** — contexto (nome, status, acoes rapidas)
3. **Overview tiles** — resumo scanavel (opcionais em telas ja detalhadas)
4. **Submenu tabs** — navegacao interna do conteudo
5. **Content area** — conteudo principal

**Acoes rapidas no header:**
- Botao de acao principal (ex: "Escalar", "Contratar", "Renovar")
- Right-click em qualquer entidade abre context menu
- Hover mostra tooltip com info extra

---

## Tile & Card System

### Tiles (Resumo)
- Tamanho fixo, 2-4 por linha no PC
- Mostra: 1 metrica principal + 1 tendencia + 1 cor de status
- Clique abre card expandido OU navega pra tela detalhada
- Nao contem acoes — sao informativos

Exemplo de tile:
```
┌────────────────────┐
│ Receita Semanal    │
│ ¥2.4M  ▲+8%       │
│ [█████████░] 80%   │
└────────────────────┘
```

### Cards (Detalhe Expandido)
- Ocupa area maior quando expandido
- Contem informacao detalhada + acoes
- Fechavel (volta pra tile)
- Pode conter sub-tiles internos

### Tabelas (Operacao)
- Usadas em telas de Camada 3
- Colunas configuraveis pelo jogador
- Sort por qualquer coluna
- Filtros combinados
- Bulk actions (selecionar multiplos)
- Export (futuro)

**REGRA: Cards para overview. Tabelas para operacao. Nunca card onde tabela e melhor.**

Telas que DEVEM ser tabela (nao card):
- Roster list (stats comparaveis lado a lado)
- Scouting results (muitos candidatos pra comparar)
- Job Board (muitos jobs pra filtrar)
- Financas detalhadas (receita/despesa por categoria)
- Ranking (lista ordenada)
- Historico de jobs (cronologico)

Telas que DEVEM ser card:
- Portal overview (metricas rapidas)
- Perfil de idol (seções tematicas)
- Resultado da semana (headlines e momentos)
- Perfil de rival (info qualitativa)

---

## Responsive Design — PC (Plataforma Primaria)

| Aspecto | PC (1920×1080+) |
|---|---|
| **Nav** | Top bar com hover submenus |
| **Tiles** | 4 por linha |
| **Tabelas** | Colunas completas, configuraveis |
| **Tooltips** | Hover |
| **Right-click** | Context menu |
| **Bookmarks** | Barra visivel com 12 slots |
| **Search** | `Ctrl+K`, dropdown grande |
| **Side panels** | Painel lateral sem sair da tela |
| **Densidade** | Alta por padrao |

**PC e a plataforma alvo. Se houver port mobile futuro, tera layouts dedicados.**

---

## Keyboard Shortcuts

| Atalho | Acao |
|---|---|
| `1`-`6` | Navegar para macrodominio |
| `Shift+1` a `Shift+12` | Bookmarks customizados |
| `Ctrl+K` | Search universal |
| `Esc` | Voltar / fechar modal |
| `Space` | Play/Pause simulacao |
| `Enter` | Confirmar acao selecionada |
| `Tab` | Proximo campo / proximo item |
| `Ctrl+Z` | Desfazer ultima acao (onde aplicavel) |
| `F1` | Abrir IdolPedia |
| `→` / `←` | Proxima/anterior semana (nos resultados) |

---

## Information Hierarchy Rules

### Portal — O que SEMPRE mostra (3 colunas):
**Esquerda (25%):** Mensagens recentes do inbox (scrollable, com tabs de filtro)
**Centro (45%):** Carrossel de noticias destaque (max 6, auto-rotate) + Calendario semanal (2 semanas, grid)
**Direita (30%):** Agenda (proximos 4-5 jobs) + Rankings da temporada (3 abas: Hits, Idols, Grupos, top 10)
**Status bar (rodape):** Logo agencia + saldo + [▶ Continuar] + [⚠ Alertas badge]

### Perfil de Idol — O que SEMPRE mostra no header:
1. Avatar + nome + arquetipo (diegetico)
2. Estagio de desenvolvimento
3. Tier de fama + posicao
4. Wellness resumo (4 barras compactas)
5. Status do contrato (tempo restante)

### Job Board — O que SEMPRE mostra por job:
1. Tipo + nome + fonte
2. Stats requeridos (com cor verde/vermelho)
3. Pagamento
4. Prazo
5. Melhor match do roster (1 idol, % de sucesso)

### Week Results — O que SEMPRE mostra:
1. Agency mood
2. Headlines (max 5, selecionadas por dramaticidade)
3. Financas resumo (1 tile)
4. Alertas pra proxima semana (max 3)

---

## Screen Role Separation — Evitando Deja Vu

Tres telas mostram "estado da agencia" mas com PAPEIS diferentes.
Se essa distincao nao for cristalina, o jogador sente redundancia.

### Portal: "O que importa AGORA"
- Escopo temporal: **este momento**
- Pergunta respondida: "preciso fazer algo?"
- Conteudo: alertas ativos, acoes pendentes, proximas 2 semanas
- Tom: **operacional, urgente**
- Dados que so existem aqui: acoes pendentes, conselho do staff
- **NAO repete:** historico, analises, tendencias

### Week Results: "O que ACONTECEU esta semana"
- Escopo temporal: **ultimos 7 dias**
- Pergunta respondida: "como foram minhas decisoes?"
- Conteudo: headlines dramatizadas, notas de job, mudancas de ranking
- Tom: **narrativo, emocional**
- Dados que so existem aqui: post-mortems expandidos, moment summaries, agency mood
- **NAO repete:** alertas futuros, predicoes, dados financeiros detalhados

### Intelligence: "POR QUE esta acontecendo e o que TENDE a acontecer"
- Escopo temporal: **ultimas semanas/meses + projecao futura**
- Pergunta respondida: "o que eu preciso entender?"
- Conteudo: tendencias, comparacoes, predicoes, ROI, riscos projetados
- Tom: **analitico, frio**
- Dados que so existem aqui: comparacoes idol vs idol, predicoes com %,
  ROI por idol, tendencias de 6 meses, roster depth analysis
- **NAO repete:** headlines dramaticas, acoes pendentes imediatas

### Regra de Ouro
Se um dado aparece em 2 dessas telas, deve ter **forma diferente**:
- Portal mostra "Receita: ¥2.4M ▲+8%" (1 tile, 1 segundo)
- Week Results mostra "Receita semanal: ¥2.4M" (dentro do contexto da semana)
- Intelligence mostra "Tendencia de receita: ▲ nos ultimos 3 meses, projecao ¥10M/mes"

Mesmo dado, profundidade diferente, contexto diferente.

---

## UI Labeling — Nomes Internos vs Nomes Visiveis

O jogador nao quer pensar em "sistemas". Quer pensar em
"minha agencia, minhas idols, meus jobs, minhas decisoes."

### Principio
Muita nomenclatura no GDD e interna — nao precisa aparecer na UI
com a mesma formalidade. O jogo deve soar como **ferramenta de trabalho
de um produtor**, nao como documentacao tecnica.

### Mapeamento de Labels

| Nome no GDD (interno) | Nome na UI (jogador ve) | Contexto |
|---|---|---|
| Agency Intelligence & Reports | **Reports** ou **Analytics** | Tab dentro de Agencia |
| Talent Development Plans | **Desenvolvimento** | Tab dentro de Roster |
| Idol Archetypes & Roles | Nome diegetico: "歌姫", "O Rosto" | Badge no perfil — sem label "arquetipo" |
| Agency Planning Board | **Planejamento** | Tab dentro de Operacoes |
| Roster Balance & Composition | **Balanco do Roster** | Tab dentro de Roster |
| Moment Engine | *Invisivel* — jogador nunca ve esse nome | Manifesta-se como headlines e mood |
| Agency Strategy | **Direcao** ou **Identidade** | Tab dentro de Agencia |
| Systemic Friction | *Invisivel* — nunca mencionado | Manifesta-se como consequencias |
| IdolPedia | **Guia** ou **?** (icone de ajuda) | Botao na nav bar |

### Regra
Se o nome soa como "sistema de design", ele e **interno ao GDD**.
Se o nome soa como "algo que um produtor real diria", pode ir na UI.

Exemplos do que **NAO** aparece na UI:
- "Moment Engine"
- "Systemic Friction"
- "Tile & Card System"
- "Information Budget"
- "Camada 3"

Exemplos do que **APARECE** na UI:
- "Reports"
- "Desenvolvimento"
- "Direcao da Agencia"
- "Balanco do Roster"
- "Guia"

---

## Power User Mode — Especificacao Formal

O jogo e PC-first e atrai jogadores de management sim que querem
eficiencia operacional maxima. O "power user mode" nao e um toggle —
e o conjunto de features que permite jogar quase inteiramente via
teclado e tabelas densas.

### 1. Colunas Salvas por Tela
- Toda tabela permite adicionar/remover/reordenar colunas
- Configuracao salva **por tela por save** (nao global)
- Presets de visualizacao: "Scouting View", "Finance View", "Quick View"
- Jogador pode criar e nomear presets
- Reset pra default sempre disponivel

### 2. Filtros e Sort Persistentes
- Filtros aplicados em uma tabela **persistem ate serem limpos**
- Sort persiste entre sessoes (salvo no save)
- Filtros combinados com AND logico
- Botao "Limpar filtros" sempre visivel quando filtro ativo
- Badge no botao de filtro mostra quantos filtros ativos

### 3. Keyboard Traversal
- `↑`/`↓` navega entre linhas de tabela
- `Enter` abre item selecionado
- `Space` em tabela = seleciona/deseleciona (pra bulk actions)
- `Ctrl+A` seleciona todos
- `Ctrl+Click` seleciona multiplos
- `Tab` move entre tiles/secoes na tela
- Focus visual claro em todo elemento navegavel

### 4. Quick Compare
- Selecionar 2 idols em qualquer tabela + `C` = abre comparacao
- Comparacao abre como painel lateral (nao navega pra outra tela)
- Highlight automatico do melhor valor em cada stat

### 5. Bulk Actions
- Em tabelas de roster/jobs/contratos, selecionar multiplos permite:
  - Escalar em lote (Job Board — escalar Top Match pra cada job)
  - Renovar em lote (Contratos — abrir negociacao sequencial)
  - Mover pra shortlist em lote (Scouting)
  - Dar folga em lote (Agenda — selecionar idols, marcar descanso)

### 6. Double-Click Behavior (Consistente)
- Double-click em idol = abre perfil
- Double-click em job = abre painel de escalacao
- Double-click em agencia rival = abre perfil da rival
- Double-click em staff = abre ficha do staff
- Nunca ambiguo — sempre abre o detalhe da entidade

### 7. Hotkeys Contextuais
Alem dos globais, cada tela tem hotkeys proprias:

| Tela | Hotkey | Acao |
|---|---|---|
| Job Board | `E` | Escalar idol selecionada no job selecionado |
| Job Board | `P` | Pin/bookmark job |
| Job Board | `X` | Rejeitar/snooze job |
| Roster | `D` | Abrir desenvolvimento da idol selecionada |
| Roster | `C` | Comparar idols selecionadas |
| Scouting | `S` | Enviar scout pra idol selecionada |
| Scouting | `L` | Adicionar a shortlist |
| Week Results | `→` | Proxima headline |
| Week Results | `←` | Headline anterior |
| Qualquer | `?` | Mostrar hotkeys da tela atual |

### 8. Status Bar (Rodape)
Barra fina no rodape da tela mostrando:
- Semana / Ano / Mes
- Saldo da agencia
- Proxima acao pendente
- Atalho mais relevante pra contexto atual

Sempre visivel, nunca intrusiva. 1 linha, fonte pequena.

---

## Dependencies

**Este documento depende de:**
- Todos GDDs de sistemas (define como cada sistema aparece na UI)

**Depended on by:**
- Todos GDDs de UI individual (dashboard, profile, job board, etc.)
- Visual Generator (estilo visual)
- Tutorial/Onboarding (sequencia de telas)

## Acceptance Criteria

1. 6 macrodominios acessiveis via top nav com atalhos numericos
2. Submenu dropdown funcional em cada dominio
3. Search universal encontra idols, staff, telas, noticias, termos
4. Bookmarks configuraveis (ate 12) com atalhos de teclado
5. IdolPedia acessivel via F1 com 10+ categorias
6. Breadcrumb visivel em toda tela interna
7. Template de tela (header + tiles + tabs + content) consistente
8. Tabelas com sort, filtro e colunas configuraveis
9. Layouts otimizados para PC (1920x1080+)
10. Todas acoes criticas a max 2 cliques do Portal

## Open Questions

- Nenhuma pendente
